"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft, Cpu, Activity, Users, CheckCircle2, Server, BarChart3, Database } from "lucide-react"

export default function AdminPage() {
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash")
  const [modelSaved, setModelSaved] = useState(false)

  const handleModelSave = (model: string) => {
    setSelectedModel(model)
    setModelSaved(true)
    setTimeout(() => setModelSaved(false), 2500)
  }

  const teamMembers = [
    { name: "Jay Patel", email: "jay.patel@futurrizon.com", role: "Owner & Lead Architect", status: "Active" },
    { name: "Alex Rivera", email: "alex.r@futurrizon.com", role: "AI Solutions Engineer", status: "Active" },
    { name: "Sofia Chen", email: "sofia.c@futurrizon.com", role: "UI/UX Designer", status: "Active" },
    { name: "Dev Team", email: "dev-team@futurrizon.com", role: "Full-Stack Developer", status: "Invited" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Futurrizon Enterprise Admin Panel</h1>
              <p className="text-xs text-slate-500">AI Model Switcher, System Health & Role-Based Access Control</p>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
          >
            Back to Workspace
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              <span>Total API Requests</span>
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">1,248</div>
            <p className="mt-1 text-[11px] font-medium text-emerald-600">+18% this week</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              <span>Average Latency</span>
              <Cpu className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">420 ms</div>
            <p className="mt-1 text-[11px] font-medium text-emerald-600">Optimal Response Speed</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              <span>System Uptime</span>
              <Server className="h-5 w-5 text-cyan-600" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">99.98%</div>
            <p className="mt-1 text-[11px] text-slate-500">Google Gemini & Supabase</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              <span>Success Rate</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">100%</div>
            <p className="mt-1 text-[11px] text-emerald-600">Zero System Downtime</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600" />
                AI Model Switcher & Engine Selection
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select the active generative LLM model used for solution architecture generation</p>
            </div>
            {modelSaved && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Model Updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              onClick={() => handleModelSave("gemini-1.5-flash")}
              className={`rounded-xl border p-4 cursor-pointer transition ${
                selectedModel === "gemini-1.5-flash"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Gemini 1.5 Flash</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">Recommended</span>
              </div>
              <p className="text-xs text-slate-600">Fast, low-latency solution generation optimized for enterprise blueprints.</p>
            </div>

            <div
              onClick={() => handleModelSave("gemini-1.5-pro")}
              className={`rounded-xl border p-4 cursor-pointer transition ${
                selectedModel === "gemini-1.5-pro"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Gemini 1.5 Pro</span>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">Deep Reasoning</span>
              </div>
              <p className="text-xs text-slate-600">Maximum reasoning depth for complex multi-tier enterprise systems.</p>
            </div>

            <div
              onClick={() => handleModelSave("mock-mode")}
              className={`rounded-xl border p-4 cursor-pointer transition ${
                selectedModel === "mock-mode"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Smart Mock Mode</span>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">Offline / Dev</span>
              </div>
              <p className="text-xs text-slate-600">Local deterministic generator mode for development and offline testing.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Role-Based Access Control (RBAC) Workspace Permissions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage team access and permissions across Futurrizon Workspace</p>
            </div>
            <button className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
              + Invite Member
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{m.name}</h4>
                  <p className="text-slate-500 text-[11px]">{m.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                    {m.role}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}