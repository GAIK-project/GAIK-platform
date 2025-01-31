import { SearchDocument } from "@/lib/db/drizzle/schema";
import { openai } from "@ai-sdk/openai";
import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { generateObject, LanguageModelV1Middleware } from "ai";
import dedent from "dedent";
import _ from "lodash";
import { z } from "zod";
import { searchDocuments } from "../ai-actions/search";
import { addToLastUserMessage, getLastUserMessageText } from "../utils";

interface SearchContext {
  searchTerms: string[];
  expectedInfo: string[];
}

const searchSchema = z.object({
  searchTerms: z
    .array(z.string())
    .describe("2-3 most relevant search phrases in SAME LANGUAGE as query"),
  expectedInfo: z
    .array(z.string())
    .describe(
      "Required information WITH FULL CONTEXT. Example: 'Helsingin yliopiston raportointiohjeen kirjoittaja' NOT just 'kirjoittaja'",
    ),
});

const createSearchContext = async (
  userMessage: string,
): Promise<SearchContext> => {
  const { object: context } = await generateObject({
    model: openai("gpt-4o", { structuredOutputs: true }),
    system: dedent`
      Analyze the query and extract:
      1. Key search terms that will help find relevant documents
      2. ONLY the specific information elements needed to answer THIS query
      3. expectedInfo should specify WHAT item its looking for and MUST include the full context, not just generic terms.
      
      Important rules:
      - Keep ALL terms in the EXACT SAME LANGUAGE as the query
      - For expectedInfo, include ONLY information directly asked in the query
      - Do not add "nice to have" information to expectedInfo
      `,
    schema: searchSchema,
    prompt: userMessage,
  });
  return context;
};

const fetchAndRerankDocuments = async (
  context: SearchContext,
): Promise<SearchDocument[]> => {
  try {
    // 1. Get initial search results
    const retvievedDocs = await searchDocuments(
      context.searchTerms.join(" "),
      7,
    );

    if (!retvievedDocs) {
      console.log("No documents found in initial search");
      return [];
    }

    const uniqueDocs = _.uniqBy(retvievedDocs, "id");
    // 2. Rerank using BM25 (Map documents to LangChain Document format (pageContent + metadata)) save original document in metadata
    const retriever = BM25Retriever.fromDocuments(
      uniqueDocs.map((doc) => ({
        pageContent: doc.content || "", // Use the content for BM25 ranking
        metadata: doc, // Save the original document
      })),
      { k: 5 },
    );

    console.log("reranked results");

    // 3. Get reranked results and return documents
    const reranked = await retriever.invoke(context.searchTerms.join(" "));
    return reranked.map((doc) => doc.metadata as SearchDocument); // Return original documents
  } catch (error) {
    console.error("Error in multiSearch:", error);
    return [];
  }
};

interface AnalysisResult {
  info: string;
  searchTerms: string[];
}

// Analyze results for completeness
const answerCheck = async (
  results: SearchDocument[],
  expectedInfo: string[],
): Promise<AnalysisResult[]> => {
  const { object: analysis } = await generateObject({
    model: openai("gpt-4o-2024-11-20", { structuredOutputs: true }),
    system: dedent`
      You are a precise document analyzer focusing on EXACT information matching.
      
      When checking results:
      1. Start each document analysis from the beginning
      2. CHECK DOCUMENT HEADERS AND METADATA FIRST
      3. ANY mention of requested information = FOUND
      4. Names, dates, and other factual data at the start of documents ARE valid information
      5. Return EMPTY missingInfo array if information exists ANYWHERE
      
      CRITICAL: Document headers containing names, dates, or other metadata ARE VALID SOURCES
      of information. Names listed at the top of a document ARE author information.
      
      YOU MUST return empty missingInfo array if you find ANY matching information,
      even if it's not explicitly labeled.
      `,
    schema: z.object({
      missingInfo: z
        .array(
          z.object({
            info: z.string(),
            searchTerms: z
              .array(z.string())
              .describe("2-3 search terms in query language"),
          }),
        )
        .describe(
          "Must be empty array if information exists in ANY form in results",
        ),
    }),
    prompt: JSON.stringify({
      results: results.map((r) => r.content || ""),
      expectedInfo: expectedInfo,
    }),
  });

  return analysis.missingInfo;
};

