"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, Paperclip, Lightbulb, FileText, X } from "lucide-react"
import { quickPrompts } from "@/lib/blueprint-data"

export type ChatMessage = {
  id: string
  role: "ai" | "user"
  label: string
  content: React.ReactNode
}

export function CompanionPanel({
  messages,
  generating,
  onSubmit,
  onUpload,
}: {
  messages: ChatMessage[]
  generating: boolean
  onSubmit: (text: string, documentText?: string, base64?: string, mimeType?: string) => void
  onUpload: (fileName: string) => void
}) {
  const [value, setValue] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [attachedFile, setAttachedFile] = useState<{ name: string; text: string; base64?: string; mimeType?: string; size: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, generating])

  const handleFileSelect = (file: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = (e.target?.result as string) || ""
      
      let base64Data = ""
      let plainText = ""

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        // extract base64 chunk from data URI
        base64Data = result.includes("base64,") ? result.split("base64,")[1] : result
      } else {
        plainText = result
      }

      setAttachedFile({
        name: file.name,
        text: plainText,
        base64: base64Data,
        mimeType: file.type || "application/pdf",
        size: `${(file.size / 1024).toFixed(1)} KB`,
      })
      onUpload(file.name)
    }
    
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const send = () => {
    const text = value.trim()
    if ((!text && !attachedFile) || generating) return
    onSubmit(text || `Analyze uploaded document: ${attachedFile?.name}`, attachedFile?.text, attachedFile?.base64, attachedFile?.mimeType)
    setValue("")
    setAttachedFile(null)
  }

  return (
    <section className="flex h-full min-h-0 flex-col border-slate-200 bg-slate-50 p-4 md:w-[35%] md:border-r md:p-6">
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">AI Architect Assistant</h2>
            <p className="text-[11px] text-slate-500">Document Parser & Architecture Builder</p>
          </div>
        </div>

        {/* Messages */}
        <div
          id="chat-messages-container"
          ref={scrollRef}
          className="thin-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
        >
          {messages.map((m, idx) => (
            <div key={`${m.id || "msg"}-${idx}`} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-2xs ${
                  m.role === "ai"
                    ? "rounded-tl-xs border border-slate-200 bg-white text-slate-800"
                    : "rounded-tr-xs bg-indigo-600 text-white font-medium"
                }`}
              >
                <p
                  className={`mb-1 text-[11px] font-bold ${
                    m.role === "ai" ? "text-indigo-600" : "text-indigo-100"
                  }`}
                >
                  {m.label}
                </p>
                {m.content}
              </div>
            </div>
          ))}

          {generating ? (
            <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:0.3s]" />
              </span>
              <span className="font-semibold">Analyzing requirements & generating solution blueprint...</span>
            </div>
          ) : null}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {quickPrompts.slice(0, 3).map((p) => (
            <button
              key={p}
              onClick={() => onSubmit(p)}
              disabled={generating}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 cursor-pointer"
            >
              <Lightbulb className="h-3 w-3 text-amber-500" />
              {p}
            </button>
          ))}
        </div>

        {/* Attached Document Preview Badge */}
        {attachedFile && (
          <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-xs text-indigo-900">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              <span className="truncate font-semibold">{attachedFile.name}</span>
              <span className="text-[10px] text-indigo-600 font-mono">({attachedFile.size})</span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="text-indigo-400 hover:text-indigo-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Input & Drag Dropzone Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-t border-slate-200 p-3 bg-white transition ${
            isDragging ? "bg-indigo-50/80 border-indigo-400" : ""
          }`}
        >
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.docx,.txt,.md,.json,.csv"
            className="hidden"
          />

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <button
              onClick={() => fileRef.current?.click()}
              type="button"
              title="Upload PDF, DOCX, TXT, BRD, SOP Document"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 transition cursor-pointer"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <textarea
              rows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Describe your business idea or drag & drop SOP/BRD document here..."
              className="flex-1 resize-none bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              onClick={send}
              disabled={(!value.trim() && !attachedFile) || generating}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span>Supports .pdf, .docx, .txt, .md, .brd</span>
            <span>Press Enter to Submit</span>
          </div>
        </div>
      </div>
    </section>
  )
}
