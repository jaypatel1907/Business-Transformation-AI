"use client";

import { Milestone } from "@/lib/planning-types";
import { Calendar, CheckCircle2, Clock, Flag, ArrowRight, ShieldCheck } from "lucide-react";

interface TimelineGanttProps {
  milestones: Milestone[];
  totalWeeks: number;
}

export function TimelineGantt({ milestones, totalWeeks }: TimelineGanttProps) {
  const weeksArray = Array.from({ length: Math.max(totalWeeks, 6) }, (_, i) => i + 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Milestone Timeline & Implementation Gantt Chart
          </h3>
          <p className="text-xs text-slate-500">
            Phased delivery roadmap spanning {totalWeeks} weeks with sequential dependencies and critical path highlighted.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-indigo-700">
            <span className="h-3 w-3 rounded-sm bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-2xs" />
            Critical Path
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="h-3 w-3 rounded-sm bg-slate-200" />
            Supporting Workstream
          </span>
        </div>
      </div>

      {/* Gantt Visual Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[720px] space-y-3">
          {/* Week column headers */}
          <div className="grid grid-cols-12 gap-1 border-b border-slate-200 pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-4 text-left pl-2">Phase & Milestone Deliverable</div>
            <div className="col-span-8 grid" style={{ gridTemplateColumns: `repeat(${weeksArray.length}, minmax(0, 1fr))` }}>
              {weeksArray.map((w) => (
                <div key={w} className="border-l border-slate-200/60 py-0.5">
                  Wk {w}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones rows */}
          <div className="space-y-2.5">
            {milestones.map((ms, index) => {
              const startPercent = (ms.offsetWeeks / weeksArray.length) * 100;
              const widthPercent = (ms.durationWeeks / weeksArray.length) * 100;

              return (
                <div
                  key={ms.id}
                  className="grid grid-cols-12 gap-1 items-center rounded-xl p-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition"
                >
                  {/* Left: Milestone Info */}
                  <div className="col-span-4 pr-3">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      {ms.criticalPath && (
                        <Flag className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                      )}
                      <span className="truncate">{ms.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{ms.description}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {ms.durationWeeks} {ms.durationWeeks === 1 ? "Week" : "Weeks"}
                      </span>
                      {ms.deliverables.slice(0, 1).map((del, dIdx) => (
                        <span key={dIdx} className="text-[9px] text-slate-400 truncate max-w-[140px]">
                          • {del}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Gantt Bar Track */}
                  <div
                    className="col-span-8 relative h-8 rounded-lg bg-slate-100/60 flex items-center px-1 overflow-hidden"
                  >
                    {/* Vertical week grid lines */}
                    <div
                      className="absolute inset-0 grid pointer-events-none"
                      style={{ gridTemplateColumns: `repeat(${weeksArray.length}, minmax(0, 1fr))` }}
                    >
                      {weeksArray.map((w) => (
                        <div key={w} className="border-r border-slate-200/50 h-full" />
                      ))}
                    </div>

                    {/* Milestone Bar */}
                    <div
                      style={{
                        marginLeft: `${startPercent}%`,
                        width: `${Math.max(widthPercent, 8)}%`,
                      }}
                      className={`relative z-10 h-6 rounded-md shadow-2xs flex items-center justify-between px-2 text-[10px] font-bold text-white transition-all hover:scale-y-105 ${
                        ms.criticalPath
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 ring-1 ring-indigo-400/40"
                          : "bg-slate-600"
                      }`}
                    >
                      <span className="truncate">{ms.phase.replace(/Phase \d+: /, "")}</span>
                      <span className="text-[9px] font-normal opacity-90 hidden sm:inline">
                        W{ms.offsetWeeks + 1}–W{ms.offsetWeeks + ms.durationWeeks}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deliverable Milestones Checkpoints Footer */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-2 text-xs">
        <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          Key Stage-Gate Acceptance Criteria
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
          <div className="p-2 rounded-lg bg-white border border-indigo-100/60">
            <strong className="text-indigo-900 block">Gate 1: Architecture Lock</strong>
            Zero schema drift; API endpoints and data entities validated with stakeholder sign-off.
          </div>
          <div className="p-2 rounded-lg bg-white border border-indigo-100/60">
            <strong className="text-indigo-900 block">Gate 2: Core Feature Freeze</strong>
            All frontend wireframes and backend workflows fully integrated and test-ready.
          </div>
          <div className="p-2 rounded-lg bg-white border border-indigo-100/60">
            <strong className="text-indigo-900 block">Gate 3: Production Readiness</strong>
            Automated test suite passing at 95%+ coverage with zero critical security vulnerabilities.
          </div>
        </div>
      </div>
    </div>
  );
}
