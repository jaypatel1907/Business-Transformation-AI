"use client"

import { useCallback, useEffect, useState } from "react"
import { useRole } from "@/lib/role-context"
import { RoleLogin } from "@/components/auth/role-login"
import { TopNav } from "@/components/blueprint/top-nav"
import { CompanionPanel, type ChatMessage } from "@/components/blueprint/companion-panel"
import { Canvas, type TabId } from "@/components/blueprint/canvas"
import { samplePrompt } from "@/lib/blueprint-data"
import { saveBlueprintLocally, getLocalBlueprints } from "@/lib/supabase"
import { exportCleanPDF, exportExecutiveReportPDF } from "@/lib/pdf-exporter"
import { BlueprintEditorModal } from "@/components/blueprint/blueprint-editor-modal"
import { BuildProgressModal } from "@/components/blueprint/build-progress-modal"
import { LiveSuccessModal } from "@/components/blueprint/live-success-modal"
import { ProjectHistoryModal } from "@/components/blueprint/project-history-modal"
import { DiscoveryModal } from "@/components/blueprint/discovery-modal"
import { BusinessContext, DiscoveryQuestion, DeepBusinessAnalysis } from "@/lib/discovery-types"
import { ProjectRecord, saveProjectRecord, getLocalProjects } from "@/lib/project-store"
import { Check, Copy, Share2, X, Rocket, Sparkles, ArrowRight, BrainCircuit } from "lucide-react"
import { getTranslation } from "@/lib/i18n"

