"use client";

import { useState, useEffect } from "react";
import { KnowledgeStore } from "@/lib/knowledge-types";
import { synthesizeKnowledgeStore, saveKnowledgeStore, loadKnowledgeStore } from "@/lib/knowledge-engine";
import { buildExportProjectModel } from "@/lib/export-engine";
import { DecisionLogTable } from "@/components/blueprint/knowledge/decision-log-table";
import { TraceabilityMatrix } from "@/components/blueprint/knowledge/traceability-matrix";
import { KnowledgeTimelineView } from "@/components/blueprint/knowledge/knowledge-timeline-view";
import { AIKnowledgeChat } from "@/components/blueprint/knowledge/ai-knowledge-chat";
import { ExportCenterModal } from "@/components/blueprint/export/export-center-modal";
import {
  Brain,
  FileCheck2,
  GitMerge,
  History,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface KnowledgeTabProps {
  generated: boolean;
  data?: any;
  targetLanguage?: string;
}

type SubView = "decisions" | "traceability" | "timeline" | "copilot";

export function KnowledgeTab({
  generated,
  data,
  targetLanguage = "English",
}: KnowledgeTabProps) {
  const [store, setStore] = useState<KnowledgeStore | null>(null);
  const [activeSubView, setActiveSubView] = useState<SubView>("decisions");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const syn = synthesizeKnowledgeStore(data);
      setStore(syn);
    }
  }, [data]);

  if (!generated && !store) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm space-y-3">
        <Brain className="h-10 w-10 text-indigo-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">
          Continuous Knowledge Layer & Decision Governance
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Input your business requirement on the left to synthesize the immutable Decision Log, Requirement Traceability Matrix (RTM), Lifecycle Timeline, and Export Platform deliverables.
        </p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Synthesizing Continuous Knowledge Layer...
      </div>
    );
  }

  const exportModel = buildExportProjectModel(data, null, null, null, targetLanguage);

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Export Center Launcher */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                <Brain className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Continuous Knowledge & Governance Hub
              </h2>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                Phase 6 Engine · Immutable Traceability
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Preserving transformation rationale, architectural decisions, requirement links, and multi-format enterprise exports.
            </p>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer self-start lg:self-auto"
          >
            <Download className="h-4 w-4" />
            Open Export Center
          </button>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Decisions Logged</span>
            <span className="font-extrabold text-slate-900">{store.decisions.length} Architectural Choices</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Traceability Links</span>
            <span className="font-extrabold text-indigo-700">{store.traceability.length} Traced Requirements</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Lifecycle Milestones</span>
            <span className="font-extrabold text-purple-700">{store.timeline.length} Recorded Phases</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">Governance Status</span>
            <span className="font-extrabold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Fully Auditable
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveSubView("decisions")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "decisions"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck2 className="h-3.5 w-3.5" />
          Decision Log & Rationale
          <span className="ml-1 rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px]">
            {store.decisions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubView("traceability")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "traceability"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <GitMerge className="h-3.5 w-3.5" />
          Requirement Traceability (RTM)
          <span className="ml-1 rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px]">
            {store.traceability.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubView("timeline")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "timeline"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          Transformation Timeline
          <span className="ml-1 rounded-full bg-indigo-50 text-indigo-700 px-1.5 py-0.2 text-[10px]">
            {store.timeline.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubView("copilot")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "copilot"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          AI Knowledge Copilot
        </button>
      </div>

      {/* Active Sub-View Render */}
      {activeSubView === "decisions" && <DecisionLogTable decisions={store.decisions} />}
      {activeSubView === "traceability" && <TraceabilityMatrix traceability={store.traceability} />}
      {activeSubView === "timeline" && <KnowledgeTimelineView timeline={store.timeline} />}
      {activeSubView === "copilot" && <AIKnowledgeChat knowledgeStore={store} />}

      {/* Export Center Modal */}
      <ExportCenterModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportModel={exportModel}
      />
    </div>
  );
}
