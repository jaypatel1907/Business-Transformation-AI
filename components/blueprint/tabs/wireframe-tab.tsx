"use client"

import { LayoutTemplate, Search, Bell, Layers, Monitor } from "lucide-react"

export function WireframeTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the low-fidelity UX Wireframe concept.
      </div>
    )
  }

  const title = data?.project_title || "Custom Enterprise Solution"
  const sections = data?.wireframe_sections || [
    { title: "Header & Navigation Bar", components: ["App Logo", "User Profile Avatar", "Notification Bell", "Global Search"] },
    { title: "Main Workspace Canvas", components: ["Requirement Input Box", "AI Status Badge", "Action Trigger Buttons"] },
    { title: "Analytics & Summary Drawer", components: ["Real-time Metrics Cards", "Activity Audit Stream", "Export Controls"] }
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-indigo-600" />
            AI Generated UX Wireframe
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Low-fidelity interactive layout concept for {title}</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 border border-cyan-200">
          Tailwind UI Mock
        </span>
      </div>

      {/* Browser Wireframe Frame */}
      <div className="rounded-xl border border-slate-300 bg-slate-100 overflow-hidden shadow-sm">
        {/* Top Browser Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 font-mono text-[11px] text-slate-600 bg-white px-3 py-0.5 rounded border border-slate-300">
              https://app.blueprint.internal/workspace
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Search className="h-3.5 w-3.5" />
            <Bell className="h-3.5 w-3.5" />
            <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
              AI
            </div>
          </div>
        </div>

        {/* Dynamic Wireframe Mockup Body */}
        <div className="p-5 bg-white space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((section: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-600" /> {section.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Module 0{idx + 1}</span>
                </div>
                <div className="space-y-2">
                  {section.components.map((comp: string, cIdx: number) => (
                    <div key={cIdx} className="rounded-lg border border-dashed border-slate-300 bg-white p-2.5 text-xs text-slate-700 font-medium flex items-center gap-2">
                      <Monitor className="h-3.5 w-3.5 text-slate-400" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}