"use client";

import { ResourceRole } from "@/lib/planning-types";
import { Users, Clock, DollarSign, Briefcase, Award, CheckCircle2 } from "lucide-react";

interface ResourcePlanTableProps {
  resources: ResourceRole[];
  currency: string;
  onEditAssumption?: () => void;
}

export function ResourcePlanTable({
  resources,
  currency,
  onEditAssumption,
}: ResourcePlanTableProps) {
  const totalHours = resources.reduce((s, r) => s + r.estimatedHours, 0);
  const totalCost = resources.reduce((s, r) => s + r.estimatedCost, 0);

  const formatCurrency = (val: number) => {
    return `${currency}${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" />
            Human Capital & Resource Allocation Plan
          </h3>
          <p className="text-xs text-slate-500">
            Tailored team composition derived from technical requirements, frontend screen volume, and backend API complexity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">Total Labor: {formatCurrency(totalCost)}</div>
            <div className="text-[10px] text-slate-500">{totalHours} total dedicated hours</div>
          </div>
          {onEditAssumption && (
            <button
              onClick={onEditAssumption}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition cursor-pointer"
            >
              Adjust Rates
            </button>
          )}
        </div>
      </div>

      {/* Resource Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Role & Domain</th>
              <th className="py-2.5 px-3">Primary Tech Skills</th>
              <th className="py-2.5 px-3 text-center">Allocation</th>
              <th className="py-2.5 px-3 text-center">Duration</th>
              <th className="py-2.5 px-3 text-right">Hours</th>
              <th className="py-2.5 px-3 text-right">Planning Rate</th>
              <th className="py-2.5 px-4 text-right">Estimated Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Role */}
                <td className="py-3 px-4 align-top">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                    {res.role}
                  </div>
                  <ul className="mt-1 space-y-0.5 text-[10px] text-slate-500 list-disc list-inside">
                    {res.responsibilities.slice(0, 2).map((resp, i) => (
                      <li key={i} className="truncate max-w-xs">{resp}</li>
                    ))}
                  </ul>
                </td>

                {/* Skills */}
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {res.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Allocation */}
                <td className="py-3 px-3 align-top text-center">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px] border border-indigo-100">
                    {res.allocationPercent}%
                  </span>
                </td>

                {/* Duration */}
                <td className="py-3 px-3 align-top text-center text-slate-700 font-medium">
                  {res.durationWeeks} Weeks
                </td>

                {/* Hours */}
                <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                  {res.estimatedHours}h
                </td>

                {/* Hourly Rate */}
                <td className="py-3 px-3 align-top text-right font-mono text-slate-600">
                  {currency}{res.hourlyRate}/h
                  <span className="block text-[9px] text-slate-400 font-normal">Assumption</span>
                </td>

                {/* Cost */}
                <td className="py-3 px-4 align-top text-right font-mono font-extrabold text-slate-900">
                  {formatCurrency(res.estimatedCost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200">
            <tr>
              <td colSpan={4} className="py-3 px-4 text-slate-800">
                Total Resource Capacity
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-900">
                {totalHours}h
              </td>
              <td className="py-3 px-3 text-right text-slate-400 font-normal text-[10px]">
                Weighted Avg
              </td>
              <td className="py-3 px-4 text-right font-mono text-indigo-700 text-sm">
                {formatCurrency(totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
