"use client"

import { Box, FolderOpen, Download } from "lucide-react"

export function TopNav({
  onLoadSample,
  onExport,
  generating,
  hasBlueprintData,
}: {
  onLoadSample: () => void
  onExport: () => void
  generating: boolean
  hasBlueprintData: boolean
}) {
  return (
    <header className="z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">BlueprintAI</h1>
          <p className="text-[10px] text-slate-500 hidden sm:block">AI Solution Architecture Generator</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 sm:flex ml-2">
          <span className={`h-2 w-2 rounded-full bg-emerald-500 ${generating ? "animate-ping" : ""}`} />
          AI Engine Active
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onLoadSample}
          disabled={generating}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 shadow-2xs cursor-pointer"
        >
          <FolderOpen className="h-4 w-4 text-indigo-600" />
          <span className="hidden sm:inline">Sample Blueprint</span>
          <span className="sm:hidden">Sample</span>
        </button>

        <button
          onClick={onExport}
          disabled={!hasBlueprintData || generating}
          title={hasBlueprintData ? "Export Blueprint JSON/Report" : "Generate a blueprint first to export"}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-40 shadow-sm cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export Blueprint</span>
        </button>
      </div>
    </header>
  )
}