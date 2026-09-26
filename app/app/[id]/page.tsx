"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getProjectById, getLocalProjects, ProjectRecord } from "@/lib/project-store";
import { generateApplicationFromBlueprint } from "@/lib/app-generator";
import { ArrowLeft, ExternalLink, RefreshCw, Layers, Shield, CheckCircle2 } from "lucide-react";

export default function LiveAppPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const found = getProjectById(projectId);
      if (found) {
        setProject(found);
        if (found.blueprint_data) {
          const generated = generateApplicationFromBlueprint(found.blueprint_data, projectId);
          setHtmlContent(generated.standalone_html);
        } else if (found.app_code) {
          setHtmlContent(found.app_code);
        }
        setLoading(false);
      } else {
        // Check saved blueprints in localStorage to generate on-the-fly
        const localBps = JSON.parse(localStorage.getItem("saved_blueprints") || "[]");
        const match = localBps.find((b: any) => b.id === projectId || b.blueprint_data?.project_title);
        
        if (match && match.blueprint_data) {
          const generated = generateApplicationFromBlueprint(match.blueprint_data, projectId);
          setHtmlContent(generated.standalone_html);
        } else {
          // Default fallback demo app
          const defaultGen = generateApplicationFromBlueprint(
            {
              project_title: "Smart Enterprise Application",
              user_problem: "Online ordering and booking operations platform",
              database_tables: [{ table_name: "orders" }, { table_name: "users" }, { table_name: "items" }],
              api_endpoints: [{ method: "GET", path: "/api/items" }, { method: "POST", path: "/api/orders" }],
            },
            projectId
          );
          setHtmlContent(defaultGen.standalone_html);
        }
        setLoading(false);
      }
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-300">Loading Live Application Sandbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Live Application Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between z-20 text-white">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to BlueprintAI</span>
          </Link>
          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-200">
              {project?.project_name || "Generated Application"}
            </span>
            <span className="bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
              {project?.version_tag || "v1.0.0"} • Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            title="Reload Application"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const blob = new Blob([htmlContent], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
          >
            <span>Open in New Window</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Sandboxed Live Application View */}
      <div className="flex-1 w-full h-full bg-white">
        <iframe
          srcDoc={htmlContent}
          title="Live Generated App"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      </div>
    </div>
  );
}
