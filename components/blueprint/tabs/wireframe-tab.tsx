"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  UXBlueprint,
  UXScreen,
  UXComponent,
  UXDeviceType
} from "@/lib/ux-wireframe-types"
import {
  normalizeToUXBlueprint,
  getUXGenerationContext
} from "@/lib/ux-wireframe-adapter"
import { ScreenManager } from "@/components/blueprint/wireframe-studio/screen-manager"
import { ComponentPalette } from "@/components/blueprint/wireframe-studio/component-palette"
import { ScreenCanvas } from "@/components/blueprint/wireframe-studio/screen-canvas"
import { ComponentInspector } from "@/components/blueprint/wireframe-studio/component-inspector"
import { UserFlowView } from "@/components/blueprint/wireframe-studio/user-flow-view"
import { UserJourneyPanel } from "@/components/blueprint/wireframe-studio/user-journey-panel"
import { UXQualityChecker } from "@/components/blueprint/wireframe-studio/ux-quality-checker"
import { InteractivePreviewModal } from "@/components/blueprint/wireframe-studio/interactive-preview-modal"

import {
  LayoutTemplate,
  Layers,
  GitGraph,
  Users,
  ShieldCheck,
  Play,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  FileCheck,
  Eye,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home
} from "lucide-react"

export interface WireframeTabProps {
  generated?: boolean
  data?: any
  targetLanguage?: string
  onUpdateBlueprint?: (updatedData: any) => void
}

