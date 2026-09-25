"use client";

import { useState, useMemo } from "react";
import { WorkItem, WorkItemCategory } from "@/lib/planning-types";
import {
  Search,
  Filter,
  Layers,
  Clock,
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

interface WBSTableProps {
  workItems: WorkItem[];
  onToggleStatus?: (itemId: string) => void;
}

const CATEGORY_LABELS: Record<WorkItemCategory, { label: string; color: string }> = {
  discovery: { label: "Discovery & Analysis", color: "bg-amber-50 text-amber-800 border-amber-200" },
  ux_design: { label: "UX & Design", color: "bg-pink-50 text-pink-800 border-pink-200" },
  frontend: { label: "Frontend", color: "bg-blue-50 text-blue-800 border-blue-200" },
  backend: { label: "Backend API", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  database: { label: "Database", color: "bg-slate-100 text-slate-800 border-slate-200" },
  ai_ml: { label: "AI & ML", color: "bg-purple-50 text-purple-800 border-purple-200" },
  integration: { label: "Integration", color: "bg-cyan-50 text-cyan-800 border-cyan-200" },
  testing: { label: "QA & Testing", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  devops: { label: "DevOps & Cloud", color: "bg-teal-50 text-teal-800 border-teal-200" },
  security: { label: "Security & Governance", color: "bg-rose-50 text-rose-800 border-rose-200" },
  documentation: { label: "Documentation", color: "bg-gray-50 text-gray-800 border-gray-200" },
  project_management: { label: "Project Mgmt", color: "bg-violet-50 text-violet-800 border-violet-200" },
};

export function WBSTable({ workItems, onToggleStatus }: WBSTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});

  // Filter items
  const filteredItems = useMemo(() => {
    return workItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignedRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.wbsCode.includes(searchQuery);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [workItems, searchQuery, selectedCategory]);

  // Group by Phase
  const groupedByPhase = useMemo(() => {
    const groups: Record<string, WorkItem[]> = {};
    filteredItems.forEach((item) => {
      const phase = item.phase || "General";
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(item);
    });
    return groups;
  }, [filteredItems]);

  const togglePhase = (phase: string) => {
    setCollapsedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  const totalFilteredHours = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => ({
        low: acc.low + item.estimatedHours.low,
        likely: acc.likely + item.estimatedHours.likely,
        high: acc.high + item.estimatedHours.high,
      }),
      { low: 0, likely: 0, high: 0 }
    );
  }, [filteredItems]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header with Search and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            Work Breakdown Structure (WBS) & Task Catalog
          </h3>
          <p className="text-xs text-slate-500">
            {filteredItems.length} scoped work items · {totalFilteredHours.likely} likely hours ({totalFilteredHours.low}h – {totalFilteredHours.high}h range)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, roles, WBS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 w-48 sm:w-56"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Disciplines</option>
            <option value="discovery">Discovery & Analysis</option>
            <option value="ux_design">UX & Design</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend API</option>
            <option value="database">Database</option>
            <option value="ai_ml">AI & ML</option>
            <option value="integration">Integration</option>
            <option value="testing">QA & Testing</option>
            <option value="devops">DevOps</option>
            <option value="project_management">Project Mgmt</option>
          </select>
        </div>
      </div>

      {/* Grouped Table View */}
      <div className="space-y-4">
        {Object.keys(groupedByPhase).length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No work items match the current search or category filter.
          </div>
        ) : (
          Object.entries(groupedByPhase).map(([phase, items]) => {
            const isCollapsed = !!collapsedPhases[phase];
            const phaseLikelyHours = items.reduce((s, i) => s + i.estimatedHours.likely, 0);

            return (
              <div key={phase} className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                {/* Collapsible Phase Header */}
                <button
                  type="button"
                  onClick={() => togglePhase(phase)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                    <span className="text-xs font-bold text-slate-900">{phase}</span>
                    <span className="rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[10px] font-semibold border border-indigo-100">
                      {items.length} tasks
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600">
                    {phaseLikelyHours} hours estimated
                  </span>
                </button>

                {/* Tasks List */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/40 text-[10px] uppercase font-bold text-slate-400">
                        <tr>
                          <th className="py-2 px-4 w-12">WBS</th>
                          <th className="py-2 px-4">Task Description & Deliverable</th>
                          <th className="py-2 px-3">Discipline</th>
                          <th className="py-2 px-3">Complexity</th>
                          <th className="py-2 px-3">Assigned Role</th>
                          <th className="py-2 px-4 text-right">Effort Range (h)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((item) => {
                          const cat = CATEGORY_LABELS[item.category] || {
                            label: item.category,
                            color: "bg-slate-100 text-slate-800",
                          };

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                              {/* WBS Code */}
                              <td className="py-2.5 px-4 font-mono font-bold text-[11px] text-indigo-600 align-top">
                                {item.wbsCode}
                              </td>

                              {/* Task Title & Description */}
                              <td className="py-2.5 px-4 align-top">
                                <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                                {item.dependencies.length > 0 && (
                                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                    <span>Depends on:</span>
                                    {item.dependencies.map((depId) => {
                                      const dep = workItems.find((w) => w.id === depId);
                                      return (
                                        <span
                                          key={depId}
                                          className="font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded"
                                        >
                                          {dep?.wbsCode || depId}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </td>

                              {/* Discipline Badge */}
                              <td className="py-2.5 px-3 align-top whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cat.color}`}>
                                  {cat.label}
                                </span>
                              </td>

                              {/* Complexity */}
                              <td className="py-2.5 px-3 align-top whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                    item.complexity === "very_high" || item.complexity === "high"
                                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                                      : item.complexity === "medium"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  }`}
                                >
                                  {item.complexity}
                                </span>
                              </td>

                              {/* Assigned Role */}
                              <td className="py-2.5 px-3 align-top whitespace-nowrap text-slate-700 font-medium">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-slate-400" />
                                  {item.assignedRole}
                                </span>
                              </td>

                              {/* Effort Range */}
                              <td className="py-2.5 px-4 align-top text-right whitespace-nowrap font-mono">
                                <span className="font-extrabold text-slate-900">{item.estimatedHours.likely}h</span>
                                <span className="text-[10px] text-slate-400 ml-1">
                                  ({item.estimatedHours.low}h–{item.estimatedHours.high}h)
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
