"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ProcessFlow,
  ProcessNode,
  ProcessEdge,
  ProcessLane,
  ProcessNodeType,
} from "@/lib/process-intelligence-types";
import {
  Play,
  Square,
  HelpCircle,
  User,
  Zap,
  Sparkles,
  Server,
  Layers,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  Move,
  Link2,
} from "lucide-react";

interface ProcessCanvasProps {
  flow: ProcessFlow;
  onUpdateFlow: (newFlow: ProcessFlow) => void;
  onSelectNode: (node: ProcessNode) => void;
  selectedNodeId: string | null;
}

const LANE_HEIGHT = 160;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 76;

export function ProcessCanvas({
  flow,
  onUpdateFlow,
  onSelectNode,
  selectedNodeId,
}: ProcessCanvasProps) {
  // Zoom & Pan state
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodeInitPos, setNodeInitPos] = useState({ x: 0, y: 0 });

  // Connect Mode
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);

  // Selected Edge for deletion
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate canvas dimensions based on nodes & lanes
  const canvasWidth = useMemo(() => {
    const maxX = flow.nodes.reduce((max, n) => Math.max(max, n.x + NODE_WIDTH + 150), 1300);
    return maxX;
  }, [flow.nodes]);

  const canvasHeight = useMemo(() => {
    return Math.max(flow.lanes.length * LANE_HEIGHT + 100, 700);
  }, [flow.lanes]);

  // Handle Pan Events
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background directly
    if ((e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).id === "canvas-grid-bg") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      setSelectedEdgeId(null);
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (draggingNodeId) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;

      const newX = Math.max(20, Math.round((nodeInitPos.x + dx) / 10) * 10);
      const newY = Math.max(20, Math.round((nodeInitPos.y + dy) / 10) * 10);

      // Determine which lane the node falls into based on Y coordinate
      const laneIndex = Math.min(
        flow.lanes.length - 1,
        Math.max(0, Math.floor((newY - 10) / LANE_HEIGHT))
      );
      const targetLane = flow.lanes[laneIndex];

      const updatedNodes = flow.nodes.map((n) => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            x: newX,
            y: newY,
            laneId: targetLane ? targetLane.id : n.laneId,
          };
        }
        return n;
      });

      onUpdateFlow({ ...flow, nodes: updatedNodes });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Node Drag Start
  const handleNodeMouseDown = (e: React.MouseEvent, node: ProcessNode) => {
    e.stopPropagation();

    // If connect mode is active
    if (connectSourceId) {
      if (connectSourceId !== node.id) {
        // Create new edge
        const newEdge: ProcessEdge = {
          id: `edge_${Date.now()}`,
          source: connectSourceId,
          target: node.id,
          label: "",
        };
        onUpdateFlow({
          ...flow,
          edges: [...flow.edges, newEdge],
        });
      }
      setConnectSourceId(null);
      return;
    }

    setDraggingNodeId(node.id);
    setDragStart({ x: e.clientX, y: e.clientY });
    setNodeInitPos({ x: node.x, y: node.y });
    onSelectNode(node);
  };

  // Quick Add Node
  const handleQuickAddNode = (type: ProcessNodeType = "task") => {
    const defaultLane = flow.lanes[0]?.id || "lane_default";
    const lastNode = flow.nodes[flow.nodes.length - 1];
    const newX = lastNode ? lastNode.x + 220 : 100;
    const newY = lastNode ? lastNode.y : 60;

    const newNode: ProcessNode = {
      id: `node_${Date.now()}`,
      type,
      label: type === "ai-task" ? "AI Intelligent Analysis" : type === "decision" ? "Evaluation Gateway" : "New Process Activity",
      description: "Define operation details in inspector",
      laneId: defaultLane,
      x: newX,
      y: newY,
      duration: "5 mins",
    };

    // Auto connect to last node if appropriate
    let newEdges = [...flow.edges];
    if (lastNode && lastNode.type !== "end") {
      newEdges.push({
        id: `e_${Date.now()}`,
        source: lastNode.id,
        target: newNode.id,
      });
    }

    const updated = {
      ...flow,
      nodes: [...flow.nodes, newNode],
      edges: newEdges,
    };
    onUpdateFlow(updated);
    onSelectNode(newNode);
  };

  // Delete Edge
  const handleDeleteEdge = (edgeId: string) => {
    const updated = {
      ...flow,
      edges: flow.edges.filter((e) => e.id !== edgeId),
    };
    onUpdateFlow(updated);
    setSelectedEdgeId(null);
  };

  // Render SVG Path Curve between Source and Target Nodes
  const renderEdgeCurve = (edge: ProcessEdge) => {
    const sourceNode = flow.nodes.find((n) => n.id === edge.source);
    const targetNode = flow.nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    // Anchor points
    const sx = sourceNode.x + (sourceNode.type === "start" || sourceNode.type === "end" ? 30 : sourceNode.type === "decision" ? 40 : NODE_WIDTH);
    const sy = sourceNode.y + (sourceNode.type === "start" || sourceNode.type === "end" ? 30 : sourceNode.type === "decision" ? 40 : NODE_HEIGHT / 2);

    const tx = targetNode.x;
    const ty = targetNode.y + (targetNode.type === "start" || targetNode.type === "end" ? 30 : targetNode.type === "decision" ? 40 : NODE_HEIGHT / 2);

    const isSelected = selectedEdgeId === edge.id;

    // Smooth Bezier Curve calculation
    const dx = Math.abs(tx - sx) * 0.5;
    const pathData = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;

    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;

    return (
      <g key={edge.id} className="cursor-pointer group">
        {/* Invisible wider stroke for easy click selection */}
        <path
          d={pathData}
          fill="none"
          stroke="transparent"
          strokeWidth={18}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEdgeId(edge.id);
          }}
        />

        {/* Visible connector line */}
        <path
          d={pathData}
          fill="none"
          stroke={isSelected ? "#4F46E5" : "#94A3B8"}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={edge.condition ? "5,4" : undefined}
          markerEnd={isSelected ? "url(#arrow-active)" : "url(#arrow-default)"}
          className="transition-colors group-hover:stroke-indigo-600"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEdgeId(edge.id);
          }}
        />

        {/* Condition / Edge Label Badge */}
        {(edge.label || edge.condition) && (
          <g transform={`translate(${midX}, ${midY})`}>
            <rect
              x="-45"
              y="-12"
              width="90"
              height="22"
              rx="6"
              fill="#FFFFFF"
              stroke={isSelected ? "#4F46E5" : "#CBD5E1"}
              strokeWidth="1.5"
              className="shadow-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEdgeId(edge.id);
              }}
            />
            <text
              textAnchor="middle"
              y="2.5"
              fontSize="10"
              fontWeight="600"
              fill={isSelected ? "#4F46E5" : "#475569"}
              className="pointer-events-none select-none"
            >
              {edge.condition || edge.label}
            </text>
          </g>
        )}

        {/* Delete Edge Button on Select */}
        {isSelected && (
          <g
            transform={`translate(${midX + 50}, ${midY - 14})`}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEdge(edge.id);
            }}
            className="cursor-pointer"
          >
            <circle r="10" fill="#EF4444" />
            <text textAnchor="middle" y="3.5" fontSize="10" fill="#FFFFFF" fontWeight="bold">
              ×
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render BPMN-style Node
  const renderNode = (node: ProcessNode) => {
    const isSelected = selectedNodeId === node.id;
    const isSource = connectSourceId === node.id;

    // Node Type Distinct Stying
    if (node.type === "start") {
      return (
        <div
          key={node.id}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
          style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
          className={`absolute flex flex-col items-center cursor-move select-none transition-shadow ${
            isSelected ? "ring-3 ring-emerald-500 rounded-full" : ""
          } ${isSource ? "ring-3 ring-indigo-500 animate-pulse" : ""}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-3 border-emerald-100 hover:scale-105 transition-transform">
            <Play className="h-6 w-6 ml-0.5 fill-current" />
          </div>
          <span className="mt-1.5 max-w-[120px] text-center text-[11px] font-bold text-slate-800 leading-tight">
            {node.label}
          </span>
        </div>
      );
    }

    if (node.type === "end") {
      return (
        <div
          key={node.id}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
          style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
          className={`absolute flex flex-col items-center cursor-move select-none transition-shadow ${
            isSelected ? "ring-3 ring-rose-500 rounded-full" : ""
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-md border-4 border-slate-900 hover:scale-105 transition-transform">
            <Square className="h-5 w-5 fill-current" />
          </div>
          <span className="mt-1.5 max-w-[120px] text-center text-[11px] font-bold text-slate-800 leading-tight">
            {node.label}
          </span>
        </div>
      );
    }

    if (node.type === "decision") {
      return (
        <div
          key={node.id}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
          style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
          className={`absolute flex flex-col items-center cursor-move select-none ${
            isSource ? "ring-2 ring-indigo-500 animate-pulse" : ""
          }`}
        >
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-md border-2 border-amber-600 rotate-45 transition-transform hover:scale-105 ${
              isSelected ? "ring-3 ring-indigo-600 ring-offset-2" : ""
            }`}
          >
            <div className="-rotate-45 flex items-center justify-center">
              <HelpCircle className="h-7 w-7 text-amber-950 stroke-[2.5]" />
            </div>
          </div>
          <span className="mt-2 max-w-[140px] text-center text-[11px] font-bold text-slate-800 leading-tight">
            {node.label}
          </span>
        </div>
      );
    }

    // Standard & Specialized Task Cards
    const isAI = node.type === "ai-task";
    const isAutomated = node.type === "automated-task";
    const isHuman = node.type === "human-task";

    return (
      <div
        key={node.id}
        onMouseDown={(e) => handleNodeMouseDown(e, node)}
        style={{
          transform: `translate(${node.x}px, ${node.y}px)`,
          width: `${NODE_WIDTH}px`,
        }}
        className={`absolute rounded-xl border bg-white p-3 shadow-sm select-none cursor-move transition-all hover:shadow-md ${
          isSelected
            ? "border-indigo-600 ring-2 ring-indigo-400/40 shadow-indigo-100"
            : isAI
            ? "border-purple-300 bg-gradient-to-br from-purple-50/60 to-white"
            : isAutomated
            ? "border-sky-300 bg-sky-50/30"
            : isHuman
            ? "border-amber-300 bg-amber-50/20"
            : "border-slate-200"
        } ${isSource ? "ring-2 ring-indigo-500 animate-pulse" : ""}`}
      >
        {/* Bottleneck Warning Badge */}
        {node.isBottleneck && (
          <div className="absolute -top-3 -right-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs animate-bounce">
            <AlertTriangle className="h-2.5 w-2.5" />
            Potential Bottleneck
          </div>
        )}

        {/* Activity Header with Icon Badge */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] ${
                isAI
                  ? "bg-purple-600 text-white"
                  : isAutomated
                  ? "bg-sky-600 text-white"
                  : isHuman
                  ? "bg-amber-600 text-white"
                  : "bg-slate-700 text-white"
              }`}
            >
              {isAI && <Sparkles className="h-3 w-3" />}
              {isAutomated && <Zap className="h-3 w-3" />}
              {isHuman && <User className="h-3 w-3" />}
              {!isAI && !isAutomated && !isHuman && <Server className="h-3 w-3" />}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isAI ? "AI Task" : isAutomated ? "Automated" : isHuman ? "Human Task" : "System"}
            </span>
          </div>

          {node.duration && (
            <span className="text-[10px] text-slate-400 font-medium">{node.duration}</span>
          )}
        </div>

        {/* Label */}
        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{node.label}</h4>

        {/* Footer info */}
        <p className="mt-1 text-[10px] text-slate-500 line-clamp-1">{node.description}</p>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-[650px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden shadow-xs">
      {/* Floating Canvas Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-sm backdrop-blur-xs">
        <button
          onClick={() => setScale((s) => Math.min(s + 0.15, 1.8))}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.15, 0.4))}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPanOffset({ x: 40, y: 30 });
          }}
          className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          title="Reset View"
        >
          {Math.round(scale * 100)}%
        </button>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Connect Tool */}
        <button
          onClick={() => {
            if (selectedNodeId) {
              setConnectSourceId(selectedNodeId);
            } else {
              alert("Please select a source node first, then click Connect.");
            }
          }}
          className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
            connectSourceId
              ? "bg-indigo-600 text-white animate-pulse"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          title="Click to draw connection to another node"
        >
          <Link2 className="h-3.5 w-3.5" />
          {connectSourceId ? "Select Target..." : "Connect"}
        </button>

        {/* Quick Add Node Dropdown */}
        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        <button
          onClick={() => handleQuickAddNode("task")}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </button>

        <button
          onClick={() => handleQuickAddNode("decision")}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Add Decision
        </button>

        <button
          onClick={() => handleQuickAddNode("ai-task")}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg transition cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Add AI Task
        </button>
      </div>

      {/* Main Interactive Pan/Zoom Canvas Area */}
      <div
        id="canvas-grid-bg"
        ref={containerRef}
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUpCanvas}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative select-none"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
          className="relative transition-transform duration-75"
        >
          {/* Swimlanes Rendering Layer */}
          <div className="absolute inset-0 pointer-events-none">
            {flow.lanes.map((lane, index) => (
              <div
                key={lane.id}
                style={{
                  top: `${index * LANE_HEIGHT}px`,
                  height: `${LANE_HEIGHT}px`,
                  width: `${canvasWidth}px`,
                }}
                className="absolute border-b border-dashed border-slate-200 flex items-stretch"
              >
                {/* Swimlane Header Banner */}
                <div
                  style={{ borderLeftColor: lane.color || "#4F46E5" }}
                  className="w-48 bg-white/80 border-r border-l-4 border-slate-200 p-3 flex flex-col justify-center shadow-2xs backdrop-blur-xs"
                >
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: lane.color || "#4F46E5" }}
                    />
                    {lane.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{lane.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Connectors Layer */}
          <svg
            className="absolute inset-0 pointer-events-auto"
            style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          >
            <defs>
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#4F46E5" />
              </marker>
            </defs>

            {flow.edges.map((edge) => renderEdgeCurve(edge))}
          </svg>

          {/* Process Nodes Layer */}
          <div className="absolute inset-0 pointer-events-auto">
            {flow.nodes.map((node) => renderNode(node))}
          </div>
        </div>
      </div>

      {/* Canvas Status & Helper Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between rounded-xl border border-slate-200/90 bg-white/90 px-4 py-2 text-[11px] text-slate-500 backdrop-blur-xs shadow-2xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">
            {flow.nodes.length} Activities · {flow.edges.length} Connections · {flow.lanes.length} Swimlanes
          </span>
          <span className="hidden sm:inline text-slate-400">
            • Drag nodes across lanes to reassign • Double-click node to inspect
          </span>
        </div>
        <div className="flex items-center gap-2">
          {connectSourceId && (
            <span className="text-indigo-600 font-bold animate-pulse">
              Connect Mode Active: Click target node
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