const enhancedRAG = async (userMessage: string): Promise<string> => {
  // 1. Create search context
  const context = await createSearchContext(userMessage);

  console.log("search context", context);

  // 2. Perform search and reranking
  let results = await fetchAndRerankDocuments(context);
  console.log(
    "fetchAndRerankDocuments number of docs returned: ",
    results.length,
  );

  // 3. Check for missing information
  const expectedInfo = context.expectedInfo;
  console.log("expected info", expectedInfo);

  const missingInfo = await answerCheck(results, expectedInfo);

  console.log("analyzeResults missing info length", missingInfo.length);

  console.log(
    "analyzeResults is missing these informations",
    missingInfo.map((info) => info.info),
  );

  // 4. Additional searches if needed
  if (missingInfo.length > 0) {
    console.log("--- Additional searches ---");
    console.log("MISSING INFO DETECTED:");

    // 1. Deduplicate search terms
    const uniqueSearchTerms = Array.from(
      new Set(missingInfo.flatMap((info) => info.searchTerms)),
    );
    console.log("unique search terms", uniqueSearchTerms);

    // 2. Batch search in parallel
    const additionalDocs = await Promise.all(
      uniqueSearchTerms.map((term) => searchDocuments(term, 2)),
    );
    console.log("Number of additional searches:", additionalDocs.length);
    console.log(
      "Total documents before deduplication:",
      additionalDocs.flat().length,
    );

    if (additionalDocs.length) {
      // 3. flatten and deduplicate additional documents
      const uniqueAdditionalDocs = _.uniqBy(additionalDocs.flat(), "id");
      console.log(
        "Unique documents after deduplication:",
        uniqueAdditionalDocs.length,
      );
      // Map to LangChain Document format: pageContent for BM25 ranking, original doc in metadata
      const retriever = BM25Retriever.fromDocuments(
        uniqueAdditionalDocs.map((doc) => ({
          pageContent: doc.content || "",
          metadata: doc,
        })),
        { k: 3 },
      );

      const additional = await retriever.invoke(userMessage);
      const additionalResults = additional.map(
        (doc) => doc.metadata as SearchDocument,
      );
      const allResults = _.uniqBy([...results, ...additionalResults], "id") // Delete duplicates with same id
        .sort((a, b) => b.similarity - a.similarity) // Laskevassa järjestyksessä (suurin ensin)
        .slice(0, 5); // Otetaan vain 5 parasta tulosta
      console.log("allresults length after rerank", allResults.length);
      console.log(
        "results after rerank ids",
        allResults.map((r) => r.id),
      );

      results = allResults;
    }
  }

  return formatResults(results);
};

export const multiStagellmMiddleware: LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    console.log("multiStageRAG middleware kutsuttu");

    // // Jos kyseessä on tool call, palauta params sellaisenaan
    if (params.mode?.type === "regular") {
      console.log("Checking if tools are defined");
      if (params.mode.tools) {
        console.log("Tool call detected, skipping RAG");
        return params;
      }
    }

    const startTime = performance.now();
    try {
      const userMessage = getLastUserMessageText(params.prompt);
      if (!userMessage || userMessage.length < 3) {
        return params;
      }

      const context = await enhancedRAG(userMessage);
      const duration = performance.now() - startTime;
      console.log(`RAG processing took ${(duration / 1000).toFixed(2)}s`);

      const result = addToLastUserMessage(params, context);
      return result;
    } catch (error) {
      console.error("Error in RAG middleware:", error);
      return params;
    }
  },
};

const formatResults = (results: SearchDocument[]): string => {
  return (
    "Use the following information to answer the question:\n" +
    results.map((r) => r.content || "").join("\n\n")
  );
};
