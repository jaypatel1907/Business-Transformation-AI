"use client";

import { useState, useMemo } from "react";
import { DecisionLogItem, DecisionStatus } from "@/lib/knowledge-types";
import {
  FileCheck2,
  User,
  Calendar,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
} from "lucide-react";

interface DecisionLogTableProps {
  decisions: DecisionLogItem[];
  onAddDecision?: (newDecision: DecisionLogItem) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  architecture: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ux: "bg-pink-50 text-pink-700 border-pink-200",
  process: "bg-purple-50 text-purple-700 border-purple-200",
  financial: "bg-emerald-50 text-emerald-700 border-emerald-200",
  scope: "bg-amber-50 text-amber-700 border-amber-200",
  governance: "bg-slate-100 text-slate-800 border-slate-200",
};

export function DecisionLogTable({ decisions }: DecisionLogTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDecisions = useMemo(() => {
    return decisions.filter((d) => {
      const matchQuery =
        d.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.impact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === "all" || d.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [decisions, searchQuery, selectedCategory]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-indigo-600" />
            Project Decision Log & Architectural Rationale
          </h3>
          <p className="text-xs text-slate-500">
            Immutable record of architectural choices, governance approvals, technology adoptions, and trade-off considerations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search decisions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 w-44 sm:w-52"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="architecture">Architecture</option>
            <option value="ux">UX & Design</option>
            <option value="process">Process</option>
            <option value="financial">Financial</option>
          </select>
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-3">
        {filteredDecisions.map((dec) => {
          const catClass = CATEGORY_COLORS[dec.category] || "bg-slate-100 text-slate-700";

          return (
            <div
              key={dec.id}
              className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-2xs hover:border-indigo-200 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${catClass}`}>
                      {dec.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{dec.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{dec.decision}</h4>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {dec.status.toUpperCase()}
                </span>
              </div>

              {/* Rationale & Business Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Underlying Rationale</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{dec.reason}</p>
                </div>

                <div className="rounded-lg bg-indigo-50/40 p-2.5 border border-indigo-100/60">
                  <span className="font-bold text-indigo-900 block text-[11px] mb-0.5">Business & Technical Impact</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{dec.impact}</p>
                </div>
              </div>

              {/* Footer: Owner and Alternatives */}
              <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 gap-2">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <User className="h-3 w-3 text-slate-400" />
                  Decision Owner: <strong>{dec.owner}</strong>
                </span>

                {dec.alternativesConsidered && dec.alternativesConsidered.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Alternatives:</span>
                    {dec.alternativesConsidered.map((alt, i) => (
                      <span key={i} className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                        {alt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
