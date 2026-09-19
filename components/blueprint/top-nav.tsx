"use client"

import { useState } from "react"
import Link from "next/link"
import { Box, FolderOpen, Download, Globe, Share2, Shield, FileText, ChevronDown, Check } from "lucide-react"

export function TopNav({
  onLoadSample,
  onExportPDF,
  onExportMarkdown,
  onExportJSON,
  onSaveAndShare,
  targetLanguage,
  onLanguageChange,
  generating,
  hasBlueprintData,
}: {
  onLoadSample: () => void
  onExportPDF: () => void
  onExportMarkdown: () => void
  onExportJSON: () => void
  onSaveAndShare: () => void
  targetLanguage: string
  onLanguageChange: (lang: string) => void
  generating: boolean
  hasBlueprintData: boolean
}) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
  ]

  const activeLang = languages.find((l) => l.code === targetLanguage) || languages[0]

  return (
    <header className="z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6 shadow-2xs">
      {/* Left Title & Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">BlueprintAI</h1>
          <p className="text-[10px] text-slate-500 hidden sm:block">AI Solution Architecture Generator</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 md:flex ml-2">
          <span className={`h-2 w-2 rounded-full bg-emerald-500 ${generating ? "animate-ping" : ""}`} />
          AI Engine Active
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-2xs cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-600" />
            <span>{activeLang.flag} {activeLang.label}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code)
                    setShowLangMenu(false)
                  }}
                  className="flex w-full items-center justify-between px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {targetLanguage === lang.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sample Blueprint Button */}
        <button
          onClick={onLoadSample}
          disabled={generating}
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 shadow-2xs cursor-pointer"
        >
          <FolderOpen className="h-3.5 w-3.5 text-indigo-600" />
          <span>Sample Project</span>
        </button>

        {/* Save & Share Button */}
        <button
          onClick={onSaveAndShare}
          disabled={!hasBlueprintData || generating}
          title="Save & Share Blueprint Link"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 shadow-2xs cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden md:inline">Save & Share</span>
        </button>

        {/* Multi-Format Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!hasBlueprintData || generating}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-40 shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
            <ChevronDown className="h-3 w-3 text-indigo-200" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <button
                onClick={() => { onExportPDF(); setShowExportMenu(false); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
              >
                <FileText className="h-4 w-4 text-red-500" />
                <span>PDF Report (.pdf)</span>
              </button>
              <button
                onClick={() => { onExportMarkdown(); setShowExportMenu(false); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Markdown Document (.md)</span>
              </button>
              <button
                onClick={() => { onExportJSON(); setShowExportMenu(false); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
              >
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>Raw Architecture (.json)</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Link */}
        <Link
          href="/admin"
          title="Admin Panel & Model Control"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
        >
          <Shield className="h-4 w-4 text-slate-600" />
          <span className="hidden lg:inline">Admin</span>
        </Link>
      </div>
    </header>
  )
}