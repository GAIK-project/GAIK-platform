export interface SearchResult {
  type: "database" | "web";
  title?: string;
  content: string;
  metadata?: any;
  similarity?: number;
}

export interface RagResponse {
  answer: string;
  sources: Array<{
    title: string;
    type: "database" | "web";
    content: string;
  }>;
}

export interface AnalysisResult {
  hasGaps: boolean;
  learnedInfo: string[]; // Mitä uutta opittiin
  remainingQuestions: string[]; // Mitä vielä pitäisi selvittää
  nextQuerySuggestion: string; // Seuraava hakukysely
}

export interface SubQueryAnalysis {
  subQueries: string[];
  rationale: string;
}

export interface GoogleGroundingMetadata {
  groundingSupports?: Array<{
    segment?: {
      text?: string;
    };
  }>;
}

export interface GoogleGroundingData {
  groundingSupports?: Array<{
    segment?: {
      text?: string;
    };
  }>;
  groundingMetadata?: GoogleGroundingMetadata;
}
