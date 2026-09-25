"use client"

import React from "react"
import { ProjectHealthDimension } from "@/lib/transformation-dashboard-types"
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Info
} from "lucide-react"

interface ProjectHealthPanelProps {
  health: ProjectHealthDimension[]
  targetLanguage?: string
}

export function ProjectHealthPanel({
  health,
  targetLanguage = "English"
}: ProjectHealthPanelProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const getStatusColor = (st: string) => {
    switch (st) {
      case "Healthy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "Attention Required":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "Blocked":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400"
    if (score >= 75) return "text-indigo-600 dark:text-indigo-400"
    if (score >= 60) return "text-amber-600 dark:text-amber-400"
    return "text-rose-600 dark:text-rose-400"
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "પ્રોજેક્ટ હેલ્થ & ડિલિવરી સ્થિતિ" : "Overall Project Health Matrix"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "સ્કોપ, સમયરેખા, બજેટ અને તકનીકી સ્થિરતા" : "Continuous telemetry measuring scope discipline, timeline integrity, and risk guardrails."}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          All Green SLA
        </span>
      </div>

      {/* Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {health.map((h, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {h.dimension}
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(h.status)}`}>
                {h.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Readiness:</span>
              <span className={`text-base font-black ${getScoreColor(h.score)}`}>
                {h.score}%
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {h.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
