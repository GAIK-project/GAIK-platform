"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Handle,
  MiniMap,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback } from "react";
import LLMNode from "./llm-node";

// Define the data interface for our text node.
interface TextNodeData extends Record<string, unknown> {
  label: string;
}

// Build a full node type for the text node.
export type TextNodeType = Node<TextNodeData, "textNode">;

// Our simple text node component. We destructure width and height.
const TextNode: React.FC<NodeProps<TextNodeType>> = ({
  data,
  width,
  height,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Define the nodeTypes mapping.
// Casting the object as NodeTypes tells TypeScript that the signature matches.
const nodeTypes: NodeTypes = {
  llmNode: LLMNode,
  textNode: TextNode,
};

// Define initial nodes. We use a loose type (Node<any, string>)
// so that we don’t need to supply every property from React Flow’s internal Node.
const initialNodes: Node<any, string>[] = [
  {
    id: "1",
    type: "llmNode",
    position: { x: 100, y: 100 },
    data: { label: "LLM Prompt Node" },
  },
  {
    id: "2",
    type: "textNode",
    position: { x: 400, y: 100 },
    data: { label: "Gen-AI Output" },
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
