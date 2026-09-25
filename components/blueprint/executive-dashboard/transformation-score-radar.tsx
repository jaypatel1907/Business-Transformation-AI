"use client"

import React from "react"
import { TransformationScoreDimension } from "@/lib/transformation-dashboard-types"
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Info
} from "lucide-react"

interface TransformationScoreRadarProps {
  dimensions: TransformationScoreDimension[]
  targetLanguage?: string
}

export function TransformationScoreRadar({
  dimensions,
  targetLanguage = "English"
}: TransformationScoreRadarProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Optimized":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      case "Ready":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
      case "Developing":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500"
    if (score >= 75) return "bg-indigo-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-rose-500"
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "ટ્રાન્સફોર્મેશન રેડીનેસ સ્કોરકાર્ડ" : "7-Dimension Transformation Readiness"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "વ્યાપક આર્કિટેક્ચર અને બિઝનેસ તૈયારી વિશ્લેષણ" : "Multi-pillar evaluation spanning strategy, architecture, data, AI, UX, and execution."}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Weighted Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim) => (
          <div
            key={dim.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {dim.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({Math.round(dim.weight * 100)}% Wt.)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    dim.status
                  )}`}
                >
                  {dim.status}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                  {dim.score}/100
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getScoreColor(
                  dim.score
                )}`}
                style={{ width: `${dim.score}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {dim.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
