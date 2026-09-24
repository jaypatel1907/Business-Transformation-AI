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
import { Check, Copy, Share2, X } from "lucide-react"

let idCounter = 0
const nextId = () => `m-${idCounter++}`

const initialMessages: ChatMessage[] = [
  {
    id: nextId(),
    role: "ai",
    label: "AI Solution Architect",
    content:
      "Hello! I'm your Futurrizon AI Solution Architect. Describe your business requirement or upload a BRD/SOP document on the left, and I'll generate a complete, implementation-ready architecture blueprint tailored to your active workspace role.",
  },
]

export default function Page() {
  const { isAuthenticated, role } = useRole()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [blueprintData, setBlueprintData] = useState<any>(null)
  const [targetLanguage, setTargetLanguage] = useState("English") // Defaulting to English
  const [lastPrompt, setLastPrompt] = useState<string>("")
  const [lastDocText, setLastDocText] = useState<string | undefined>(undefined)

  // Share Modal states
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

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

  const runGeneration = useCallback(
    async (
      userMessage?: ChatMessage,
      rawPromptText?: string,
      documentText?: string,
      langToUse?: string,
      docBase64?: string,
      docMimeType?: string
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
                <div className="space-y-4">
                  <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                    {currentLang === "Gujarati" 
                      ? "અરે વાહ! તમારો આઈડિયા ખૂબ જ સરસ છે. ચાલો હું તમને આ પ્રોજેક્ટ કઈ રીતે બનાવવો તે માટે સ્ટેપ-બાય-સ્ટેપ ગાઇડ કરું:"
                      : "Great idea! Here is a simple, step-by-step guide on how we will build your project:"}
                  </p>
                  
                  <div className="space-y-4 mt-3">
                    {data.bpmn_steps?.map((step: any, idx: number) => (
                      <div key={idx} className="text-[13px] text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-1">
                          {currentLang === "Gujarati" ? "સ્ટેપ" : "Step"} {idx + 1}: {step.title}
                        </strong>
                        <span className="whitespace-pre-line">{step.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-xl">
                    <p className="text-[13px] text-indigo-800 font-medium leading-relaxed">
                      👉 <strong>{currentLang === "Gujarati" ? "વધુ માહિતી:" : "More Info:"}</strong>{" "}
                      {currentLang === "Gujarati" 
                        ? "મેં આ પ્રોજેક્ટ માટે જરૂરી ડેટાબેઝ, વાયરફ્રેમ (ડિઝાઈન) અને આર્કિટેક્ચર પણ બનાવી દીધું છે. જમણી બાજુ આપેલા Tabs પર ક્લિક કરીને તમે આખી સિસ્ટમનો પ્લાન જોઈ શકો છો!"
                        : "I have also created the full Database schema, APIs, and UX Wireframes for this project. Click the Tabs on the right to view the complete blueprint!"}
                    </p>
                  </div>
                </div>
              ),
            },
          ])
          setGenerated(true)
          setActiveTab("dashboard")
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
    [targetLanguage, lastPrompt, lastDocText, role, blueprintData]
  )

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
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <TopNav
        onExportExecutivePDF={handleExportExecutivePDF}
        onExportGuideRoadmapPDF={handleExportGuideRoadmapPDF}
        onExportDatabaseApiPDF={handleExportDatabaseApiPDF}
        onExportWireframePDF={handleExportWireframePDF}
        onExportChatPDF={handleExportChatPDF}
        onExportMarkdown={handleExportMarkdown}
        onExportJSON={handleExportJSON}
        targetLanguage={targetLanguage}
        onLanguageChange={handleLanguageChange}
        generating={generating}
        hasBlueprintData={!!blueprintData}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <CompanionPanel
          messages={messages}
          generating={generating}
          onSubmit={handleSubmit}
          onUpload={handleUpload}
        />
        <Canvas
          active={activeTab}
          onChange={setActiveTab}
          generated={generated}
          generating={generating}
          data={blueprintData}
          targetLanguage={targetLanguage}
        />
      </main>

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