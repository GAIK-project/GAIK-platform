import { createBrowserClient } from "@/lib/db/supabase/client";

export interface Model {
  id: string;
  label: string;
  description: string;
}

// Default models fallback
export const defaultModels: Array<Model> = [
  {
    id: "none",
    label: "none",
    description: "none",
  }
];

export const DEFAULT_CUSTOM_MODEL_NAME: string = "none";

// --- Supabase client ---
const supabase = createBrowserClient();

// --- Fetch models or fallback ---
export async function fetchModels(): Promise<Model[]> {
  try {
    const { data, error } = await supabase
      .from("assistants")
      .select("assistant_name");

    if (error) throw error;
    if (!data || data.length === 0) return defaultModels;

    return data.map((row) => ({
      id: row.assistant_name,
      label: row.assistant_name,
      description: "Custom model from Supabase",
    }));
  } catch (err) {
    console.error("Failed to fetch models, using default:", err);
    return defaultModels;
  }
}
