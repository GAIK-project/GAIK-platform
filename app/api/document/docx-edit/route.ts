import { inMemoryFS } from "@/ai/inmemory-store";
import { strReplaceEditor } from "@/ai/tools/str-replace-editor";
import { anthropic } from "@ai-sdk/anthropic";
import { CoreMessage, streamText } from "ai";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

/**
 * Tämä route vastaanottaa PDF:n ja ohjeet (instruction),
 * parsii PDF:n tekstin, tallentaa sen /mydoc.txt-polulle inMemoryFS:ään,
 * antaa kielimallille (Claude) mahdollisuuden käyttää 'str_replace_editor' -työkalua,
 * ja lopuksi generoi .docx-tiedoston muokatusta tekstistä.
 */

export async function POST(req: NextRequest) {
  try {
    // 1) Haetaan lomakkeen tiedot: PDF-tiedosto + ohje
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const instruction = formData.get("instruction") as string | null;

    // Jos puuttuu, virhe
    if (!file || !instruction) {
      return new Response("Missing file or instruction", { status: 400 });
    }

    // 2) Parsitaan PDF -> Raakateksti pdf-parse-kirjastolla
    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const parsed = await pdfParse(buffer);

    // Oletus: pdf-parse lukee kaikki sivut, liittää ne yhteen
    const originalText = parsed.text.trim();
    console.log("📄 Original text length:", originalText.length);

    // 3) Tallennetaan teksti inMemoryFS:ään polulle "/mydoc.txt"
    //    (Claude pääsee "str_replace_editor" -työkalulla muokkaamaan sitä)
    inMemoryFS.delete("/mydoc.txt");
    inMemoryFS.set("/mydoc.txt", originalText);
    // Jos haluat tallentaa S3:een, voit tässä ladata originalText -> S3:
    /*
    const s3Client = new S3Client({ region: "us-east-1" });
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "my-bucket",
        Key: "temp/mydoc.txt",
        Body: originalText,
      })
    );
    */
    // 4) Kerrotaan LLM:lle system-viestissä, että sillä on 'str_replace_editor'.
    //    Vähintään yksi user-viesti on pakollinen Anthropicin rajapinnassa.
    const messages = [
      {
        role: "system",
        content: `You have a "str_replace_editor" tool to modify the text in "/mydoc.txt". 
        The user's instruction is: ${instruction}
        
        Please apply changes carefully, maintaining document structure and formatting.`,
      },
      {
        role: "user",
        content: "Please modify /mydoc.txt with the given instructions.",
      },
    ] as CoreMessage[];

    // 5) Käynnistetään streamText, annetaan 'str_replace_editor' työkalun käytettäväksi.
    //    Kielimalli (Claude) voi halutessaan kutsua työkaluamme automaattisesti:
    //      - generoi JSON-objektin, jossa command, path, old_str, new_str, jne.
    //      - AI SDK validoi skeemaa vasten ja kutsuu .execute(args).
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages,
      maxSteps: 5,
      tools: { strReplaceEditor },
      onChunk: (chunk) => {
        if (chunk.chunk.type === "tool-call") {
          console.log("🛠️ Tool called:", {
            tool: chunk.chunk.toolName,
            args: chunk.chunk.args,
          });
        } else if (chunk.chunk.type === "tool-result") {
          console.log("✅ Tool result:", {
            tool: chunk.chunk.toolName,
            result: chunk.chunk.result.success,
          });
        }
      },
      // Tarkista jokaisen stepin lopussa mitä tapahtui
      onStepFinish: ({ stepType, toolCalls, toolResults, finishReason }) => {
        console.log("📍 Step finished:", {
          type: stepType,
          tools: toolCalls?.length || 0,
          results: toolResults?.length || 0,
          reason: finishReason,
        });
      },
    });

    // 6) Keräämme lopullisen "assistant"-tekstin. Sillä välin kielimalli
    //    saattaa tehdä useita tool-kutsuja (str_replace, insert, ym.)
    let assistantText = "";
    for await (const chunk of result.textStream) {
      assistantText += chunk;
    }
    // Nyt kielimalli on valmis. Tänä aikana se automaattisesti
    // saattoi kutsua str_replace_editor -työkalua monesti.

    // 7) Haetaan inMemoryFS:stä lopullinen teksti, johon LLM teki muokkaukset
    const finalText = inMemoryFS.get("/mydoc.txt") ?? "";
    // Jos haluat poistua S3:sta, jos tallensit dataa:
    /*
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "my-bucket",
        Key: "temp/mydoc.txt",
      })
    );
    */
    // 8) Muutetaan teksti rivikerrallaan docx-kappaleiksi
    const lines = finalText.split(/\r?\n/);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22, // 11 pt
                  }),
                ],
                spacing: {
                  after: 200,
                  line: 360, // 1.5 riviväli
                },
              }),
          ),
        },
      ],
    });

    // 9) Generoidaan .docx-binaari
    const docBuffer = await Packer.toBuffer(doc);

    // 10) Palautetaan .docx tiedosto
    return new Response(docBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="edited.docx"',
      },
    });
  } catch (err) {
    console.error("Document processing error:", err);
    return NextResponse.json(
      {
        error: "Failed to process document",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
