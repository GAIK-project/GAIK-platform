import React from "react";

type Message = {
  content: string;
  role: string;
};

type BubbleProps = {
  message: Message;
};

const Bubble: React.FC<BubbleProps> = ({ message }) => {
  const { content, role } = message;
  return <div className={`${role} bubble`}>{content}</div>;
};

export default Bubble;
