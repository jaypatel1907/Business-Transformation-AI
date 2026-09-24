"use client"

import { useState } from "react"
import Link from "next/link"
import { useRole } from "@/lib/role-context"
import {
  Box,
  FolderOpen,
  Download,
  Globe,
  Share2,
  Shield,
  Briefcase,
  User,
  FileText,
  ChevronDown,
  Check,
  Layers,
  MessageSquare,
  Sparkles,
  LogOut,
} from "lucide-react"

export function TopNav({
  onExportExecutivePDF,
  onExportGuideRoadmapPDF,
  onExportDatabaseApiPDF,
  onExportWireframePDF,
  onExportChatPDF,
  onExportMarkdown,
  onExportJSON,
  targetLanguage,
  onLanguageChange,
  generating,
  hasBlueprintData,
}: {
  onExportExecutivePDF: () => void
  onExportGuideRoadmapPDF: () => void
  onExportDatabaseApiPDF: () => void
  onExportWireframePDF: () => void
  onExportChatPDF: () => void
  onExportMarkdown: () => void
  onExportJSON: () => void
  targetLanguage: string
  onLanguageChange: (lang: string) => void
  generating: boolean
  hasBlueprintData: boolean
}) {
  const { role, logout } = useRole()
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const languages = [
    { code: "English", label: "English", flag: "🇬🇧" },
    { code: "Gujarati", label: "ગુજરાતી", flag: "🇮🇳" },
    { code: "Hindi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "Spanish", label: "Español", flag: "🇪🇸" },
    { code: "French", label: "Français", flag: "🇫🇷" },
    { code: "German", label: "Deutsch", flag: "🇩🇪" },
  ]

  const activeLang =
    languages.find((l) => l.code.toLowerCase() === (targetLanguage || "English").toLowerCase()) ||
    languages[0]

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

        {/* Role Badge */}
        {role && (
          <div
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold md:flex ml-2 border ${
              role === "Admin"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : role === "Manager"
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {role === "Admin" && <Shield className="h-3.5 w-3.5 text-rose-600" />}
            {role === "Manager" && <Briefcase className="h-3.5 w-3.5 text-indigo-600" />}
            {role === "Employee" && <User className="h-3.5 w-3.5 text-emerald-600" />}
            <span>{role} View</span>
          </div>
        )}
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
            <span>
              {activeLang.flag} {activeLang.label}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
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
                  {activeLang.code === lang.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>



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
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50 divide-y divide-slate-100">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                PDF Export Options
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onExportExecutivePDF()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">All-in-One Full Report (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Everything combined in one file</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onExportGuideRoadmapPDF()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Guide & Roadmap (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Step-by-step plan & timeline</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onExportDatabaseApiPDF()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Box className="h-4 w-4 text-sky-500 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Database & APIs (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Tables and REST endpoints</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onExportWireframePDF()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Box className="h-4 w-4 text-rose-500 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Wireframe UI (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Design layout structures</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onExportChatPDF()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Chat History (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Conversation thread only</div>
                  </div>
                </button>
              </div>

              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Raw Data Formats
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onExportMarkdown()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Markdown (.md)</span>
                </button>
                <button
                  onClick={() => {
                    onExportJSON()
                    setShowExportMenu(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>Raw Architecture (.json)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Link (Only for Admin role) */}
        {role === "Admin" && (
          <Link
            href="/admin"
            title="Admin Panel & Model Control"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
          >
            <Shield className="h-4 w-4 text-rose-600" />
            <span className="hidden lg:inline">Admin</span>
          </Link>
        )}

        {/* Switch Role / Logout Button */}
        <button
          onClick={logout}
          title="Switch Role or Logout"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Switch Role</span>
        </button>
      </div>
    </header>
  )
}