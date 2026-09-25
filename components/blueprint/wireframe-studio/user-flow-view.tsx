"use client"

import { UXBlueprint, UXScreen, UXNavigation } from "@/lib/ux-wireframe-types"
import { ArrowRight, Compass, Link2, Plus, Sparkles, Layers } from "lucide-react"

interface UserFlowViewProps {
  blueprint: UXBlueprint
  onSelectScreen: (screenId: string) => void
  onAddNavigation: (sourceId: string, targetId: string, label: string) => void
  targetLanguage?: string
}

export function UserFlowView({
  blueprint,
  onSelectScreen,
  onAddNavigation,
  targetLanguage = "English"
}: UserFlowViewProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/70 space-y-6 thin-scrollbar">
      {/* Header */}
      <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {isGuj ? "યુઝર ફ્લો અને સ્ક્રીન નેવિગેશન મેપ" : "Interactive Screen Navigation & User Flow"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isGuj
              ? "તમામ સ્ક્રીનો વચ્ચેના નેવિગેશન ટ્રાન્ઝિશન અને એક્શન કનેક્શન જુઓ"
              : "Visual mapping of interactive routes, screen transitions, and action triggers across the platform"}
          </p>
        </div>

        <span className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
          {blueprint.navigation.length} {isGuj ? "નેવિગેશન લિંક્સ" : "Active Flow Paths"}
        </span>
      </div>

      {/* Screen Cards with Outgoing Transitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blueprint.screens.map((screen, sIdx) => {
          const outgoingNavs = blueprint.navigation.filter((n) => n.sourceScreenId === screen.id)
          const incomingNavs = blueprint.navigation.filter((n) => n.targetScreenId === screen.id)

          return (
            <div
              key={screen.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 transition space-y-4"
            >
              {/* Screen Top Title */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">
                    {sIdx + 1}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">{screen.name}</h4>
                </div>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  {screen.route}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2">{screen.purpose || screen.description}</p>

              {/* Components preview count */}
              <div className="text-[10px] text-slate-400 font-medium">
                Contains {screen.components.length} components ({screen.components.filter((c) => c.type === "button").length} action buttons)
              </div>

              {/* Outgoing Transitions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  {isGuj ? "આગળની નેવિગેશન દિશાઓ:" : "Outgoing Screen Transitions:"}
                </p>

                {outgoingNavs.length === 0 ? (
                  <p className="text-[10px] italic text-amber-600">
                    {isGuj ? "કોઈ આગળની લિંક નથી (ટર્મિનલ સ્ક્રીન)" : "No outgoing links (Terminal Screen)"}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {outgoingNavs.map((nav) => {
                      const targetScreen = blueprint.screens.find((s) => s.id === nav.targetScreenId)

                      return (
                        <div
                          key={nav.id}
                          className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-xs border border-slate-200"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <ArrowRight className="h-3 w-3 text-indigo-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">
                              {targetScreen?.name || nav.targetScreenId}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">
                            {nav.trigger}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Inspect Button */}
              <button
                onClick={() => onSelectScreen(screen.id)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-center text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition cursor-pointer"
              >
                {isGuj ? "કેનવાસ પર એડિટ કરો →" : "Edit on Visual Canvas →"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
