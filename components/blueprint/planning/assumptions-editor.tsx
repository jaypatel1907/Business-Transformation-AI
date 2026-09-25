"use client";

import { useState, useEffect } from "react";
import { PlanningAssumptions, DEFAULT_ASSUMPTIONS } from "@/lib/planning-types";
import { X, Sparkles, RotateCcw, Check, Calculator, DollarSign, Users, Sliders } from "lucide-react";

interface AssumptionsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAssumptions: PlanningAssumptions;
  onApply: (updated: PlanningAssumptions) => void;
}

export function AssumptionsEditorModal({
  isOpen,
  onClose,
  currentAssumptions,
  onApply,
}: AssumptionsEditorModalProps) {
  const [form, setForm] = useState<PlanningAssumptions>({ ...currentAssumptions });

  useEffect(() => {
    setForm({ ...currentAssumptions });
  }, [currentAssumptions, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ ...form, userModified: true });
    onClose();
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_ASSUMPTIONS, userModified: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">What-If Analysis & Planning Assumptions</h3>
              <p className="text-xs text-slate-500">
                Adjust baseline labor rates, cloud budget, and adoption assumptions to instantly recalculate cost and ROI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs">
          {/* Section 1: Hourly Labor Rates */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-600" />
              Hourly Labor Rate Assumptions ({form.currency}/hour)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Frontend Developer</label>
                <input
                  type="number"
                  value={form.frontendDevRate}
                  onChange={(e) => setForm({ ...form, frontendDevRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Backend Developer</label>
                <input
                  type="number"
                  value={form.backendDevRate}
                  onChange={(e) => setForm({ ...form, backendDevRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">AI/ML Engineer</label>
                <input
                  type="number"
                  value={form.aiMlRate}
                  onChange={(e) => setForm({ ...form, aiMlRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">UI/UX Designer</label>
                <input
                  type="number"
                  value={form.uiUxRate}
                  onChange={(e) => setForm({ ...form, uiUxRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">QA Engineer</label>
                <input
                  type="number"
                  value={form.qaRate}
                  onChange={(e) => setForm({ ...form, qaRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Project Manager / BA</label>
                <input
                  type="number"
                  value={form.pmRate}
                  onChange={(e) => setForm({ ...form, pmRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cloud & AI Run Rate */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-sky-600" />
              Monthly Cloud & AI Operating Budget ({form.currency}/month)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Monthly Cloud Hosting (PostgreSQL, Edge)</label>
                <input
                  type="number"
                  value={form.monthlyCloudCost}
                  onChange={(e) => setForm({ ...form, monthlyCloudCost: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Monthly Gemini AI API Budget</label>
                <input
                  type="number"
                  value={form.monthlyAIAPICost}
                  onChange={(e) => setForm({ ...form, monthlyAIAPICost: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: ROI Parameters (Sliders) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-emerald-600" />
              ROI & Business Value Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">
                  Staff Hourly Cost ({form.currency}/hour)
                </label>
                <input
                  type="number"
                  value={form.staffHourlyCostForROI}
                  onChange={(e) => setForm({ ...form, staffHourlyCostForROI: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">
                  Annual Transaction / Request Volume
                </label>
                <input
                  type="number"
                  value={form.annualTransactionVolume}
                  onChange={(e) => setForm({ ...form, annualTransactionVolume: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Expected Automation Rate:</span>
                  <span className="font-bold text-indigo-700">{form.expectedAutomationRatePercent}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  value={form.expectedAutomationRatePercent}
                  onChange={(e) => setForm({ ...form, expectedAutomationRatePercent: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Platform Adoption Rate:</span>
                  <span className="font-bold text-indigo-700">{form.expectedAdoptionRatePercent}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={form.expectedAdoptionRatePercent}
                  onChange={(e) => setForm({ ...form, expectedAdoptionRatePercent: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Recalculate Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
