// RagService.ts
import {
  AnalysisResult,
  GoogleGroundingData,
  RagResponse,
  SearchResult,
  SubQueryAnalysis,
} from "@/ai/types/rag";
import { SearchDocument } from "@/lib/db/drizzle/schema";

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { embed, generateObject, generateText } from "ai";
import { z } from "zod";

export type SupportedModel =
  | ReturnType<typeof google>
  | ReturnType<typeof openai>
  | ReturnType<typeof anthropic>;

export interface RagConfig {
  supabaseUrl: string;
  supabaseKey: string;
  modelProvider?: "google" | "openai" | "anthropic"; // Mallin tarjoaja
  modelName?: string;
  /** Kuinka monta kertaa yritetään reflektoida ja parantaa vastausta (oletus 3). */
  maxReflections?: number;
  maxSourcesPerQuery?: number; // Montako lähdettä per alikysymys
  vectorSearchThreshold?: number; // Vektorihakujen similarity threshold
  vectorSearchCount?: number; // Montako dokumenttia haetaan vektorihaulla
  refinementSourceCount?: number; // Montako lähdettä reflektoinnin parantamisessa
}

export class ReflectiveRAG {
  private supabase: SupabaseClient;
  private model: SupportedModel;
  private maxReflections: number;
  // Uudet kentät
  private maxSourcesPerQuery: number;
  private vectorSearchThreshold: number;
  private vectorSearchCount: number;
  private refinementSourceCount: number;

  constructor(config: RagConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.model = google("gemini-1.5-pro", { useSearchGrounding: true });
    switch (config.modelProvider) {
      case "openai":
        this.model = openai(config.modelName || "gpt-4o");
        break;
      case "anthropic":
        this.model = anthropic(config.modelName || "claude-3-5-sonnet-latest");
        break;
      case "google":
      default:
        this.model = google(config.modelName || "gemini-2.0-flash-exp", {
          useSearchGrounding: true,
        });
    }
    // Käytä annettuja arvoja tai oletuksia
    this.maxReflections = config.maxReflections ?? 3;
    this.maxSourcesPerQuery = config.maxSourcesPerQuery ?? 8;
    this.vectorSearchThreshold = config.vectorSearchThreshold ?? 0.7;
    this.vectorSearchCount = config.vectorSearchCount ?? 5;
    this.refinementSourceCount = config.refinementSourceCount ?? 3;
  }

  /**
   * Prosessoi kysely useilla askelilla (DB + Web -haku, ensivastaus, reflektio + parannus)
   */
  async processQuery(query: string): Promise<RagResponse> {
    try {
      // 1. Jaa kysely alikysymyksiin
      const subQueries = await this.analyzeAndGenerateSubQueries(query);
      let allSources: SearchResult[] = [];
      let currentAnswer = "";

      // 2. Käsittele jokainen alikysymys
      for (const subQuery of subQueries) {
        // Hae lähteet tälle alikysymykselle
        const [dbResults, webResults] = await Promise.all([
          this.searchDatabase(subQuery),
          this.searchWeb(subQuery),
        ]);

        const subQuerySources = [...dbResults, ...webResults]
          .filter(
            (result) => result.content && result.content.trim().length > 0,
          )
          .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
          .slice(0, this.maxSourcesPerQuery); // Käytä konfiguroitua arvoa

        allSources = [...allSources, ...subQuerySources];

        // Generoi tai päivitä vastausta
        const subResponse = await this.generateResponse(
          subQuery,
          subQuerySources,
          currentAnswer,
        );

        currentAnswer = subResponse.text;
      }

      // 3. Tee iteratiivinen parannus lopulliselle vastaukselle
      const finalAnswer = await this.reflectAndImprove(
        query,
        currentAnswer,
        allSources,
        this.maxReflections,
      );

      return {
        answer: finalAnswer,
        sources: allSources.map((source) => ({
          title: source.title || "Source",
          type: source.type,
          content: source.content.substring(0, 200) + "...",
        })),
      };
    } catch (error) {
      console.error("Error in RAG process:", error);
      throw new Error("Failed to process query");
    }
  }

  private async analyzeAndGenerateSubQueries(query: string): Promise<string[]> {
    const { object } = await generateObject<SubQueryAnalysis>({
      model: this.model,
      schema: z.object({
        subQueries: z.array(z.string()),
        rationale: z.string(),
      }),
      prompt: `
        Break down this query into specific sub-questions that will help build a comprehensive answer.
        Original query: ${query}
        
        Consider:
        1. Background information needed
        2. Key aspects to explore
        3. Specific details required
        4. Practical implications
        
        Return 2-4 sub-questions that will help explore this topic thoroughly.
      `,
    });

    console.log("Generated sub-queries:", object.subQueries);
    return object.subQueries;
  }
  /**
   * Supabasen vektorihaku (RPC-funktio "match_documents") - semanttinen haku kyselyembeddingillä.
   */
  private async searchDatabase(query: string): Promise<SearchResult[]> {
    try {
      // 1. Generoi embed kyselylle
      const { embedding, usage } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: query,
      });

      console.log(`Embedding generated. Token usage: ${usage.tokens}`);

