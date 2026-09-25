"use client";

import { useEffect, useState } from "react";
import { getLocalProjects, ProjectRecord } from "@/lib/project-store";
import { History, ExternalLink, Play, Trash2, X, Clock, Layers, Sparkles } from "lucide-react";

interface ProjectHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectRecord) => void;
}

export function ProjectHistoryModal({
  isOpen,
  onClose,
  onSelectProject,
}: ProjectHistoryModalProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProjects(getLocalProjects());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const filtered = projects.filter((p) => p.id !== id);
      setProjects(filtered);
      localStorage.setItem("blueprint_ai_projects", JSON.stringify(filtered));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Project History & Version Builds</h2>
              <p className="text-xs text-slate-500">Access and manage all generated applications and deployed versions.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {projects.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No applications generated yet.</p>
              <p className="text-xs text-slate-400">Generate a blueprint and click &ldquo;Approve &amp; Build&rdquo; to create your first application!</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                      {proj.project_name}
                    </h3>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-100">
                      {proj.version_tag || "v1.0"}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    &ldquo;{proj.original_prompt}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{proj.files?.length || 5} Files Generated</span>
                    {proj.change_summary && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{proj.change_summary}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(proj.live_url, "_blank");
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                    title="Open Live Application"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">Open Live</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(proj.id, e)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
