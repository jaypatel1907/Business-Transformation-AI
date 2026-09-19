"use client"

import { Gauge, Zap, Clock, CheckCircle2, Server, Database, Cpu, Layout } from "lucide-react"

export function DashboardTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Zap className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No Blueprint Generated Yet</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Input your business idea or problem statement in the AI Assistant panel on the left to generate an instant architecture blueprint.
        </p>
      </div>
    )
  }

  const maturity = data?.digital_maturity || 92
  const adoption = data?.ai_adoption || 95
  const timeline = data?.timeline || "6 Weeks"
  const title = data?.project_title || "Custom Enterprise Blueprint"
  const userProblem = data?.user_problem || ""
  const initiatives = data?.initiatives || [
    { title: "Core Process Automation", impact: "High Impact", desc: "Automates main workflow bottleneck." },
    { title: "AI Intelligence Copilot", impact: "High Impact", desc: "Real-time decision support engine." }
  ]
  const techStack = data?.tech_stack || {
    frontend: "Next.js 16 + React + Tailwind",
    backend: "Node.js / Express API Gateway",
    database: "PostgreSQL (Supabase)",
    ai_layer: "Google Gemini 1.5 Flash"
  }

  return (
    <div className="space-y-6">
      {/* Title Header Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700">
              AI Solution Architecture Blueprint
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{title}</h2>
            {userProblem && (
              <p className="mt-1 text-xs text-slate-600 max-w-3xl line-clamp-2">
                <strong>Requirement:</strong> "{userProblem}"
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 shadow-2xs">
              Status: Implementation Ready
            </span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Digital Maturity Score</span>
            <Gauge className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{maturity}%</div>
          <p className="mt-1 text-[11px] font-medium text-emerald-600">+12% Transformation Ready</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>AI Adoption Readiness</span>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{adoption}%</div>
          <p className="mt-1 text-[11px] font-medium text-amber-600">High Automation Suitability</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Target MVP Delivery</span>
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{timeline}</div>
          <p className="mt-1 text-[11px] text-slate-500">Calculated by AI Solution Engine</p>
        </div>
      </div>

      {/* Initiatives & Recommended Architecture */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Key Strategic Initiatives
          </h3>
          <div className="space-y-3">
            {initiatives.map((item: any, i: number) => (
              <div key={i} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    {item.impact || "High Impact"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-600" />
            Recommended Tech Stack
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Layout className="h-4 w-4 text-indigo-500" /> Frontend Layer
              </span>
              <span className="font-mono text-indigo-700 font-semibold">{techStack.frontend}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-500" /> Backend Gateway
              </span>
              <span className="font-mono text-cyan-700 font-semibold">{techStack.backend}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" /> Database Layer
              </span>
              <span className="font-mono text-blue-700 font-semibold">{techStack.database}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-500" /> AI Intelligence
              </span>
              <span className="font-mono text-purple-700 font-semibold">{techStack.ai_layer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}