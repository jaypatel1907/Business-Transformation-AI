"use client"

import React, { useState } from "react"
import {
  UXBlueprint,
  UXPersona,
  UXJourney,
  UXJourneyStep,
  UXScreen
} from "@/lib/ux-wireframe-types"
import {
  Users,
  Route,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Edit2,
  Check,
  X,
  UserCheck,
  Target,
  AlertCircle,
  Smartphone
} from "lucide-react"

interface UserJourneyPanelProps {
  blueprint: UXBlueprint
  onUpdateBlueprint: (updater: (prev: UXBlueprint) => UXBlueprint) => void
  onSelectScreen?: (screenId: string) => void
}

export function UserJourneyPanel({
  blueprint,
  onUpdateBlueprint,
  onSelectScreen
}: UserJourneyPanelProps) {
  const [activeTab, setActiveTab] = useState<"personas" | "journeys">("personas")
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    blueprint.personas[0]?.id || ""
  )
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null)
  const [editPersonaForm, setEditPersonaForm] = useState<Partial<UXPersona>>({})

  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null)
  const [editJourneyForm, setEditJourneyForm] = useState<Partial<UXJourney>>({})

  // Add new Persona
  const handleAddPersona = () => {
    const newId = `persona_${Date.now()}`
    const newPersona: UXPersona = {
      id: newId,
      name: "New Persona",
      role: "Key User / Customer",
      goals: ["Complete tasks quickly", "Track status in real-time"],
      painPoints: ["Complex navigation", "Slow feedback"],
      keyScreens: blueprint.screens.slice(0, 2).map((s) => s.id)
    }

    onUpdateBlueprint((prev) => ({
      ...prev,
      personas: [...prev.personas, newPersona],
      updatedAt: new Date().toISOString()
    }))
    setSelectedPersonaId(newId)
    setEditingPersonaId(newId)
    setEditPersonaForm(newPersona)
  }

  // Delete Persona
  const handleDeletePersona = (id: string) => {
    onUpdateBlueprint((prev) => ({
      ...prev,
      personas: prev.personas.filter((p) => p.id !== id),
      journeys: prev.journeys.filter((j) => j.personaId !== id),
      updatedAt: new Date().toISOString()
    }))
    if (selectedPersonaId === id) {
      const remaining = blueprint.personas.filter((p) => p.id !== id)
      setSelectedPersonaId(remaining[0]?.id || "")
    }
  }

  // Save edited persona
  const handleSavePersona = () => {
    if (!editingPersonaId) return
    onUpdateBlueprint((prev) => ({
      ...prev,
      personas: prev.personas.map((p) =>
        p.id === editingPersonaId ? ({ ...p, ...editPersonaForm } as UXPersona) : p
      ),
      updatedAt: new Date().toISOString()
    }))
    setEditingPersonaId(null)
    setEditPersonaForm({})
  }

  // Add new Journey
  const handleAddJourney = (personaId: string) => {
    const newId = `journey_${Date.now()}`
    const firstScreen = blueprint.screens[0]
    const secondScreen = blueprint.screens[1] || firstScreen

    const newJourney: UXJourney = {
      id: newId,
      personaId,
      title: "New User Journey",
      goal: "Successfully complete primary workflow",
      steps: [
        {
          stepNumber: 1,
          title: "Discovery & Entry",
          description: "User lands on screen and initiates action",
          screenId: firstScreen ? firstScreen.id : "",
          action: "Open application and click primary action",
          aiTouchpoint: "AI Assistant suggests top recommendations"
        },
        ...(secondScreen
          ? [
              {
                stepNumber: 2,
                title: "Execution & Finalize",
                description: "User reviews information and confirms",
                screenId: secondScreen.id,
                action: "Review summary and submit order",
                aiTouchpoint: "Automated instant confirmation"
              }
            ]
          : [])
      ]
    }

    onUpdateBlueprint((prev) => ({
      ...prev,
      journeys: [...prev.journeys, newJourney],
      updatedAt: new Date().toISOString()
    }))
  }

  // Delete Journey
  const handleDeleteJourney = (journeyId: string) => {
    onUpdateBlueprint((prev) => ({
      ...prev,
      journeys: prev.journeys.filter((j) => j.id !== journeyId),
      updatedAt: new Date().toISOString()
    }))
  }

  // Add Step to Journey
  const handleAddStep = (journeyId: string) => {
    onUpdateBlueprint((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) => {
        if (j.id !== journeyId) return j
        const nextNum = j.steps.length + 1
        const newStep: UXJourneyStep = {
          stepNumber: nextNum,
          title: `Step ${nextNum}`,
          description: "Describe what user does in this step",
          screenId: prev.screens[0]?.id || "",
          action: "Perform next action"
        }
        return {
          ...j,
          steps: [...j.steps, newStep]
        }
      }),
      updatedAt: new Date().toISOString()
    }))
  }

  // Remove Step from Journey
  const handleRemoveStep = (journeyId: string, stepIndex: number) => {
    onUpdateBlueprint((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) => {
        if (j.id !== journeyId) return j
        const newSteps = j.steps
          .filter((_, idx) => idx !== stepIndex)
          .map((st, i) => ({ ...st, stepNumber: i + 1 }))
        return {
          ...j,
          steps: newSteps
        }
      }),
      updatedAt: new Date().toISOString()
    }))
  }

  // Update step field
  const handleUpdateStep = (
    journeyId: string,
    stepIndex: number,
    field: keyof UXJourneyStep,
    value: any
  ) => {
    onUpdateBlueprint((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) => {
        if (j.id !== journeyId) return j
        const updatedSteps = [...j.steps]
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          [field]: value
        }
        return {
          ...j,
          steps: updatedSteps
        }
      }),
      updatedAt: new Date().toISOString()
    }))
  }

  const selectedPersona = blueprint.personas.find((p) => p.id === selectedPersonaId)
  const personaJourneys = blueprint.journeys.filter(
    (j) => j.personaId === selectedPersonaId
  )

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Personas & End-to-End User Journeys
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
                {blueprint.personas.length} Personas • {blueprint.journeys.length} Journeys
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Map target audience behaviors and step-by-step product interaction flows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab("personas")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === "personas"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Personas
            </button>
            <button
              onClick={() => setActiveTab("journeys")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === "journeys"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Journey Maps
            </button>
          </div>

          <button
            onClick={handleAddPersona}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Persona
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left column: Persona list */}
        <div className="col-span-3 border-r border-slate-800 bg-slate-900/60 p-4 overflow-y-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Target User Profiles
          </div>

          {blueprint.personas.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-800/30 rounded-lg border border-dashed border-slate-800">
              No personas yet. Click &quot;Add Persona&quot; to begin.
            </div>
          ) : (
            blueprint.personas.map((persona) => {
              const isSelected = persona.id === selectedPersonaId
              return (
                <div
                  key={persona.id}
                  onClick={() => setSelectedPersonaId(persona.id)}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500/50 shadow-sm"
                      : "bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                        {persona.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {persona.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{persona.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePersona(persona.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                      {persona.goals.length} Goals
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                      {blueprint.journeys.filter((j) => j.personaId === persona.id).length} Journeys
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Right column: Details for selected persona */}
        <div className="col-span-9 p-6 overflow-y-auto space-y-6 bg-slate-950/40">
          {!selectedPersona ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Users className="w-12 h-12 mb-3 text-slate-600 opacity-50" />
              <p className="text-sm">Select or create a persona from the left list</p>
            </div>
          ) : activeTab === "personas" ? (
            /* Persona Profile View/Edit */
            <div className="space-y-6">
              {/* Persona Header Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative">
                {editingPersonaId === selectedPersona.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Name</label>
                        <input
                          type="text"
                          value={editPersonaForm.name || ""}
                          onChange={(e) =>
                            setEditPersonaForm({ ...editPersonaForm, name: e.target.value })
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Role / Job Title</label>
                        <input
                          type="text"
                          value={editPersonaForm.role || ""}
                          onChange={(e) =>
                            setEditPersonaForm({ ...editPersonaForm, role: e.target.value })
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingPersonaId(null)
                          setEditPersonaForm({})
                        }}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePersona}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-lg font-bold">
                        {selectedPersona.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">
                          {selectedPersona.name}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium">
                          {selectedPersona.role}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingPersonaId(selectedPersona.id)
                        setEditPersonaForm(selectedPersona)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>

              {/* Goals & Pain Points Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Goals */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    Key Goals & Motivations
                  </div>
                  <ul className="space-y-2">
                    {selectedPersona.goals.map((goal, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pain Points */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    Current Pain Points & Friction
                  </div>
                  <ul className="space-y-2">
                    {selectedPersona.painPoints.map((pain, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-lg"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connected Wireframe Screens */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    Associated Screens in Blueprint
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {blueprint.screens.map((screen) => {
                    const isLinked = selectedPersona.keyScreens?.includes(screen.id)
                    return (
                      <div
                        key={screen.id}
                        onClick={() => {
                          const curr = selectedPersona.keyScreens || []
                          const updated = isLinked
                            ? curr.filter((id) => id !== screen.id)
                            : [...curr, screen.id]
                          onUpdateBlueprint((prev) => ({
                            ...prev,
                            personas: prev.personas.map((p) =>
                              p.id === selectedPersona.id
                                ? { ...p, keyScreens: updated }
                                : p
                            ),
                            updatedAt: new Date().toISOString()
                          }))
                        }}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isLinked
                            ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-300"
                            : "bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-medium text-slate-200 truncate">
                            {screen.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {screen.route}
                          </div>
                        </div>
                        {isLinked && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* User Journeys View for Selected Persona */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Route className="w-4 h-4 text-indigo-400" />
                    Journeys for {selectedPersona.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Step-by-step paths from intent to outcome with AI touches.
                  </p>
                </div>

                <button
                  onClick={() => handleAddJourney(selectedPersona.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Journey
                </button>
              </div>

              {personaJourneys.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 space-y-3">
                  <Route className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No user journeys mapped for this persona yet.</p>
                  <button
                    onClick={() => handleAddJourney(selectedPersona.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg border border-slate-700 text-xs font-medium"
                  >
                    Create First Journey
                  </button>
                </div>
              ) : (
                personaJourneys.map((journey) => (
                  <div
                    key={journey.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
                  >
                    {/* Journey Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={journey.title}
                          onChange={(e) =>
                            onUpdateBlueprint((prev) => ({
                              ...prev,
                              journeys: prev.journeys.map((j) =>
                                j.id === journey.id ? { ...j, title: e.target.value } : j
                              )
                            }))
                          }
                          className="bg-transparent font-bold text-sm text-slate-100 focus:outline-none focus:border-b border-indigo-500 px-1"
                        />
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-slate-500 font-medium">Goal:</span>
                          <input
                            type="text"
                            value={journey.goal}
                            onChange={(e) =>
                              onUpdateBlueprint((prev) => ({
                                ...prev,
                                journeys: prev.journeys.map((j) =>
                                  j.id === journey.id ? { ...j, goal: e.target.value } : j
                                )
                              }))
                            }
                            className="bg-transparent text-slate-300 focus:outline-none focus:border-b border-indigo-500 px-1 w-96"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddStep(journey.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                          Add Step
                        </button>
                        <button
                          onClick={() => handleDeleteJourney(journey.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Step Timeline */}
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                      {journey.steps.map((step, idx) => {
                        const targetScreen = blueprint.screens.find(
                          (s) => s.id === step.screenId
                        )
                        return (
                          <div
                            key={idx}
                            className="relative group bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700"
                          >
                            {/* Step Badge */}
                            <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-indigo-600 border-2 border-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                              {step.stepNumber}
                            </div>

                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) =>
                                      handleUpdateStep(
                                        journey.id,
                                        idx,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    className="bg-transparent font-semibold text-xs text-slate-200 focus:outline-none focus:border-b border-indigo-500"
                                  />

                                  {/* Screen Selector */}
                                  <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                                    <Smartphone className="w-3 h-3 text-indigo-400" />
                                    <select
                                      value={step.screenId}
                                      onChange={(e) =>
                                        handleUpdateStep(
                                          journey.id,
                                          idx,
                                          "screenId",
                                          e.target.value
                                        )
                                      }
                                      className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
                                    >
                                      <option value="" className="bg-slate-800">
                                        Select Screen...
                                      </option>
                                      {blueprint.screens.map((s) => (
                                        <option
                                          key={s.id}
                                          value={s.id}
                                          className="bg-slate-800"
                                        >
                                          {s.name} ({s.route})
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {targetScreen && onSelectScreen && (
                                    <button
                                      onClick={() => onSelectScreen(targetScreen.id)}
                                      className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-0.5"
                                    >
                                      Open in Canvas <ArrowRight className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">
                                      User Action
                                    </label>
                                    <input
                                      type="text"
                                      value={step.action}
                                      onChange={(e) =>
                                        handleUpdateStep(
                                          journey.id,
                                          idx,
                                          "action",
                                          e.target.value
                                        )
                                      }
                                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] text-indigo-400 uppercase font-semibold flex items-center gap-1 mb-0.5">
                                      <Sparkles className="w-3 h-3 text-indigo-400" />
                                      AI Touchpoint / Assistance
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Smart auto-complete, fraud check..."
                                      value={step.aiTouchpoint || ""}
                                      onChange={(e) =>
                                        handleUpdateStep(
                                          journey.id,
                                          idx,
                                          "aiTouchpoint",
                                          e.target.value
                                        )
                                      }
                                      className="w-full bg-slate-900 border border-indigo-500/30 rounded px-2.5 py-1 text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemoveStep(journey.id, idx)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