      // 2. Kutsu Supabasen match_documents-funktiota
      const { data, error } = await this.supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: this.vectorSearchThreshold,
        match_count: this.vectorSearchCount,
      });

      if (error) throw error;

      // 3. Mapataan tulokset RAG-formaattiin
      return (data as SearchDocument[]).map((doc) => ({
        type: "database" as const,
        title: doc.title || "Database Source",
        content: doc.content,
        metadata: doc.metadata,
        similarity: doc.similarity,
      }));
    } catch (error) {
      console.error("Database search failed:", error);
      return [];
    }
  }

  /**
   * Google-mallin web-haku (useSearchGrounding = true)
   */
  private async searchWeb(query: string): Promise<SearchResult[]> {
    try {
      const { text, experimental_providerMetadata } = await generateText({
        model: this.model,
        prompt: query,
        system: "Find relevant and recent information about this topic.",
      });

      const metadata =
        experimental_providerMetadata?.google as GoogleGroundingData;
      const groundingData = metadata?.groundingMetadata;

      if (!groundingData?.groundingSupports) return [];

      return groundingData.groundingSupports
        .filter(
          (support): support is { segment: { text: string } } =>
            !!support.segment?.text,
        )
        .map((support) => ({
          type: "web" as const,
          content: support.segment.text,
          title: "Web Source",
          similarity: 1.0,
        }));
    } catch (error) {
      console.error("Web search failed:", error);
      return [];
    }
  }

  /**
   * Ensimmäisen vastauksen generointi: luodaan konteksti lähteistä ja annetaan ohjeet LLM:lle
   */
  private async generateResponse(
    query: string,
    sources: SearchResult[],
    currentAnswer: string,
  ) {
    const context = sources
      .map((source) => {
        const similarityPart = source.similarity
          ? ` (Relevance: ${(source.similarity * 100).toFixed(1)}%)`
          : "";
        return `[${source.type}${similarityPart}] ${source.content}`;
      })
      .join("\n\n");

    return await generateText({
      model: this.model,
      system:
        "You are a helpful assistant. Use the provided information to answer accurately. If information is insufficient, clearly state what you don't know. Never invent facts.",
      prompt: `
        Question: ${query}
        
        Available Information:
        ${context}
        
        Provide a comprehensive answer using the available information.
      `,
    });
  }

  /**
   * Reflektoi ja paranna vastausta useita kertoja (enintään maxLoops)
   */
  private async reflectAndImprove(
    query: string,
    currentAnswer: string,
    sources: SearchResult[],
    maxLoops: number,
  ): Promise<string> {
    let finalAnswer = currentAnswer;

    for (let iteration = 0; iteration < maxLoops; iteration++) {
      const { object: analysis } = await generateObject<AnalysisResult>({
        model: this.model,
        schema: z.object({
          hasGaps: z.boolean(),
          learnedInfo: z.array(z.string()),
          remainingQuestions: z.array(z.string()),
          nextQuerySuggestion: z.string(),
        }),
        prompt: `
          Original Question: ${query}
          Current Answer: ${finalAnswer}
          
          Analyze the current answer:
          1. What have we learned so far?
          2. What questions remain unanswered?
          3. What specific information should we search for next?
          
          Provide a detailed analysis of gaps and potential improvements.
        `,
      });

      if (!analysis.hasGaps || analysis.remainingQuestions.length === 0) {
        console.log(`No gaps found at iteration ${iteration}, stopping.`);
        break;
      }

      // Etsi lisätietoa seuraavasta kysymyksestä
      const [newDbResults, newWebResults] = await Promise.all([
        this.searchDatabase(analysis.nextQuerySuggestion),
        this.searchWeb(analysis.nextQuerySuggestion),
      ]);

      const newSources = [...newDbResults, ...newWebResults]
        .filter((result) => result.content && result.content.trim().length > 0)
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, this.refinementSourceCount); // Käytä konfiguroitua arvoa

      const { text: improvedAnswer } = await generateText({
        model: this.model,
        system:
          "You are improving an existing answer. Integrate new information seamlessly while maintaining accuracy.",
        prompt: `
          Original Question: ${query}
          Current Answer: ${finalAnswer}
          
          What we've learned:
          ${analysis.learnedInfo.map((info) => `- ${info}`).join("\n")}
          
          Questions to address:
          ${analysis.remainingQuestions.map((q) => `- ${q}`).join("\n")}
          
          New Information:
          ${newSources.map((s) => s.content).join("\n\n")}
          
          Provide an improved answer that incorporates this new information.
        `,
      });

      if (improvedAnswer.trim() === finalAnswer.trim()) {
        console.log(
          `No improvement detected at iteration ${iteration}, stopping.`,
        );
        break;
      }

      finalAnswer = improvedAnswer;
      console.log(`Refinement iteration ${iteration + 1} complete.`);
    }

    return finalAnswer;
  }
}

export default ReflectiveRAG;

// const rag = new ReflectiveRAG({
//supabaseUrl: "...",
//supabaseKey: "...",
//maxSourcesPerQuery: 10,        // Enemmän lähteitä
//vectorSearchThreshold: 0.6,    // Löysempi threshold
//vectorSearchCount: 8,          // Enemmän vektorihakutuloksia
//refinementSourceCount: 5       // Enemmän lähteitä parannuksiin
//modelProvider: "anthropic",
//modelName: "claude-3"
//});
