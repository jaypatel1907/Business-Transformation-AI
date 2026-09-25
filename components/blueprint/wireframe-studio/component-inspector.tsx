"use client"

import { UXComponent, UXScreen } from "@/lib/ux-wireframe-types"
import {
  Sliders,
  Trash2,
  Copy,
  Link,
  Tag,
  Type,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  Info
} from "lucide-react"

interface ComponentInspectorProps {
  selectedComponent: UXComponent | null
  screens: UXScreen[]
  onUpdateComponent: (updated: UXComponent) => void
  onDeleteComponent: (componentId: string) => void
  onDuplicateComponent: (componentId: string) => void
  targetLanguage?: string
}

export function ComponentInspector({
  selectedComponent,
  screens,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  targetLanguage = "English"
}: ComponentInspectorProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  if (!selectedComponent) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400 bg-white border-l border-slate-200 space-y-2">
        <Sliders className="h-8 w-8 text-slate-300" />
        <p className="text-xs font-bold text-slate-600">
          {isGuj ? "કોઈ કમ્પોનન્ટ પસંદ કરેલ નથી" : "No Component Selected"}
        </p>
        <p className="text-[11px] text-slate-400 max-w-[200px]">
          {isGuj
            ? "પ્રોપર્ટીઝ અને નેવિગેશન એક્શન બદલવા માટે કેનવાસ પરના કોઈપણ ઘટક પર ક્લિક કરો."
            : "Click any component on the visual canvas to inspect and modify properties, actions, and layouts."}
        </p>
      </div>
    )
  }

  const handleChange = (field: keyof UXComponent, value: any) => {
    onUpdateComponent({ ...selectedComponent, [field]: value })
  }

  const handlePropertyChange = (propKey: string, value: any) => {
    onUpdateComponent({
      ...selectedComponent,
      properties: {
        ...(selectedComponent.properties || {}),
        [propKey]: value
      }
    })
  }

  const handleActionChange = (actionField: string, value: any) => {
    onUpdateComponent({
      ...selectedComponent,
      action: {
        type: selectedComponent.action?.type || "navigate",
        label: selectedComponent.action?.label || `Proceed to ${value}`,
        ...(selectedComponent.action || {}),
        [actionField]: value
      }
    })
  }

  return (
    <div className="flex h-full flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
            {selectedComponent.type}
          </span>
          <h4 className="font-bold text-xs text-slate-800 truncate max-w-[140px]">
            {selectedComponent.label || "Component"}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateComponent(selectedComponent.id)}
            title="Duplicate Component"
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDeleteComponent(selectedComponent.id)}
            title="Delete Component"
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs thin-scrollbar">
        {/* Label */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Type className="h-3.5 w-3.5 text-indigo-600" />
            <span>{isGuj ? "કમ્પોનન્ટ લેબલ" : "Component Label / Title"}</span>
          </label>
          <input
            type="text"
            value={selectedComponent.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Content / Subtitle */}
        {selectedComponent.type !== "divider" && (
          <div>
            <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Info className="h-3.5 w-3.5 text-indigo-600" />
              <span>{isGuj ? "વિગતવાર વર્ણન / કન્ટેન્ટ" : "Content / Descriptive Text"}</span>
            </label>
            <textarea
              rows={2}
              value={selectedComponent.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Descriptive text..."
              className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        )}

        {/* Width Selector */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>{isGuj ? "કમ્પોનન્ટ સાઇઝ / પહોળાઈ" : "Grid Width / Span"}</span>
          </label>
          <div className="grid grid-cols-4 gap-1">
            {(["full", "2/3", "1/2", "1/3"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => handleChange("width", w)}
                className={`rounded-lg py-1 text-[10px] font-bold transition cursor-pointer ${
                  (selectedComponent.width || "full") === w
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {w.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Style Variant */}
        {["button", "card", "alert", "badge"].includes(selectedComponent.type) && (
          <div>
            <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Tag className="h-3.5 w-3.5 text-indigo-600" />
              <span>{isGuj ? "સ્ટાઈલ વેરિઅન્ટ" : "Visual Variant"}</span>
            </label>
            <select
              value={selectedComponent.variant || "primary"}
              onChange={(e) => handleChange("variant", e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="primary">Primary (Accent)</option>
              <option value="secondary">Secondary (Neutral)</option>
              <option value="outline">Outline Bordered</option>
              <option value="success">Success Emerald</option>
              <option value="danger">Danger Crimson</option>
              <option value="ghost">Ghost Minimal</option>
            </select>
          </div>
        )}

        {/* Action & Navigation Link Wiring */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 space-y-3">
          <div className="flex items-center gap-1.5">
            <Link className="h-4 w-4 text-indigo-600" />
            <h5 className="font-bold text-xs text-indigo-950">
              {isGuj ? "નેવિગેશન અને ઇન્ટરેક્શન એક્શન" : "Navigation & Interactive Action"}
            </h5>
          </div>

          <div>
            <label className="font-semibold text-slate-700 text-[11px] block mb-1">
              Action Trigger Type
            </label>
            <select
              value={selectedComponent.action?.type || "navigate"}
              onChange={(e) => handleActionChange("type", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
            >
              <option value="navigate">Navigate to Screen</option>
              <option value="submit">Form Submit & Proceed</option>
              <option value="open_modal">Open Dialog Modal</option>
              <option value="back">Go Back Previous</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 text-[11px] block mb-1">
              Target Destination Screen
            </label>
            <select
              value={selectedComponent.action?.targetScreenId || ""}
              onChange={(e) => handleActionChange("targetScreenId", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 font-medium"
            >
              <option value="">-- No Navigation (Static) --</option>
              {screens.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.route})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Placeholder specific */}
        {["input", "textarea", "search", "select"].includes(selectedComponent.type) && (
          <div>
            <label className="font-bold text-slate-700 block mb-1">Placeholder Text</label>
            <input
              type="text"
              value={selectedComponent.placeholder || ""}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
            />
          </div>
        )}
      </div>
    </div>
  )
}
