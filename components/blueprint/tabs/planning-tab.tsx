"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PlanningBlueprint,
  PlanningAssumptions,
  PlanningScenario,
  ScenarioType,
} from "@/lib/planning-types";
import {
  buildPlanningBlueprint,
  savePlanningBlueprint,
  loadPlanningBlueprint,
} from "@/lib/planning-engine";
import { RESTAURANT_PLANNING_FIXTURE } from "@/lib/planning-fixtures";
import { PlanningOverviewCards } from "@/components/blueprint/planning/planning-overview-cards";
import { WBSTable } from "@/components/blueprint/planning/wbs-table";
import { ResourcePlanTable } from "@/components/blueprint/planning/resource-plan-table";
import { TimelineGantt } from "@/components/blueprint/planning/timeline-gantt";
import { CostBreakdownPanel } from "@/components/blueprint/planning/cost-breakdown-panel";
import { ROIValueDashboard } from "@/components/blueprint/planning/roi-value-dashboard";
import { RiskRegisterPanel } from "@/components/blueprint/planning/risk-register-panel";
import { AssumptionsEditorModal } from "@/components/blueprint/planning/assumptions-editor";
import {
  Calculator,
  Layers,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface PlanningTabProps {
  generated: boolean;
  data?: any;
  targetLanguage?: string;
}

type SubView = "wbs" | "resources" | "timeline" | "cost" | "roi" | "risks";

export function PlanningTab({
  generated,
  data,
  targetLanguage = "English",
}: PlanningTabProps) {
  const [blueprint, setBlueprint] = useState<PlanningBlueprint | null>(null);
  const [activeSubView, setActiveSubView] = useState<SubView>("wbs");
  const [selectedScenarioType, setSelectedScenarioType] = useState<ScenarioType>("standard");
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isDirty, setIsDirty] = useState(false);

  // Initialize Blueprint from data or storage
  useEffect(() => {
    const projectId = data?.id || data?.project_title || "active_project";
    const saved = loadPlanningBlueprint(projectId);
    if (saved) {
      setBlueprint(saved);
    } else {
      const initial = buildPlanningBlueprint(data);
      setBlueprint(initial);
    }
    setIsDirty(false);
  }, [data]);

  // Handle Assumption Update (What-If Analysis)
  const handleApplyAssumptions = (updatedAssumptions: PlanningAssumptions) => {
    const recalculated = buildPlanningBlueprint(data, updatedAssumptions);
    setBlueprint(recalculated);
    setIsDirty(true);
    setSaveStatus("idle");
  };

  // Handle Save
  const handleSavePlan = useCallback(() => {
    if (!blueprint) return;
    setSaveStatus("saving");
    const projectId = data?.id || data?.project_title || "active_project";
    savePlanningBlueprint(projectId, blueprint);
    setTimeout(() => {
      setIsDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 400);
  }, [blueprint, data]);

  // Handle Reset to Benchmark Fixture
  const handleResetToBenchmark = () => {
    if (confirm("Reset to Restaurant Online Ordering & Table Booking Benchmark Plan?")) {
      setBlueprint(JSON.parse(JSON.stringify(RESTAURANT_PLANNING_FIXTURE)));
      setIsDirty(true);
    }
  };

  if (!generated && !blueprint) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm space-y-3">
        <Calculator className="h-10 w-10 text-indigo-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">
          AI Planning, Cost, ROI & Resource Estimation Engine
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Input your business requirement on the left to synthesize the Work Breakdown Structure (WBS), resource allocations, milestone timeline, CapEx/OpEx cost model, and ROI realization projection.
        </p>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Loading Planning Engine models...
      </div>
    );
  }

  const activeScenario =
    blueprint.scenarios.find((s) => s.type === selectedScenarioType) || blueprint.scenarios[1];

  return (
    <div className="space-y-6">
      {/* Top Banner: Scenario Selection (MVP vs Standard vs Enterprise) + Global Actions */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                <Calculator className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Planning, Cost, ROI & Resource Studio
              </h2>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                Phase 4 Engine · Deterministic TCO
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Transforming technical architecture into an auditable implementation plan, resource budget, and value realization model.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1.5 border border-slate-200">
            {blueprint.scenarios.map((sc) => (
              <button
                key={sc.type}
                onClick={() => setSelectedScenarioType(sc.type)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  selectedScenarioType === sc.type
                    ? "bg-white text-indigo-900 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{sc.label.split("—")[0].trim()}</span>
                <span className="text-[10px] text-slate-400 font-normal">({sc.teamSize})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Brief Alert */}
        <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-indigo-950">
            <strong>Active Scenario: {activeScenario.label} — </strong>
            <span className="text-slate-600">{activeScenario.description}</span>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs flex-shrink-0">
            {activeScenario.durationWeeks} Wks Delivery · {blueprint.costModel.currency}{activeScenario.estimatedCost.expected.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAssumptionsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-indigo-600" />
              What-If Analysis
            </button>

            <button
              onClick={handleResetToBenchmark}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Load Restaurant Ordering & Booking Benchmark Fixture"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              Reset to Benchmark
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Unsaved edits
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Plan Saved
              </span>
            )}

            <button
              onClick={handleSavePlan}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saveStatus === "saving" ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <PlanningOverviewCards
        blueprint={blueprint}
        onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveSubView("wbs")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "wbs"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Work Breakdown (WBS)
          <span className="ml-1 rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px]">
            {blueprint.workBreakdown.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubView("resources")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "resources"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Resource Allocation
          <span className="ml-1 rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px]">
            {blueprint.resources.length} Roles
          </span>
        </button>

        <button
          onClick={() => setActiveSubView("timeline")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "timeline"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          Gantt & Milestones
          <span className="ml-1 rounded-full bg-indigo-50 text-indigo-700 px-1.5 py-0.2 text-[10px]">
            {blueprint.durationWeeks} Wks
          </span>
        </button>

        <button
          onClick={() => setActiveSubView("cost")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "cost"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" />
          TCO & Cost Model
        </button>

        <button
          onClick={() => setActiveSubView("roi")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "roi"
              ? "bg-white text-emerald-800 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ROI & Value Model
        </button>

        <button
          onClick={() => setActiveSubView("risks")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubView === "risks"
              ? "bg-white text-amber-800 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          Risk Register
          <span className="ml-1 rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px]">
            {blueprint.risks.length}
          </span>
        </button>
      </div>

      {/* Active Sub-View Render */}
      {activeSubView === "wbs" && <WBSTable workItems={blueprint.workBreakdown} />}

      {activeSubView === "resources" && (
        <ResourcePlanTable
          resources={blueprint.resources}
          currency={blueprint.costModel.currency}
          onEditAssumption={() => setIsAssumptionsModalOpen(true)}
        />
      )}

      {activeSubView === "timeline" && (
        <TimelineGantt
          milestones={blueprint.milestones}
          totalWeeks={blueprint.durationWeeks}
        />
      )}

      {activeSubView === "cost" && (
        <CostBreakdownPanel
          costModel={blueprint.costModel}
          onEditAssumption={() => setIsAssumptionsModalOpen(true)}
        />
      )}

      {activeSubView === "roi" && (
        <ROIValueDashboard
          roiModel={blueprint.roiModel}
          onEditAssumption={() => setIsAssumptionsModalOpen(true)}
        />
      )}

      {activeSubView === "risks" && <RiskRegisterPanel risks={blueprint.risks} />}

      {/* Assumptions / What-If Modal */}
      <AssumptionsEditorModal
        isOpen={isAssumptionsModalOpen}
        onClose={() => setIsAssumptionsModalOpen(false)}
        currentAssumptions={blueprint.assumptions}
        onApply={handleApplyAssumptions}
      />
    </div>
  );
}
