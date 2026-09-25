"use client"

import React, { useState } from "react"
import { AIOpportunityPortfolioItem } from "@/lib/transformation-dashboard-types"
import {
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Clock,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldAlert,
  Layers
} from "lucide-react"

interface AIOpportunityPortfolioProps {
  opportunities: AIOpportunityPortfolioItem[]
  onSelectOpportunity?: (item: AIOpportunityPortfolioItem) => void
  onNavigateTab?: (tab: any) => void
  targetLanguage?: string
}

export function AIOpportunityPortfolio({
  opportunities,
  onSelectOpportunity,
  onNavigateTab,
  targetLanguage = "English"
}: AIOpportunityPortfolioProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredOpportunities = opportunities.filter((item) => {
    if (filterCategory === "all") return true
    if (filterCategory === "high_impact") return item.impact === "High"
    if (filterCategory === "quick_wins") return item.feasibility === "High" && (item.timeToValue.includes("2") || item.timeToValue.includes("1"))
    if (filterCategory === "genai") return item.category.includes("Generative") || item.category.includes("Chat")
    return true
  })

  const getCategoryColor = (cat: string) => {
    if (cat.includes("Generative")) return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    if (cat.includes("Predictive")) return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
    if (cat.includes("Vision")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-100 dark:border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isGuj ? "AI ઓપોર્ચ્યુનિટી પોર્ટફોલિયો" : "AI Opportunity & Agentic Portfolio"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuj ? "મૂલ્ય નિર્માણ માટે ઓળખાયેલા પ્રાથમિક AI ક્ષેત્રો" : "Prioritized intelligent agents, predictive modules, and GenAI touchpoints."}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterCategory === "all"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterCategory("high_impact")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterCategory === "high_impact"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            High Impact
          </button>
          <button
            onClick={() => setFilterCategory("quick_wins")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterCategory === "quick_wins"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Quick Wins
          </button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredOpportunities.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectOpportunity && onSelectOpportunity(item)}
            className="group p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {item.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Business Value:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px]">
                  {item.businessValue}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Time-to-Value:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  {item.timeToValue}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
