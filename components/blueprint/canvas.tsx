"use client"

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
}

export function Canvas({ active, onChange, generated, data }: CanvasProps) {
  const SafeDashboardTab = DashboardTab as any
  const SafeBpmnTab = BpmnTab as any
  const SafeDbTab = DbTab as any
  const SafeWireframeTab = WireframeTab as any
  const SafeRoadmapTab = RoadmapTab as any

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-slate-50/60 p-4 md:p-6 pb-24 border-l border-slate-200/80">
      <Tabs value={active} onValueChange={(v) => onChange(v as TabId)} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-5 bg-white border border-slate-200/80 shadow-sm p-1 rounded-xl sticky top-0 z-10">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer">Dashboard</TabsTrigger>
          <TabsTrigger value="bpmn" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer">Process Map</TabsTrigger>
          <TabsTrigger value="db" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer">DB & APIs</TabsTrigger>
          <TabsTrigger value="wireframe" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer">UX Wireframe</TabsTrigger>
          <TabsTrigger value="roadmap" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all cursor-pointer">Roadmap</TabsTrigger>
        </TabsList>

        <div className="pb-12">
          <TabsContent value="dashboard" className="mt-0 outline-none">
            <SafeDashboardTab generated={generated} data={data} />
          </TabsContent>
          <TabsContent value="bpmn" className="mt-0 outline-none">
            <SafeBpmnTab generated={generated} data={data} />
          </TabsContent>
          <TabsContent value="db" className="mt-0 outline-none">
            <SafeDbTab generated={generated} data={data} />
          </TabsContent>
          <TabsContent value="wireframe" className="mt-0 outline-none">
            <SafeWireframeTab generated={generated} data={data} />
          </TabsContent>
          <TabsContent value="roadmap" className="mt-0 outline-none">
            <SafeRoadmapTab generated={generated} data={data} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}