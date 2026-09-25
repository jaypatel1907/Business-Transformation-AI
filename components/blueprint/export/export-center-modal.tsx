"use client";

import { useState } from "react";
import {
  ExportProjectModel,
  ExportDocumentType,
  ExportFormat,
  ExportProgressState,
} from "@/lib/export-types";
import {
  generateExportJSON,
  generateExportXLSX,
  generateExportDOCX,
  generateExportZIP,
  triggerBrowserDownload,
} from "@/lib/export-engine";
import { exportCleanPDF } from "@/lib/pdf-exporter";
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Archive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface ExportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportModel: ExportProjectModel;
}

interface ExportOption {
  id: ExportDocumentType;
  title: string;
  description: string;
  icon: any;
  formats: { format: ExportFormat; label: string; color: string }[];
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "executive_report",
    title: "Executive Summary & Strategy Report",
    description: "C-level transformation overview covering business problem, strategic intent, expected ROI, CapEx/OpEx, and roadmap.",
    icon: FileText,
    formats: [
      { format: "pdf", label: "PDF Document", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
      { format: "docx", label: "Word (.docx)", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
    ],
  },
  {
    id: "business_analysis",
    title: "Deep Business Analysis & Gap Matrix",
    description: "Complete operational assessment with digital maturity, AI readiness dimensions, gap mitigations, and AI opportunities.",
    icon: Layers,
    formats: [
      { format: "pdf", label: "PDF Document", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
      { format: "docx", label: "Word (.docx)", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
    ],
  },
  {
    id: "transformation_plan",
    title: "Implementation Plan, WBS & Resource Budget",
    description: "Work breakdown structure, role allocations, hourly rates, milestone Gantt chart, and project risk register.",
    icon: FileSpreadsheet,
    formats: [
      { format: "xlsx", label: "Excel (.xlsx)", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
      { format: "docx", label: "Word (.docx)", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
      { format: "pdf", label: "PDF Document", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
    ],
  },
  {
    id: "technical_architecture",
    title: "Technical Architecture & API Catalog",
    description: "Full-stack specifications, PostgreSQL table schemas, REST API endpoints, security controls, and edge deployment.",
    icon: FileCode,
    formats: [
      { format: "pdf", label: "PDF Document", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
      { format: "docx", label: "Word (.docx)", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
    ],
  },
  {
    id: "full_project_package",
    title: "Complete Enterprise Documentation Package",
    description: "Bundles Executive Report (DOCX), Implementation Model (XLSX), and raw JSON into a single downloadable ZIP archive.",
    icon: Archive,
    formats: [
      { format: "zip", label: "All-in-One (.zip)", color: "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700" },
    ],
  },
  {
    id: "raw_json",
    title: "Raw Machine-Readable Project Data",
    description: "Standardized schema-versioned JSON export for programmatic ingestion, CI/CD pipelines, and backup archival.",
    icon: FileCode,
    formats: [
      { format: "json", label: "JSON Data", color: "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200" },
    ],
  },
];

export function ExportCenterModal({
  isOpen,
  onClose,
  exportModel,
}: ExportCenterModalProps) {
  const [progressState, setProgressState] = useState<ExportProgressState>({
    status: "idle",
    progressPercent: 0,
    message: "",
  });

  if (!isOpen) return null;

  const handleExport = async (docType: ExportDocumentType, format: ExportFormat) => {
    try {
      setProgressState({
        status: "preparing",
        activeFormat: format,
        progressPercent: 20,
        message: `Preparing canonical export model for ${format.toUpperCase()}...`,
      });

      const baseName = exportModel.metadata.projectTitle.replace(/[^a-zA-Z0-9_-]/g, "_");

      if (format === "json") {
        setProgressState({ status: "generating", progressPercent: 60, message: "Serializing JSON project schema..." });
        const jsonStr = generateExportJSON(exportModel);
        const blob = new Blob([jsonStr], { type: "application/json" });
        setProgressState({ status: "finalizing", progressPercent: 90, message: "Downloading file..." });
        triggerBrowserDownload(blob, `${baseName}_project_blueprint.json`);
      } else if (format === "xlsx") {
        setProgressState({ status: "generating", progressPercent: 60, message: "Generating multi-sheet Excel workbook..." });
        const blob = generateExportXLSX(exportModel);
        setProgressState({ status: "finalizing", progressPercent: 90, message: "Downloading spreadsheet..." });
        triggerBrowserDownload(blob, `${baseName}_implementation_plan.xlsx`);
      } else if (format === "docx") {
        setProgressState({ status: "generating", progressPercent: 60, message: "Compiling Microsoft Word document with tables & styles..." });
        const blob = await generateExportDOCX(exportModel);
        setProgressState({ status: "finalizing", progressPercent: 90, message: "Downloading document..." });
        triggerBrowserDownload(blob, `${baseName}_executive_report.docx`);
      } else if (format === "zip") {
        setProgressState({ status: "generating", progressPercent: 50, message: "Packaging DOCX, XLSX, and JSON into ZIP archive..." });
        const blob = await generateExportZIP(exportModel);
        setProgressState({ status: "finalizing", progressPercent: 90, message: "Downloading package..." });
        triggerBrowserDownload(blob, `${baseName}_complete_package.zip`);
      } else if (format === "pdf") {
        setProgressState({ status: "generating", progressPercent: 50, message: "Rendering high-resolution PDF canvas..." });
        await exportCleanPDF({
          elementId: "blueprint-canvas-content",
          filename: `${baseName}_blueprint.pdf`,
        });
      }

      setProgressState({
        status: "complete",
        progressPercent: 100,
        message: "Export generated successfully!",
      });

      setTimeout(() => {
        setProgressState({ status: "idle", progressPercent: 0, message: "" });
      }, 2500);
    } catch (err: any) {
      console.error("Export Error:", err);
      setProgressState({
        status: "failed",
        progressPercent: 100,
        message: "Export generation failed.",
        error: err.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Enterprise Export & Reporting Center
              </h3>
              <p className="text-xs text-slate-500">
                Generate professional deliverables across PDF, DOCX, XLSX, JSON, and complete ZIP packages.
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

        {/* Live Progress Bar */}
        {progressState.status !== "idle" && (
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
              progressState.status === "failed"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : progressState.status === "complete"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-indigo-50 border-indigo-200 text-indigo-900"
            }`}
          >
            <div className="flex justify-between items-center font-bold">
              <span className="flex items-center gap-2">
                {progressState.status === "complete" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : progressState.status === "failed" ? (
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                )}
                {progressState.message}
              </span>
              <span>{progressState.progressPercent}%</span>
            </div>
            <div className="w-full bg-white/80 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progressState.status === "failed"
                    ? "bg-rose-500"
                    : progressState.status === "complete"
                    ? "bg-emerald-500"
                    : "bg-indigo-600"
                }`}
                style={{ width: `${progressState.progressPercent}%` }}
              />
            </div>
            {progressState.error && (
              <p className="text-[10px] text-rose-700">{progressState.error}</p>
            )}
          </div>
        )}

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EXPORT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs hover:border-indigo-200 transition flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{opt.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-9">
                    {opt.description}
                  </p>
                </div>

                {/* Formats Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 pl-9">
                  {opt.formats.map((fmt) => (
                    <button
                      key={fmt.format}
                      onClick={() => handleExport(opt.id, fmt.format)}
                      disabled={progressState.status !== "idle" && progressState.status !== "complete"}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-2xs cursor-pointer disabled:opacity-50 ${fmt.color}`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Security Notice */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Zero Server Secret Exposure · Sensitive credentials & API keys sanitized from exports
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
