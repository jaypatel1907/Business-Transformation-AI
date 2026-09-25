"use client";

import { CostModel } from "@/lib/planning-types";
import { DollarSign, PieChart, Server, Shield, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

interface CostBreakdownPanelProps {
  costModel: CostModel;
  onEditAssumption?: () => void;
}

export function CostBreakdownPanel({
  costModel,
  onEditAssumption,
}: CostBreakdownPanelProps) {
  const formatCurrency = (val: number) => {
    return `${costModel.currency}${val.toLocaleString("en-IN")}`;
  };

  const oneTimeLines = costModel.lines.filter((l) => l.type === "one_time");
  const monthlyLines = costModel.lines.filter((l) => l.type === "monthly");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-indigo-600" />
            Transparent Total Cost of Ownership (TCO) Model
          </h3>
          <p className="text-xs text-slate-500">
            Categorized capital expenditure (CapEx) and operational cloud run rate (OpEx) with explicit contingency buffers.
          </p>
        </div>

        {onEditAssumption && (
          <button
            onClick={onEditAssumption}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition cursor-pointer"
          >
            Edit Rate Assumptions
          </button>
        )}
      </div>

      {/* Cost Range Slider / Visualizer */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">Deterministic Estimation Range</span>
          <span className="text-slate-500 text-[11px]">Derived from task effort lower/upper bounds</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Range (-20%)</span>
            <span className="text-sm font-bold text-slate-700">{formatCurrency(costModel.low)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 shadow-2xs ring-1 ring-indigo-400/30">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Expected Base</span>
            <span className="text-base font-extrabold text-indigo-900">{formatCurrency(costModel.expected)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Range (+30%)</span>
            <span className="text-sm font-bold text-slate-700">{formatCurrency(costModel.high)}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: CapEx vs OpEx */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Initial CapEx Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-indigo-600" />
              Initial Delivery & Build Investment
            </span>
            <span className="text-xs font-extrabold text-slate-900">
              {formatCurrency(costModel.totalInitialCost)}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {oneTimeLines.map((line, idx) => {
              const percent = Math.round((line.amount / costModel.totalInitialCost) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-slate-700">{line.category}</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(line.amount)} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        line.category.includes("Contingency")
                          ? "bg-amber-500"
                          : line.category.includes("AI")
                          ? "bg-purple-600"
                          : "bg-indigo-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Operational Cloud Run Rate (OpEx) */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Server className="h-4 w-4 text-sky-600" />
              Monthly Cloud & AI Run Rate
            </span>
            <span className="text-xs font-extrabold text-sky-900">
              {formatCurrency(costModel.recurringMonthlyCost)}/mo
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {monthlyLines.map((line, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{line.label}</span>
                  <span className="font-mono font-extrabold text-slate-900">{formatCurrency(line.amount)}/mo</span>
                </div>
                {line.notes && (
                  <p className="text-[10px] text-slate-500">{line.notes}</p>
                )}
              </div>
            ))}

            <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs space-y-1">
              <div className="flex justify-between items-center font-bold text-sky-950">
                <span>Annualized Operating Cost (12 Months)</span>
                <span className="font-mono text-sm">{formatCurrency(costModel.annualOperatingCost)}/yr</span>
              </div>
              <p className="text-[10px] text-sky-700">
                Covers serverless edge computing, PostgreSQL storage, Gemini API inference credits, and SSL/DNS maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
