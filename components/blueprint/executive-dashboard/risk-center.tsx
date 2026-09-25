"use client"

import React, { useState } from "react"
import { RiskItem } from "@/lib/transformation-dashboard-types"
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Filter,
  ShieldCheck,
  ArrowRight
} from "lucide-react"

interface RiskCenterProps {
  risks: RiskItem[]
  onSelectRisk?: (risk: RiskItem) => void
  targetLanguage?: string
}

export function RiskCenter({
  risks,
  onSelectRisk,
  targetLanguage = "English"
}: RiskCenterProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const filteredRisks = risks.filter((r) => {
    if (filterSeverity === "all") return true
    return r.severity.toLowerCase() === filterSeverity.toLowerCase()
  })

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
      case "high":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
      default:
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30"
    }
  }

  const getStatusBadge = (st: string) => {
    switch (st.toLowerCase()) {
      case "mitigated":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      case "monitoring":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
      default:
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "એક્ઝિક્યુટિવ રિસ્ક સેન્ટર" : "Enterprise Risk Center & Mitigation"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "તકનીકી, બિઝનેસ અને સુરક્ષા જોખમો" : "Categorized risk registry with documented containment and contingency measures."}
            </p>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterSeverity("all")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterSeverity === "all"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All ({risks.length})
          </button>
          <button
            onClick={() => setFilterSeverity("high")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterSeverity === "high"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilterSeverity("medium")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterSeverity === "medium"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Medium
          </button>
        </div>
      </div>

      {/* Risk Items */}
      <div className="space-y-3">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            onClick={() => onSelectRisk && onSelectRisk(risk)}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(risk.severity)}`}>
                  {risk.severity} Severity
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {risk.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {risk.title}
                </h4>
              </div>

              <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${getStatusBadge(risk.status)}`}>
                {risk.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Impact Analysis</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {risk.impact}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/20 dark:border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Mitigation Action
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {risk.mitigation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
