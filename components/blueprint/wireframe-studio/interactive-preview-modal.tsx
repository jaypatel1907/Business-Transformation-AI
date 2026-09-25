"use client"

import React, { useState, useEffect } from "react"
import {
  UXBlueprint,
  UXScreen,
  UXComponent,
  UXDeviceType
} from "@/lib/ux-wireframe-types"
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Play
} from "lucide-react"

interface InteractivePreviewModalProps {
  blueprint: UXBlueprint
  initialScreenId?: string
  onClose: () => void
}

export function InteractivePreviewModal({
  blueprint,
  initialScreenId,
  onClose
}: InteractivePreviewModalProps) {
  const [currentScreenId, setCurrentScreenId] = useState<string>(
    initialScreenId || blueprint.screens[0]?.id || ""
  )
  const [history, setHistory] = useState<string[]>([])
  const [deviceType, setDeviceType] = useState<UXDeviceType>("desktop")
  const [showFlowTrace, setShowFlowTrace] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const currentScreen =
    blueprint.screens.find((s) => s.id === currentScreenId) || blueprint.screens[0]

  useEffect(() => {
    if (initialScreenId) {
      setCurrentScreenId(initialScreenId)
      setHistory([])
    }
  }, [initialScreenId])

  // Handle Action Trigger
  const handleAction = (comp: UXComponent) => {
    if (!comp.action) {
      setAlertMessage(`Clicked "${comp.label}" (No interaction wired yet)`)
      setTimeout(() => setAlertMessage(null), 2500)
      return
    }

    const { type, targetScreenId, label } = comp.action

    if (type === "navigate" && targetScreenId) {
      const target = blueprint.screens.find((s) => s.id === targetScreenId)
      if (target) {
        setHistory((prev) => [...prev, currentScreenId])
        setCurrentScreenId(targetScreenId)
      } else {
        setAlertMessage(`Target screen ${targetScreenId} not found`)
        setTimeout(() => setAlertMessage(null), 2500)
      }
    } else if (type === "back") {
      handleGoBack()
    } else if (type === "submit") {
      setAlertMessage(`Form submitted: ${label || comp.label}`)
      setTimeout(() => setAlertMessage(null), 3000)
    } else {
      setAlertMessage(`Action: ${type} (${label || comp.label})`)
      setTimeout(() => setAlertMessage(null), 2500)
    }
  }

  const handleGoBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setHistory((h) => h.slice(0, -1))
      setCurrentScreenId(prev)
    }
  }

  const handleReset = () => {
    setHistory([])
    setCurrentScreenId(blueprint.screens[0]?.id || "")
  }

  const getDeviceWidthClass = () => {
    switch (deviceType) {
      case "mobile":
        return "w-[380px] h-[720px] rounded-[36px] border-[10px] border-slate-800 shadow-2xl"
      case "tablet":
        return "w-[740px] h-[800px] rounded-[24px] border-[8px] border-slate-800 shadow-2xl"
      default:
        return "w-full max-w-4xl h-[780px] rounded-xl border border-slate-800 shadow-2xl"
    }
  }

  // Component renderer for interactive preview
  const renderInteractiveComponent = (comp: UXComponent) => {
    const widthStyle =
      comp.width === "1/2"
        ? "col-span-6"
        : comp.width === "1/3"
        ? "col-span-4"
        : comp.width === "2/3"
        ? "col-span-8"
        : comp.width === "1/4"
        ? "col-span-3"
        : "col-span-12"

    switch (comp.type) {
      case "heading":
        return (
          <div key={comp.id} className={`${widthStyle} py-1`}>
            <h3 className="text-base font-bold text-slate-100">{comp.label}</h3>
            {comp.content && (
              <p className="text-xs text-slate-400 mt-0.5">{comp.content}</p>
            )}
          </div>
        )

      case "button":
        return (
          <div key={comp.id} className={`${widthStyle} py-1`}>
            <button
              onClick={() => handleAction(comp)}
              className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                comp.variant === "primary"
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                  : comp.variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : comp.variant === "outline"
                  ? "border border-slate-600 hover:bg-slate-800 text-slate-200"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {comp.label}
              {comp.action?.type === "navigate" && (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )

      case "input":
      case "search":
        return (
          <div key={comp.id} className={`${widthStyle} space-y-1`}>
            <label className="text-[11px] font-medium text-slate-400">
              {comp.label}
            </label>
            <div className="relative">
              {comp.type === "search" && (
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              )}
              <input
                type="text"
                placeholder={comp.placeholder || "Enter text..."}
                className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 ${
                  comp.type === "search" ? "pl-9 pr-3" : "px-3"
                }`}
              />
            </div>
          </div>
        )

      case "stat_card":
        return (
          <div
            key={comp.id}
            className={`${widthStyle} p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`}
          >
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                {comp.label}
              </div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {comp.properties?.statValue || "$24,500"}
              </div>
            </div>
            {comp.properties?.statChange && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {comp.properties.statChange}
              </span>
            )}
          </div>
        )

      case "card":
        return (
          <div
            key={comp.id}
            onClick={() => comp.action && handleAction(comp)}
            className={`${widthStyle} p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 ${
              comp.action ? "cursor-pointer hover:border-indigo-500/50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200">{comp.label}</h4>
              {comp.action && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            {comp.content && (
              <p className="text-[11px] text-slate-400">{comp.content}</p>
            )}
          </div>
        )

      case "table":
        const cols = comp.properties?.columns || ["Item", "Category", "Status", "Action"]
        const rows = comp.properties?.dataRows || [
          ["Truffle Pasta", "Mains", "Available", "View"],
          ["Ribeye Steak", "Mains", "Low Stock", "View"],
          ["Tiramisu", "Desserts", "Available", "View"]
        ]
        return (
          <div
            key={comp.id}
            className={`${widthStyle} rounded-xl border border-slate-800 overflow-hidden bg-slate-900`}
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase">
                <tr>
                  {cols.map((col, idx) => (
                    <th key={idx} className="p-2.5">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 text-slate-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case "alert":
        return (
          <div
            key={comp.id}
            className={`${widthStyle} p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs flex items-center gap-2`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-semibold mr-1">{comp.label}:</span>
              <span>{comp.content || "Smart AI Recommendation available."}</span>
            </div>
          </div>
        )

      default:
        return (
          <div
            key={comp.id}
            className={`${widthStyle} p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300`}
          >
            <span className="font-semibold">{comp.label}</span>
            {comp.content && (
              <p className="text-slate-400 text-[11px] mt-0.5">{comp.content}</p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
              <Play className="w-4 h-4 fill-emerald-400" />
            </span>
            <span className="font-bold text-sm text-slate-100">
              Interactive Prototype Player
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Breadcrumb / History */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {history.length > 0 && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-700 text-xs"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
            <span className="text-slate-200 font-semibold">{currentScreen?.name}</span>
            <span className="text-slate-500 font-mono text-[11px]">
              ({currentScreen?.route})
            </span>
          </div>
        </div>

        {/* Device Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setDeviceType("desktop")}
              className={`p-1.5 rounded ${
                deviceType === "desktop"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceType("tablet")}
              className={`p-1.5 rounded ${
                deviceType === "tablet"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceType("mobile")}
              className={`p-1.5 rounded ${
                deviceType === "mobile"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Flow
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Screen Preview Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative">
        {alertMessage && (
          <div className="absolute top-8 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xl border border-indigo-400 z-50 animate-bounce">
            {alertMessage}
          </div>
        )}

        <div
          className={`${getDeviceWidthClass()} bg-slate-950 flex flex-col overflow-hidden transition-all duration-300`}
        >
          {/* Simulated Browser / Device Header */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-slate-950 px-4 py-1 rounded text-[11px] text-slate-400 font-mono border border-slate-800">
              https://app.preview{currentScreen?.route}
            </div>
            <div className="text-[10px] text-slate-500 font-medium uppercase">
              Live Interactive
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-100">
                {currentScreen?.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentScreen?.description || currentScreen?.purpose}
              </p>
            </div>

            <div className="grid grid-cols-12 gap-3.5">
              {currentScreen?.components.map((c) => renderInteractiveComponent(c))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="h-10 border-t border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between text-xs text-slate-400">
        <div>
          Click any button or card wired with navigation to interactively switch screens.
        </div>
        <div className="flex items-center gap-2">
          <span>Active Screen: {currentScreen?.name}</span>
        </div>
      </div>
    </div>
  )
}
