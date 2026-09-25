"use client"

import React from "react"
import {
  TransformationDashboardData,
  ExecutiveFilterType
} from "@/lib/transformation-dashboard-types"
import {
  Sparkles,
  TrendingUp,
  Clock,
  Briefcase,
  Layers,
  Cpu,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Filter,
  Calendar,
  Share2
} from "lucide-react"

interface ExecutiveHeaderProps {
  data: TransformationDashboardData
  activeFilter: ExecutiveFilterType
  onFilterChange: (filter: ExecutiveFilterType) => void
  currentRole: string
  targetLanguage?: string
}

export function ExecutiveHeader({
  data,
  activeFilter,
  onFilterChange,
  currentRole,
  targetLanguage = "English"
}: ExecutiveHeaderProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const isHindi = targetLanguage.toLowerCase().includes("hi")

  const filters: Array<{ id: ExecutiveFilterType; label: string; icon: React.ReactNode }> = [
    { id: "all", label: isGuj ? "બધા વ્યૂ" : "All Perspectives", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "executive", label: isGuj ? "એક્ઝિક્યુટિવ" : "Executive View", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "business", label: isGuj ? "બિઝનેસ" : "Business & ROI", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "ai", label: isGuj ? "AI ઓપોર્ચ્યુનિટી" : "AI & Automation", icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: "process", label: isGuj ? "પ્રોસેસ" : "Process Transformation", icon: <Filter className="w-3.5 h-3.5" /> },
    { id: "financial", label: isGuj ? "નાણાકીય" : "Cost & Investment", icon: <DollarSign className="w-3.5 h-3.5" /> }
  ]

  // Formatted date
  const formattedDate = new Date(data.lastUpdated).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {isGuj ? "એક્ઝિક્યુટિવ ટ્રાન્સફોર્મેશન કમાન્ડ સેન્ટર" : "Executive Transformation Command Center"}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium">
              {data.industry}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {data.status}
            </span>

            <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-1">
              <Calendar className="w-3 h-3" /> {formattedDate}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {data.projectTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
            {data.executiveSummary.strategicIntent}
          </p>
        </div>

        {/* Progress Metric Ring */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shrink-0">
          <div className="relative flex items-center justify-center w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${data.overallTransformationProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                {data.overallTransformationProgress}%
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isGuj ? "ટ્રાન્સફોર્મેશન સ્કોર" : "Readiness Score"}
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {data.overallTransformationProgress >= 85
                ? "Enterprise Ready"
                : data.overallTransformationProgress >= 70
                ? "In Final Review"
                : "Developing"}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              7 Dimensions Evaluated
            </div>
          </div>
        </div>
      </div>

      {/* Perspective Filter Bar */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {filters.map((f) => {
            const isSelected = activeFilter === f.id
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            )
          })}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>Role View:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
            {currentRole}
          </span>
        </div>
      </div>
    </div>
  )
}
