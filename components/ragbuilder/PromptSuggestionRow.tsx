import React from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

type PromptSuggestionRowProps = {
  onPromptClick: (prompt: string) => void;
};

const PromptSuggestionRow: React.FC<PromptSuggestionRowProps> = ({
  onPromptClick,
}) => {
  const prompts: string[] = [
    "Who is the highest paid F1 driver?",
    "Who is the current Formula One World Driver's Champion?",
    "How physically demanding is F1 driving?",
  ];

  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
