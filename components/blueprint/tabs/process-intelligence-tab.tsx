"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ProcessFlow,
  ProcessNode,
  ProcessLane,
  ProcessNodeType,
} from "@/lib/process-intelligence-types";
import {
  buildProcessIntelligenceModel,
  analyzeProcessBottlenecks,
  saveProcessFlowToStorage,
} from "@/lib/process-intelligence-adapter";
import {
  RESTAURANT_CURRENT_STATE_FIXTURE,
  RESTAURANT_FUTURE_STATE_FIXTURE,
} from "@/lib/process-intelligence-fixtures";
import { ProcessCanvas } from "@/components/blueprint/process-designer/process-canvas";
import { NodeInspectorModal } from "@/components/blueprint/process-designer/node-inspector-modal";
import { BottleneckPanel } from "@/components/blueprint/process-designer/bottleneck-panel";
import {
  Workflow,
  ArrowRightLeft,
  AlertTriangle,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Layers,
  CheckCircle2,
  Download,
  Eye,
  Zap,
  HelpCircle,
  Info,
  X,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ProcessIntelligenceTabProps {
  generated: boolean;
  data?: any;
  targetLanguage?: string;
}

export function ProcessIntelligenceTab({
  generated,
  data,
  targetLanguage = "English",
}: ProcessIntelligenceTabProps) {
  // Active Process State: "current" (As-Is) vs "future" (To-Be)
  const [activeState, setActiveState] = useState<"current" | "future">("current");

  // Dual flow state
  const [currentFlow, setCurrentFlow] = useState<ProcessFlow | null>(null);
  const [futureFlow, setFutureFlow] = useState<ProcessFlow | null>(null);

  // Inspector Modal
  const [inspectingNode, setInspectingNode] = useState<ProcessNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Help & Explanation Guide Toggle
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  // Unsaved Changes Tracking
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Initialize or re-derive flows when data changes
  useEffect(() => {
    const models = buildProcessIntelligenceModel(data, targetLanguage);
    setCurrentFlow(models.current);
    setFutureFlow(models.future);
    setIsDirty(false);
  }, [data, targetLanguage]);

  // Current active flow pointer
  const activeFlow = useMemo(() => {
    return activeState === "current" ? currentFlow : futureFlow;
  }, [activeState, currentFlow, futureFlow]);

  // Handle flow mutation from Canvas (node moved, node added, edge deleted, etc.)
  const handleUpdateFlow = useCallback(
    (newFlow: ProcessFlow) => {
      // Re-run dynamic bottleneck analysis
      const updatedBottlenecks = analyzeProcessBottlenecks(newFlow);

      // Flag nodes matching detected bottlenecks
      const updatedNodes = newFlow.nodes.map((node) => {
        const btn = updatedBottlenecks.find((b) => b.nodeId === node.id);
        return {
          ...node,
          isBottleneck: !!btn,
          bottleneckId: btn ? btn.id : undefined,
        };
      });

      const refinedFlow: ProcessFlow = {
        ...newFlow,
        nodes: updatedNodes,
        bottlenecks: updatedBottlenecks,
      };

      if (activeState === "current") {
        setCurrentFlow(refinedFlow);
      } else {
        setFutureFlow(refinedFlow);
      }
      setIsDirty(true);
      setSaveStatus("idle");
    },
    [activeState]
  );

  // Save changes to localStorage
  const handleSaveFlows = useCallback(() => {
    if (!currentFlow || !futureFlow) return;
    setSaveStatus("saving");
    const projectId = data?.id || data?.project_title || "active_project";
    saveProcessFlowToStorage(projectId, currentFlow, futureFlow);
    setTimeout(() => {
      setIsDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 400);
  }, [currentFlow, futureFlow, data]);

  // Reset to Benchmark Fixture
  const handleResetToBenchmark = () => {
    if (confirm("Reset current workflows to the standard benchmark (Restaurant Table Reservation As-Is vs To-Be)?")) {
      setCurrentFlow(JSON.parse(JSON.stringify(RESTAURANT_CURRENT_STATE_FIXTURE)));
      setFutureFlow(JSON.parse(JSON.stringify(RESTAURANT_FUTURE_STATE_FIXTURE)));
      setIsDirty(true);
    }
  };

  // Node Inspector Save
  const handleSaveNode = (updatedNode: ProcessNode) => {
    if (!activeFlow) return;
    const updatedNodes = activeFlow.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
    handleUpdateFlow({ ...activeFlow, nodes: updatedNodes });
  };

  // Node Inspector Delete
  const handleDeleteNode = (nodeId: string) => {
    if (!activeFlow) return;
    const updatedNodes = activeFlow.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = activeFlow.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
    handleUpdateFlow({ ...activeFlow, nodes: updatedNodes, edges: updatedEdges });
  };

  // Quick Convert Node to Automated or AI Task
  const handleConvertNodeType = (nodeId: string, toType: "automated-task" | "ai-task") => {
    if (!activeFlow) return;
    const updatedNodes = activeFlow.nodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          type: toType as ProcessNodeType,
          isBottleneck: false,
          duration: toType === "ai-task" ? "1-2 sec" : "Instant",
        };
      }
      return n;
    });
    handleUpdateFlow({ ...activeFlow, nodes: updatedNodes });
  };

  // Add Swimlane
  const handleAddLane = () => {
    if (!activeFlow) return;
    const laneName = prompt("Enter new Swimlane name (e.g., Compliance, Dispatcher, Vendor):", "External Partner");
    if (!laneName) return;

    const newLane: ProcessLane = {
      id: `lane_${Date.now()}`,
      name: laneName,
      role: "Assigned Stakeholder",
      color: "#0284C7",
    };

    handleUpdateFlow({
      ...activeFlow,
      lanes: [...activeFlow.lanes, newLane],
    });
  };

  // AI Optimize Current State -> Generate Streamlined Future State
  const handleAIOptimizeWorkflow = () => {
    if (!currentFlow) return;
    // Transform manual human tasks into AI and automated tasks
    const optimizedNodes: ProcessNode[] = currentFlow.nodes.map((n) => {
      if (n.type === "human-task") {
        return {
          ...n,
          type: "ai-task",
          label: `AI Assisted: ${n.label}`,
          duration: "Sub-second",
          isBottleneck: false,
        };
      }
      return { ...n, isBottleneck: false };
    });

    const optimizedFlow: ProcessFlow = {
      ...currentFlow,
      id: `flow_opt_${Date.now()}`,
      name: `${currentFlow.name} (AI Optimized Future State)`,
      state: "future",
      nodes: optimizedNodes,
      bottlenecks: [],
    };

    setFutureFlow(optimizedFlow);
    setActiveState("future");
    setIsDirty(true);
  };

  if (!generated && !activeFlow) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm space-y-3">
        <Workflow className="h-10 w-10 text-indigo-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Process Intelligence Designer</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Input your business requirement on the left to synthesize As-Is & To-Be BPMN workflows, analyze potential bottlenecks, and generate automation opportunities.
        </p>
      </div>
    );
  }

  if (!activeFlow) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Loading Process Intelligence model...
      </div>
    );
  }

  const currentBottleneckCount = currentFlow?.bottlenecks.length || 0;
  const futureBottleneckCount = futureFlow?.bottlenecks.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & State Switcher */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                <Workflow className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Process Intelligence Designer
              </h2>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                BPMN 2.0 Style · Multi-Lane
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive process canvas with swimlanes, bottleneck diagnostics, and automation recommendations.
            </p>
          </div>

          {/* State Switcher (Current As-Is vs Future To-Be) */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1.5 border border-slate-200">
            <button
              onClick={() => setActiveState("current")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeState === "current"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Current State (As-Is)</span>
              {currentBottleneckCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-extrabold border border-amber-200">
                  <AlertTriangle className="h-2.5 w-2.5 text-amber-600" />
                  {currentBottleneckCount} Bottlenecks
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveState("future")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeState === "future"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
              <span>Future State (To-Be)</span>
              <span className="rounded-full bg-white/20 text-white px-2 py-0.5 text-[10px] font-bold">
                Optimized
              </span>
            </button>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddLane}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              Add Swimlane
            </button>

            <button
              onClick={handleAIOptimizeWorkflow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              AI Optimize Workflow
            </button>

            <button
              onClick={() => setShowHelpGuide(!showHelpGuide)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                showHelpGuide
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
              <span>{showHelpGuide ? "Hide Guide" : "What is this? (સરળ સમજૂતી)"}</span>
            </button>

            <button
              onClick={handleResetToBenchmark}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Load Restaurant Table Booking Benchmark Fixture"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              Reset to Benchmark
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Unsaved changes
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> All Saved
              </span>
            )}

            <button
              onClick={handleSaveFlows}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saveStatus === "saving" ? "Saving..." : "Save Process"}
            </button>
          </div>
        </div>

        {/* User Explanation & Guide Card */}
        {showHelpGuide && (
          <div className="rounded-xl bg-gradient-to-r from-indigo-50/90 via-slate-50 to-blue-50/80 p-4 border border-indigo-100 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
              <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm">
                <Info className="h-4 w-4 text-indigo-600" />
                <span>Process Intelligence Guide · સરળ માર્ગદર્શિકા</span>
              </div>
              <button
                onClick={() => setShowHelpGuide(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 leading-relaxed">
              <div className="bg-white/80 p-3 rounded-lg border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-[11px]">1</span>
                  આ શું છે? (What is this?)
                </p>
                <p className="text-slate-600 text-[11px]">
                  કોઈપણ બિઝનેસ કામ કેવી રીતે થાય છે (દા.ત. Customer ઓર્ડર આપે, System પ્રોસેસ કરે, Staff ચેક કરે) તેનો સ્ટેપ-બાય-સ્ટેપ વિઝ્યુઅલ ફ્લો ડાયાગ્રામ (Swimlanes) છે.
                </p>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-[11px]">2</span>
                  As-Is vs To-Be (અત્યારે vs ભવિષ્ય)
                </p>
                <p className="text-slate-600 text-[11px]">
                  <strong>Current (As-Is):</strong> જ્યાં મેન્યુઅલ ભૂલો અને મોડું (Bottlenecks) થાય છે. <br />
                  <strong>Future (To-Be):</strong> AI ઓટોમેશનથી 80% સમય અને ખર્ચ બચાવતો ફાસ્ટ ફ્લો.
                </p>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-[11px]">3</span>
                  કેવી રીતે વાપરવું? (How to use)
                </p>
                <p className="text-slate-600 text-[11px]">
                  1. કોઈ પણ બોક્સ પર ક્લિક કરીને સમય/ખર્ચ જુઓ. <br />
                  2. <strong>AI Optimize Workflow</strong> દબાવો જેથી AI આપમેળે સ્લો સ્ટેપ્સ ફાસ્ટ કરી દેશે. <br />
                  3. ડાયાગ્રામ એક્સપોર્ટ કરવા <strong>Export PNG/JSON</strong> વાપરો.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Visual Process Canvas */}
      <ProcessCanvas
        flow={activeFlow}
        onUpdateFlow={handleUpdateFlow}
        onSelectNode={(node) => {
          setInspectingNode(node);
          setIsModalOpen(true);
        }}
        selectedNodeId={inspectingNode?.id || null}
      />

      {/* Bottleneck Analysis & Optimization Layer */}
      <BottleneckPanel
        flow={activeFlow}
        onFocusNode={(nodeId) => {
          const target = activeFlow.nodes.find((n) => n.id === nodeId);
          if (target) {
            setInspectingNode(target);
            setIsModalOpen(true);
          }
        }}
        onConvertNode={handleConvertNodeType}
      />

      {/* Node Inspector Modal */}
      <NodeInspectorModal
        node={inspectingNode}
        lanes={activeFlow.lanes}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNode}
        onDelete={handleDeleteNode}
      />
    </div>
  );
}
