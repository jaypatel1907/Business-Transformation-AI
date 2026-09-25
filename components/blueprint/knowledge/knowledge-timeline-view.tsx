"use client";

import { KnowledgeTimelineEvent } from "@/lib/knowledge-types";
import { History, Calendar, User, CheckCircle2, Flag, ArrowRight } from "lucide-react";

interface KnowledgeTimelineViewProps {
  timeline: KnowledgeTimelineEvent[];
}

export function KnowledgeTimelineView({ timeline }: KnowledgeTimelineViewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-600" />
          Transformation Lifecycle & Decision Chronology
        </h3>
        <p className="text-xs text-slate-500">
          Auditable timeline recording key project milestones, business analysis approvals, and architectural decisions.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timeline.map((event, idx) => (
          <div key={event.id} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white shadow-xs ${
                idx === timeline.length - 1
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
            </div>

            {/* Event Card */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-1.5 shadow-2xs hover:border-indigo-200 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {event.phase}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{event.date}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" />
                  Recorded by: <strong>{event.author}</strong>
                </span>
                <span className="text-[10px] text-slate-400">Milestone Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
