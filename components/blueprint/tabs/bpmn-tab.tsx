"use client"

import { GitCommitHorizontal, CheckCircle2, ArrowRight } from "lucide-react"

export function BpmnTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the visual process workflow.
      </div>
    )
  }

  const steps = data?.bpmn_steps || [
    { id: 1, title: "Requirement Intake", desc: "User triggers process via app interface" },
    { id: 2, title: "AI Rule Verification", desc: "Checks business logic & automated constraints" },
    { id: 3, title: "Core Processing", desc: "System processes and allocates required resources" },
    { id: 4, title: "Completion & Logs", desc: "Notification sent and DB logged for audit trail" }
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitCommitHorizontal className="h-4 w-4 text-indigo-600" />
            Visual Process Intelligence Workflow (BPMN 2.0)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">End-to-end automated orchestration pipeline tailored to your problem statement</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
          AI Verified Flow
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step: any, idx: number) => (
          <div key={step.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 relative flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="h-7 w-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-300 rounded-full p-1 text-indigo-600 shadow-2xs">
                <ArrowRight className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}