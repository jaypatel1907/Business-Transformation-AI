"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Shield,
  CheckCircle2,
  Users,
  Activity,
  Cpu,
  Server,
  ArrowLeft,
  UserPlus,
  Trash2,
  X,
  Mail,
  User,
  Briefcase,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Invited" | "Pending"
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "m-1",
    name: "Jay Patel",
    email: "jay.patel@futurrizon.com",
    role: "Owner & Lead Architect",
    status: "Active",
  },
  {
    id: "m-2",
    name: "Alex Rivera",
    email: "alex.r@futurrizon.com",
    role: "AI Solutions Engineer",
    status: "Active",
  },
  {
    id: "m-3",
    name: "Sofia Chen",
    email: "sofia.c@futurrizon.com",
    role: "UI/UX Designer",
    status: "Active",
  },
  {
    id: "m-4",
    name: "Dev Team",
    email: "dev-team@futurrizon.com",
    role: "Full-Stack Developer",
    status: "Invited",
  },
]

export default function AdminPage() {
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash")
  const [modelSaved, setModelSaved] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Full-Stack Developer")

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("futurrizon_selected_model")
      if (savedModel) setSelectedModel(savedModel)

      const savedMembers = localStorage.getItem("futurrizon_rbac_members")
      if (savedMembers) {
        try {
          const parsed = JSON.parse(savedMembers)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTeamMembers(parsed)
          }
        } catch (e) {
          console.error("Failed to parse saved team members", e)
        }
      }
    }
  }, [])

  const handleModelSave = (model: string) => {
    setSelectedModel(model)
    if (typeof window !== "undefined") {
      localStorage.setItem("futurrizon_selected_model", model)
    }
    setModelSaved(true)
    setTimeout(() => setModelSaved(false), 2500)
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role,
      status: "Invited",
    }

    const updated = [...teamMembers, newMember]
    setTeamMembers(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("futurrizon_rbac_members", JSON.stringify(updated))
    }

    // Reset form
    setName("")
    setEmail("")
    setRole("Full-Stack Developer")
    setShowInviteModal(false)
    setInviteSuccess(true)
    setTimeout(() => setInviteSuccess(false), 3000)
  }

  const handleDeleteMember = (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id)
    setTeamMembers(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("futurrizon_rbac_members", JSON.stringify(updated))
    }
  }

  const handleToggleStatus = (id: string) => {
    const updated: TeamMember[] = teamMembers.map((m) => {
      if (m.id === id) {
        const nextStatus: "Active" | "Invited" = m.status === "Active" ? "Invited" : "Active"
        return {
          ...m,
          status: nextStatus,
        }
      }
      return m
    })
    setTeamMembers(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("futurrizon_rbac_members", JSON.stringify(updated))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
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
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Workspace</span>
          </Link>
        </div>

        {/* System Health Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* AI Model Switcher */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600" />
                AI Model Switcher & Engine Selection
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the active generative LLM model used for solution architecture generation
              </p>
            </div>
            {modelSaved && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Model Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              onClick={() => handleModelSave("gemini-1.5-flash")}
              className={`rounded-xl border p-4 cursor-pointer transition ${
                selectedModel === "gemini-1.5-flash"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-600/20"
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
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-600/20"
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
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-600/20"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Smart Domain Mode</span>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">Domain Rules</span>
              </div>
              <p className="text-xs text-slate-600">Intelligent localized synthesis engine with domain-tailored schemas.</p>
            </div>
          </div>
        </div>

        {/* RBAC Team Members Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Role-Based Access Control (RBAC) Workspace Permissions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage team access, roles, and permissions across Futurrizon Workspace ({teamMembers.length} Members)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {inviteSuccess && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Member Invited!
                </span>
              )}
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>+ Invite Member</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {teamMembers.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-3 hover:border-slate-300 transition"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {m.name}
                    {m.role.includes("Owner") && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                        Admin
                      </span>
                    )}
                  </h4>
                  <p className="text-slate-500 text-[11px] font-mono mt-0.5">{m.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                    {m.role}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(m.id)}
                    title="Click to toggle status"
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition ${
                      m.status === "Active"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {m.status}
                  </button>
                  {!m.role.includes("Owner") && (
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      title="Remove Member"
                      className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                Invite Workspace Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rohit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g., rohit@futurrizon.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  Workspace Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="AI Solutions Engineer">AI Solutions Engineer</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="DevOps & Cloud Architect">DevOps & Cloud Architect</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Owner & Lead Architect">Owner & Lead Architect</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
