import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 bg-white ${className}`}
    >
      {children}
    </div>
  );
};
