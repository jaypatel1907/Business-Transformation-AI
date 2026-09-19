"use client"

import { useCallback, useEffect, useState } from "react"
import { TopNav } from "@/components/blueprint/top-nav"
import { CompanionPanel, type ChatMessage } from "@/components/blueprint/companion-panel"
import { Canvas, type TabId } from "@/components/blueprint/canvas"
import { samplePrompt } from "@/lib/blueprint-data"
import { saveBlueprintLocally, getLocalBlueprints } from "@/lib/supabase"
import { Check, Copy, Share2, X, Download } from "lucide-react"

let idCounter = 0
const nextId = () => `m-${idCounter++}`

const initialMessages: ChatMessage[] = [
  {
    id: nextId(),
    role: "ai",
    label: "AI Solution Architect",
    content:
      "Hello! I'm your Futurrizon AI Solution Architect. Describe your business requirement or upload a BRD/SOP document on the left, and I'll generate a complete, implementation-ready architecture blueprint across all modules.",
  },
]

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [blueprintData, setBlueprintData] = useState<any>(null)
  const [targetLanguage, setTargetLanguage] = useState("en")
  
  // Share Modal & Version History Drawer states
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  // Restore saved blueprint if URL has blueprintId parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHistory(getLocalBlueprints())
      const params = new URLSearchParams(window.location.search)
      const bpId = params.get("blueprintId")
      if (bpId) {
        const localList = getLocalBlueprints()
        const found = localList.find((b) => b.id === bpId)
        if (found && found.blueprint_data) {
          setBlueprintData(found.blueprint_data)
          setGenerated(true)
        }
      }
    }
  }, [])

  const runGeneration = useCallback(async (userMessage: ChatMessage, rawPromptText?: string, documentText?: string) => {
    setMessages((prev) => [...prev, userMessage])
    setGenerating(true)

    const promptToSend =
      rawPromptText ||
      (typeof userMessage.content === "string" ? userMessage.content : "Analyze this business requirement");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          documentText,
          targetLanguage,
          selectedModel: "gemini-1.5-flash"
        }),
      })

      const result = await res.json()

      if (result.success && result.data) {
        const data = result.data
        setBlueprintData(data)

        // Save automatically to history
        const savedRecord = saveBlueprintLocally(data)
        setHistory(getLocalBlueprints())

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "ai",
            label: "AI Solution Architect",
            content: (
              <div className="space-y-2">
                <p className="font-bold text-slate-900">
                  ✨ Generated Blueprint: <span className="text-indigo-700">{data.project_title}</span>
                </p>
                <p className="text-xs text-slate-600">
                  Maturity: <strong>{data.digital_maturity}%</strong> | AI Readiness: <strong>{data.ai_adoption}%</strong> | Timeline: <strong>{data.timeline}</strong>
                </p>
                <p className="text-xs text-slate-600">
                  Est. Budget: <strong>{data.financial_estimation?.min_budget || "$18,000"} - {data.financial_estimation?.max_budget || "$32,000"}</strong> ({data.financial_estimation?.total_hours || "240 Hours"})
                </p>
                <ul className="list-disc space-y-1 pl-4 text-xs text-slate-700">
                  <li>
                    <strong className="text-slate-900">Process Workflow:</strong> {data.bpmn_steps?.length || 4} workflow steps mapped.
                  </li>
                  <li>
                    <strong className="text-slate-900">Database &amp; APIs:</strong> {data.database_tables?.map((t: any) => t.table_name).join(", ")} generated.
                  </li>
                  <li>
                    <strong className="text-slate-900">Resource Allocation:</strong> {data.financial_estimation?.team_roles?.length || 4} engineering roles assigned.
                  </li>
                </ul>
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
  }, [targetLanguage])

  const handleSubmit = useCallback(
    (text: string, documentText?: string) => {
      runGeneration({ id: nextId(), role: "user", label: "Business Requirement", content: text }, text, documentText)
    },
    [runGeneration],
  )

  const handleUpload = useCallback(
    (fileName: string) => {
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
    },
    [],
  )

  const handleLoadSample = useCallback(() => {
    runGeneration({ id: nextId(), role: "user", label: "Sample Requirement", content: samplePrompt }, samplePrompt)
  }, [runGeneration])

  // Export handlers
  const handleExportPDF = useCallback(() => {
    if (!blueprintData) return
    window.print()
  }, [blueprintData])

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

## Sprint Release Plan
${blueprintData.sprint_plan?.map((s: any) => `### ${s.sprint}: ${s.title}\n- **Deliverables**: ${s.focus}`).join("\n\n")}
`

    const mdBlob = `data:text/markdown;charset=utf-8,${encodeURIComponent(mdContent)}`
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", mdBlob)
    downloadAnchor.setAttribute("download", fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }, [blueprintData])

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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <TopNav
        onLoadSample={handleLoadSample}
        onExportPDF={handleExportPDF}
        onExportMarkdown={handleExportMarkdown}
        onExportJSON={handleExportJSON}
        onSaveAndShare={handleSaveAndShare}
        targetLanguage={targetLanguage}
        onLanguageChange={setTargetLanguage}
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