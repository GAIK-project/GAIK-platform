import { Chat } from "@/components/chat/chat";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/model-names";
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

  return (
    <div className="h-full ">
      <Chat id={id} initialMessages={[]} selectedModelId={selectedModelId} />
    </div>
  );
}
