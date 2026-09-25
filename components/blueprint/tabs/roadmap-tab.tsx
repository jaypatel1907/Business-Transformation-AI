"use client";
import { getTranslation } from "@/lib/i18n";
import {
  Route,
  Clock,
  Cloud,
  TriangleAlert,
  CheckCircle2,
  Calendar,
  Kanban,
  DollarSign,
  User,
  Code2,
  Bot,
  CheckSquare,
  Layers,
  Sparkles,
} from "lucide-react";

export function RoadmapTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the practical developer execution roadmap.
      </div>
    );
  }

  const timeline = data?.timeline || "6-8 Weeks";
  const finEst = data?.financial_estimation || {
    min_budget: "$18,000",
    max_budget: "$32,000",
    total_hours: "240 Hours",
    hourly_rate: "$75/hr",
  };

  // Use the AI generated rich sprints or the fallback
  const rawSprints = data?.roadmap_sprints || [
    {
      timeframe: "Week 1",
      phase: "Frontend UI & GitHub Setup",
      tech_stack: "React, Next.js, Tailwind CSS",
      ai_tools: "v0 by Vercel, Cursor IDE",
      owner: "Frontend Developer",
      tasks: "Initialize GitHub repository, build main user interfaces, create responsive layout components.",
    },
    {
      timeframe: "Week 2",
      phase: "Backend API & Database Schema",
      tech_stack: "Node.js, PostgreSQL, Supabase",
      ai_tools: "Cursor IDE, Gemini API",
      owner: "Backend Developer",
      tasks: "Provision PostgreSQL database, implement REST endpoints, configure authentication and RLS.",
    },
  ];

  const planning = data?.planning || {
    effortHours: "240",
    cloudCost: "$120/mo",
    cloudDetail: "PostgreSQL Database + Edge Compute",
    risk: {
      level: "Low-Medium",
      title: "API Concurrency & Scaling",
      mitigation: "Implement Redis caching and background worker queues.",
    },
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6">
      {/* Executive Sprint & Milestone Overview Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Kanban className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sprint Execution & Developer Deliverables</h3>
              <p className="text-xs text-slate-500">
                Actionable sprint backlog mapped to engineering roles and tech stack platform components.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
            {timeline} Execution Window
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Budget</span>
            <span className="font-extrabold text-slate-900">{finEst.min_budget} – {finEst.max_budget}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Sprint Cadence</span>
            <span className="font-extrabold text-indigo-700">{rawSprints.length} Scoped Sprints</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Cloud Run Rate</span>
            <span className="font-extrabold text-slate-900">{planning.cloudCost}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Risk Profile</span>
            <span className="font-extrabold text-amber-700">{planning.risk?.level || "Low-Medium"}</span>
          </div>
        </div>
      </div>

      {/* Sprints Detailed List */}
      <div className="space-y-4">
        {rawSprints.map((sprint: any, idx: number) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors"
          >
            {/* Left Accent Bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded tracking-wider uppercase border border-indigo-100">
                  {sprint.timeframe || `Sprint ${idx + 1}`}
                </span>
                <h4 className="text-sm font-extrabold text-slate-800 mt-2">
                  {sprint.phase || sprint.focus || sprint.title || "Project Sprint Phase"}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                <User className="w-3 h-3 text-slate-400" /> {sprint.owner || "Engineering Lead"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-500" /> Languages & Tech
                </div>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(sprint.tech_stack)
                    ? sprint.tech_stack
                    : (sprint.tech_stack || "Next.js").split(",")
                  ).map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-sky-500" /> Platform & Deployment
                </div>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(sprint.platform)
                    ? sprint.platform
                    : (sprint.platform || "Vercel Edge").split(",")
                  ).map((plat: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded"
                    >
                      {plat.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-purple-500" /> AI Accelerators
                </div>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(sprint.ai_tools)
                    ? sprint.ai_tools
                    : (sprint.ai_tools || "Cursor, Gemini").split(",")
                  ).map((tool: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded"
                    >
                      {tool.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                Sprint Action Items & Deliverables
              </div>
              <div className="space-y-1.5">
                {Array.isArray(sprint.tasks) ? (
                  sprint.tasks.map((task: string, tIdx: number) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckSquare className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                      <span className="font-medium leading-relaxed">{task}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckSquare className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium leading-relaxed">
                      {sprint.tasks || sprint.deliverable || sprint.focus || "Implement core sprint features"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
