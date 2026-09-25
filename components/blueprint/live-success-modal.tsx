"use client";

import { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Code2,
  RefreshCw,
  Edit3,
  Rocket,
  X,
  FileCode,
  Layers,
  ChevronDown,
} from "lucide-react";
import { ProjectRecord } from "@/lib/project-store";

interface LiveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectRecord | null;
  onEditRequirements: () => void;
  onRegenerate: () => void;
  onDeployAgain: () => void;
  onAIRefine?: (prompt: string) => void;
}

export function LiveSuccessModal({
  isOpen,
  onClose,
  project,
  onEditRequirements,
  onRegenerate,
  onDeployAgain,
  onAIRefine,
}: LiveSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"sandbox" | "code" | "refine">("sandbox");
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [isSubmittingRefine, setIsSubmittingRefine] = useState(false);

  if (!isOpen || !project) return null;

  const fullLiveUrl = typeof window !== "undefined" ? `${window.location.origin}${project.live_url}` : project.live_url;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyRefinement = () => {
    if (!refinePrompt.trim()) return;
    setIsSubmittingRefine(true);
    if (onAIRefine) {
      onAIRefine(refinePrompt.trim());
    }
  };

  const files = project.files || [];
  const activeFile = files[activeFileIndex] || files[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50/80 via-white to-purple-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 font-bold">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Your Application is Live & Ready!
                </h2>
                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Project: <strong>{project.project_name}</strong> • Version: <strong className="text-indigo-600 font-mono">{project.version_tag || "v1.0"}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Banner & Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex-1 w-full flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-emerald-500 font-bold text-xs">🌐</span>
            <span className="font-mono text-xs text-slate-800 font-semibold truncate select-all">
              {fullLiveUrl}
            </span>
            <button
              onClick={handleCopy}
              className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy URL"}</span>
            </button>
          </div>

          {/* View Toggles & Open in New Window */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("sandbox")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "sandbox" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🖥️ Live Sandbox
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "code" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                💻 Code & SQL ({files.length})
              </button>
              <button
                onClick={() => setActiveTab("refine")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  activeTab === "refine" ? "bg-purple-600 text-white shadow-xs" : "text-purple-700 hover:text-purple-900"
                }`}
              >
                <span>✨ AI Edit</span>
              </button>
            </div>

            <button
              onClick={() => window.open(project.live_url, "_blank")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <span>Open Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sandbox / Code Explorer / AI Refiner */}
        <div className="flex-1 overflow-hidden bg-slate-100 flex flex-col min-h-[440px]">
          
          {/* TAB 1: Live Application Sandbox */}
          {activeTab === "sandbox" && (
            <div className="flex-1 w-full h-full bg-white relative flex flex-col">
              <div className="px-4 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>💡 Tip: Click <strong>&quot;✏️ Edit Web&quot;</strong> in the live navbar to edit items, prices, coupons, and titles without code!</span>
                <span className="font-mono text-emerald-700 font-bold">Status: 200 OK Active</span>
              </div>
              <iframe
                srcDoc={project.app_code}
                title="Live Application Sandbox"
                className="w-full flex-1 border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
              />
            </div>
          )}

          {/* TAB 2: Generated Code & PostgreSQL Schema Explorer */}
          {activeTab === "code" && (
            <div className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden bg-slate-950 text-slate-200 font-mono text-xs">
              <div className="w-full sm:w-64 border-r border-slate-800 bg-slate-900/60 p-3 space-y-1 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Generated Project Files
                </div>
                {files.map((file, fi) => (
                  <button
                    key={fi}
                    onClick={() => setActiveFileIndex(fi)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition ${
                      fi === activeFileIndex
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
                <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{activeFile?.path || "File"} • {activeFile?.description}</span>
                  <span className="uppercase text-[10px] font-bold text-indigo-400">{activeFile?.language}</span>
                </div>
                <pre className="flex-1 p-4 overflow-auto text-[11px] leading-relaxed text-slate-300">
                  <code>{activeFile?.content || "// No content"}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: AI Refinement / Incremental Build Panel */}
          {activeTab === "refine" && (
            <div className="flex-1 p-6 bg-slate-50 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-5">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
                  ✨
                </div>
                <h3 className="text-lg font-bold text-slate-900">Refine Application with AI</h3>
                <p className="text-xs text-slate-500">
                  Describe what you want to add, modify, or customize in your live application (e.g., &ldquo;Add 30% discount promo banner&rdquo;, &ldquo;Add table booking for 4 guests&rdquo;, &ldquo;Change theme to Emerald Green&rdquo;).
                </p>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-700 block">AI Refinement Instructions:</label>
                <textarea
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="e.g. Add 20% discount coupon SUMMER20, change currency to ₹ INR, and add 2 extra menu items with prices..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 leading-relaxed"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 font-bold self-center">Quick Suggestions:</span>
                  {[
                    "🎁 Add 25% discount promo banner",
                    "🍲 Add 3 popular chef-special dishes",
                    "💳 Enable online Razorpay/Stripe checkout",
                    "🩺 Add doctor consultation time slots",
                  ].map((sug, si) => (
                    <button
                      key={si}
                      onClick={() => setRefinePrompt(sug.slice(2))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleApplyRefinement}
                  disabled={!refinePrompt.trim() || isSubmittingRefine}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{isSubmittingRefine ? "Generating AI Update..." : "Build & Deploy AI Refinement (v2.0)"}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Next Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              onClick={onEditRequirements}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Blueprint Requirements</span>
            </button>
            <button
              onClick={onRegenerate}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Re-compile App</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === "refine" ? "sandbox" : "refine")}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>✨ Refine App with AI</span>
            </button>
            <button
              onClick={onDeployAgain}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy Production Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
