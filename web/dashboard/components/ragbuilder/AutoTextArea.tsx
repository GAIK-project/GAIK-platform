import { useRef, useEffect } from "react";

interface AutoGrowingTextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

function useAutoResizeTextarea(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  value: string,
) {
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, textareaRef]);
}

export default function AutoGrowingTextarea({
  value,
  onChange,
  placeholder,
}: AutoGrowingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(
    textareaRef as React.RefObject<HTMLTextAreaElement>,
    value,
  );

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      className="textarea"
      value={value}
      maxLength={500}
      onChange={onChange}
      style={{
        overflow: "hidden",
        resize: "none",
      }}
    />
  );
}
