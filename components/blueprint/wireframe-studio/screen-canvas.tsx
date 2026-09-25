"use client"

import { useState } from "react"
import { UXScreen, UXComponent, UXDeviceType } from "@/lib/ux-wireframe-types"
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Sparkles
} from "lucide-react"

export interface ScreenCanvasProps {
  screen: UXScreen
  deviceType?: UXDeviceType
  selectedComponentId?: string | null
  zoom?: number
  onSelectComponent: (componentId: string) => void
  onUpdateScreen?: (updatedScreen: UXScreen) => void
  onMoveComponent?: (componentId: string, direction: "up" | "down") => void
  onDeleteComponent?: (componentId: string) => void
  onDuplicateComponent?: (componentId: string) => void
  onNavigateToScreen?: (screenId: string) => void
  onDeviceChange?: (device: UXDeviceType) => void
  onZoomChange?: (zoom: number) => void
  onAddComponentClick?: () => void
  targetLanguage?: string
}

export function ScreenCanvas({
  screen,
  deviceType = "desktop",
  selectedComponentId = null,
  zoom = 100,
  onSelectComponent,
  onUpdateScreen,
  onMoveComponent: propOnMoveComponent,
  onDeleteComponent: propOnDeleteComponent,
  onDuplicateComponent: propOnDuplicateComponent,
  onNavigateToScreen,
  onDeviceChange,
  onZoomChange,
  onAddComponentClick,
  targetLanguage = "English"
}: ScreenCanvasProps) {
  const [internalZoom, setInternalZoom] = useState<number>(zoom)
  const currentZoom = zoom || internalZoom
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const handleZoomIn = () => {
    const next = Math.min(150, currentZoom + 10)
    setInternalZoom(next)
    if (onZoomChange) onZoomChange(next)
  }

  const handleZoomOut = () => {
    const next = Math.max(50, currentZoom - 10)
    setInternalZoom(next)
    if (onZoomChange) onZoomChange(next)
  }

  const handleZoomReset = () => {
    setInternalZoom(100)
    if (onZoomChange) onZoomChange(100)
  }

  // Move component
  const handleMove = (componentId: string, direction: "up" | "down") => {
    if (propOnMoveComponent) {
      propOnMoveComponent(componentId, direction)
      return
    }
    if (onUpdateScreen) {
      const idx = screen.components.findIndex((c) => c.id === componentId)
      if (idx === -1) return
      const targetIdx = direction === "up" ? idx - 1 : idx + 1
      if (targetIdx < 0 || targetIdx >= screen.components.length) return
      const newCmps = [...screen.components]
      const temp = newCmps[idx]
      newCmps[idx] = newCmps[targetIdx]
      newCmps[targetIdx] = temp
      onUpdateScreen({ ...screen, components: newCmps })
    }
  }

  // Duplicate component
  const handleDuplicate = (componentId: string) => {
    if (propOnDuplicateComponent) {
      propOnDuplicateComponent(componentId)
      return
    }
    if (onUpdateScreen) {
      const target = screen.components.find((c) => c.id === componentId)
      if (!target) return
      const newId = `cmp-${Date.now()}`
      const duplicated: UXComponent = {
        ...target,
        id: newId,
        label: `${target.label} (Copy)`
      }
      onUpdateScreen({
        ...screen,
        components: [...screen.components, duplicated]
      })
      onSelectComponent(newId)
    }
  }

  // Delete component
  const handleDelete = (componentId: string) => {
    if (propOnDeleteComponent) {
      propOnDeleteComponent(componentId)
      return
    }
    if (onUpdateScreen) {
      onUpdateScreen({
        ...screen,
        components: screen.components.filter((c) => c.id !== componentId)
      })
    }
  }

  // Device framing class
  const getDeviceWidth = () => {
    switch (deviceType) {
      case "mobile":
        return "max-w-[390px]"
      case "tablet":
        return "max-w-[768px]"
      default:
        return "max-w-[1080px]"
    }
  }

  // Component Renderer
  const renderComponentItem = (cmp: UXComponent, idx: number) => {
    const isSelected = selectedComponentId === cmp.id

    const getWidthClass = (w?: string) => {
      if (deviceType === "mobile") return "w-full"
      switch (w) {
        case "1/2":
          return "w-full sm:w-[calc(50%-6px)]"
        case "1/3":
          return "w-full sm:w-[calc(33.333%-8px)]"
        case "2/3":
          return "w-full sm:w-[calc(66.666%-6px)]"
        case "1/4":
          return "w-full sm:w-[calc(25%-9px)]"
        case "auto":
          return "w-auto"
        default:
          return "w-full"
      }
    }

    return (
      <div
        key={cmp.id}
        onClick={(e) => {
          e.stopPropagation()
          onSelectComponent(cmp.id)
        }}
        className={`group relative rounded-xl border transition-all cursor-pointer ${getWidthClass(
          cmp.width
        )} ${
          isSelected
            ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/40 shadow-sm"
            : "border-slate-800 bg-slate-900 hover:border-indigo-500/40 hover:shadow-xs"
        }`}
      >
        {/* Hover Quick Action Toolbar */}
        <div
          className={`absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-lg bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-white shadow-md transition-opacity ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="text-[9px] font-mono text-indigo-400 mr-1 uppercase">
            {cmp.type}
          </span>
          <button
            title="Move Up"
            disabled={idx === 0}
            onClick={(e) => {
              e.stopPropagation()
              handleMove(cmp.id, "up")
            }}
            className="p-0.5 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            title="Move Down"
            disabled={idx === (screen?.components?.length || 0) - 1}
            onClick={(e) => {
              e.stopPropagation()
              handleMove(cmp.id, "down")
            }}
            className="p-0.5 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation()
              handleDuplicate(cmp.id)
            }}
            className="p-0.5 hover:text-emerald-400 cursor-pointer"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(cmp.id)
            }}
            className="p-0.5 hover:text-rose-400 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Action Link Indicator */}
        {cmp.action?.targetScreenId && (
          <div className="absolute -bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.2 text-[9px] font-bold text-white shadow-xs">
            <LinkIcon className="h-2.5 w-2.5" />
            <span>→ {cmp.action.targetScreenId}</span>
          </div>
        )}

        {/* Component Content Rendering */}
        <div className="p-3.5">
          {/* Heading */}
          {cmp.type === "heading" && (
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100">{cmp.label}</h3>
              {cmp.content && <p className="text-xs text-slate-400">{cmp.content}</p>}
            </div>
          )}

          {/* Text */}
          {cmp.type === "text" && (
            <p className="text-xs text-slate-300 leading-relaxed">
              {cmp.label || cmp.content}
            </p>
          )}

          {/* Button */}
          {cmp.type === "button" && (
            <button
              type="button"
              onClick={(e) => {
                if (cmp.action?.targetScreenId && onNavigateToScreen) {
                  e.stopPropagation()
                  onNavigateToScreen(cmp.action.targetScreenId)
                }
              }}
              className={`w-full rounded-xl py-2 px-4 text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 ${
                cmp.variant === "primary"
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : cmp.variant === "success"
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : cmp.variant === "danger"
                  ? "bg-rose-600 text-white hover:bg-rose-500"
                  : cmp.variant === "outline"
                  ? "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <span>{cmp.label}</span>
              {cmp.action?.targetScreenId && <span className="text-[10px]">→</span>}
            </button>
          )}

          {/* Input & Search */}
          {(cmp.type === "input" || cmp.type === "search") && (
            <div className="space-y-1">
              {cmp.label && (
                <label className="block text-[11px] font-bold text-slate-300">
                  {cmp.label}{" "}
                  {cmp.properties?.required && <span className="text-rose-400">*</span>}
                </label>
              )}
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                {cmp.type === "search" && (
                  <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                )}
                <span className="truncate">{cmp.placeholder || "Enter value..."}</span>
              </div>
            </div>
          )}

          {/* Textarea */}
          {cmp.type === "textarea" && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                {cmp.label}
              </label>
              <div className="h-16 rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-xs text-slate-500">
                {cmp.placeholder || "Enter long description..."}
              </div>
            </div>
          )}

          {/* Select */}
          {cmp.type === "select" && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                {cmp.label}
              </label>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                <span>{cmp.placeholder || "Select option..."}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          )}

          {/* Card */}
          {cmp.type === "card" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{cmp.label}</span>
                {cmp.properties?.badge && (
                  <span className="rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 text-[9px] font-bold">
                    {cmp.properties.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cmp.content || "Interactive card container with structured content."}
              </p>
            </div>
          )}

          {/* Stat Card */}
          {cmp.type === "stat_card" && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {cmp.label}
                </p>
                <p className="text-xl font-black text-slate-100 mt-0.5">
                  {cmp.properties?.statValue || "$12,450"}
                </p>
              </div>
              {cmp.properties?.statChange && (
                <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  {cmp.properties.statChange}
                </span>
              )}
            </div>
          )}

          {/* Table */}
          {cmp.type === "table" && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200">{cmp.label}</span>
              <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60">
                <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900 p-2 text-[10px] font-bold uppercase text-slate-400">
                  {(cmp.properties?.columns || ["Col 1", "Col 2", "Col 3", "Action"]).map(
                    (col: string, cIdx: number) => (
                      <span key={cIdx}>{col}</span>
                    )
                  )}
                </div>
                {(cmp.properties?.dataRows || [["Data A", "Data B", "Active", "View"]]).map(
                  (row: string[], rIdx: number) => (
                    <div
                      key={rIdx}
                      className="grid grid-cols-4 p-2 text-xs text-slate-300 border-b border-slate-800/60 last:border-0"
                    >
                      {row.map((cell: string, cellIdx: number) => (
                        <span key={cellIdx} className="truncate">
                          {cell}
                        </span>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Alert */}
          {cmp.type === "alert" && (
            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 p-2.5 rounded-lg">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>{cmp.label || cmp.content || "Smart AI Recommendation"}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Canvas Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-800 p-1 border border-slate-700">
          <button
            onClick={() => onDeviceChange && onDeviceChange("desktop")}
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              deviceType === "desktop"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Desktop View (1200px)"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[10px]">Desktop</span>
          </button>
          <button
            onClick={() => onDeviceChange && onDeviceChange("tablet")}
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              deviceType === "tablet"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[10px]">Tablet</span>
          </button>
          <button
            onClick={() => onDeviceChange && onDeviceChange("mobile")}
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              deviceType === "mobile"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[10px]">Mobile</span>
          </button>
        </div>

        {/* Zoom & Add Actions */}
        <div className="flex items-center gap-2">
          {onAddComponentClick && (
            <button
              onClick={onAddComponentClick}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span
              onClick={handleZoomReset}
              className="px-1.5 text-[10px] font-mono text-slate-300 cursor-pointer select-none"
              title="Reset Zoom (100%)"
            >
              {currentZoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        onClick={() => onSelectComponent("")}
        className="flex-1 overflow-auto bg-slate-950 p-6 flex justify-center items-start"
      >
        <div
          style={{
            transform: `scale(${currentZoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out"
          }}
          className={`w-full ${getDeviceWidth()} rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden`}
        >
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2.5">
            <div className="flex items-center gap-2 text-slate-500">
              <ArrowLeft className="h-3.5 w-3.5" />
              <ArrowRight className="h-3.5 w-3.5" />
              <RotateCw className="h-3 w-3" />
              <Home className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 max-w-sm mx-3 flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-0.5 text-[10px] font-mono text-slate-400">
              https://app.preview{screen?.route || "/"}
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-500 font-medium">Ready</span>
            </div>
          </div>

          {/* Screen Canvas Body */}
          <div className="p-6 min-h-[500px]">
            {/* Screen Info */}
            <div className="mb-6 flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-100">
                  {screen?.name || "Untitled Screen"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {screen?.description || screen?.purpose || "Interactive UI page"}
                </p>
              </div>
              {screen?.isInitial && (
                <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-0.5 text-[10px] font-bold">
                  Initial Entry Point
                </span>
              )}
            </div>

            {/* Render Component Grid */}
            <div className="flex flex-wrap gap-3">
              {!screen?.components || screen.components.length === 0 ? (
                <div className="w-full rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  <p className="text-sm font-semibold">This screen is currently empty</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Select components from the left palette to construct this screen.
                  </p>
                </div>
              ) : (
                screen.components.map((cmp, idx) => renderComponentItem(cmp, idx))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
