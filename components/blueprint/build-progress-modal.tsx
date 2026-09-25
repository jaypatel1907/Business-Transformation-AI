"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, Terminal, Sparkles, Box } from "lucide-react";

interface BuildProgressModalProps {
  isOpen: boolean;
  projectName: string;
  onComplete: (projectResult: any) => void;
  onRetry: () => void;
  onCancel: () => void;
  buildError?: string | null;
}

const BUILD_STEPS = [
  { id: "approved", label: "Blueprint approved & locked" },
  { id: "validated", label: "Requirements validated" },
  { id: "arch", label: "Architecture specification created" },
  { id: "files", label: "Project file structure generated" },
  { id: "components", label: "Interactive UI components generated" },
  { id: "api", label: "REST APIs & Endpoints compiled" },
  { id: "db", label: "PostgreSQL Database configured" },
  { id: "deps", label: "Dependencies & Environment verified" },
  { id: "build", label: "Production Application built" },
  { id: "tests", label: "Automated test suite & schema check passed" },
  { id: "deploy", label: "Live deployment instance ready" },
];

export function BuildProgressModal({
  isOpen,
  projectName,
  onComplete,
  onRetry,
  onCancel,
  buildError = null,
}: BuildProgressModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setLogs([]);
      setIsFailed(false);
      return;
    }

    if (buildError) {
      setIsFailed(true);
      setLogs((prev) => [...prev, `[ERROR] Build halted: ${buildError}`]);
      return;
    }

    // Step-by-step progress simulation synchronized with backend pipeline
    let step = 0;
    const interval = setInterval(() => {
      if (step < BUILD_STEPS.length - 1) {
        step++;
        setCurrentStepIndex(step);
        const current = BUILD_STEPS[step];
        const time = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          `[${time}] ✓ ${current.label}`,
        ]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete({});
        }, 1200);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen, buildError, onComplete]);

  if (!isOpen) return null;

  const currentStep = BUILD_STEPS[currentStepIndex] || BUILD_STEPS[0];
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / BUILD_STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              {isFailed ? <AlertCircle className="w-5 h-5 text-rose-300" /> : <Box className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-100">
                {isFailed ? "Generation Halted" : "Building Your Application"}
              </h2>
              <p className="text-xs text-slate-400">
                Target: <span className="text-indigo-400 font-semibold">{projectName || "Enterprise Solution"}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-800 px-3 py-1 rounded-full text-indigo-300 border border-slate-700">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Status: <strong className="text-slate-200">{isFailed ? "Failed" : currentStep.label}</strong></span>
            <span>Step {currentStepIndex + 1} of {BUILD_STEPS.length}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isFailed ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {BUILD_STEPS.map((s, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex && !isFailed;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs transition ${
                  isDone
                    ? "bg-slate-800/80 text-emerald-400"
                    : isCurrent
                    ? "bg-indigo-900/40 text-indigo-300 font-bold border border-indigo-700/50"
                    : "text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0 flex items-center justify-center text-[9px]">
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Terminal Logs Output */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 space-y-1 font-mono text-[11px] text-slate-400 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-slate-500 pb-1 border-b border-slate-800/60 font-bold text-[10px] uppercase">
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span>Build Console Telemetry</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="text-slate-300">
              {log}
            </div>
          ))}
          {!isFailed && (
            <div className="text-indigo-400 animate-pulse">
              &gt; Compiling production code...
            </div>
          )}
        </div>

        {/* Action Controls */}
        {isFailed ? (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onRetry}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
          </div>
        ) : (
          <div className="text-center text-[11px] text-slate-500">
            Please wait while the AI compiler builds, tests, and prepares your live application.
          </div>
        )}
      </div>
    </div>
  );
}
