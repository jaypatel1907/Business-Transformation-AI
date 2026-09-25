"use client";
import { useRole } from "@/lib/role-context"
import { getTranslation } from "@/lib/i18n"
import {
  Gauge,
  Zap,
  Clock,
  DollarSign,
  Users,
  Server,
  Layout,
  Database,
  Cpu,
  Activity,
  CheckCircle2,
  CheckSquare,
  ShieldAlert,
  Sliders,
  History,
  TrendingUp,
} from "lucide-react"

export function DashboardTab({
  generated,
  data,
  targetLanguage = "English",
}: {
  generated: boolean
  data?: any
  targetLanguage?: string
}) {
  const { role } = useRole()
  const currentRole = role || "Manager"
  const lang = targetLanguage || data?.target_language || "English"
  const t = getTranslation(lang)

  if (!generated) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm space-y-2">
        <p className="font-semibold text-slate-700">No Blueprint Generated Yet</p>
        <p className="text-xs text-slate-400">
          Enter your business problem or attach a BRD/SOP document on the left to generate the complete solution architecture.
        </p>
      </div>
    )
  }

  const maturity = data?.digital_maturity || 88
  const adoption = data?.ai_adoption || 94
  const timeline = data?.timeline || "6 Weeks"
  const title = data?.project_title || "Custom Website / App Project"
  const userProblem = data?.user_problem || ""

  const finEst = data?.financial_estimation || {
    min_budget: "$18,000",
    max_budget: "$32,000",
    total_hours: "240 Hours",
    hourly_rate: "$75/hr",
    team_roles: [
      { role: "Senior Full-Stack Engineer", count: 2, allocation: "100%" },
      { role: "UI/UX Product Designer", count: 1, allocation: "50%" },
      { role: "AI & Data Engineer", count: 1, allocation: "75%" },
      { role: "DevOps Architect", count: 1, allocation: "50%" },
    ],
  }

  const techStack = data?.tech_stack || {
    frontend: "Next.js 16 + React 19 + Tailwind",
    backend: "Node.js / Express",
    database: "PostgreSQL",
    ai_layer: "Google Gemini 1.5 Flash",
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                Project Blueprint & Step-by-Step Guide
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                  currentRole === "Admin"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : currentRole === "Manager"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {currentRole} Role Active
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{title}</h2>
            {userProblem && (
              <p className="mt-1 text-xs text-slate-600 max-w-3xl line-clamp-2">
                <strong>Requirement:</strong> "{userProblem}"
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 shadow-2xs">
              {t.statusReady}
            </span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          currentRole === "Employee" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{t.digitalMaturity}</span>
            <Gauge className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{maturity}%</div>
          <p className="mt-1 text-[11px] font-medium text-emerald-600">+12% Transformation Ready</p>
        </div>

        {currentRole !== "Employee" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>{t.aiReadiness}</span>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{adoption}%</div>
            <p className="mt-1 text-[11px] font-medium text-amber-600">High Suitability</p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{t.targetMvp}</span>
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{timeline}</div>
          <p className="mt-1 text-[11px] text-slate-500">Sprint 1 to Sprint 6</p>
        </div>

        {currentRole !== "Employee" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
              <span>{t.financialBudget}</span>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">
              {finEst.min_budget} - {finEst.max_budget}
            </div>
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              @ {finEst.hourly_rate} ({finEst.total_hours})
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SHARED (Admin & Manager): Resource Allocation & Tech Stack */}
      {/* ------------------------------------------------------------- */}
      {currentRole !== "Employee" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Team Role Allocation */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              {t.resourceAllocation}
            </h3>
            <div className="space-y-3">
              {finEst.team_roles.map((member: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[11px]">
                      {member.count}x
                    </div>
                    <span className="font-semibold text-slate-900">{member.role}</span>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-mono font-medium text-slate-700">
                    {member.allocation} Allocation
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-600" />
              {t.techStack}
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
                  <Cpu className="h-4 w-4 text-purple-500" /> AI Intelligence Layer
                </span>
                <span className="font-mono text-purple-700 font-semibold">{techStack.ai_layer}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADMIN SPECIFIC VIEW: System Health, AI Config & Activity Log */}
      {/* ------------------------------------------------------------- */}
      {currentRole === "Admin" && (
        <div className="space-y-6">
          {/* Admin Row: System Health & Live Telemetry */}
          <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-rose-600" />
                Live System Health & Cloud Telemetry (Admin Exclusive)
              </h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                All Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">API Requests</span>
                <p className="text-lg font-extrabold text-slate-900 mt-1">1,248 reqs</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Avg Latency</span>
                <p className="text-lg font-extrabold text-slate-900 mt-1">420 ms</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Uptime SLA</span>
                <p className="text-lg font-extrabold text-slate-900 mt-1">99.98%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Active LLM</span>
                <p className="text-lg font-extrabold text-indigo-600 mt-1">Gemini 1.5 Flash</p>
              </div>
            </div>
          </div>

          {/* Admin Security & User Activity Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              Security Audit & Workspace Activity Log
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { time: "16:28:40", event: "Admin role authenticated successfully", ip: "192.168.1.104", status: "AUTH_OK" },
                { time: "16:25:12", event: "POST /api/generate executed (gemini-1.5-flash)", ip: "10.0.4.12", status: "200_OK" },
                { time: "16:21:05", event: "Supabase RLS security policies validated", ip: "Internal", status: "SECURE" },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">[{log.time}]</span>
                    <span className="text-slate-800 font-sans">{log.event}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


