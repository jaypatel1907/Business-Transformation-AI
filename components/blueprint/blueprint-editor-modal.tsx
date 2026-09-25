"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  X,
  Edit3,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  Database,
  Terminal,
  Layout,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface BlueprintEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: any;
  onApproveAndBuild: (editedBlueprint: any) => void;
  onRegenerate: () => void;
  generating?: boolean;
}

export function BlueprintEditorModal({
  isOpen,
  onClose,
  blueprint,
  onApproveAndBuild,
  onRegenerate,
  generating = false,
}: BlueprintEditorModalProps) {
  const [data, setData] = useState<any>(blueprint || {});
  const [expandedSection, setExpandedSection] = useState<string>("initiatives");

  useEffect(() => {
    if (blueprint) {
      setData(blueprint);
    }
  }, [blueprint, isOpen]);

  if (!isOpen || !blueprint) return null;

  const toggleSection = (s: string) => {
    setExpandedSection(expandedSection === s ? "" : s);
  };

  // Add Item Helpers
  const addInitiative = () => {
    const list = [...(data.initiatives || [])];
    list.push({ title: "New Feature / Capability", impact: "High Impact", desc: "Feature description..." });
    setData({ ...data, initiatives: list });
  };

  const removeInitiative = (idx: number) => {
    const list = (data.initiatives || []).filter((_: any, i: number) => i !== idx);
    setData({ ...data, initiatives: list });
  };

  const addTable = () => {
    const list = [...(data.database_tables || [])];
    list.push({ table_name: `tbl_custom_${list.length + 1}`, columns: ["id (PK, UUID)", "name (VARCHAR)", "created_at (TIMESTAMP)"] });
    setData({ ...data, database_tables: list });
  };

  const removeTable = (idx: number) => {
    const list = (data.database_tables || []).filter((_: any, i: number) => i !== idx);
    setData({ ...data, database_tables: list });
  };

  const addApi = () => {
    const list = [...(data.api_endpoints || [])];
    list.push({ method: "POST", path: "/api/v1/custom/action", desc: "Custom API Endpoint" });
    setData({ ...data, api_endpoints: list });
  };

  const removeApi = (idx: number) => {
    const list = (data.api_endpoints || []).filter((_: any, i: number) => i !== idx);
    setData({ ...data, api_endpoints: list });
  };

  const handleApprove = () => {
    onApproveAndBuild(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Review & Approve Solution Blueprint
                </h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready for Generation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Review requirements, add or edit database schemas, and trigger automated full-stack build.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Project Title & Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Target Project</span>
              <h3 className="text-base font-bold text-slate-900">{data.project_title || "Enterprise Architecture Blueprint"}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Requirement: &ldquo;{data.user_problem}&rdquo;</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700">
                ⚡ Timeline: <strong>{data.timeline || "8 Weeks"}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700">
                💰 Budget: <strong>{data.financial_estimation?.min_budget || "$18k"}</strong>
              </div>
            </div>
          </div>

          {/* Section 1: Core Features & Initiatives */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("initiatives")}
              className="w-full p-4 bg-slate-50 flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-100/80 transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>1. Core Functional Requirements & Initiatives ({(data.initiatives || []).length})</span>
              </div>
              {expandedSection === "initiatives" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection === "initiatives" && (
              <div className="p-4 space-y-3">
                {(data.initiatives || []).map((init: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={init.title}
                        onChange={(e) => {
                          const list = [...data.initiatives];
                          list[idx].title = e.target.value;
                          setData({ ...data, initiatives: list });
                        }}
                        className="w-full font-bold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={init.desc}
                        onChange={(e) => {
                          const list = [...data.initiatives];
                          list[idx].desc = e.target.value;
                          setData({ ...data, initiatives: list });
                        }}
                        className="w-full text-xs text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      onClick={() => removeInitiative(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Remove Requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addInitiative}
                  className="w-full py-2 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Requirement</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Database Schema */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("database")}
              className="w-full p-4 bg-slate-50 flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-100/80 transition"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>2. PostgreSQL Database Schema ({(data.database_tables || []).length} Tables)</span>
              </div>
              {expandedSection === "database" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection === "database" && (
              <div className="p-4 space-y-3">
                {(data.database_tables || []).map((t: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500">TABLE</span>
                        <input
                          type="text"
                          value={t.table_name}
                          onChange={(e) => {
                            const list = [...data.database_tables];
                            list[idx].table_name = e.target.value;
                            setData({ ...data, database_tables: list });
                          }}
                          className="font-mono font-bold text-xs text-blue-700 bg-white px-2 py-1 rounded border border-slate-200"
                        />
                      </div>
                      <button
                        onClick={() => removeTable(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-lg border border-slate-100 flex flex-wrap gap-1.5">
                      {(t.columns || []).map((col: string, ci: number) => (
                        <span key={ci} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-700">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addTable}
                  className="w-full py-2 border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50/50 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Database Table</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: REST APIs */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("apis")}
              className="w-full p-4 bg-slate-50 flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-100/80 transition"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-600" />
                <span>3. Production REST APIs ({(data.api_endpoints || []).length} Endpoints)</span>
              </div>
              {expandedSection === "apis" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection === "apis" && (
              <div className="p-4 space-y-2">
                {(data.api_endpoints || []).map((api: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${api.method === 'POST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                        {api.method}
                      </span>
                      <input
                        type="text"
                        value={api.path}
                        onChange={(e) => {
                          const list = [...data.api_endpoints];
                          list[idx].path = e.target.value;
                          setData({ ...data, api_endpoints: list });
                        }}
                        className="flex-1 bg-white px-2 py-1 rounded border border-slate-200 text-slate-800"
                      />
                    </div>
                    <button
                      onClick={() => removeApi(idx)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addApi}
                  className="w-full py-2 border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50/50 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add API Endpoint</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onRegenerate}
            disabled={generating}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
          >
            ↻ Regenerate Blueprint
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Approve & Build Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
