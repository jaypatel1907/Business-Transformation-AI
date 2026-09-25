"use client"

import React, { useState, useMemo } from "react"
import { useRole } from "@/lib/role-context"
import { getTranslation } from "@/lib/i18n"
import {
  TransformationDashboardData,
  ExecutiveFilterType,
  ExecutiveKPI,
  RiskItem,
  AIOpportunityPortfolioItem
} from "@/lib/transformation-dashboard-types"
import { getTransformationDashboardData } from "@/lib/transformation-dashboard-adapter"

import { ExecutiveHeader } from "@/components/blueprint/executive-dashboard/executive-header"
import { ExecutiveSummaryCard } from "@/components/blueprint/executive-dashboard/executive-summary-card"
import { KPIGrid } from "@/components/blueprint/executive-dashboard/kpi-grid"
import { TransformationScoreRadar } from "@/components/blueprint/executive-dashboard/transformation-score-radar"
import { CurrentVsFutureView } from "@/components/blueprint/executive-dashboard/current-vs-future-view"
import { AIOpportunityPortfolio } from "@/components/blueprint/executive-dashboard/ai-opportunity-portfolio"
import { RoadmapTimeline } from "@/components/blueprint/executive-dashboard/roadmap-timeline"
import { FinancialROIView } from "@/components/blueprint/executive-dashboard/financial-roi-view"
import { RiskCenter } from "@/components/blueprint/executive-dashboard/risk-center"
import { ExecutiveAlertsBanner } from "@/components/blueprint/executive-dashboard/executive-alerts-banner"
import { NextBestActions } from "@/components/blueprint/executive-dashboard/next-best-actions"
import { ProjectHealthPanel } from "@/components/blueprint/executive-dashboard/project-health-panel"
import { DrillDownModal } from "@/components/blueprint/executive-dashboard/drill-down-modal"

import {
  Activity,
  ShieldAlert,
  Server,
  Cpu,
  Database,
  Layout
} from "lucide-react"

export interface DashboardTabProps {
  generated: boolean
  data?: any
  targetLanguage?: string
  onNavigateTab?: (tab: any) => void
}

export function DashboardTab({
  generated,
  data,
  targetLanguage = "English",
  onNavigateTab
}: DashboardTabProps) {
  const { role } = useRole()
  const currentRole = role || "Manager"
  const lang = targetLanguage || data?.target_language || "English"
  const t = getTranslation(lang)

  // Executive Perspective Filter State
  const [activeFilter, setActiveFilter] = useState<ExecutiveFilterType>("all")

  // Interactive Modal Inspection State
  const [drillDownItem, setDrillDownItem] = useState<{
    type: "kpi" | "risk" | "opportunity"
    data: ExecutiveKPI | RiskItem | AIOpportunityPortfolioItem
  } | null>(null)

  // Memoized aggregation layer
  const dashboardData: TransformationDashboardData = useMemo(() => {
    return getTransformationDashboardData(data)
  }, [data])

  if (!generated) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 shadow-sm space-y-2">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          No Transformation Blueprint Generated Yet
        </p>
        <p className="text-xs text-slate-400">
          Enter your business challenge or attach a BRD/SOP document on the left to synthesize the Executive Transformation Command Center.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Top Executive Command Header */}
      <ExecutiveHeader
        data={dashboardData}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        currentRole={currentRole}
        targetLanguage={lang}
      />

      {/* 2. Executive Context Alerts */}
      <ExecutiveAlertsBanner
        alerts={dashboardData.alerts}
        onNavigateTab={onNavigateTab}
        targetLanguage={lang}
      />

      {/* 3. Executive Problem & Strategic Charter */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "business") && (
        <ExecutiveSummaryCard
          data={dashboardData}
          onNavigateTab={onNavigateTab}
          targetLanguage={lang}
        />
      )}

      {/* 4. Executive KPI Scorecard Grid */}
      <KPIGrid
        kpis={dashboardData.kpis}
        onSelectKPI={(kpi) => setDrillDownItem({ type: "kpi", data: kpi })}
        targetLanguage={lang}
      />

      {/* 5. Transformation Readiness & Project Health */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "business" || activeFilter === "process") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransformationScoreRadar
            dimensions={dashboardData.readinessScores}
            targetLanguage={lang}
          />
          <ProjectHealthPanel
            health={dashboardData.health}
            targetLanguage={lang}
          />
        </div>
      )}

      {/* 6. Current vs Future State Process Transformation */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "process" || activeFilter === "ai") && (
        <CurrentVsFutureView
          data={dashboardData.currentVsFuture}
          onNavigateTab={onNavigateTab}
          targetLanguage={lang}
        />
      )}

      {/* 7. AI & Agentic Opportunity Portfolio */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "ai") && (
        <AIOpportunityPortfolio
          opportunities={dashboardData.aiOpportunities}
          onSelectOpportunity={(opp) => setDrillDownItem({ type: "opportunity", data: opp })}
          onNavigateTab={onNavigateTab}
          targetLanguage={lang}
        />
      )}

      {/* 8. Financial Breakdown & Projected ROI Return */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "business" || activeFilter === "financial") && (
        <FinancialROIView
          financials={dashboardData.financials}
          roi={dashboardData.roi}
          targetLanguage={lang}
        />
      )}

      {/* 9. Phased Delivery Roadmap */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "financial") && (
        <RoadmapTimeline
          roadmap={dashboardData.roadmap}
          onNavigateTab={onNavigateTab}
          targetLanguage={lang}
        />
      )}

      {/* 10. Risk Center & Mitigation Strategy */}
      {(activeFilter === "all" || activeFilter === "executive" || activeFilter === "business") && (
        <RiskCenter
          risks={dashboardData.risks}
          onSelectRisk={(risk) => setDrillDownItem({ type: "risk", data: risk })}
          targetLanguage={lang}
        />
      )}

      {/* 11. Command Center Recommended Next Actions */}
      <NextBestActions
        actions={dashboardData.nextActions}
        onNavigateTab={onNavigateTab}
        targetLanguage={lang}
      />

      {/* 12. Admin Exclusive Live Telemetry & Audit Logs */}
      {currentRole === "Admin" && (
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                Live System Health & Cloud Telemetry (Admin Exclusive)
              </h3>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                All Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">API Gateway</span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">1,248 reqs</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Inference Latency</span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">420 ms</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Uptime SLA</span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">99.98%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Active LLM</span>
                <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">Gemini 2.5 Flash</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. Drill Down Inspection Modal */}
      {drillDownItem && (
        <DrillDownModal
          selectedItem={drillDownItem}
          onClose={() => setDrillDownItem(null)}
          targetLanguage={lang}
        />
      )}
    </div>
  )
}
