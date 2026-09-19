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
    <div className="flex-1 overflow-y-auto bg-slate-50/60 p-4 md:p-6 min-h-screen">
      <Tabs value={active} onValueChange={(v) => onChange(v as TabId)} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-5 bg-white border border-slate-200/80 shadow-sm p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all">Dashboard</TabsTrigger>
          <TabsTrigger value="bpmn" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all">Process Map</TabsTrigger>
          <TabsTrigger value="db" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all">DB & APIs</TabsTrigger>
          <TabsTrigger value="wireframe" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all">UX Wireframe</TabsTrigger>
          <TabsTrigger value="roadmap" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-slate-600 rounded-lg py-2 text-xs transition-all">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <SafeDashboardTab generated={generated} data={data} />
        </TabsContent>
        <TabsContent value="bpmn">
          <SafeBpmnTab generated={generated} data={data} />
        </TabsContent>
        <TabsContent value="db">
          <SafeDbTab generated={generated} data={data} />
        </TabsContent>
        <TabsContent value="wireframe">
          <SafeWireframeTab generated={generated} data={data} />
        </TabsContent>
        <TabsContent value="roadmap">
          <SafeRoadmapTab generated={generated} data={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}