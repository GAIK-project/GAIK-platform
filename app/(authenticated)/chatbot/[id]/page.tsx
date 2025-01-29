// import { cookies } from "next/headers";
// import { Chat } from "@/components/chat/chat";
// import { DEFAULT_MODEL_NAME } from "@/lib/models";
// import { fetchChatHistory } from "@/lib/chat-history"; // Tämä pitää implementoida

// interface ChatPageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function ChatPage({ params }: ChatPageProps) {
//   const { id } = params;

//   // Haetaan chat historia ID:n perusteella
//   const chatHistory = await fetchChatHistory(id);

//   // Haetaan malli cookiesta
//   const cookieStore = await cookies();
//   const modelFromCookie = cookieStore.get("model-id")?.value || DEFAULT_MODEL_NAME;

//   return (
//     <div className="flex h-dvh bg-background">
//       <Chat
//         id={id}
//         initialModel={modelFromCookie}
//         initialMessages={chatHistory?.messages || []}
//       />
//     </div>
//   );
// }
