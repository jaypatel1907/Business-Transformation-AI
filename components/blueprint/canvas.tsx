"use client"

import { useEffect } from "react"
import { useRole } from "@/lib/role-context"
import { getTranslation } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardTab } from "@/components/blueprint/tabs/dashboard-tab"
import { BpmnTab } from "@/components/blueprint/tabs/bpmn-tab"
import { DbTab } from "@/components/blueprint/tabs/db-tab"
import { WireframeTab } from "@/components/blueprint/tabs/wireframe-tab"
import { RoadmapTab } from "@/components/blueprint/tabs/roadmap-tab"

export type TabId = "dashboard" | "bpmn" | "db" | "wireframe" | "roadmap"

interface CanvasProps {
  active: TabId
  onChange: (tab: TabId) => void
  generated: boolean
  generating: boolean
  data?: any
  targetLanguage?: string
}

export function Canvas({ active, onChange, generated, data, targetLanguage = "English" }: CanvasProps) {
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
  const SafeBpmnTab = BpmnTab as any
  const SafeDbTab = DbTab as any
  const SafeWireframeTab = WireframeTab as any
  const SafeRoadmapTab = RoadmapTab as any

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-slate-50/60 p-4 md:p-6 pb-24 border-l border-slate-200/80">
      <Tabs value={active} onValueChange={(v) => onChange(v as TabId)} className="w-full">
        <TabsList
          className={`mb-6 grid w-full bg-white border border-slate-200/80 shadow-sm p-1 rounded-xl sticky top-0 z-10 ${
            isEmployee ? "grid-cols-3 md:grid-cols-3" : "grid-cols-2 md:grid-cols-5"
          }`}
        >
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer"
          >
            {t("tabDashboard")}
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
          <TabsContent value="dashboard" className="mt-0 outline-none">
            <SafeDashboardTab generated={generated} data={data} targetLanguage={targetLanguage} />
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
            <SafeWireframeTab generated={generated} data={data} targetLanguage={targetLanguage} />
          </TabsContent>
          {!isEmployee && (
            <TabsContent value="roadmap" className="mt-0 outline-none">
              <SafeRoadmapTab generated={generated} data={data} targetLanguage={targetLanguage} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}