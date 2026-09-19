"use client"

import { Route, Clock, Cloud, TriangleAlert, CheckCircle2, Calendar } from "lucide-react"

export function RoadmapTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the transformation roadmap and cost estimates.
      </div>
    )
  }

  const timeline = data?.timeline || "6 Weeks"
  const milestones = data?.roadmap_milestones || [
    { phase: "Phase 1 (Week 1-2)", title: "Architecture & Data Model", task: "Setup Database schemas, auth providers, and API routing" },
    { phase: "Phase 2 (Week 3-4)", title: "Core Business Logic & AI", task: "Implement processing pipeline and external integrations" },
    { phase: "Phase 3 (Week 5+)", title: "Testing & Launch", task: "End-to-end security audits, performance tuning, and launch" }
  ]

  const planning = data?.planning || {
    effortHours: "240",
    cloudCost: "$120/mo",
    cloudDetail: "PostgreSQL Database + Edge Compute",
    risk: {
      level: "Low-Medium",
      title: "API Concurrency & Scaling",
      mitigation: "Implement Redis caching and background worker queues."
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Implementation Roadmap */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Route className="h-4 w-4 text-indigo-600" />
              Implementation Roadmap (Transformation Planner)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Structured execution timeline for your MVP delivery</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
            {timeline} Timeline
          </span>
        </div>

        <div className="space-y-4">
          {milestones.map((ms: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{ms.title || `Phase ${idx + 1}`}</span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                  <Calendar className="h-3 w-3 text-indigo-600" /> {ms.phase}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-3">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (idx + 1) * 35)}%` }} />
              </div>
              <p className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {ms.task || ms.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Effort, Cost & Risk */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <TriangleAlert className="h-4 w-4 text-amber-500" />
          Effort & Risk Analytics
        </h3>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Clock className="h-4 w-4 text-emerald-600" /> Total Engineering Effort
            </span>
            <span className="text-xl font-bold text-slate-900">{planning.effortHours || "240"} Hours</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Calculated by AI Solution Architect</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Cloud className="h-4 w-4 text-cyan-600" /> Estimated Cloud Infrastructure
            </span>
            <span className="text-xl font-bold text-slate-900">{planning.cloudCost || "$120/mo"}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{planning.cloudDetail || "PostgreSQL + Edge Compute"}</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">
              AI Risk Analysis & Mitigation
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-300">
              {planning?.risk?.level || "Low-Medium"} Risk
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-900 mt-1.5">{planning?.risk?.title || "Scaling & Latency"}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            <strong className="text-slate-800">Mitigation: </strong>
            {planning?.risk?.mitigation || "Implement caching policies & worker queues."}
          </p>
        </div>
      </div>
    </div>
  )
}