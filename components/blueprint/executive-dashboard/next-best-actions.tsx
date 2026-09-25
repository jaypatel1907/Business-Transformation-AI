"use client"

import React from "react"
import { NextBestAction } from "@/lib/transformation-dashboard-types"
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Zap,
  PlayCircle
} from "lucide-react"

interface NextBestActionsProps {
  actions: NextBestAction[]
  onNavigateTab?: (tab: any) => void
  targetLanguage?: string
}

export function NextBestActions({
  actions,
  onNavigateTab,
  targetLanguage = "English"
}: NextBestActionsProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Immediate":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-black animate-pulse"
      case "High":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
      default:
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "ભલામણ કરેલ આગામી પગલાં (કમાન્ડ સેન્ટર)" : "Recommended Next Actions (Command Center)"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "પ્રોજેક્ટને આગળ વધારવા માટે તાત્કાલિક કાર્યો" : "Direct execution links into corresponding blueprint modules to maintain project momentum."}
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act) => (
          <div
            key={act.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(act.priority)}`}>
                  {act.priority} Priority
                </span>

                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {act.estimatedEffort}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {act.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[140px]">{act.ownerRole}</span>
              </span>

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(act.targetTab)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{act.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
