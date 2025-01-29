import { Pipeline } from "./analysis-pipeline";
import { geminiMaterialAnalyzer } from "./material-analysis";
/*
Käyttö esim:

Jos käyttäjä haluaa tarkemman analyysin, lisää GPT-4
if (needsDetailedAnalysis) {
  pipeline.addAnalyzer(gpt4Analyzer);
}

Jos haluat säästää kustannuksissa, poista kalliimpi malli
if (needsCheaperOption) {
  pipeline.removeAnalyzer('GPT-4 Analyzer');
}

*/
const pipeline = new Pipeline([geminiMaterialAnalyzer, geminiMaterialAnalyzer]);
export const runtime = "nodejs";
async function test() {
  try {
    const result = await pipeline.run({
      merkki: "Artek",
      malli: "69",
      kuvaus: "Puinen tuoli",
    });

    console.log("Results:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Suorita testi
test();

// ESIMERKKEJÄ
// async function compareModels(input: any) {
//   const pipeline = new Pipeline([]);

//   // Testaa ensin Geminillä
//   pipeline.addAnalyzer(geminiAnalyzer);
//   const geminiResults = await pipeline.run(input);

//   // Vaihda GPT-4:ään
//   pipeline.removeAnalyzer('Gemini Analyzer');
//   pipeline.addAnalyzer(gpt4Analyzer);
//   const gpt4Results = await pipeline.run(input);

//   return {
//     gemini: geminiResults,
//     gpt4: gpt4Results
//   };
// }

// // 3. Fallback-logiikka
// async function analyzeWithFallback(input: any) {
//   const pipeline = new Pipeline([primaryAnalyzer]);

//   try {
//     const results = await pipeline.run(input);
//     if (results.results.length === 0) {
//       // Jos ensimmäinen epäonnistuu, kokeile varamallia
//       pipeline.removeAnalyzer('Primary Analyzer');
//       pipeline.addAnalyzer(fallbackAnalyzer);
//       return await pipeline.run(input);
//     }
//     return results;
//   } catch (error) {
//     console.error('Error with primary:', error);
//     // Vaihda varamalliin virheen sattuessa
//     pipeline.removeAnalyzer('Primary Analyzer');
//     pipeline.addAnalyzer(fallbackAnalyzer);
//     return await pipeline.run(input);
//   }
// }
