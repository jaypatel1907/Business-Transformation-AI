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
  Plus
} from "lucide-react"

interface ScreenCanvasProps {
  screen: UXScreen
  deviceType: UXDeviceType
  selectedComponentId: string | null
  onSelectComponent: (componentId: string) => void
  onMoveComponent: (componentId: string, direction: "up" | "down") => void
  onDeleteComponent: (componentId: string) => void
  onDuplicateComponent: (componentId: string) => void
  onNavigateToScreen?: (screenId: string) => void
  targetLanguage?: string
}

export function ScreenCanvas({
  screen,
  deviceType,
  selectedComponentId,
  onSelectComponent,
  onMoveComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onNavigateToScreen,
  targetLanguage = "English"
}: ScreenCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  // Width constraint according to device mode
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

  // Component Renderer Engine
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
            ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/40 shadow-sm"
            : "border-slate-300/80 bg-white hover:border-indigo-300 hover:shadow-xs"
        }`}
      >
        {/* Hover Quick Action Toolbar */}
        <div
          className={`absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-lg bg-slate-900 px-1.5 py-0.5 text-white shadow-md transition-opacity ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="text-[9px] font-mono text-indigo-300 mr-1 uppercase">{cmp.type}</span>
          <button
            title="Move Up"
            disabled={idx === 0}
            onClick={(e) => {
              e.stopPropagation()
              onMoveComponent(cmp.id, "up")
            }}
            className="p-0.5 hover:text-indigo-300 disabled:opacity-30 cursor-pointer"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            title="Move Down"
            disabled={idx === screen.components.length - 1}
            onClick={(e) => {
              e.stopPropagation()
              onMoveComponent(cmp.id, "down")
            }}
            className="p-0.5 hover:text-indigo-300 disabled:opacity-30 cursor-pointer"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicateComponent(cmp.id)
            }}
            className="p-0.5 hover:text-emerald-400 cursor-pointer"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteComponent(cmp.id)
            }}
            className="p-0.5 hover:text-rose-400 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Action Link Indicator */}
        {cmp.action?.targetScreenId && (
          <div className="absolute -bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.2 text-[9px] font-bold text-white shadow-2xs">
            <LinkIcon className="h-2.5 w-2.5" />
            <span>→ {cmp.action.targetScreenId}</span>
          </div>
        )}

        {/* Component Visual Renderer */}
        <div className="p-3">
          {/* 1. Heading */}
          {cmp.type === "heading" && (
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{cmp.label}</h3>
              {cmp.content && <p className="text-xs text-slate-500">{cmp.content}</p>}
            </div>
          )}

          {/* 2. Text */}
          {cmp.type === "text" && (
            <p className="text-xs text-slate-700 leading-relaxed">{cmp.label || cmp.content}</p>
          )}

          {/* 3. Button */}
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
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : cmp.variant === "success"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : cmp.variant === "danger"
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : cmp.variant === "outline"
                  ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              <span>{cmp.label}</span>
              {cmp.action?.targetScreenId && <span className="text-[10px]">→</span>}
            </button>
          )}

          {/* 4. Input & Search */}
          {(cmp.type === "input" || cmp.type === "search") && (
            <div className="space-y-1">
              {cmp.label && (
                <label className="block text-[11px] font-bold text-slate-700">
                  {cmp.label} {cmp.properties?.required && <span className="text-rose-500">*</span>}
                </label>
              )}
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-500">
                {cmp.type === "search" && <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                <span className="truncate">{cmp.placeholder || "Enter value..."}</span>
              </div>
            </div>
          )}

          {/* 5. Textarea */}
          {cmp.type === "textarea" && (
            <div className="space-y-1">
              {cmp.label && <label className="block text-[11px] font-bold text-slate-700">{cmp.label}</label>}
              <div className="h-16 rounded-xl border border-slate-300 bg-slate-50/50 p-2 text-xs text-slate-400">
                {cmp.placeholder || "Type multiline text..."}
              </div>
            </div>
          )}

          {/* 6. Select */}
          {cmp.type === "select" && (
            <div className="space-y-1">
              {cmp.label && <label className="block text-[11px] font-bold text-slate-700">{cmp.label}</label>}
              <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 font-medium">
                <span>{cmp.properties?.options?.[0] || cmp.placeholder || "Select option"}</span>
                <span className="text-slate-400">▼</span>
              </div>
            </div>
          )}

          {/* 7. Card */}
          {cmp.type === "card" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">{cmp.label}</h4>
                {cmp.properties?.badge && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">
                    {cmp.properties.badge}
                  </span>
                )}
              </div>
              {cmp.content && <p className="text-xs text-slate-600 leading-relaxed">{cmp.content}</p>}
              {cmp.properties?.total && (
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-xs text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-600">{cmp.properties.total}</span>
                </div>
              )}
            </div>
          )}

          {/* 8. Stat Card */}
          {cmp.type === "stat_card" && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">{cmp.label}</p>
              <p className="text-xl font-black text-slate-900">{cmp.properties?.statValue || "$24,800"}</p>
              {cmp.properties?.statChange && (
                <p className="text-[10px] font-semibold text-emerald-600">{cmp.properties.statChange}</p>
              )}
            </div>
          )}

          {/* 9. Navbar */}
          {cmp.type === "navbar" && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  B
                </div>
                <span className="font-extrabold text-xs text-slate-900">
                  {cmp.properties?.brandName || cmp.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600">
                {(cmp.properties?.menuItems || ["Home", "Features", "Pricing"]).map((m: string, mIdx: number) => (
                  <span key={mIdx} className="hover:text-indigo-600">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 10. Tabs */}
          {cmp.type === "tabs" && (
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 overflow-x-auto">
              {(cmp.properties?.items || ["All", "Active", "Archived"]).map((t: string, tIdx: number) => (
                <span
                  key={tIdx}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                    tIdx === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* 11. Table */}
          {cmp.type === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase">
                    {(cmp.properties?.columns || ["ID", "Name", "Status"]).map((col: string, cIdx: number) => (
                      <th key={cIdx} className="py-1 px-2 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(cmp.properties?.dataRows || [["#01", "Item A", "Active"], ["#02", "Item B", "Pending"]]).map(
                    (row: string[], rIdx: number) => (
                      <tr key={rIdx} className="border-b border-slate-100">
                        {row.map((cell: string, cellIdx: number) => (
                          <td key={cellIdx} className="py-1.5 px-2 text-slate-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 12. Alert */}
          {cmp.type === "alert" && (
            <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-2 text-xs text-emerald-900 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[11px]">{cmp.label}</p>
                {cmp.content && <p className="text-[10px] text-emerald-700">{cmp.content}</p>}
              </div>
            </div>
          )}

          {/* 13. Divider */}
          {cmp.type === "divider" && <div className="h-[1px] w-full bg-slate-200 my-1" />}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-slate-100/70 overflow-hidden">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">{screen.name}</span>
          <span className="font-mono text-slate-400 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
            {screen.route}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[10px] text-slate-500 w-10 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Viewport Area */}
      <div
        onClick={() => onSelectComponent("")}
        className="flex-1 overflow-auto p-6 flex justify-center items-start thin-scrollbar"
      >
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          className={`w-full ${getDeviceWidth()} transition-all duration-200 rounded-2xl border border-slate-400 bg-white shadow-xl overflow-hidden`}
        >
          {/* Browser Chrome Header */}
          <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <div className="flex gap-2 text-slate-400 ml-2">
                <ArrowLeft className="h-3.5 w-3.5" />
                <ArrowRight className="h-3.5 w-3.5" />
                <RotateCw className="h-3 w-3" />
              </div>
            </div>

            <div className="flex-1 max-w-md mx-3 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span className="truncate">https://app.enterprise{screen.route}</span>
              <span className="text-[9px] text-emerald-400 font-bold">SSL 🔒</span>
            </div>

            <span className="text-[10px] font-bold text-slate-400 uppercase">{deviceType}</span>
          </div>

          {/* Wireframe Canvas Container */}
          <div className="p-6 bg-slate-50/50 min-h-[520px]">
            {screen.components.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                <p className="font-bold text-xs text-slate-600">
                  {isGuj ? "આ સ્ક્રીન ખાલી છે" : "This Screen is Empty"}
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  {isGuj
                    ? "ડાબી બાજુની UI કમ્પોનન્ટ લાઈબ્રેરીમાંથી ઘટકો ઉમેરો."
                    : "Add components from the left component palette to build the wireframe interface."}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 items-start">
                {screen.components.map((cmp, idx) => renderComponentItem(cmp, idx))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
