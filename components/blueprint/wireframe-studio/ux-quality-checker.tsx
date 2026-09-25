"use client"

import React, { useMemo } from "react"
import { UXBlueprint, UXQualityIssue } from "@/lib/ux-wireframe-types"
import { validateUXQuality } from "@/lib/ux-wireframe-adapter"
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react"

interface UXQualityCheckerProps {
  blueprint: UXBlueprint
  onSelectScreen?: (screenId: string) => void
  onSelectComponent?: (componentId: string) => void
}

export function UXQualityChecker({
  blueprint,
  onSelectScreen,
  onSelectComponent
}: UXQualityCheckerProps) {
  const issues = useMemo(() => {
    return validateUXQuality(blueprint)
  }, [blueprint])

  const errorCount = issues.filter((i) => i.type === "error").length
  const warningCount = issues.filter((i) => i.type === "warning").length
  const infoCount = issues.filter((i) => i.type === "info").length

  // Calculate UX Quality Score (100 - penalties)
  const score = Math.max(
    0,
    Math.min(100, 100 - errorCount * 20 - warningCount * 8 - infoCount * 2)
  )

  const getScoreColor = (sc: number) => {
    if (sc >= 90) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    if (sc >= 70) return "text-amber-400 border-amber-500/30 bg-amber-500/10"
    return "text-rose-400 border-rose-500/30 bg-rose-500/10"
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              UX Quality & Usability Assessment
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                {issues.length} Items Found
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Automated audit for navigation integrity, form accessibility, orphan screens, and UX best practices.
            </p>
          </div>
        </div>

        {/* Quality Score Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs ${getScoreColor(score)}`}>
          <span>UX Score:</span>
          <span className="text-sm font-black">{score}/100</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/40">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Critical Errors</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{errorCount}</div>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Warnings</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{warningCount}</div>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Suggestions</div>
              <div className="text-2xl font-bold text-sky-400 mt-1">{infoCount}</div>
            </div>
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Info className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Screens</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">
                {blueprint.screens.length}
              </div>
            </div>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Issue List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Detailed Diagnostic Findings
          </div>

          {issues.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-emerald-500/30 text-emerald-300 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
              <div className="font-semibold text-sm">Everything Looks Perfect!</div>
              <p className="text-xs text-emerald-400/70 max-w-md mx-auto">
                No UX dead ends, unlabelled inputs, or disconnected screens were detected in this blueprint.
              </p>
            </div>
          ) : (
            issues.map((issue) => {
              const targetScreen = issue.screenId
                ? blueprint.screens.find((s) => s.id === issue.screenId)
                : undefined

              const icon =
                issue.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : issue.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <Info className="w-4 h-4 text-sky-400" />
                )

              const borderTone =
                issue.type === "error"
                  ? "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50"
                  : issue.type === "warning"
                  ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                  : "border-sky-500/30 bg-sky-500/5 hover:border-sky-500/50"

              return (
                <div
                  key={issue.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${borderTone}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                        {issue.title}
                        {targetScreen && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                            {targetScreen.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{issue.description}</p>
                    </div>
                  </div>

                  {targetScreen && (
                    <div className="shrink-0 flex items-center gap-2">
                      {onSelectScreen && (
                        <button
                          onClick={() => {
                            onSelectScreen(targetScreen.id)
                            if (issue.componentId && onSelectComponent) {
                              onSelectComponent(issue.componentId)
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 hover:text-indigo-200 border border-slate-700 font-medium transition-colors"
                        >
                          Fix in Canvas <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* UX Best Practice Guidelines */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI UX Architect Recommendations
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
              <div className="font-semibold text-slate-200 mb-1">
                Fitts&apos;s Law & Primary Actions
              </div>
              <div>
                Keep critical conversion actions (Submit, Book, Order) prominent with full width or high contrast variants.
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
              <div className="font-semibold text-slate-200 mb-1">
                Zero Dead Ends
              </div>
              <div>
                Every screen must offer an explicit backward or alternate route to prevent customer drop-off.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
