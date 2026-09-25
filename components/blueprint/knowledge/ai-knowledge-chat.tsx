"use client";

import { useState } from "react";
import { KnowledgeStore } from "@/lib/knowledge-types";
import { searchKnowledge, answerKnowledgeQuery } from "@/lib/knowledge-engine";
import {
  Sparkles,
  Search,
  Bot,
  Send,
  User,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface AIKnowledgeChatProps {
  knowledgeStore: KnowledgeStore;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Why did we choose PostgreSQL with RLS?",
  "What AI model architecture is deployed?",
  "Which manual bottlenecks were identified?",
  "What is the total initial CapEx and ROI?",
  "Which screens are mapped in UX traceability?",
];

export function AIKnowledgeChat({ knowledgeStore }: AIKnowledgeChatProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_init",
      sender: "assistant",
      text: `Hello! I am your Project Knowledge Copilot for **"${knowledgeStore.projectTitle}"**. You can ask me why specific architecture decisions were made, which processes are automated, how ROI was calculated, or search the requirement traceability matrix.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q || q.trim() === "") return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const answer = answerKnowledgeQuery(q, knowledgeStore);

    const botMsg: ChatMessage = {
      id: `b_${Date.now() + 1}`,
      sender: "assistant",
      text: answer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setQuery("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            AI Project Knowledge & Rationale Assistant
          </h3>
          <p className="text-xs text-slate-500">
            Grounded Q&A assistant querying immutable decisions, architecture trade-offs, and requirement matrices.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Grounded in Project Context
        </span>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="h-3 w-3 text-amber-500" /> Suggested:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto p-3 rounded-xl bg-slate-50/60 border border-slate-200/80">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender === "assistant" && (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4" />
              </span>
            )}

            <div
              className={`max-w-lg rounded-xl p-3 text-xs leading-relaxed space-y-1 ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div
                className={`text-[9px] ${
                  m.sender === "user" ? "text-indigo-200 text-right" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === "user" && (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-700 flex-shrink-0 mt-0.5">
                <User className="h-4 w-4" />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ask anything about architecture decisions, risk mitigation, or ROI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          Ask Copilot
        </button>
      </form>
    </div>
  );
}
