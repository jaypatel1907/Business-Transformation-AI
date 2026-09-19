"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, Paperclip, Lightbulb } from "lucide-react"
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
  onSubmit: (text: string) => void
  onUpload: (fileName: string) => void
}) {
  const [value, setValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, generating])

  const send = () => {
    const text = value.trim()
    if (!text || generating) return
    onSubmit(text)
    setValue("")
  }

  return (
    <section className="flex h-full min-h-0 flex-col border-slate-200 bg-slate-50 p-4 md:w-[35%] md:border-r md:p-6">
      <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">AI Architect</h2>
            <p className="text-[11px] text-slate-500">Understands goals · recommends stacks</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="thin-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m) => (
            <div key={m.id} className={`bp-fade-up flex ${m.role === "user" ? "justify-end" : ""}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "ai"
                    ? "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                    : "rounded-tr-sm bg-indigo-600 text-white"
                }`}
              >
                <p
                  className={`mb-1 text-[11px] font-semibold ${
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
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.3s]" />
              </span>
              <span>Designing your blueprint…</span>
            </div>
          ) : null}
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => onSubmit(p)}
              disabled={generating}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
            >
              <Lightbulb className="h-3 w-3 text-indigo-500" />
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 p-4">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUpload(f.name)
              e.target.value = ""
            }}
          />
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={generating}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              aria-label="Attach a document"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) send()
              }}
              placeholder="Describe your idea…"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={send}
              disabled={generating}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-50"
              aria-label="Send prompt"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
