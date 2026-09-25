"use client"

import React from "react"
import { ExecutiveKPI } from "@/lib/transformation-dashboard-types"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gauge,
  Zap,
  Clock,
  ShieldAlert,
  Cpu,
  Info,
  ArrowUpRight
} from "lucide-react"

interface KPIGridProps {
  kpis: ExecutiveKPI[]
  onSelectKPI?: (kpi: ExecutiveKPI) => void
  targetLanguage?: string
}

export function KPIGrid({
  kpis,
  onSelectKPI,
  targetLanguage = "English"
}: KPIGridProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "Calculated":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "AI Estimated":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "User Provided":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    }
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "financial":
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      case "ai":
        return <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      case "maturity":
        return <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      case "process":
        return <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      default:
        return <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span>{isGuj ? "એક્ઝિક્યુટિવ KPI સ્કોરકાર્ડ" : "Executive KPI Scorecard"}</span>
          <span className="text-[11px] text-slate-400 font-normal">
            ({kpis.length} {isGuj ? "મેટ્રિક્સ" : "benchmarked metrics"})
          </span>
        </h3>
        <span className="text-[10px] text-slate-400">
          {isGuj ? "વિગતો માટે કોઈપણ કાર્ડ પર ક્લિક કરો" : "Click any KPI for formula & source breakdown"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            onClick={() => onSelectKPI && onSelectKPI(kpi)}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top Row: Label & Source Badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  {getIcon(kpi.category)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-tight">
                    {kpi.label}
                  </span>
                  {kpi.benchmark && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {kpi.benchmark}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getSourceBadge(
                  kpi.source
                )}`}
              >
                {kpi.source}
              </span>
            </div>

            {/* Middle: Big Value */}
            <div className="my-1">
              <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-baseline gap-1">
                <span>{kpi.value}</span>
                {kpi.unit && (
                  <span className="text-xs font-semibold text-slate-400">{kpi.unit}</span>
                )}
              </div>
            </div>

            {/* Bottom: Trend / Detail */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 text-[11px]">
                {kpi.trendDirection === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
                <span>{kpi.trend || "On Track"}</span>
              </div>

              <span className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold transition-opacity flex items-center gap-0.5">
                Inspect <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
