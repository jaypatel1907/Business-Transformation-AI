"use client"

import React from "react"
import { FinancialBreakdown, ROIEstimate } from "@/lib/transformation-dashboard-types"
import {
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  Server,
  Sparkles,
  Calculator,
  CheckCircle2,
  Info
} from "lucide-react"

interface FinancialROIViewProps {
  financials: FinancialBreakdown
  roi: ROIEstimate
  targetLanguage?: string
}

export function FinancialROIView({
  financials,
  roi,
  targetLanguage = "English"
}: FinancialROIViewProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Investment & Cost Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {isGuj ? "રોકાણ અને ખર્ચ બ્રેકડાઉન" : "Capital Investment & Cost Structure"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isGuj ? "એન્જિનિયરિંગ કલાકો, ક્લાઉડ અને AI API ખર્ચ" : "Estimated development, cloud infrastructure, and ongoing maintenance."}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {financials.source}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Budget Cap</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">
              {financials.totalEstimatedInvestment}
            </div>
            <p className="text-[10px] text-slate-500">
              {financials.estimatedHours} @ {financials.hourlyRate}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Dev Engineering</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">
              {financials.developmentCost}
            </div>
            <p className="text-[10px] text-slate-500">75% Core Allocation</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Cloud Infra / Hosting</span>
            <div className="text-lg font-black text-sky-600 dark:text-sky-400">
              {financials.cloudInfrastructureMonthly}
            </div>
            <p className="text-[10px] text-slate-500">PostgreSQL + Edge Vercel</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">AI / LLM API Usage</span>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400">
              {financials.aiApiUsageMonthly}
            </div>
            <p className="text-[10px] text-slate-500">Gemini 2.5 Flash Token Rate</p>
          </div>
        </div>

        {/* Team Role Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isGuj ? "ટીમ ભૂમિકા અને ફાળવણી" : "Core Team Resource Allocation"}</span>
          </div>

          <div className="space-y-1.5">
            {financials.teamRoles.map((role, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center border border-indigo-500/20">
                    {role.count}x
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {role.role}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {role.allocation} FTE
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Projected ROI & Value Creation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {isGuj ? "અપેક્ષિત ROI અને વેલ્યુ રિટર્ન" : "Expected ROI & Business Value"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isGuj ? "વાર્ષિક બચત અને કાર્યક્ષમતા વધારો" : "Quantified financial return, break-even period, and operational savings."}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {roi.source}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold">
                Projected 1-Yr ROI
              </span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {roi.expectedROI}
              </div>
              <p className="text-[10px] text-slate-500">Benchmark: 180% Industry Avg</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                Payback Period
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {roi.paybackPeriod}
              </div>
              <p className="text-[10px] text-slate-500">Break-even post-launch</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Annualized Benefit</span>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                {roi.annualBenefit}
              </div>
              <p className="text-[10px] text-slate-500">Efficiency + new capacity</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Direct Cost Savings</span>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                {roi.costSavingsAnnual}
              </div>
              <p className="text-[10px] text-slate-500">Labor reallocation</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {roi.calculationNotes}
          </p>
        </div>
      </div>
    </div>
  )
}
