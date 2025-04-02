import { DEFAULT_MODEL_NAME, models } from "@/ai/model-names";
import { DEFAULT_CUSTOM_MODEL_NAME, fetchModels } from "@/ai/custom-model-names";
import { Chat } from "@/components/chat/chat";
import { generateUUID } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function ChatPage() {
  // Generoidaan uusi ID uudelle chatille
  const id = generateUUID();

  // Haetaan malli cookiesta
  const cookieStore = await cookies();
  const modelFromCookie =
    cookieStore.get("model-id")?.value || DEFAULT_MODEL_NAME;

  const selectedModelId =
    models.find((model) => model.id === modelFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  //sama homma custom malleille
  const customModels = await fetchModels();

  const customModelFromCookie =
    cookieStore.get("custom-model")?.value || DEFAULT_MODEL_NAME;

  const customSelectedModelId =
  customModels.find((model) => model.id === customModelFromCookie)?.id ||
  customModels[0]?.id || // fallback if customModels is not empty
  DEFAULT_MODEL_NAME;     // fallback if no models at all

  return (
    <div className="h-full ">
      <Chat id={id} initialMessages={[]} selectedModelId={selectedModelId} selectedCustomModel={customSelectedModelId} customModels={customModels}/>
    </div>
  );
}
