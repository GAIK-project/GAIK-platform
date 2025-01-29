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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";

// Yksinkertainen custom node
const TextNode = ({ data }: NodeProps) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <Handle type="target" position={Position.Top} />
      <div>
        <input
          type="text"
          onChange={(evt) => console.log(evt.target.value)}
          className="nodrag"
          placeholder="Enter text"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Node tyypit
const nodeTypes = {
  textNode: TextNode,
};

// Alkutilanne
const initialNodes: Node[] = [
  {
    id: "1",
    type: "textNode",
    position: { x: 100, y: 100 },
    data: { label: "Node 1" },
  },
  {
    id: "2",
    type: "textNode",
    position: { x: 300, y: 100 },
    data: { label: "Node 2" },
  },
  {
    id: "3",
    type: "textNode",
    position: { x: 400, y: 100 },
    data: { label: "Node 3" },
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
