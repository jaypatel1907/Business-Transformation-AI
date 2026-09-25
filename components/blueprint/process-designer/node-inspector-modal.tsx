"use client";

import { useState, useEffect } from "react";
import {
  ProcessNode,
  ProcessNodeType,
  ProcessLane,
} from "@/lib/process-intelligence-types";
import {
  X,
  Play,
  Square,
  HelpCircle,
  User,
  Zap,
  Sparkles,
  Server,
  Layers,
  AlertTriangle,
  Trash2,
  Check,
} from "lucide-react";

interface NodeInspectorModalProps {
  node: ProcessNode | null;
  lanes: ProcessLane[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProcessNode) => void;
  onDelete: (nodeId: string) => void;
}

const NODE_TYPES: { type: ProcessNodeType; label: string; desc: string; icon: any; color: string }[] = [
  { type: "start", label: "Start Event", desc: "Initiates process flow", icon: Play, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { type: "human-task", label: "Human Task", desc: "Performed manually by a person", icon: User, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { type: "automated-task", label: "Automated Task", desc: "Executed by system scripts / software", icon: Zap, color: "text-sky-600 bg-sky-50 border-sky-200" },
  { type: "ai-task", label: "AI Task", desc: "Cognitive task powered by Gemini / ML", icon: Sparkles, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { type: "system-task", label: "System / DB Task", desc: "Core database or API transaction", icon: Server, color: "text-slate-600 bg-slate-50 border-slate-200" },
  { type: "decision", label: "Decision Gateway", desc: "Conditional branching point", icon: HelpCircle, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { type: "subprocess", label: "Subprocess", desc: "Nested sequence or module", icon: Layers, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { type: "end", label: "End Event", desc: "Process conclusion point", icon: Square, color: "text-rose-600 bg-rose-50 border-rose-200" },
];

export function NodeInspectorModal({
  node,
  lanes,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: NodeInspectorModalProps) {
  const [formData, setFormData] = useState<ProcessNode | null>(null);

  useEffect(() => {
    if (node) {
      setFormData({ ...node });
    }
  }, [node]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Process Node Inspector</h3>
              <p className="text-xs text-slate-500">Configure BPMN activity properties, swimlane, and automation level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-xs">
          {/* Label */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Step Name / Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. Verify Customer Identity"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Step Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Explain what actions occur during this step..."
            />
          </div>

          {/* Node Type Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">BPMN Activity Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NODE_TYPES.map((nt) => {
                const Icon = nt.icon;
                const isSelected = formData.type === nt.type;
                return (
                  <button
                    key={nt.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: nt.type })}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-[11px] font-medium leading-tight">{nt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Swimlane Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Swimlane</label>
              <select
                value={formData.laneId}
                onChange={(e) => setFormData({ ...formData, laneId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              >
                {lanes.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Step Duration</label>
              <input
                type="text"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. 5 mins, 200 ms, Instant"
              />
            </div>
          </div>

          {/* Automation Potential & Bottleneck Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Automation Potential</label>
              <select
                value={formData.automationPotential || "none"}
                onChange={(e) => setFormData({ ...formData, automationPotential: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              >
                <option value="high">High Potential (Rule-based / AI ready)</option>
                <option value="medium">Medium Potential (Requires human review)</option>
                <option value="low">Low Potential (Physical or highly creative)</option>
                <option value="none">None / Not Applicable</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBottleneck || false}
                  onChange={(e) => setFormData({ ...formData, isBottleneck: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Flag as Potential Bottleneck
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete this process node?")) {
                onDelete(formData.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Node
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
