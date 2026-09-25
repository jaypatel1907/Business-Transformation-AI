"use client";

import { useState } from "react";
import {
  ProcessFlow,
  ProcessBottleneck,
  AutomationOpportunity,
  AIOpportunity,
  ProcessOptimization,
} from "@/lib/process-intelligence-types";
import {
  AlertTriangle,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface BottleneckPanelProps {
  flow: ProcessFlow;
  onFocusNode: (nodeId: string) => void;
  onConvertNode: (nodeId: string, toType: "automated-task" | "ai-task") => void;
}

export function BottleneckPanel({
  flow,
  onFocusNode,
  onConvertNode,
}: BottleneckPanelProps) {
  const [activeTab, setActiveTab] = useState<"bottlenecks" | "automation" | "ai" | "optimizations">("bottlenecks");

  const bottlenecks = flow.bottlenecks || [];
  const autoOpps = flow.automationOpportunities || [];
  const aiOpps = flow.aiOpportunities || [];
  const optimizations = flow.optimizations || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Sub-tabs header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("bottlenecks")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "bottlenecks"
                ? "bg-white text-amber-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            Potential Bottlenecks
            <span className="ml-1 rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px]">
              {bottlenecks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("automation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "automation"
                ? "bg-white text-sky-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-sky-600" />
            Automation Opportunities
            <span className="ml-1 rounded-full bg-sky-100 text-sky-800 px-1.5 py-0.2 text-[10px]">
              {autoOpps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "ai"
                ? "bg-white text-purple-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            AI Opportunities
            <span className="ml-1 rounded-full bg-purple-100 text-purple-800 px-1.5 py-0.2 text-[10px]">
              {aiOpps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("optimizations")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "optimizations"
                ? "bg-white text-emerald-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Optimizations
            <span className="ml-1 rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px]">
              {optimizations.length}
            </span>
          </button>
        </div>
      </div>

      {/* 1. Potential Bottlenecks Content */}
      {activeTab === "bottlenecks" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>
              Identified from process structure, manual handoffs, and approval gateways.
            </span>
            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Structural Assessment
            </span>
          </div>

          {bottlenecks.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-emerald-50/50 border border-dashed border-emerald-200">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-900">Zero Structural Bottlenecks Detected!</p>
              <p className="text-xs text-emerald-700 mt-1">
                This workflow is highly automated with streamlined handoffs and minimal idle delays.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bottlenecks.map((btn) => (
                <div
                  key={btn.id}
                  className="rounded-xl border border-amber-200/90 bg-amber-50/30 p-4 space-y-2.5 transition hover:shadow-xs hover:border-amber-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{btn.title}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        btn.severity === "high"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : btn.severity === "medium"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {btn.severity} Severity
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{btn.reason}</p>

                  <div className="rounded-lg bg-white p-2.5 border border-amber-100 text-xs text-slate-800">
                    <span className="font-bold text-amber-900">Recommendation: </span>
                    {btn.recommendation}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-amber-100/60 text-[11px]">
                    {btn.potentialTimeSaved && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        Save: <strong className="text-slate-700">{btn.potentialTimeSaved}</strong>
                      </span>
                    )}
                    <button
                      onClick={() => onFocusNode(btn.nodeId)}
                      className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      Inspect Node <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Automation Opportunities Content */}
      {activeTab === "automation" && (
        <div className="space-y-3">
          {autoOpps.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <Zap className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No additional routine automation opportunities flagged.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {autoOpps.map((opp) => (
                <div
                  key={opp.id}
                  className="rounded-xl border border-sky-200 bg-sky-50/20 p-4 space-y-2.5 transition hover:shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-sky-600" />
                      {opp.stepName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      Complexity: {opp.implementationComplexity}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{opp.opportunity}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{opp.rationale}</p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-sky-100 text-xs">
                    <span className="font-bold text-slate-700">Expected Benefit: </span>
                    <span className="text-slate-600">{opp.potentialBenefit}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-sky-100">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Tool: <strong>{opp.suggestedToolOrAI || "Cloud Pipeline"}</strong>
                    </span>
                    <button
                      onClick={() => onConvertNode(opp.nodeId, "automated-task")}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      Convert to Automated Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. AI Opportunities Content */}
      {activeTab === "ai" && (
        <div className="space-y-3">
          {aiOpps.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <Sparkles className="h-7 w-7 text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">All planned AI capabilities are active in this workflow.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiOpps.map((ai) => (
                <div
                  key={ai.id}
                  className="rounded-xl border border-purple-200 bg-purple-50/20 p-4 space-y-2.5 transition hover:shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      {ai.stepName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      {ai.complexity} Complexity
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{ai.aiCapability}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Recommended Model: <strong>{ai.modelSuggestion || "Gemini 3.6 Flash"}</strong>
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-purple-100 text-xs">
                    <span className="font-bold text-slate-700">Expected Impact: </span>
                    <span className="text-slate-600">{ai.expectedImpact}</span>
                  </div>

                  <div className="flex justify-end pt-1 border-t border-purple-100">
                    <button
                      onClick={() => onConvertNode(ai.nodeId, "ai-task")}
                      className="px-3 py-1 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      Convert to AI Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Process Optimizations Content */}
      {activeTab === "optimizations" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {optimizations.map((opt) => (
              <div
                key={opt.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 space-y-2 transition hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    {opt.title}
                  </h5>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Effort: {opt.effort}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                <div className="text-[11px] font-semibold text-emerald-800 pt-1 border-t border-emerald-100">
                  Impact: {opt.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
