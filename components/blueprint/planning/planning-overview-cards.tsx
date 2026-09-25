"use client";

import { PlanningBlueprint } from "@/lib/planning-types";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface PlanningOverviewCardsProps {
  blueprint: PlanningBlueprint;
  onOpenAssumptions: () => void;
}

export function PlanningOverviewCards({
  blueprint,
  onOpenAssumptions,
}: PlanningOverviewCardsProps) {
  const { costModel, roiModel, confidence, durationWeeks, totalEstimatedHours } = blueprint;
  const expectedScenario = roiModel.scenarios.find((s) => s.scenario === "expected") || roiModel.scenarios[1];

  const formatCurrency = (amount: number) => {
    return `${costModel.currency}${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Project Context and Confidence Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Implementation & Financial Architecture
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                {durationWeeks} Weeks Delivery
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic planning model calculated from technical scope, screen complexity, and resource rates.
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              confidence.overall === "high"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : confidence.overall === "medium"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-slate-50 text-slate-800 border-slate-200"
            }`}
          >
            {confidence.overall === "high" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            )}
            <span>
              {confidence.overall === "high"
                ? "High Estimation Confidence"
                : confidence.overall === "medium"
                ? "Medium Estimation Confidence"
                : "Preliminary Planning Range"}
            </span>
          </div>

          <button
            onClick={onOpenAssumptions}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            What-If Analysis
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Executive Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Initial Investment */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1 hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Initial Investment</span>
            <DollarSign className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {formatCurrency(costModel.expected)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Range: {formatCurrency(costModel.low)} – {formatCurrency(costModel.high)}
          </div>
        </div>

        {/* 2. Total Implementation Effort */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1 hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Effort</span>
            <Clock className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {totalEstimatedHours.likely} Hours
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {durationWeeks} Weeks ({totalEstimatedHours.low}h – {totalEstimatedHours.high}h)
          </div>
        </div>

        {/* 3. Monthly Operating Cost */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1 hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Cloud / AI</span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Recurring</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {formatCurrency(costModel.recurringMonthlyCost)}<span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Annual: {formatCurrency(costModel.annualOperatingCost)}/yr
          </div>
        </div>

        {/* 4. Estimated Annual Benefit */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1 hover:border-emerald-200 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Annual Benefit</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-emerald-700">
            {formatCurrency(expectedScenario.annualBenefit)}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">
            Net: {formatCurrency(expectedScenario.netAnnualBenefit)}/yr
          </div>
        </div>

        {/* 5. Projected 1st-Year ROI */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1 hover:border-purple-200 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">1-Year ROI</span>
            <ArrowUpRight className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-base font-extrabold text-purple-700">
            {expectedScenario.firstYearROI !== null ? `+${expectedScenario.firstYearROI}%` : "N/A"}
          </div>
          <div className="text-[10px] text-purple-600 font-medium">
            3-Yr ROI: {expectedScenario.threeYearROI !== null ? `+${expectedScenario.threeYearROI}%` : "N/A"}
          </div>
        </div>

        {/* 6. Estimated Payback Period */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-1 hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Payback Period</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-base font-extrabold text-indigo-700">
            {expectedScenario.paybackMonths !== null ? `${expectedScenario.paybackMonths} Months` : "N/A"}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {expectedScenario.paybackMonths !== null && expectedScenario.paybackMonths <= 24 ? "Healthy capital recovery" : "Long-term horizon"}
          </div>
        </div>
      </div>
    </div>
  );
}
