"use client";

import { useState, useMemo } from "react";
import { ProjectRisk, RiskCategory, RiskSeverity } from "@/lib/planning-types";
import { ShieldAlert, AlertTriangle, CheckCircle2, User, Search, Filter } from "lucide-react";

interface RiskRegisterPanelProps {
  risks: ProjectRisk[];
}

const CATEGORY_LABELS: Record<RiskCategory, string> = {
  technical: "Technical Architecture",
  financial: "Financial & Budget",
  operational: "Operations & Adoption",
  security: "Security & Governance",
  data: "Data Quality & Migration",
  ai: "AI & Model Quality",
  integration: "Third-Party Integration",
  resource: "Human Resources",
  schedule: "Timeline & Scope",
};

export function RiskRegisterPanel({ risks }: RiskRegisterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      const matchQuery =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mitigation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === "all" || r.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [risks, searchQuery, selectedCategory]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            Project Risk Register & Proactive Mitigation Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Identified implementation hazards across technical, security, AI model quality, and change management tracks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search risks, owners..."
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
            <option value="all">All Risk Categories</option>
            <option value="schedule">Schedule & Scope</option>
            <option value="technical">Technical</option>
            <option value="ai">AI & ML</option>
            <option value="security">Security</option>
            <option value="integration">Integration</option>
            <option value="operational">Operational</option>
          </select>
        </div>
      </div>

      {/* Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2.5 shadow-2xs hover:border-amber-200 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                    risk.severity === "high" || risk.severity === "critical"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{risk.title}</h4>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0 ${
                  risk.severity === "critical"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : risk.severity === "high"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {risk.severity} Risk
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>

            {/* Mitigation Box */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80 text-xs text-slate-800">
              <span className="font-bold text-slate-900">Mitigation Strategy: </span>
              {risk.mitigation}
            </div>

            {/* Footer: Category & Owner */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700">
                {CATEGORY_LABELS[risk.category] || risk.category}
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <User className="h-3 w-3 text-slate-400" />
                Owner: <strong>{risk.owner}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