const nextId = () => `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

function FormattedMessage({ text }: { text: string }) {
  if (!text) return null
  const paragraphs = text.split("\n\n")

  return (
    <div className="space-y-3 text-[13px] text-slate-800 leading-relaxed">
      {paragraphs.map((p, i) => {
        const isHighlight = p.startsWith("👉") || p.includes("Tabs") || p.includes("કેનવાસ") || p.includes("Canvas")
        
        const lines = p.split("\n").map((line, li) => {
          const parts = line.split(/(\*\*.*?\*\*)/g)
          return (
            <div key={li} className={line.startsWith("•") ? "pl-2 py-0.5 text-slate-700" : ""}>
              {parts.map((part, pi) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={pi} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
                }
                return part
              })}
            </div>
          )
        })

        if (isHighlight) {
          return (
            <div key={i} className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 font-medium text-xs leading-relaxed">
              {lines}
            </div>
          )
        }

        return <div key={i} className="space-y-1">{lines}</div>
      })}
    </div>
  )
}

const getInitialMessages = (lang: string): ChatMessage[] => [
  {
    id: "msg-welcome-0",
    role: "ai",
    label: "AI Solution Architect",
    content: <FormattedMessage text={getTranslation(lang, "welcome")} />
  }
]

export default function Page() {
  const { isAuthenticated, role } = useRole()
  const [targetLanguage, setTargetLanguage] = useState("English") // Defaulting to English
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages("English"))
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("analysis")
  const [blueprintData, setBlueprintData] = useState<any>(null)
  const [lastPrompt, setLastPrompt] = useState<string>("")
  const [lastDocText, setLastDocText] = useState<string | undefined>(undefined)

  // Phase 1: Discovery & Business Context State
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false)
  const [discoveryContext, setDiscoveryContext] = useState<BusinessContext | null>(null)
  const [discoveryAnswers, setDiscoveryAnswers] = useState<DiscoveryQuestion[]>([])

  // Update welcome message if language changes and no other messages exist
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "msg-welcome-0") {
      setMessages(getInitialMessages(targetLanguage))
    }
  }, [targetLanguage])

  // Share Modal states
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

  // Application Generation & Deployment Workflow States
  const [showEditorModal, setShowEditorModal] = useState(false)
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [showLiveSuccessModal, setShowLiveSuccessModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [currentProject, setCurrentProject] = useState<ProjectRecord | null>(null)
  const [buildError, setBuildError] = useState<string | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)

  // Restore saved blueprint if URL has blueprintId parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const bpId = params.get("blueprintId")
      if (bpId) {
        const localList = getLocalBlueprints()
        const found = localList.find((b) => b.id === bpId)
        if (found && found.blueprint_data) {
          setBlueprintData(found.blueprint_data)
          setGenerated(true)
          if (found.blueprint_data.target_language) {
            setTargetLanguage(found.blueprint_data.target_language)
          }
          if (found.blueprint_data.user_problem) {
            setLastPrompt(found.blueprint_data.user_problem)
          }
        }
      }
    }
  }, [])

  const handleApproveAndBuild = useCallback(
    async (approvedBp: any) => {
      setShowEditorModal(false)
      setBlueprintData(approvedBp)
      setShowBuildModal(true)
      setIsBuilding(true)
      setBuildError(null)

      try {
        const res = await fetch("/api/build", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blueprint: approvedBp,
            projectId: currentProject?.id,
            version: currentProject ? currentProject.version + 1 : 1,
            userRole: role || "Manager",
            changeSummary: currentProject ? `Incremental update ${currentProject.version + 1}` : "Initial Build from Blueprint",
          }),
        })

        const data = await res.json()
        if (data.success && data.project) {
          const saved = saveProjectRecord(data.project)
          setCurrentProject(saved)
        } else {
          setBuildError(data.error || "Application build failed")
        }
      } catch (err: any) {
        setBuildError(err.message || "Network error during compilation")
      }
    },
    [currentProject, role]
  )

  const handleBuildComplete = useCallback(() => {
    setShowBuildModal(false)
    setIsBuilding(false)
    setShowLiveSuccessModal(true)
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "ai",
        label: "Live Deployment Engine",
        content: (
          <FormattedMessage
            text={`🎉 **Application Generated & Deployed Live!**\n\nYour full-stack application has passed all automated unit checks, database DDL validations, and is now running live.\n\n👉 **Live Preview:** Click **Open Live App** to test interactive orders, cart, booking, and live admin management!`}
          />
        ),
      },
    ])
  }, [])

  const handleEditRequirements = useCallback(() => {
    setShowLiveSuccessModal(false)
    setShowEditorModal(true)
  }, [])

  const handleRegenerateFromSuccess = useCallback(() => {
    setShowLiveSuccessModal(false)
    if (blueprintData) {
      handleApproveAndBuild(blueprintData)
    }
  }, [blueprintData, handleApproveAndBuild])

  const handleDeployAgain = useCallback(async () => {
    if (!currentProject) return
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProject.id,
          projectName: currentProject.project_name,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setShowLiveSuccessModal(true)
      }
    } catch (e) {
      console.error(e)
    }
  }, [currentProject])

  const handleAIRefine = useCallback(
    async (refinePromptText: string) => {
      if (!blueprintData) return
      setShowLiveSuccessModal(false)
      setShowBuildModal(true)
      setIsBuilding(true)
      setBuildError(null)

      const updatedBlueprint = {
        ...blueprintData,
        user_problem: `${blueprintData.user_problem || "App"} | Refinement: ${refinePromptText}`,
        initiatives: [
          ...(blueprintData.initiatives || []),
          {
            title: refinePromptText.length > 30 ? refinePromptText.slice(0, 30) + "..." : refinePromptText,
            impact: "AI Refinement",
            desc: `User refined capability: ${refinePromptText}`,
          },
        ],
      }
      setBlueprintData(updatedBlueprint)

      try {
        const nextVer = currentProject ? currentProject.version + 1 : 2
        const res = await fetch("/api/build", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blueprint: updatedBlueprint,
            projectId: currentProject?.id,
            version: nextVer,
            userRole: role || "Manager",
            changeSummary: `AI Refinement: ${refinePromptText}`,
          }),
        })

        const data = await res.json()
        if (data.success && data.project) {
          const saved = saveProjectRecord(data.project)
          setCurrentProject(saved)
        } else {
          setBuildError(data.error || "Application build failed")
        }
      } catch (err: any) {
        setBuildError(err.message || "Network error during compilation")
      }
    },
    [blueprintData, currentProject, role]
  )

  const handleSelectProjectFromHistory = useCallback((project: ProjectRecord) => {
    setCurrentProject(project)
    if (project.approved_blueprint) {
      setBlueprintData(project.approved_blueprint)
      setGenerated(true)
    }
    setShowLiveSuccessModal(true)
  }, [])

  const runGeneration = useCallback(
    async (
      userMessage?: ChatMessage,
      rawPromptText?: string,
      documentText?: string,
      langToUse?: string,
      docBase64?: string,
      docMimeType?: string,
      overrideContext?: BusinessContext,
      overrideAnswers?: DiscoveryQuestion[]
    ) => {
      if (userMessage) {
        setMessages((prev) => [...prev, userMessage])
      }
      setGenerating(true)

      const currentLang = langToUse || targetLanguage || "English"
      const promptToSend =
        rawPromptText ||
        lastPrompt ||
        blueprintData?.user_problem ||
        "Analyze this business requirement and build architecture blueprint"

      const docToSend = documentText !== undefined ? documentText : lastDocText

      if (rawPromptText) setLastPrompt(rawPromptText)
      if (documentText) setLastDocText(documentText)

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptToSend,
            documentText: docToSend,
            documentBase64: docBase64,
            documentMimeType: docMimeType,
            language: currentLang,
            targetLanguage: currentLang,
            role: role || "Manager",
            selectedModel: "gemini-3.6-flash",
            businessContext: overrideContext || discoveryContext || undefined,
            discoveryAnswers: overrideAnswers || (discoveryAnswers.length > 0 ? discoveryAnswers : undefined),
          }),
        })

        const result = await res.json()

        if (result.success && result.data) {
          const data = result.data
          setBlueprintData(data)

          // Save record to local storage
          saveBlueprintLocally(data)

          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "ai",
              label: "AI Solution Architect",
              content: (
                <FormattedMessage 
                  text={
                    data.chat_reply || 
                    (currentLang === "Gujarati"
                      ? `નમસ્તે! મેં તમારા **"${data.project_title || "આઈડિયા"}"** નું સંપૂર્ણ વિશ્લેષણ કરીને આર્કિટેક્ચર બ્લૂપ્રિન્ટ તૈયાર કરી છે.\n\n🎯 **સિસ્ટમ સારાંશ:**\n• **પરિપક્વતા સ્કોર:** ${data.digital_maturity || 85}%\n• **લક્ષિત સમયગાળો:** ${data.timeline || "8 Weeks"}\n• **ટેક સ્ટેક:** ${data.tech_stack?.frontend || "Next.js"} + ${data.tech_stack?.backend || "Node.js"}\n\n👉 **કેનવાસ પ્લાન જુઓ:** જમણી બાજુના Tabs પર ક્લિક કરીને Deep Business Analysis, Process Map, Database Schema, Wireframe અને Roadmap જુઓ!`
                      : `Hello! I've analyzed your requirement for **"${data.project_title || "your project"}"** and generated an enterprise transformation blueprint.\n\n🎯 **Architecture Highlights:**\n• **Digital Maturity:** ${data.digital_maturity || 85}%\n• **Estimated Timeline:** ${data.timeline || "8 Weeks"}\n• **Engineered Tech Stack:** ${data.tech_stack?.frontend || "Next.js"} + ${data.tech_stack?.backend || "Node.js"}\n\n👉 **Explore the Solution Canvas:** Click through the tabs on the right to inspect Deep Business Analysis, Process Map, Database Schemas, UX Wireframes, and Roadmap!`)
                  } 
                />
              ),
            },
          ])
          setGenerated(true)
          setActiveTab("analysis")
        } else {
          throw new Error(result.error || "Failed to generate architecture blueprint")
        }
      } catch (err: any) {
        console.error("AI Generation Error:", err)
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "ai",
            label: "AI Solution Architect",
            content: (
              <div className="space-y-1 text-xs text-red-600">
                <p className="font-semibold">⚠️ Generation Notice</p>
                <p>{err.message || "Failed to generate blueprint"}</p>
              </div>
            ),
          },
        ])
      } finally {
        setGenerating(false)
      }
    },
    [targetLanguage, lastPrompt, lastDocText, role, blueprintData, discoveryContext, discoveryAnswers]
  )

  const handleCompleteDiscovery = useCallback(
    (context: BusinessContext, answers: DiscoveryQuestion[]) => {
      setDiscoveryContext(context)
      setDiscoveryAnswers(answers)
      setShowDiscoveryModal(false)

      const discoveryPrompt = `${lastPrompt || context.business_domain} (Target: ${context.target_audience}; Pain Points: ${context.current_pain_points.join(", ")})`
      
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "user",
          label: "Discovery Completed",
          content: (
            <span>
              🎯 <strong>Discovery Interview Completed:</strong> Synthesizing tailored Gap Analysis & Architecture for{" "}
              <strong className="text-indigo-600">{context.business_domain}</strong>...
            </span>
          ),
        },
      ])

      runGeneration(
        undefined,
        lastPrompt || context.business_domain,
        lastDocText,
        targetLanguage,
        undefined,
        undefined,
        context,
        answers
      )
    },
    [lastPrompt, lastDocText, targetLanguage, runGeneration]
  )

  const handleUpdateAnalysis = useCallback((updatedAnalysis: DeepBusinessAnalysis) => {
    if (!blueprintData) return
    const updated = {
      ...blueprintData,
      business_analysis: updatedAnalysis,
      digital_maturity: updatedAnalysis.digital_maturity.overall_score,
      ai_adoption: updatedAnalysis.ai_readiness.overall_score,
    }
    setBlueprintData(updated)
    saveBlueprintLocally(updated)
  }, [blueprintData])

  const handleApproveAnalysis = useCallback((approvedAnalysis: DeepBusinessAnalysis) => {
    if (!blueprintData) return
    const updated = {
      ...blueprintData,
      business_analysis: approvedAnalysis,
      digital_maturity: approvedAnalysis.digital_maturity.overall_score,
      ai_adoption: approvedAnalysis.ai_readiness.overall_score,
    }
    setBlueprintData(updated)
    saveBlueprintLocally(updated)

    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "ai",
        label: "AI Business Consultant",
        content: (
          <FormattedMessage
            text={`✅ **Business Analysis & Gap Matrix Approved!**\n\nThe strategic value drivers, PPTD gap mitigations, and target KPIs have been approved and synchronized into the Solution Architecture. You can now review the **Process Guide**, **Database & APIs**, or proceed directly to **Approve & Build**.`}
          />
        ),
      },
    ])
  }, [blueprintData])

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setTargetLanguage(newLang)
      const promptToReplay = lastPrompt || blueprintData?.user_problem || samplePrompt
      if (generated || blueprintData) {
        runGeneration(undefined, promptToReplay, lastDocText, newLang)
      }
    },
    [generated, lastPrompt, blueprintData, lastDocText, runGeneration]
  )

  const handleSubmit = useCallback(
    (text: string, documentText?: string, base64?: string, mimeType?: string) => {
      runGeneration(
        { id: nextId(), role: "user", label: "Business Requirement", content: text },
        text,
        documentText,
        undefined,
        base64,
        mimeType
      )
    },
    [runGeneration]
  )

  const handleUpload = useCallback((fileName: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "user",
        label: "Document Attached",
        content: (
          <span>
            Attached <strong className="text-indigo-600">{fileName}</strong> — parsing content & building architecture...
          </span>
        ),
      },
    ])
  }, [])

  const handleLoadSample = useCallback(() => {
    runGeneration(
      { id: nextId(), role: "user", label: "Sample Requirement", content: samplePrompt },
      samplePrompt
    )
  }, [runGeneration])

  // PDF Export Handlers (Clean Target Container Exporter)
  const handleExportExecutivePDF = useCallback(async () => {
    if (!blueprintData) return
    const { exportExecutiveReportPDF } = await import('@/lib/pdf-exporter')
    await exportExecutiveReportPDF(blueprintData, targetLanguage)
  }, [blueprintData, targetLanguage])

  const handleExportGuideRoadmapPDF = useCallback(async () => {
    if (!blueprintData) return
    const { exportGuideRoadmapPDF } = await import('@/lib/pdf-exporter')
    await exportGuideRoadmapPDF(blueprintData, targetLanguage)
  }, [blueprintData, targetLanguage])

  const handleExportDatabaseApiPDF = useCallback(async () => {
    if (!blueprintData) return
    const { exportDatabaseApiPDF } = await import('@/lib/pdf-exporter')
    await exportDatabaseApiPDF(blueprintData, targetLanguage)
  }, [blueprintData, targetLanguage])

  const handleExportWireframePDF = useCallback(async () => {
    if (!blueprintData) return
    const { exportWireframePDF } = await import('@/lib/pdf-exporter')
    await exportWireframePDF(blueprintData, targetLanguage)
  }, [blueprintData, targetLanguage])

  const handleExportChatPDF = useCallback(async () => {
    const { exportCleanPDF } = await import('@/lib/pdf-exporter')
    const filename = `Blueprint-Chat-History-${Date.now()}`
    await exportCleanPDF({ elementId: "chat-messages-container", filename })
  }, [])

  const handleExportJSON = useCallback(() => {
    if (!blueprintData) return
    const fileName = `${(blueprintData.project_title || "blueprint").toLowerCase().replace(/[^a-z0-9]+/g, "_")}_architecture.json`
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(blueprintData, null, 2))}`
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", jsonString)
    downloadAnchor.setAttribute("download", fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }, [blueprintData])

  const handleExportMarkdown = useCallback(() => {
    if (!blueprintData) return
    const fileName = `${(blueprintData.project_title || "blueprint").toLowerCase().replace(/[^a-z0-9]+/g, "_")}_report.md`
    const mdContent = `# Architectural Blueprint Report: ${blueprintData.project_title}

