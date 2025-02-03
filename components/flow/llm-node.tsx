"use client";

import React, { useCallback, useState } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

// Define the data interface for our LLM node.
export interface LLMNodeData {
  label?: string;
  // You can add more fields if needed.
  [key: string]: unknown;
}

// Build a full node type for our custom node.
// (The second generic parameter is the node type string.)
export type LLMNodeType = Node<LLMNodeData, "llmNode">;

// Our custom LLM node component.
const LLMNode: React.FC<NodeProps<LLMNodeType>> = ({ data, width, height }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleGenerate = useCallback(() => {
    // Simulate an LLM response. Replace this with a real API call if needed.
    setResponse(`Simulated response for: "${prompt}"`);
  }, [prompt]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-lg">
      {/* Input handle */}
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col space-y-2">
        <label className="font-bold text-sm">LLM Prompt</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt..."
          className="nodrag p-2 border rounded"
        />
        <button
          onClick={handleGenerate}
          className="bg-blue-500 text-white px-3 py-1 rounded nodrag"
        >
          Generate
        </button>
        {response && (
          <div className="p-2 bg-gray-100 rounded text-sm">{response}</div>
        )}
      </div>
      {/* Output handle */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LLMNode;
