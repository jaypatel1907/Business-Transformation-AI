"use client"

import { useCallback, useState } from "react"
import { TopNav } from "@/components/blueprint/top-nav"
import { CompanionPanel, type ChatMessage } from "@/components/blueprint/companion-panel"
import { Canvas, type TabId } from "@/components/blueprint/canvas"
import { samplePrompt } from "@/lib/blueprint-data"

let idCounter = 0
const nextId = () => `m-${idCounter++}`

const initialMessages: ChatMessage[] = [
  {
    id: nextId(),
    role: "ai",
    label: "AI Solution Architect",
    content:
      "Hello! I'm your AI Solution Architect. Describe your business requirement or problem statement on the left, and I'll generate a complete, implementation-ready architecture blueprint across all modules.",
  },
]

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [blueprintData, setBlueprintData] = useState<any>(null)

  const runGeneration = useCallback(async (userMessage: ChatMessage, rawPromptText?: string) => {
    setMessages((prev) => [...prev, userMessage])
    setGenerating(true)

    const promptToSend =
      rawPromptText ||
      (typeof userMessage.content === "string" ? userMessage.content : "Analyze this business requirement");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend }),
      })

      const result = await res.json()

      if (result.success && result.data) {
        const data = result.data
        setBlueprintData(data)

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
                <ul className="list-disc space-y-1 pl-4 text-xs text-slate-700">
                  <li>
                    <strong className="text-slate-900">Process Workflow:</strong> {data.bpmn_steps?.length || 4} customized workflow steps.
                  </li>
                  <li>
                    <strong className="text-slate-900">Database &amp; APIs:</strong> {data.database_tables?.map((t: any) => t.table_name).join(", ")} mapped.
                  </li>
                  <li>
                    <strong className="text-slate-900">Implementation Plan:</strong> Estimated at {data.planning?.effortHours || "240"} Hours ({data.planning?.cloudCost || "$120/mo"}).
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
  }, [])

  const handleSubmit = useCallback(
    (text: string) => {
      runGeneration({ id: nextId(), role: "user", label: "Business Idea", content: text }, text)
    },
    [runGeneration],
  )

  const handleUpload = useCallback(
    (fileName: string) => {
      runGeneration(
        {
          id: nextId(),
          role: "user",
          label: "Document Upload",
          content: (
            <span>
              Uploaded <strong className="text-slate-900">{fileName}</strong> — please analyze and build the solution architecture.
            </span>
          ),
        },
        `Analyze document ${fileName} and generate full architecture.`
      )
    },
    [runGeneration],
  )

  const handleLoadSample = useCallback(() => {
    runGeneration({ id: nextId(), role: "user", label: "Sample Project", content: samplePrompt }, samplePrompt)
  }, [runGeneration])

  const handleExport = useCallback(() => {
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <TopNav
        onLoadSample={handleLoadSample}
        onExport={handleExport}
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
    </div>
  )
}