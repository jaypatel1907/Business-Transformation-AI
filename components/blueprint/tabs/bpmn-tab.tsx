"use client";
import { getTranslation } from "@/lib/i18n"
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
    { id: 1, title: "Step 1: Design & Homepage", desc: "First, we will design a beautiful and attractive homepage for your users." },
    { id: 2, title: "Step 2: Features & Catalog", desc: "Next, we will add the core features and product catalog so users can interact." },
    { id: 3, title: "Step 3: Database Setup", desc: "Then, we will set up the backend database to save all user data securely." },
    { id: 4, title: "Step 4: Testing & Launch", desc: "Finally, we will test everything and launch the website live on the internet!" }
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          Step-by-Step Project Guide
        </h2>
        <p className="text-sm text-slate-600">
          This is your complete, easy-to-understand action plan. Follow these exact steps to build your project from start to finish.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step: any, idx: number) => (
          <div key={step.id || idx} className="flex flex-col md:flex-row gap-5 p-6 rounded-2xl bg-[#f8f9fa] border border-slate-200 transition-all hover:border-emerald-300 hover:shadow-md">
            
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-extrabold border-2 border-emerald-200">
                {idx + 1}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{step.desc}</p>
              
              {step.phase && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-white text-slate-600 border border-slate-200 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    Phase: {step.phase}
                  </span>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}


