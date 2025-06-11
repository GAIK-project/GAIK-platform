"use client";

import { useRouter } from "next/navigation";
import useStore from "@/app/utils/store/useStore";
import { saveModelId } from "@/app/(authenticated)/chatbot/actions";
import { saveCustomModel } from "@/app/(authenticated)/chatbot/actions";
import styles from "@/app/styles/Monitorpage.module.css"; // Assuming same styles

type Props = {
  assistantName: string;
  enabled: boolean;
};

export default function ChatRedirectButton({ assistantName, enabled }: Props) {
  const { setBaseModel, setCustomModel } = useStore();
  const router = useRouter();

  const handleClick = async () => {
    await saveModelId("hyde-rag");
    await saveCustomModel(assistantName);
    setBaseModel("hyde-rag");
    setCustomModel(assistantName);
    router.push("/chatbot");
  };

  return (
    <button
      className={`${styles.chatButton} ${enabled ? styles.active : styles.disabled}`}
      onClick={handleClick}
      disabled={!enabled}
    >
      Chat
    </button>
  );
}
