"use client";

import { RequirementTraceabilityNode } from "@/lib/knowledge-types";
import { GitMerge, ArrowRight, CheckCircle2, Layers, Monitor, Terminal, Database, Clock } from "lucide-react";

interface TraceabilityMatrixProps {
  traceability: RequirementTraceabilityNode[];
}

export function TraceabilityMatrix({ traceability }: TraceabilityMatrixProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <GitMerge className="h-4 w-4 text-indigo-600" />
          End-to-End Requirement Traceability Matrix (RTM)
        </h3>
        <p className="text-xs text-slate-500">
          Auditable chain linking Business Requirements → Business Analysis Gap → Process Node → UX Screen → API → Database → WBS Task.
        </p>
      </div>

      {/* Traceability Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Req ID</th>
              <th className="py-2.5 px-3">Business Requirement</th>
              <th className="py-2.5 px-3">Process Touchpoint</th>
              <th className="py-2.5 px-3">UX Screen</th>
              <th className="py-2.5 px-3">API Endpoint</th>
              <th className="py-2.5 px-3">Database Entity</th>
              <th className="py-2.5 px-3">WBS Task</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {traceability.map((node) => (
              <tr key={node.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Code */}
                <td className="py-3 px-3 font-mono font-bold text-[11px] text-indigo-600 align-top">
                  {node.requirementCode}
                </td>

                {/* Title */}
                <td className="py-3 px-3 align-top max-w-xs">
                  <span className="font-bold text-slate-900 block">{node.requirementTitle}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Category: {node.category}
                  </span>
                </td>

                {/* Process */}
                <td className="py-3 px-3 align-top">
                  <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] border border-purple-100">
                    <Layers className="h-3 w-3" />
                    {node.processNodeRef?.nodeLabel || "Automated Flow"}
                  </span>
                </td>

                {/* Screen */}
                <td className="py-3 px-3 align-top">
                  <span className="inline-flex items-center gap-1 font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded text-[10px] border border-pink-100">
                    <Monitor className="h-3 w-3" />
                    {node.uxScreenRef?.screenName || "Portal View"}
                  </span>
                </td>

                {/* API */}
                <td className="py-3 px-3 align-top">
                  <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 block truncate max-w-[140px]">
                    {node.apiEndpointRef?.method} {node.apiEndpointRef?.path}
                  </span>
                </td>

                {/* DB */}
                <td className="py-3 px-3 align-top">
                  <span className="font-mono text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 block truncate max-w-[120px]">
                    <Database className="inline h-2.5 w-2.5 mr-1 text-slate-400" />
                    {node.databaseTableRef?.tableName}
                  </span>
                </td>

                {/* WBS */}
                <td className="py-3 px-3 align-top">
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 block">
                    <Clock className="inline h-2.5 w-2.5 mr-1 text-emerald-500" />
                    {node.wbsTaskRef?.wbsCode} {node.wbsTaskRef?.taskTitle}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-3 align-top text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Traced
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
