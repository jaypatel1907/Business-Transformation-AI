"use client"

import React from "react"
import { RoadmapPhaseStatus } from "@/lib/transformation-dashboard-types"
import {
  Kanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Code2,
  Calendar,
  Flag
} from "lucide-react"

interface RoadmapTimelineProps {
  roadmap: RoadmapPhaseStatus[]
  onNavigateTab?: (tab: any) => void
  targetLanguage?: string
}

export function RoadmapTimeline({
  roadmap,
  onNavigateTab,
  targetLanguage = "English"
}: RoadmapTimelineProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "In Progress":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 animate-pulse"
      default:
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "ટ્રાન્સફોર્મેશન માઇલસ્ટોન રોડમેપ" : "Transformation Delivery Milestones"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "સ્પ્રિન્ટ વાઇઝ ડિલિવરી તબક્કા અને લક્ષ્યો" : "Phased sprint execution timeline with assigned functional owners and key milestones."}
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("roadmap")}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
          >
            <span>{isGuj ? "સંપૂર્ણ રોડમેપ જુઓ" : "Full Sprint Board"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sprints Horizontal Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roadmap.map((phase) => (
          <div
            key={phase.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {phase.timeframe}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${getStatusBadge(phase.status)}`}>
                  {phase.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {phase.title}
              </h4>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <User className="w-3 h-3 text-slate-400" />
                <span className="truncate">{phase.owner}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <Flag className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="font-medium line-clamp-2">{phase.keyMilestone}</span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {phase.techStack.slice(0, 3).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
