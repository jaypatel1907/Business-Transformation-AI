"use client"

import { useEffect } from "react"
import { useRole } from "@/lib/role-context"
import { getTranslation } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardTab } from "@/components/blueprint/tabs/dashboard-tab"
import { AnalysisTab } from "@/components/blueprint/tabs/analysis-tab"
import { ProcessIntelligenceTab } from "@/components/blueprint/tabs/process-intelligence-tab"
import { PlanningTab } from "@/components/blueprint/tabs/planning-tab"
import { KnowledgeTab } from "@/components/blueprint/tabs/knowledge-tab"
import { BpmnTab } from "@/components/blueprint/tabs/bpmn-tab"
import { DbTab } from "@/components/blueprint/tabs/db-tab"
import { WireframeTab } from "@/components/blueprint/tabs/wireframe-tab"
import { RoadmapTab } from "@/components/blueprint/tabs/roadmap-tab"

export type TabId = "analysis" | "dashboard" | "process" | "planning" | "knowledge" | "bpmn" | "db" | "wireframe" | "roadmap"

interface CanvasProps {
  active: TabId
  onChange: (tab: TabId) => void
  generated: boolean
  generating: boolean
  data?: any
  targetLanguage?: string
  onUpdateAnalysis?: (updatedAnalysis: any) => void
  onApproveAnalysis?: (analysis: any) => void
  onUpdateBlueprint?: (updatedData: any) => void
}

export function Canvas({
  active,
  onChange,
  generated,
  data,
  targetLanguage = "English",
  onUpdateAnalysis,
  onApproveAnalysis,
  onUpdateBlueprint
}: CanvasProps) {
  const { role } = useRole()
  const isEmployee = role === "Employee"
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(targetLanguage || data?.target_language || "English", key)

  // If role is employee and current active tab is hidden (db or roadmap), reset to dashboard
  useEffect(() => {
    if (isEmployee && (active === "db" || active === "roadmap")) {
      onChange("dashboard")
    }
  }, [isEmployee, active, onChange])

  const SafeDashboardTab = DashboardTab as any
  const SafeAnalysisTab = AnalysisTab as any
  const SafeProcessTab = ProcessIntelligenceTab as any
  const SafePlanningTab = PlanningTab as any
  const SafeKnowledgeTab = KnowledgeTab as any
  const SafeBpmnTab = BpmnTab as any
  const SafeDbTab = DbTab as any
  const SafeWireframeTab = WireframeTab as any
  const SafeRoadmapTab = RoadmapTab as any

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-slate-50/60 p-4 md:p-6 pb-24 border-l border-slate-200/80">
      <Tabs value={active} onValueChange={(v) => onChange(v as TabId)} className="w-full">
        <TabsList
          className={`mb-6 grid w-full bg-white border border-slate-200/80 shadow-sm p-1 rounded-xl sticky top-0 z-10 ${
            isEmployee ? "grid-cols-3 sm:grid-cols-7" : "grid-cols-3 sm:grid-cols-9"
          }`}
        >
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabAnalysis") || "Analysis"}
          </TabsTrigger>

          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabDashboard")}
          </TabsTrigger>

          <TabsTrigger
            value="process"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabProcess") || "Process"}
          </TabsTrigger>

          <TabsTrigger
            value="planning"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabPlanning") || "Planning & ROI"}
          </TabsTrigger>

          <TabsTrigger
            value="knowledge"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabKnowledge") || "Knowledge & Export"}
          </TabsTrigger>

          <TabsTrigger
            value="bpmn"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabGuide")}
          </TabsTrigger>

          {/* DB & APIs Tab: Hidden for Employee */}
          {!isEmployee && (
            <TabsTrigger
              value="db"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
            >
              {t("tabDatabase")}
            </TabsTrigger>
          )}

          <TabsTrigger
            value="wireframe"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabWireframe")}
          </TabsTrigger>

          {/* Roadmap Tab: Hidden for Employee */}
          {!isEmployee && (
            <TabsTrigger
              value="roadmap"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
            >
              {t("tabRoadmap")}
            </TabsTrigger>
          )}
        </TabsList>

        <div id="blueprint-canvas-content" className="pb-12 bg-transparent rounded-xl">
          <TabsContent value="analysis" className="mt-0 outline-none">
            <SafeAnalysisTab
              generated={generated}
              data={data}
              targetLanguage={targetLanguage}
              onUpdateAnalysis={onUpdateAnalysis}
              onApproveAnalysis={onApproveAnalysis}
            />
          </TabsContent>
          <TabsContent value="dashboard" className="mt-0 outline-none">
            <SafeDashboardTab
              generated={generated}
              data={data}
              targetLanguage={targetLanguage}
              onNavigateTab={(tab: TabId) => onChange(tab)}
            />
          </TabsContent>
          <TabsContent value="process" className="mt-0 outline-none">
            <SafeProcessTab generated={generated} data={data} targetLanguage={targetLanguage} />
          </TabsContent>
          <TabsContent value="planning" className="mt-0 outline-none">
            <SafePlanningTab
              generated={generated}
              data={data}
              targetLanguage={targetLanguage}
              onUpdateBlueprint={onUpdateBlueprint}
            />
          </TabsContent>
          <TabsContent value="knowledge" className="mt-0 outline-none">
            <SafeKnowledgeTab generated={generated} data={data} targetLanguage={targetLanguage} />
          </TabsContent>
          <TabsContent value="bpmn" className="mt-0 outline-none">
            <SafeBpmnTab generated={generated} data={data} targetLanguage={targetLanguage} />
          </TabsContent>
          {!isEmployee && (
            <TabsContent value="db" className="mt-0 outline-none">
              <SafeDbTab generated={generated} data={data} targetLanguage={targetLanguage} />
            </TabsContent>
          )}
          <TabsContent value="wireframe" className="mt-0 outline-none">
            <SafeWireframeTab
              generated={generated}
              data={data}
              targetLanguage={targetLanguage}
              onUpdateBlueprint={onUpdateBlueprint}
            />
          </TabsContent>
          {!isEmployee && (
            <TabsContent value="roadmap" className="mt-0 outline-none">
              <SafeRoadmapTab
                generated={generated}
                data={data}
                targetLanguage={targetLanguage}
                onUpdateBlueprint={onUpdateBlueprint}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}