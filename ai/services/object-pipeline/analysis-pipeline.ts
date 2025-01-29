import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export interface Analyzer<TPrompt, TCompletion> {
  name: string;
  analyze: (input: TPrompt) => Promise<TCompletion>;
}

// Pipeline luokka geneerisillä tyypeillä
export class Pipeline<TPrompt, TCompletion> {
  private analyzers: Analyzer<TPrompt, TCompletion>[];

  constructor(analyzers: Analyzer<TPrompt, TCompletion>[]) {
    this.analyzers = analyzers;
  }

  async run(input: TPrompt): Promise<{
    results: { name: string; result: Awaited<TCompletion> }[];
    error?: Error;
  }> {
    const results: { name: string; result: Awaited<TCompletion> }[] = [];

    try {
      const analysisPromises = this.analyzers.map(async (analyzer) => {
        try {
          const result = await analyzer.analyze(input);
          return { name: analyzer.name, result };
        } catch (error) {
          console.error(`Error in ${analyzer.name}:`, error);
          return null;
        }
      });

      const analysisResults = await Promise.all(analysisPromises);

      results.push(
        ...analysisResults.filter(
          (r): r is { name: string; result: Awaited<TCompletion> } =>
            r !== null,
        ),
      );

      return { results };
    } catch (error) {
      return { results, error: error as Error };
    }
  }

  addAnalyzer(analyzer: Analyzer<TPrompt, TCompletion>) {
    this.analyzers.push(analyzer);
  }

  removeAnalyzer(name: string) {
    this.analyzers = this.analyzers.filter((a) => a.name !== name);
  }
}
