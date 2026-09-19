"use client"

import { useState } from "react"
import { Workflow, ChevronRight, Sparkles, ShoppingCart, ShieldCheck, MapPin, PackageCheck, type LucideIcon } from "lucide-react"
import { Panel, EmptyState } from "@/components/blueprint/primitives"
import { Modal } from "@/components/blueprint/modal"
import { processNodes, type FlowNode } from "@/lib/blueprint-data"

const nodeIcons: Record<string, LucideIcon> = {
  received: ShoppingCart,
  validation: ShieldCheck,
  matched: MapPin,
  delivered: PackageCheck,
}

export function ProcessMapTab({ generated }: { generated: boolean }) {
  const [active, setActive] = useState<FlowNode | null>(null)

  if (!generated) {
    return (
      <Panel title="Workflow (BPMN)" subtitle="Process Intelligence Designer" icon={Workflow} badge="BPMN 2.0">
        <EmptyState icon={Workflow} message="Input requirements to generate the delivery workflow." />
      </Panel>
    )
  }

  return (
    <>
      <Panel
        title="Workflow (BPMN)"
        subtitle="Process Intelligence Designer · click a step to refine"
        icon={Workflow}
        badge="BPMN 2.0"
      >
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          {processNodes.map((node, i) => {
            const Icon = nodeIcons[node.id] ?? Workflow
            return (
              <div key={node.id} className="flex flex-col items-center gap-4 lg:flex-1 lg:flex-row">
                <button
                  onClick={() => setActive(node)}
                  className={`bp-fade-up flex w-full flex-col items-center gap-2 rounded-xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                    node.accent
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-indigo-200"
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      node.accent ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-semibold text-slate-900">{node.title}</span>
                  <span className="text-[10px] text-slate-400">{node.subtitle}</span>
                </button>
                {i < processNodes.length - 1 ? (
                  <ChevronRight className="hidden h-4 w-4 flex-shrink-0 text-slate-300 lg:block" />
                ) : null}
              </div>
            )
          })}
        </div>

        <p className="mt-5 text-[11px] text-slate-400">Click any step to refine it with an AI prompt.</p>
      </Panel>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? `${active.step}. ${active.title}` : ""}
        subtitle="Refine this workflow step"
      >
        {active ? (
          <div className="space-y-4">
            <p className="text-[13px] leading-relaxed text-slate-600">{active.detail}</p>
            <label className="block text-[11px] font-medium text-slate-500">Refine with AI</label>
            <textarea
              rows={3}
              placeholder={`e.g. "Add SLA timers and escalation for ${active.title}"`}
              className="thin-scrollbar w-full rounded-lg border border-slate-200 bg-white p-3 text-[13px] text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActive(null)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setActive(null)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
              >
                <Sparkles className="h-3.5 w-3.5" /> Regenerate Step
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