## Executive Summary
- **Requirement**: "${blueprintData.user_problem || "Business Solution"}"
- **Target Language**: ${blueprintData.target_language || targetLanguage}
- **Active Role**: ${role || "Manager"}
- **Digital Maturity Score**: ${blueprintData.digital_maturity}%
- **AI Adoption Readiness**: ${blueprintData.ai_adoption}%
- **MVP Timeline**: ${blueprintData.timeline}
- **Est. Financial Budget**: ${blueprintData.financial_estimation?.min_budget} - ${blueprintData.financial_estimation?.max_budget} (${blueprintData.financial_estimation?.total_hours})

## Recommended Tech Stack
- **Frontend**: ${blueprintData.tech_stack?.frontend}
- **Backend**: ${blueprintData.tech_stack?.backend}
- **Database**: ${blueprintData.tech_stack?.database}
- **AI Intelligence**: ${blueprintData.tech_stack?.ai_layer}

## Database ER Schema
${blueprintData.database_tables?.map((t: any) => `### Table: ${t.table_name}\n${t.columns.map((c: string) => `- \`${c}\``).join("\n")}`).join("\n\n")}

## API Endpoints
${blueprintData.api_endpoints?.map((e: any) => `- \`${e.method} ${e.path}\`: ${e.desc}`).join("\n")}
`

    const mdBlob = `data:text/markdown;charset=utf-8,${encodeURIComponent(mdContent)}`
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", mdBlob)
    downloadAnchor.setAttribute("download", fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }, [blueprintData, targetLanguage, role])

  // Save & Share Handler
  const handleSaveAndShare = useCallback(() => {
    if (!blueprintData) return
    const record = saveBlueprintLocally(blueprintData)
    const url = `${window.location.origin}/?blueprintId=${record.id}`
    setShareUrl(url)
    setShowShareModal(true)
  }, [blueprintData])

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [shareUrl])

  // If not authenticated, render Role Selection Login gate
  if (!isAuthenticated) {
    return <RoleLogin />
  }

  // If authenticated, render full Workspace
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans relative">
      <TopNav
        onExportExecutivePDF={handleExportExecutivePDF}
        onExportGuideRoadmapPDF={handleExportGuideRoadmapPDF}
        onExportDatabaseApiPDF={handleExportDatabaseApiPDF}
        onExportWireframePDF={handleExportWireframePDF}
        onExportChatPDF={handleExportChatPDF}
        onExportMarkdown={handleExportMarkdown}
        onExportJSON={handleExportJSON}
        onOpenApproveBuild={() => setShowEditorModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenDiscovery={() => setShowDiscoveryModal(true)}
        targetLanguage={targetLanguage}
        onLanguageChange={handleLanguageChange}
        generating={generating}
        hasBlueprintData={!!blueprintData}
      />

      {/* Floating Blueprint Approval Call-to-Action Bar */}
      {blueprintData && !generating && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-md z-10 border-b border-indigo-700/60 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-emerald-300">Architecture Blueprint Ready:</span>
            <span className="text-slate-300 hidden sm:inline truncate max-w-md">
              {blueprintData.project_title || "Solution Architecture"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiscoveryModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-indigo-100 font-bold text-xs shadow-xs transition cursor-pointer border border-indigo-500/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>AI Discovery</span>
            </button>
            <button
              onClick={() => setShowEditorModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Review, Approve & Build Live App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <CompanionPanel
          targetLanguage={targetLanguage}
          messages={messages}
          generating={generating}
          onSubmit={handleSubmit}
          onUpload={handleUpload}
          onOpenDiscovery={() => setShowDiscoveryModal(true)}
        />
        <Canvas
          active={activeTab}
          onChange={setActiveTab}
          generated={generated}
          generating={generating}
          data={blueprintData}
          targetLanguage={targetLanguage}
          onUpdateAnalysis={handleUpdateAnalysis}
          onApproveAnalysis={handleApproveAnalysis}
        />
      </main>

      {/* Discovery Wizard & AI Business Consultant Modal */}
      <DiscoveryModal
        isOpen={showDiscoveryModal}
        onClose={() => setShowDiscoveryModal(false)}
        initialPrompt={lastPrompt || blueprintData?.user_problem || "Enterprise Solution"}
        targetLanguage={targetLanguage}
        onCompleteDiscovery={handleCompleteDiscovery}
      />

      {/* 1. Blueprint Review & Approval Modal */}
      <BlueprintEditorModal
        isOpen={showEditorModal}
        onClose={() => setShowEditorModal(false)}
        blueprint={blueprintData}
        onApproveAndBuild={handleApproveAndBuild}
        onRegenerate={() => {
          setShowEditorModal(false)
          runGeneration(undefined, lastPrompt, lastDocText)
        }}
        generating={generating}
      />

      {/* 2. Application Generation Build Progress Modal */}
      <BuildProgressModal
        isOpen={showBuildModal}
        projectName={blueprintData?.project_title || "Enterprise App"}
        onComplete={handleBuildComplete}
        onRetry={() => handleApproveAndBuild(blueprintData)}
        onCancel={() => {
          setShowBuildModal(false)
          setIsBuilding(false)
        }}
        buildError={buildError}
      />

      {/* 3. Live Success Result Modal */}
      <LiveSuccessModal
        isOpen={showLiveSuccessModal}
        onClose={() => setShowLiveSuccessModal(false)}
        project={currentProject}
        onEditRequirements={handleEditRequirements}
        onRegenerate={handleRegenerateFromSuccess}
        onDeployAgain={handleDeployAgain}
        onAIRefine={handleAIRefine}
      />

      {/* 4. Project Builds & Version History Modal */}
      <ProjectHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectProject={handleSelectProjectFromHistory}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                Share Architecture Blueprint
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Your blueprint has been saved. Copy the shareable link below to collaborate with team members:
            </p>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-800 outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer transition"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
