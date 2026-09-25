"use client"

import React from "react"
import { CurrentVsFutureTransformation } from "@/lib/transformation-dashboard-types"
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Cpu,
  UserCheck,
  Layers,
  ArrowDown
} from "lucide-react"

interface CurrentVsFutureViewProps {
  data: CurrentVsFutureTransformation
  onNavigateTab?: (tab: any) => void
  targetLanguage?: string
}

export function CurrentVsFutureView({
  data,
  onNavigateTab,
  targetLanguage = "English"
}: CurrentVsFutureViewProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "હાલની vs ભવિષ્યની પ્રક્રિયા ટ્રાન્સફોર્મેશન" : "Current vs Future State Process Transformation"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "મેન્યુઅલ કામકાજમાંથી ઓટોમેટેડ અને AI આધારિત વર્કફ્લો" : "Side-by-side transition blueprint highlighting eliminated manual friction."}
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("process")}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
          >
            <span>{isGuj ? "પ્રોસેસ ઇન્ટેલિજન્સ ખોલો" : "Open Process Intelligence"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Hours Saved Weekly</div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {data.totalManualHoursSavedWeekly}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Automation Rate</div>
          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {data.automationPercentage}%
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">AI Touchpoints</div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
            {data.aiTouchpointsCount} Intelligent Gates
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">API Integrations</div>
          <div className="text-lg font-black text-sky-600 dark:text-sky-400 mt-0.5">
            {data.integrationsCount} Cloud Connectors
          </div>
        </div>
      </div>

      {/* Step by Step Transition Comparison */}
      <div className="space-y-3">
        {data.steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
          >
            {/* Step Number */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-700">
                {step.stepNumber}
              </span>
            </div>

            {/* Current State (Red/Amber tone) */}
            <div className="lg:col-span-4 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-1">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Current Manual State
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {step.currentState}
              </p>
            </div>

            {/* Middle Transition Arrow */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
              <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                <span>{step.manualEffortReduction}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
              <div className="lg:hidden flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* Future State (Emerald/Purple tone) */}
            <div className="lg:col-span-5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Future Autonomous State
                </span>
                <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {step.automationType}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                {step.futureState}
              </p>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Tech: {step.techEnabler}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
