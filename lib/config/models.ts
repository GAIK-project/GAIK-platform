import { strReplaceEditor } from "@/ai/tools/str-replace-editor";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

export const modelConfigs = {
  claude: {
    provider: () => anthropic("claude-3-5-sonnet-20241022"),
    tools: { str_replace_editor: strReplaceEditor },
    system: `You can use "str_replace_editor" to modify the text in "/mydoc.txt". Always produce a final assistant response describing the changes`,
    maxSteps: 5,
  },
  gpt4: {
    provider: () => openai("gpt-4o"),
    tools: { str_replace_editor: strReplaceEditor },
    system: `Use str_replace_editor tool to modify text in "/mydoc.txt". Describe all changes.`,
    maxSteps: 3,
  },
} as const;
