"use client";

import { useState } from "react";
import { ROIModel, ROIScenario } from "@/lib/planning-types";
import { TrendingUp, Calculator, Clock, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

interface ROIValueDashboardProps {
  roiModel: ROIModel;
  onEditAssumption?: () => void;
}

export function ROIValueDashboard({
  roiModel,
  onEditAssumption,
}: ROIValueDashboardProps) {
  const [activeScenarioKey, setActiveScenarioKey] = useState<"conservative" | "expected" | "optimistic">("expected");

  const currentScenario: ROIScenario =
    roiModel.scenarios.find((s) => s.scenario === activeScenarioKey) || roiModel.scenarios[1];

  const formatCurrency = (val: number) => {
    return `${roiModel.currency}${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
      {/* Header with Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            ROI & Business Value Realization Model
          </h3>
          <p className="text-xs text-slate-500">
            Transparent value projection calculated from automated hours, error reduction, and platform adoption.
          </p>
        </div>

        {/* Conservative vs Expected vs Optimistic Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
          {roiModel.scenarios.map((sc) => (
            <button
              key={sc.scenario}
              onClick={() => setActiveScenarioKey(sc.scenario)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeScenarioKey === sc.scenario
                  ? "bg-white text-emerald-800 shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {sc.scenario === "conservative" ? "Conservative" : sc.scenario === "expected" ? "Expected (Base)" : "Optimistic"}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario KPI Summary (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Gross Annual Benefit */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Gross Annual Benefit</span>
          <div className="text-lg font-extrabold text-emerald-700">{formatCurrency(currentScenario.annualBenefit)}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Labor savings + error elimination</span>
        </div>

        {/* Net Annual Benefit */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block">Net Annual Benefit</span>
          <div className="text-lg font-extrabold text-indigo-700">{formatCurrency(currentScenario.netAnnualBenefit)}</div>
          <span className="text-[10px] text-indigo-600 font-medium">After {formatCurrency(currentScenario.annualOperatingCost)} OpEx</span>
        </div>

        {/* Payback Period */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Estimated Payback</span>
          <div className="text-lg font-extrabold text-slate-900">
            {currentScenario.paybackMonths !== null ? `${currentScenario.paybackMonths} Months` : "Insufficient Data"}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">From production go-live</span>
        </div>

        {/* 3-Year Return on Investment */}
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">3-Year Projected ROI</span>
          <div className="text-lg font-extrabold text-purple-700">
            {currentScenario.threeYearROI !== null ? `+${currentScenario.threeYearROI}%` : "N/A"}
          </div>
          <span className="text-[10px] text-purple-600 font-medium">1-Year: +{currentScenario.firstYearROI}% ROI</span>
        </div>
      </div>

      {/* Assumptions & Formula Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Assumptions Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-slate-600" />
              ROI Baseline Input Assumptions
            </span>
            {onEditAssumption && (
              <button
                onClick={onEditAssumption}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Modify
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {roiModel.assumptions.map((asm) => (
              <div key={asm.key} className="flex justify-between items-center py-1 border-b border-slate-50 text-[11px]">
                <div>
                  <span className="font-medium text-slate-800">{asm.label}</span>
                  <span className="block text-[10px] text-slate-400">{asm.notes}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {asm.value.toLocaleString()} {asm.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transparent Formulas Walkthrough */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200/80 pb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Transparent Arithmetic Walkthrough
          </span>

          <div className="space-y-2 text-xs text-slate-600">
            {roiModel.formulaNotes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 font-medium">
            <strong>Auditable Methodology:</strong> All ROI formulas use linear deterministic arithmetic. No randomized or hallucinations values are introduced into the financial projection.
          </div>
        </div>
      </div>
    </div>
  );
}
