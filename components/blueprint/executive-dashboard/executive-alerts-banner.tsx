"use client"

import React from "react"
import { ExecutiveAlert } from "@/lib/transformation-dashboard-types"
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight
} from "lucide-react"

interface ExecutiveAlertsBannerProps {
  alerts: ExecutiveAlert[]
  onNavigateTab?: (tab: any) => void
  targetLanguage?: string
}

export function ExecutiveAlertsBanner({
  alerts,
  onNavigateTab,
  targetLanguage = "English"
}: ExecutiveAlertsBannerProps) {
  if (!alerts || alerts.length === 0) return null

  const isGuj = targetLanguage.toLowerCase().includes("gu")

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => {
        const isCritical = alert.type === "critical"
        const isWarning = alert.type === "warning"
        const isSuccess = alert.type === "success"

        const borderBg = isCritical
          ? "border-rose-500/30 bg-rose-500/5 text-rose-800 dark:text-rose-200"
          : isWarning
          ? "border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-200"
          : isSuccess
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
          : "border-sky-500/30 bg-sky-500/5 text-sky-800 dark:text-sky-200"

        const icon = isCritical ? (
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
        ) : isWarning ? (
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        ) : isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-sky-500 shrink-0" />
        )

        return (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${borderBg} transition-all`}
          >
            <div className="flex items-start sm:items-center gap-2.5">
              {icon}
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>{alert.title}</span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {alert.sourcePhase} Phase
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {alert.description}
                </p>
              </div>
            </div>

            {alert.targetTab && onNavigateTab && (
              <button
                onClick={() => onNavigateTab(alert.targetTab)}
                className="self-end sm:self-auto flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs transition-colors shrink-0"
              >
                <span>{alert.actionLabel || "Inspect"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