export function WireframeTab({
  generated = true,
  data,
  targetLanguage = "English",
  onUpdateBlueprint
}: WireframeTabProps) {
  // Main Studio Views
  type StudioView = "canvas" | "flow" | "journeys" | "quality" | "legacy"
  const [activeView, setActiveView] = useState<StudioView>("canvas")

  // Blueprint State initialized from adapter
  const [blueprint, setBlueprint] = useState<UXBlueprint>(() =>
    normalizeToUXBlueprint(data)
  )

  // Sub-selection states
  const [selectedScreenId, setSelectedScreenId] = useState<string>(() => {
    const initial = normalizeToUXBlueprint(data)
    return initial.activeScreenId || initial.screens[0]?.id || "screen-1"
  })
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [deviceType, setDeviceType] = useState<UXDeviceType>("desktop")
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Left sidebar tab: "screens" vs "palette"
  const [leftTab, setLeftTab] = useState<"screens" | "palette">("screens")
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState<boolean>(false)

  // Modals & Async Loaders
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false)
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved")

  // Sync with incoming data prop if changed externally
  useEffect(() => {
    if (data) {
      const normalized = normalizeToUXBlueprint(data)
      setBlueprint(normalized)
      if (
        !selectedScreenId ||
        !normalized.screens.some((s) => s.id === selectedScreenId)
      ) {
        setSelectedScreenId(normalized.activeScreenId || normalized.screens[0]?.id || "screen-1")
      }
    }
  }, [data])

  // Active Screen helper
  const activeScreen = useMemo(() => {
    const screens = blueprint?.screens || []
    return (
      screens.find((s) => s.id === selectedScreenId) ||
      screens[0] ||
      null
    )
  }, [blueprint?.screens, selectedScreenId])

  // Active Component helper
  const activeComponent = useMemo(() => {
    if (!activeScreen || !selectedComponentId) return null
    return (
      activeScreen.components?.find((c) => c.id === selectedComponentId) || null
    )
  }, [activeScreen, selectedComponentId])

  // Central state update dispatcher
  const updateBlueprint = useCallback(
    (updater: (prev: UXBlueprint) => UXBlueprint) => {
      setSaveStatus("saving")
      setBlueprint((prev) => {
        const next = updater(prev)
        if (onUpdateBlueprint) {
          onUpdateBlueprint({
            ...data,
            ux_blueprint: next
          })
        }
        return next
      })
      setTimeout(() => setSaveStatus("saved"), 400)
    },
    [data, onUpdateBlueprint]
  )

  // AI UX Generation trigger
  const handleGenerateAIUX = async () => {
    try {
      setIsGeneratingAI(true)
      const context = getUXGenerationContext(data)
      const response = await fetch("/api/ux/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: data?.user_problem || data?.project_title || "Enterprise Solution",
          blueprintData: data,
          language: data?.target_language || "English",
          projectTitle: data?.project_title || "Enterprise Solution",
          userProblem: data?.user_problem || "Business Transformation Workflow",
          context
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to generate AI UX: ${response.statusText}`)
      }

      const resData = await response.json()
      const rawBlueprint = resData.ux_blueprint || resData
      const generatedBlueprint: UXBlueprint =
        rawBlueprint && Array.isArray(rawBlueprint.screens) && rawBlueprint.screens.length > 0
          ? rawBlueprint
          : normalizeToUXBlueprint(data)

      updateBlueprint(() => generatedBlueprint)
      if (generatedBlueprint.screens && generatedBlueprint.screens.length > 0) {
        setSelectedScreenId(generatedBlueprint.screens[0].id)
        setSelectedComponentId(null)
      }
    } catch (err) {
      console.error("AI UX Generation error:", err)
      // Fallback normalization
      const fallback = normalizeToUXBlueprint(data)
      updateBlueprint(() => fallback)
      if (fallback.screens && fallback.screens.length > 0) {
        setSelectedScreenId(fallback.screens[0].id)
        setSelectedComponentId(null)
      }
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Handle adding a component from palette
  const handleAddComponentFromPalette = (compTemplate: Partial<UXComponent>) => {
    if (!activeScreen) return
    const newId = `cmp-${Date.now()}`
    const newComponent: UXComponent = {
      id: newId,
      type: compTemplate.type || "card",
      label: compTemplate.label || "New Component",
      content: compTemplate.content || "",
      placeholder: compTemplate.placeholder || "",
      variant: compTemplate.variant || "secondary",
      width: compTemplate.width || "full",
      action: compTemplate.action,
      properties: compTemplate.properties || {}
    }

    updateBlueprint((prev) => ({
      ...prev,
      screens: prev.screens.map((s) =>
        s.id === activeScreen.id
          ? { ...s, components: [...s.components, newComponent] }
          : s
      ),
      updatedAt: new Date().toISOString()
    }))

    setSelectedComponentId(newId)
  }

  // Handle updating screen directly
  const handleUpdateActiveScreen = (updatedScreen: UXScreen) => {
    updateBlueprint((prev) => ({
      ...prev,
      screens: prev.screens.map((s) =>
        s.id === updatedScreen.id ? updatedScreen : s
      ),
      updatedAt: new Date().toISOString()
    }))
  }

  // Handle updating single component from inspector
  const handleUpdateComponent = (updatedComponent: UXComponent) => {
    if (!activeScreen) return
    updateBlueprint((prev) => ({
      ...prev,
      screens: prev.screens.map((s) =>
        s.id === activeScreen.id
          ? {
              ...s,
              components: s.components.map((c) =>
                c.id === updatedComponent.id ? updatedComponent : c
              )
            }
          : s
      ),
      updatedAt: new Date().toISOString()
    }))
  }

  // Handle deleting single component
  const handleDeleteComponent = (componentId: string) => {
    if (!activeScreen) return
    updateBlueprint((prev) => ({
      ...prev,
      screens: prev.screens.map((s) =>
        s.id === activeScreen.id
          ? {
              ...s,
              components: s.components.filter((c) => c.id !== componentId)
            }
          : s
      ),
      updatedAt: new Date().toISOString()
    }))
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null)
    }
  }

  // PDF Export
  const handleExportPDF = async () => {
    const element = document.getElementById("wireframe-studio-export-target")
    if (!element) return

    try {
      setIsExportingPDF(true)
      const html2canvas = (await import("html2canvas-pro")).default
      const jsPDF = (await import("jspdf")).default

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#090d16"
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("l", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(
        `${blueprint.projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-wireframes.pdf`
      )
    } catch (err) {
      console.error("Error generating wireframe PDF:", err)
    } finally {
      setIsExportingPDF(false)
    }
  }

  // Legacy Clean Wireframe renderer for fallback view
  const renderLegacySections = () => {
    const sections = data?.wireframe_sections || [
      { title: "Authentication", components: ["Email", "Password", "Sign In"] },
      { title: "Main Interface", components: ["Sidebar", "Main Content"] },
      { title: "Settings & Payment", components: ["Credit Card", "Checkout"] }
    ]

    return (
      <div className="space-y-6">
        {sections.map((sec: any, idx: number) => (
          <div
            key={idx}
            className="w-full rounded-md border border-slate-700 bg-slate-900 overflow-hidden shadow-sm"
          >
            <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center gap-3">
              <div className="flex gap-2 text-slate-400">
                <ArrowLeft className="w-4 h-4" />
                <ArrowRight className="w-4 h-4" />
                <RotateCw className="w-3.5 h-3.5 mt-0.5" />
                <Home className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-700 rounded-sm h-6 flex-1 max-w-2xl mx-2 flex items-center px-2 text-[10px] text-slate-400 font-mono">
                https://app.preview/{sec.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-200">{sec.title}</h3>
              <div className="grid grid-cols-3 gap-3">
                {(sec.components || []).map((cmp: string, cIdx: number) => (
                  <div
                    key={cIdx}
                    className="p-4 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-center justify-center font-medium"
                  >
                    {cmp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Header & Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-slate-100">
                  AI UX / Interactive Wireframe Studio
                </h1>
                <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Phase 3 Live
                </span>
                {saveStatus === "saving" && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive screen builder, component palette, live flow graph, and clickable prototype testing.
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Selector */}
            <select
              value={blueprint.status}
              onChange={(e) =>
                updateBlueprint((prev) => ({
                  ...prev,
                  status: e.target.value as any
                }))
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="draft">Status: Draft</option>
              <option value="under_review">Status: Under Review</option>
              <option value="approved">Status: Approved</option>
            </select>

            {/* AI UX Generate Button */}
            <button
              onClick={handleGenerateAIUX}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isGeneratingAI ? "Synthesizing AI UX..." : "AI Generate UX"}
            </button>

            {/* Play Prototype Button */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Play Prototype
            </button>

            {/* PDF Export Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
            >
              {isExportingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              PDF
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView("canvas")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === "canvas"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Canvas Studio
            </button>
            <button
              onClick={() => setActiveView("flow")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === "flow"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GitGraph className="w-3.5 h-3.5" />
              User Flow Graph
            </button>
            <button
              onClick={() => setActiveView("journeys")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === "journeys"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Personas & Journeys
            </button>
            <button
              onClick={() => setActiveView("quality")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === "quality"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              UX Quality Audit
            </button>
            <button
              onClick={() => setActiveView("legacy")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === "legacy"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Clean Wireframe
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>
              {blueprint.screens.length} Screens •{" "}
              {blueprint.screens.reduce((acc, s) => acc + s.components.length, 0)}{" "}
              Components
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio View Container */}
      <div
        id="wireframe-studio-export-target"
        className="min-h-[750px] flex flex-col"
      >
        {activeView === "canvas" && (
          <div className="grid grid-cols-12 gap-4 h-[750px]">
            {/* Left Sidebar (Screens & Component Palette) */}
            <div
              className={`${
                leftPanelCollapsed ? "col-span-1" : "col-span-3"
              } bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col transition-all duration-200 shadow-xl`}
            >
              <div className="flex items-center justify-between p-2.5 border-b border-slate-800 bg-slate-900/90">
                {!leftPanelCollapsed && (
                  <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700/80 w-full mr-2">
                    <button
                      onClick={() => setLeftTab("screens")}
                      className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                        leftTab === "screens"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Screens ({blueprint.screens.length})
                    </button>
                    <button
                      onClick={() => setLeftTab("palette")}
                      className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                        leftTab === "palette"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      + Add Components
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                  title={leftPanelCollapsed ? "Expand Panel" : "Collapse Panel"}
                >
                  {leftPanelCollapsed ? (
                    <PanelLeft className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {!leftPanelCollapsed &&
                  (leftTab === "screens" ? (
                    <ScreenManager
                      blueprint={blueprint}
                      selectedScreenId={selectedScreenId}
                      onSelectScreen={(id) => {
                        setSelectedScreenId(id)
                        setSelectedComponentId(null)
                      }}
                      onUpdateBlueprint={updateBlueprint}
                    />
                  ) : (
                    <ComponentPalette
                      onAddComponent={handleAddComponentFromPalette}
                    />
                  ))}
              </div>
            </div>

            {/* Center Canvas */}
            <div
              className={`${
                leftPanelCollapsed ? "col-span-8" : "col-span-6"
              } h-full`}
            >
              {activeScreen ? (
                <ScreenCanvas
                  screen={activeScreen}
                  selectedComponentId={selectedComponentId}
                  deviceType={deviceType}
                  zoom={zoomLevel}
                  onSelectComponent={(cId) => setSelectedComponentId(cId)}
                  onUpdateScreen={handleUpdateActiveScreen}
                  onDeviceChange={(dev) => setDeviceType(dev)}
                  onZoomChange={(zm) => setZoomLevel(zm)}
                  onAddComponentClick={() => {
                    setLeftPanelCollapsed(false)
                    setLeftTab("palette")
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
                  No active screen selected.
                </div>
              )}
            </div>

            {/* Right Inspector */}
            <div className="col-span-3 h-full">
              <ComponentInspector
                selectedComponent={activeComponent}
                screens={blueprint.screens}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
                onDuplicateComponent={(cId) => {
                  if (!activeScreen || !activeComponent) return
                  const duplicated = {
                    ...activeComponent,
                    id: `comp_${Date.now()}`,
                    label: `${activeComponent.label} (Copy)`
                  }
                  const updatedScreens = blueprint.screens.map((sc) => {
                    if (sc.id === selectedScreenId) {
                      return { ...sc, components: [...sc.components, duplicated] }
                    }
                    return sc
                  })
                  updateBlueprint((prev) => ({ ...prev, screens: updatedScreens }))
                }}
              />
            </div>
          </div>
        )}

        {activeView === "flow" && (
          <div className="h-[750px]">
            <UserFlowView
              blueprint={blueprint}
              onSelectScreen={(sId) => {
                setSelectedScreenId(sId)
                setActiveView("canvas")
              }}
              onAddNavigation={(sourceId, targetId, label) => {
                const newNav = {
                  id: `nav_${Date.now()}`,
                  sourceScreenId: sourceId,
                  targetScreenId: targetId,
                  trigger: "click" as const,
                  label: label || "Navigate",
                }
                updateBlueprint((prev) => ({
                  ...prev,
                  navigation: [...(prev.navigation || []), newNav]
                }))
              }}
            />
          </div>
        )}

        {activeView === "journeys" && (
          <div className="h-[750px]">
            <UserJourneyPanel
              blueprint={blueprint}
              onUpdateBlueprint={updateBlueprint}
              onSelectScreen={(sId) => {
                setSelectedScreenId(sId)
                setActiveView("canvas")
              }}
            />
          </div>
        )}

        {activeView === "quality" && (
          <div className="h-[750px]">
            <UXQualityChecker
              blueprint={blueprint}
              onSelectScreen={(sId) => {
                setSelectedScreenId(sId)
                setActiveView("canvas")
              }}
              onSelectComponent={(cId) => {
                setSelectedComponentId(cId)
                setActiveView("canvas")
              }}
            />
          </div>
        )}

        {activeView === "legacy" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100">
                  Clean Sequential Wireframes (Overview)
                </h3>
                <p className="text-xs text-slate-400">
                  Static representation of core screens in linear order.
                </p>
              </div>
            </div>
            {renderLegacySections()}
          </div>
        )}
      </div>

      {/* Interactive Clickable Prototype Modal */}
      {showPreviewModal && (
        <InteractivePreviewModal
          blueprint={blueprint}
          initialScreenId={selectedScreenId}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  )
}
