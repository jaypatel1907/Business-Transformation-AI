"use client"

import { Route, Clock, Cloud, TriangleAlert, CheckCircle2, Calendar, Kanban, DollarSign } from "lucide-react"

export function RoadmapTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the transformation roadmap and cost estimates.
      </div>
    )
  }

  const timeline = data?.timeline || "6 Weeks"
  const finEst = data?.financial_estimation || {
    min_budget: "$18,000",
    max_budget: "$32,000",
    total_hours: "240 Hours",
    hourly_rate: "$75/hr"
  }

  const sprintPlan = data?.sprint_plan || [
    { sprint: "Sprint 1 (Week 1)", title: "Architecture & Data Modeling", focus: "Supabase DB Schemas, RLS Policies & Auth Setup" },
    { sprint: "Sprint 2 (Week 2)", title: "API Gateway & Middleware", focus: "REST Endpoints, Validation Rules & Error Handling" },
    { sprint: "Sprint 3 (Week 3)", title: "AI Core & Pipeline Integration", focus: "Gemini API binding, Prompt Engineering & Triage Engine" },
    { sprint: "Sprint 4 (Week 4)", title: "Frontend Component Suite", focus: "Tailwind UI, Dashboard Metrics & Interactive Wireframes" },
    { sprint: "Sprint 5 (Week 5)", title: "Security & Load Testing", focus: "Penetration testing, Redis Caching & Latency Optimization" },
    { sprint: "Sprint 6 (Week 6+)", title: "Production Launch & Handoff", focus: "Vercel Deployment, CI/CD pipeline & Documentation" }
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
      {/* Implementation Sprint Plan */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="h-4 w-4 text-indigo-600" />
              Sprint & Milestone Release Roadmap (Sprint 1 - 6)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Agile release breakdown and milestone targets</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
            {timeline} Duration
          </span>
        </div>

        <div className="space-y-3.5">
          {sprintPlan.map((sprint: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  {sprint.title}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-indigo-700 font-bold bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  <Calendar className="h-3 w-3 text-indigo-600" /> {sprint.sprint}
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span><strong className="text-slate-800">Deliverables:</strong> {sprint.focus}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Effort, Cost & Risk */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          Financial & Risk Analytics
        </h3>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <DollarSign className="h-4 w-4 text-emerald-600" /> Financial Budget Range
            </span>
            <span className="text-base font-extrabold text-slate-900">{finEst.min_budget} - {finEst.max_budget}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Calculated @ {finEst.hourly_rate} ({finEst.total_hours})</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Clock className="h-4 w-4 text-indigo-600" /> Total Engineering Effort
            </span>
            <span className="text-lg font-bold text-slate-900">{finEst.total_hours}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">AI Calculated Scope & Capacity</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Cloud className="h-4 w-4 text-cyan-600" /> Infrastructure Cloud Cost
            </span>
            <span className="text-lg font-bold text-slate-900">{planning.cloudCost || "$120/mo"}</span>
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