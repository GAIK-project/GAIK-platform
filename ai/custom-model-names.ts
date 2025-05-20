import { createBrowserClient } from "@/lib/db/supabase/client";

export interface Model {
  id: string;
  label: string;
  description: string;
}

// Default models fallback
export const defaultModels: Array<Model> = [
  {
    id: "None",
    label: "None",
    description: "dont use any custom model",
  }
];

export const DEFAULT_CUSTOM_MODEL_NAME: string = "None";

// --- Supabase client ---
const supabase = createBrowserClient();

// --- Fetch models or fallback ---
export async function fetchModels(owner : string): Promise<Model[]> {
  try {
    const { data, error } = await supabase
      .from("assistants")
      .select("assistant_name")
      .eq("owner", owner);

    if (error) throw error;
    if (!data || data.length === 0) return defaultModels;

    return [
        {
          id: "None",
          label: "None",
          description: "Don't use any custom model",
        },
        ...data.map((row) => ({
          id: row.assistant_name,
          label: row.assistant_name,
          description: "Custom model from Supabase",
        })),
    ];
  } catch (err) {
    console.error("Failed to fetch models, using default:", err);
    return defaultModels;
  }
}
