"use client"

import { useState } from "react"
import { useRole, type UserRole, ROLE_PASSCODES } from "@/lib/role-context"
import { Shield, Briefcase, User, Box, ArrowRight, Lock, AlertCircle, Sparkles, Check } from "lucide-react"

export function RoleLogin() {
  const { login } = useRole()
  const [selectedRole, setSelectedRole] = useState<UserRole>("Manager")
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const rolesList: {
    id: UserRole
    title: string
    desc: string
    badge: string
    icon: any
    color: string
    borderColor: string
    bgLight: string
    activeGlow: string
  }[] = [
    {
      id: "Admin",
      title: "Admin",
      desc: "Full system access, AI config, security policies & live telemetry",
      badge: "Full Access",
      icon: Shield,
      color: "text-rose-600",
      borderColor: "border-rose-500",
      bgLight: "bg-rose-50",
      activeGlow: "ring-2 ring-rose-500/30 border-rose-500 bg-rose-50/40",
    },
    {
      id: "Manager",
      title: "Manager",
      desc: "Project planning, team management, budget estimation & sprint milestones",
      badge: "Project Lead",
      icon: Briefcase,
      color: "text-indigo-600",
      borderColor: "border-indigo-500",
      bgLight: "bg-indigo-50",
      activeGlow: "ring-2 ring-indigo-500/30 border-indigo-500 bg-indigo-50/40",
    },
    {
      id: "Employee",
      title: "Employee",
      desc: "Task execution, implementation guides, workflows & UI wireframes",
      badge: "Task Focused",
      icon: User,
      color: "text-emerald-600",
      borderColor: "border-emerald-500",
      bgLight: "bg-emerald-50",
      activeGlow: "ring-2 ring-emerald-500/30 border-emerald-500 bg-emerald-50/40",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!passcode.trim()) {
      setError("Please enter the role passcode.")
      return
    }

    setLoading(true)
    const success = login(selectedRole, passcode.trim())
    setLoading(false)

    if (!success) {
      setError("Invalid passcode. Please try again.")
    }
  }

  const fillQuickPasscode = (roleToFill: UserRole) => {
    setSelectedRole(roleToFill)
    setPasscode(ROLE_PASSCODES[roleToFill])
    setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100 p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Box className="h-8 w-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700 mt-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Futurrizon Business Transformation AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Select Your Role & Enter Passcode
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Choose your enterprise workspace role to unlock tailored solution architecture views, metrics, and permissions.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {rolesList.map((r) => {
            const Icon = r.icon
            const isSelected = selectedRole === r.id

            return (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRole(r.id)
                  setError(null)
                }}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-150 text-left ${
                  isSelected
                    ? `${r.activeGlow} shadow-md`
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.bgLight} ${r.color} shadow-xs`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-slate-500 mt-0.5">
                      {r.badge}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-2 line-clamp-3">
                      {r.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Enter {selectedRole} Passcode
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Required for authentication
              </span>
            </label>

            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  setError(null)
                }}
                placeholder={`Enter passcode for ${selectedRole} (e.g., ${ROLE_PASSCODES[selectedRole]})...`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Helper Pills */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Hackathon / Demo Passcodes (Click to autofill):
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillQuickPasscode("Admin")}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100 transition cursor-pointer"
              >
                🔴 Admin: <code className="font-bold">admin123</code>
              </button>
              <button
                type="button"
                onClick={() => fillQuickPasscode("Manager")}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
              >
                🔵 Manager: <code className="font-bold">manager123</code>
              </button>
              <button
                type="button"
                onClick={() => fillQuickPasscode("Employee")}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
              >
                🟢 Employee: <code className="font-bold">employee123</code>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
          >
            <span>Enter {selectedRole} Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}