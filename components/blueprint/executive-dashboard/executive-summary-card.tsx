"use client"

import React from "react"
import { TransformationDashboardData } from "@/lib/transformation-dashboard-types"
import {
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react"

interface ExecutiveSummaryCardProps {
  data: TransformationDashboardData
  onNavigateTab?: (tab: any) => void
  targetLanguage?: string
}

export function ExecutiveSummaryCard({
  data,
  onNavigateTab,
  targetLanguage = "English"
}: ExecutiveSummaryCardProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const es = data.executiveSummary

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "એક્ઝિક્યુટિવ પ્રોજેક્ટ સમરી" : "Executive Problem & Strategic Charter"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "મૂળ બિઝનેસ સમસ્યા અને અપેક્ષિત પરિણામ" : "Core operational challenge, transformation scope, and projected outcomes."}
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("analysis")}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
          >
            <span>{isGuj ? "ડીપ એનાલિસિસ જુઓ" : "Deep Analysis"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Problem Statement */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {isGuj ? "૧. બિઝનેસ સમસ્યા" : "1. Business Challenge"}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {es.businessProblem}
          </p>
        </div>

        {/* 2. Transformation Scope */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {isGuj ? "૨. ટ્રાન્સફોર્મેશન ઓબ્જેક્ટિવ" : "2. Transformation Objective"}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {es.transformationObjective}
          </p>
        </div>

        {/* 3. Expected Outcome */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            {isGuj ? "૩. અપેક્ષિત વેલ્યુ & પરિણામ" : "3. Projected Business Outcome"}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {es.expectedOutcome}
          </p>
        </div>
      </div>
    </div>
  )
}
