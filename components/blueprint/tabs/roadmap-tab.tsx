"use client"

import React, { useState, useMemo } from "react"
import {
  CanonicalProjectPlan,
  CanonicalPhase
} from "@/lib/project-plan-types"
import {
  getCanonicalProjectPlan,
  recalculateProjectPlan,
  exportPlanToBlueprintData
} from "@/lib/project-plan-adapter"
import {
  Kanban,
  Clock,
  DollarSign,
  User,
  Code2,
  Bot,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Check
} from "lucide-react"

interface RoadmapTabProps {
  generated: boolean
  data?: any
  targetLanguage?: string
  onUpdateBlueprint?: (updatedData: any) => void
}

export function RoadmapTab({
  generated,
  data,
  targetLanguage = "English",
  onUpdateBlueprint
}: RoadmapTabProps) {
  const isGuj = (targetLanguage || "").toLowerCase().includes("gu")

  // Canonical plan model as single source of truth
  const plan: CanonicalProjectPlan = useMemo(() => {
    return getCanonicalProjectPlan(data)
  }, [data])

  // Local editing state
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<CanonicalPhase>>({})
  const [isAddingPhase, setIsAddingPhase] = useState(false)
  const [newPhaseForm, setNewPhaseForm] = useState<{
    name: string
    timeframe: string
    owner: string
    effortHours: number
    tasks: string
    tech_stack: string
  }>({
    name: "Security & Automated Testing Phase",
    timeframe: `Week ${plan.phases.length + 1}`,
    owner: "QA & Security Engineer",
    effortHours: 40,
    tasks: "End-to-end integration tests, penetration testing, automated CI/CD pipeline",
    tech_stack: "Playwright, GitHub Actions, Jest"
  })
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the practical developer execution roadmap.
      </div>
    )
  }

  // Handle Recalculate Plan
  const handleRecalculatePlan = () => {
    const recalculated = recalculateProjectPlan(plan)
    if (onUpdateBlueprint) {
      onUpdateBlueprint(exportPlanToBlueprintData(recalculated, data))
    }
    showToast(isGuj ? "પ્લાન સફળતાપૂર્વક રી-કેલ્ક્યુલેટ થયો!" : "✓ Plan recalculated & synchronized with Planning & ROI!")
  }

  // Start Editing Phase
  const handleStartEdit = (phase: CanonicalPhase) => {
    setEditingPhaseId(phase.id)
    setEditForm({
      name: phase.name,
      timeframe: phase.timeframe,
      owner: phase.owner,
      effortHours: phase.effortHours,
      tasks: Array.isArray(phase.tasks) ? phase.tasks.join(", ") : phase.tasks,
      status: phase.status
    })
  }

  // Save Phase Edit
  const handleSaveEdit = (phaseId: string) => {
    const updatedPhases = plan.phases.map((p) => {
      if (p.id === phaseId) {
        return {
          ...p,
          name: editForm.name || p.name,
          timeframe: editForm.timeframe || p.timeframe,
          owner: editForm.owner || p.owner,
          effortHours: Number(editForm.effortHours) || p.effortHours,
          tasks: typeof editForm.tasks === "string" ? editForm.tasks.split(",").map(s => s.trim()) : p.tasks,
          status: (editForm.status as any) || p.status
        }
      }
      return p
    })

    const updatedPlan: CanonicalProjectPlan = {
      ...plan,
      phases: updatedPhases
    }
    const recalculated = recalculateProjectPlan(updatedPlan)
    if (onUpdateBlueprint) {
      onUpdateBlueprint(exportPlanToBlueprintData(recalculated, data))
    }
    setEditingPhaseId(null)
    showToast(isGuj ? "સ્પ્રિન્ટ ફેરફારો સેવ થયા!" : "✓ Sprint updated and synced to Planning & Budget!")
  }

  // Delete Phase
  const handleDeletePhase = (phaseId: string) => {
    if (plan.phases.length <= 1) {
      alert("At least one phase is required in the execution plan.")
      return
    }
    const updatedPhases = plan.phases.filter((p) => p.id !== phaseId)
    const updatedPlan: CanonicalProjectPlan = {
      ...plan,
      phases: updatedPhases
    }
    const recalculated = recalculateProjectPlan(updatedPlan)
    if (onUpdateBlueprint) {
      onUpdateBlueprint(exportPlanToBlueprintData(recalculated, data))
    }
    showToast(isGuj ? "સ્પ્રિન્ટ દૂર કરવામાં આવી" : "✓ Sprint removed & budget recalculated.")
  }

  // Add New Phase
  const handleAddNewPhase = () => {
    const newPhase: CanonicalPhase = {
      id: `phase-${Date.now()}`,
      sprintNumber: plan.phases.length + 1,
      timeframe: newPhaseForm.timeframe,
      name: newPhaseForm.name,
      phase: newPhaseForm.name,
      description: newPhaseForm.tasks,
      owner: newPhaseForm.owner,
      tech_stack: newPhaseForm.tech_stack.split(",").map(s => s.trim()),
      ai_tools: ["Cursor IDE", "Gemini 2.5 Flash"],
      tasks: newPhaseForm.tasks.split(",").map(s => s.trim()),
      effortHours: Number(newPhaseForm.effortHours) || 40,
      estimatedCost: (Number(newPhaseForm.effortHours) || 40) * 75,
      resourceRoles: [newPhaseForm.owner],
      dependencies: plan.phases.length > 0 ? [plan.phases[plan.phases.length - 1].id] : [],
      milestones: [`milestone-${plan.phases.length + 1}`],
      status: "planned"
    }

    const updatedPlan: CanonicalProjectPlan = {
      ...plan,
      phases: [...plan.phases, newPhase]
    }
    const recalculated = recalculateProjectPlan(updatedPlan)
    if (onUpdateBlueprint) {
      onUpdateBlueprint(exportPlanToBlueprintData(recalculated, data))
    }
    setIsAddingPhase(false)
    showToast(isGuj ? "નવી સ્પ્રિન્ટ ઉમેરાઈ!" : "✓ New sprint added! Planning & ROI updated.")
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Shared Plan Synchronization Status Bar */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {isGuj ? "શેર્ડ પ્રોજેક્ટ પ્લાન સિન્ક્રોનાઇઝેશન" : "Shared Project Plan Synchronization"}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {plan.syncStatus === "synchronized" ? "Synchronized" : "Recalculation Ready"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isGuj
                  ? "Roadmap અને Planning & ROI એક જ કેનોનિકલ ડેટા મૉડલ સાથે લિંક છે."
                  : "Roadmap and Planning & ROI share the exact same underlying effort, resource, and budget model."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecalculatePlan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs border border-indigo-200 shadow-2xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isGuj ? "રી-કેલ્ક્યુલેટ પ્લાન" : "Recalculate Plan"}</span>
            </button>
            <button
              onClick={() => setIsAddingPhase(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isGuj ? "સ્પ્રિન્ટ ઉમેરો" : "Add Sprint"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Sprint & Milestone Overview Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Kanban className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sprint Execution & Developer Deliverables</h3>
              <p className="text-xs text-slate-500">
                Actionable sprint backlog mapped to engineering roles and tech stack platform components.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
            {plan.timelineWindow} Execution Window
          </span>
        </div>

        {/* Dynamic Connected Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Budget</span>
            <span className="font-extrabold text-slate-900 text-sm">{plan.financials.minBudget} – {plan.financials.maxBudget}</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">Synced from Financials</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Scoped Effort</span>
            <span className="font-extrabold text-indigo-700 text-sm">{plan.effort.totalHours} Hours</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{plan.phases.length} Active Sprints</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Cloud Run Rate</span>
            <span className="font-extrabold text-slate-900 text-sm">{plan.financials.cloudMonthlyCost}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5 truncate">{plan.financials.cloudDetail.split("+")[0]}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Projected ROI</span>
            <span className="font-extrabold text-emerald-700 text-sm">{plan.financials.roiPercentage}% ROI</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">{plan.financials.paybackMonths} Mo Payback</span>
          </div>
        </div>
      </div>

      {/* Add New Phase Modal / Form */}
      {isAddingPhase && (
        <div className="rounded-2xl border-2 border-indigo-400 bg-indigo-50/40 p-5 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              {isGuj ? "નવો સ્પ્રિન્ટ / ફેઝ ઉમેરો" : "Add New Sprint Phase"}
            </h4>
            <button
              onClick={() => setIsAddingPhase(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Sprint Title / Phase Name:</label>
              <input
                type="text"
                value={newPhaseForm.name}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Timeframe (e.g. Week 4-5):</label>
              <input
                type="text"
                value={newPhaseForm.timeframe}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, timeframe: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Role / Owner:</label>
              <input
                type="text"
                value={newPhaseForm.owner}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, owner: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Estimated Effort (Hours):</label>
              <input
                type="number"
                value={newPhaseForm.effortHours}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, effortHours: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Key Deliverables & Tasks (comma-separated):</label>
              <input
                type="text"
                value={newPhaseForm.tasks}
                onChange={(e) => setNewPhaseForm({ ...newPhaseForm, tasks: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingPhase(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNewPhase}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
            >
              Add Sprint to Plan
            </button>
          </div>
        </div>
      )}

      {/* Sprints List */}
      <div className="space-y-4">
        {plan.phases.map((sprint, idx) => {
          const isEditing = editingPhaseId === sprint.id
          return (
            <div
              key={sprint.id || idx}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-200 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold shadow-2xs">
                    {idx + 1}
                  </span>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="font-bold text-slate-900 text-sm border border-slate-300 rounded px-2 py-1"
                      />
                    ) : (
                      <h4 className="font-bold text-slate-900 text-sm">{sprint.name}</h4>
                    )}
                    <span className="text-[11px] text-indigo-600 font-semibold">{sprint.timeframe}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                    {sprint.effortHours} Hours (${(sprint.effortHours * 75).toLocaleString()})
                  </span>
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveEdit(sprint.id)}
                      className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(sprint)}
                      title="Edit Sprint"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePhase(sprint.id)}
                    title="Delete Sprint"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Roles & Tech Stack Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <User className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Owner</span>
                    <span className="font-semibold text-slate-800">{sprint.owner}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Code2 className="h-4 w-4 text-purple-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Tech Stack</span>
                    <span className="font-semibold text-slate-800 truncate">
                      {Array.isArray(sprint.tech_stack) ? sprint.tech_stack.join(", ") : sprint.tech_stack}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Bot className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">AI Tooling</span>
                    <span className="font-semibold text-slate-800 truncate">
                      {Array.isArray(sprint.ai_tools) ? sprint.ai_tools.join(", ") : sprint.ai_tools}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sprint Backlog Tasks:
                </span>
                <div className="space-y-1">
                  {(Array.isArray(sprint.tasks) ? sprint.tasks : [String(sprint.tasks)]).map((task, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
