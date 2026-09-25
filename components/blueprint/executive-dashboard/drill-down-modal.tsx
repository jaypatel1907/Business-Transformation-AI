"use client"

import React from "react"
import {
  ExecutiveKPI,
  RiskItem,
  AIOpportunityPortfolioItem
} from "@/lib/transformation-dashboard-types"
import {
  X,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Info,
  CheckCircle2,
  DollarSign,
  Cpu,
  Layers,
  Clock
} from "lucide-react"

interface DrillDownModalProps {
  selectedItem: {
    type: "kpi" | "risk" | "opportunity"
    data: ExecutiveKPI | RiskItem | AIOpportunityPortfolioItem
  } | null
  onClose: () => void
  targetLanguage?: string
}

export function DrillDownModal({
  selectedItem,
  onClose,
  targetLanguage = "English"
}: DrillDownModalProps) {
  if (!selectedItem) return null

  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const { type, data } = selectedItem

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
              {type === "kpi" ? (
                <TrendingUp className="w-4 h-4" />
              ) : type === "risk" ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {type === "kpi"
                ? isGuj
                  ? "KPI વિગતવાર વિશ્લેષણ"
                  : "KPI Deep-Dive Analysis"
                : type === "risk"
                ? isGuj
                  ? "રિસ્ક આકારણી"
                  : "Risk Assessment"
                : isGuj
                ? "AI ઓપોર્ચ્યુનિટી વિગતો"
                : "AI Opportunity Details"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* KPI Body */}
        {type === "kpi" && (
          <div className="space-y-4 text-xs">
            {(() => {
              const kpi = data as ExecutiveKPI
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                        {kpi.label}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                        {kpi.benchmark || "Enterprise Standard"}
                      </p>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {kpi.value} {kpi.unit}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Calculation & Methodology:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {kpi.details || "Derived through cross-phase aggregation of business value drivers and resource allocations."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">Data Attribution Source:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-500/20">
                      {kpi.source}
                    </span>
                  </div>
                </>
              )
            })()}
          </div>
        )}

        {/* Risk Body */}
        {type === "risk" && (
          <div className="space-y-4 text-xs">
            {(() => {
              const risk = data as RiskItem
              return (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-500/20">
                        {risk.severity} Severity
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {risk.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {risk.title}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Business Impact:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {risk.impact}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Mitigation Strategy:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {risk.mitigation}
                    </p>
                  </div>
                </>
              )
            })()}
          </div>
        )}

        {/* Opportunity Body */}
        {type === "opportunity" && (
          <div className="space-y-4 text-xs">
            {(() => {
              const opp = data as AIOpportunityPortfolioItem
              return (
                <>
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-500/20">
                      {opp.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {opp.title}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Description & Scope:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Business Value:</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {opp.businessValue}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Time-to-Value:</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                        {opp.timeToValue}
                      </p>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
