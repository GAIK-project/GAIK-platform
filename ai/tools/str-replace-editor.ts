// lib/str-replace-editor.ts

import { inMemoryFS } from "@/lib/ai/inmemory-store";
import { tool } from "ai";
import { z } from "zod";

/**
 * strReplaceEditor: Mukautettu tekstieditorityökalu LLM-malleja varten
 *
 * Tämä työkalu tarjoaa rajapinnan tekstin muokkaamiseen muistissa. Se on suunniteltu
 * toimimaan yhdessä kielimallien (LLM) kanssa ja tarjoaa seuraavat perustoiminnot:
 *
 * Komennot:
 * - create: Luo uuden tiedoston annetulla sisällöllä
 * - view: Näytä tiedoston sisältö (mahdollisuus näyttää vain tietty rivialue)
 * - str_replace: Korvaa tekstiä tiedostossa
 * - insert: Lisää uutta tekstiä tiettyyn kohtaan
 * - undo_edit: Peruuta viimeisin muokkaus
 *
 * Parametrit:
 * @param {string} command - Suoritettava komento
 * @param {string} path - Tiedostopolku (esim. "/mydoc.txt")
 * @param {string} [file_text] - Teksti create-komentoa varten
 * @param {number} [insert_line] - Rivinumero insert-komentoa varten
 * @param {string} [new_str] - Uusi teksti str_replace/insert-komentoja varten
 * @param {string} [old_str] - Korvattava teksti str_replace-komentoa varten
 * @param {number[]} [view_range] - Rivialue view-komentoa varten [alku, loppu]
 *
 * Käyttöesimerkkejä:
 *
 * 1. Tiedoston luonti:
 * await strReplaceEditor.execute({
 *   command: "create",
 *   path: "/mydoc.txt",
 *   file_text: "Hello World"
 * });
 *
 * 2. Tekstin korvaaminen:
 * await strReplaceEditor.execute({
 *   command: "str_replace",
 *   path: "/mydoc.txt",
 *   old_str: "Hello",
 *   new_str: "Hi"
 * });
 *
 * 3. Tekstin lisääminen:
 * await strReplaceEditor.execute({
 *   command: "insert",
 *   path: "/mydoc.txt",
 *   insert_line: 2,
 *   new_str: "New line of text"
 * });
 *
 * Muokkausmahdollisuuksia:
 * 1. Uusien komentojen lisääminen enum-listaan ja switch-rakenteeseen
 * 2. Uusien validointien lisääminen parametreille
 * 3. Tuki useammille tiedostoformaateille
 * 4. Hakutoiminnallisuuksien lisääminen
 * 5. Tuki säännöllisille lausekkeille (regex)
 */

export const strReplaceEditor = tool({
  description:
    "Editor for create/view/str_replace/insert/undo_edit in an in-memory FS.",
  parameters: z.object({
    command: z.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
    path: z.string(),
    file_text: z.string().optional(),
    insert_line: z.number().optional(),
    new_str: z.string().optional(),
    old_str: z.string().optional(),
    view_range: z.array(z.number()).optional(),
  }),

  async execute({
    command,
    path,
    file_text,
    insert_line,
    new_str,
    old_str,
    view_range,
  }) {
    function readFile(p: string) {
      return inMemoryFS.get(p) ?? "";
    }
    function writeFile(p: string, content: string) {
      inMemoryFS.set(p, content);
    }
    function copyFile(src: string, dst: string) {
      const data = readFile(src);
      inMemoryFS.set(dst, data);
    }

    const backupPath = path + ".backup";

    switch (command) {
      case "create":
        if (!file_text) {
          throw new Error("file_text is required for create command");
        }
        writeFile(path, file_text);
        return { success: true, message: `Created file at ${path}` };

      case "view": {
        const content = readFile(path);
        if (view_range) {
          const [start, end] = view_range;
          const lines = content.split("\n");
          const snippet = lines.slice(start - 1, end).join("\n");
          return { success: true, content: snippet };
        }
        return { success: true, content };
      }

      case "str_replace": {
        if (!old_str || !new_str) {
          throw new Error("old_str and new_str are required for str_replace");
        }
        copyFile(path, backupPath);
        const oldContent = readFile(path);
        const replaced = oldContent.replaceAll(old_str, new_str);
        writeFile(path, replaced);
        return { success: true, message: "Text replaced successfully" };
      }

      case "insert": {
        if (new_str === undefined || insert_line === undefined) {
          throw new Error("new_str and insert_line are required for insert");
        }
        copyFile(path, backupPath);
        const content = readFile(path);
        const lines = content.split("\n");
        lines.splice(insert_line, 0, new_str);
        writeFile(path, lines.join("\n"));
        return { success: true, message: "Text inserted successfully" };
      }

      case "undo_edit": {
        copyFile(backupPath, path);
        return { success: true, message: "Undo successful" };
      }

      default:
        return { success: false, message: "Invalid command" };
    }
  },
});
