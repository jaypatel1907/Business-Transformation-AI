"use client"

import { useState, useEffect } from "react"
import { DiscoveryQuestion, BusinessContext } from "@/lib/discovery-types"
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Bot,
  BrainCircuit,
  Sliders,
  X,
  RefreshCw,
  Lightbulb,
  Building,
  Target,
  Cpu,
  Layers
} from "lucide-react"

interface DiscoveryModalProps {
  isOpen: boolean
  onClose: () => void
  initialPrompt: string
  targetLanguage?: string
  onCompleteDiscovery: (context: BusinessContext, answers: DiscoveryQuestion[]) => void
}

export function DiscoveryModal({
  isOpen,
  onClose,
  initialPrompt,
  targetLanguage = "English",
  onCompleteDiscovery
}: DiscoveryModalProps) {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<DiscoveryQuestion[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [consultantFeedback, setConsultantFeedback] = useState<string>("")

  // Fetch or initialize discovery questions
  const loadDiscoveryQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: initialPrompt || "Enterprise Business Transformation Platform",
          language: targetLanguage
        })
      })
      const data = await res.json()
      if (data.success && data.questions?.length) {
        setQuestions(data.questions)
        const initialAnswers: Record<string, string> = {}
        data.questions.forEach((q: DiscoveryQuestion) => {
          initialAnswers[q.id] = q.selected_option || q.options[0] || ""
        })
        setAnswers(initialAnswers)
        setConsultantFeedback(
          targetLanguage.toLowerCase().includes("gu")
            ? "તમારી જરૂરિયાતો અનુસાર પ્રશ્નો તૈયાર કરવામાં આવ્યા છે. યોગ્ય વિકલ્પો પસંદ કરો."
            : "Tailored discovery questions generated. Select options or type custom requirements to refine the architecture."
        )
      }
    } catch (err) {
      console.error("Discovery question load error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadDiscoveryQuestions()
      setActiveStep(0)
    }
  }, [isOpen, initialPrompt, targetLanguage])

  if (!isOpen) return null

  const currentQ = questions[activeStep]
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const handleSelectOption = (qId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }))
    setCustomInputs((prev) => ({ ...prev, [qId]: "" }))
  }

  const handleCustomInputChange = (qId: string, text: string) => {
    setCustomInputs((prev) => ({ ...prev, [qId]: text }))
    setAnswers((prev) => ({ ...prev, [qId]: text }))
  }

  const handleNext = () => {
    if (activeStep < questions.length - 1) {
      setActiveStep((prev) => prev + 1)
    } else {
      finalizeDiscovery()
    }
  }

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1)
    }
  }

  const finalizeDiscovery = () => {
    const updatedQuestions = questions.map((q) => ({
      ...q,
      selected_option: answers[q.id] || q.options[0],
      custom_answer: customInputs[q.id] || undefined
    }))

    const businessContext: BusinessContext = {
      business_domain: initialPrompt || "Custom Enterprise Solution",
      target_audience: answers["q1"] || "Direct Consumers & Enterprise Users",
      operational_scale: "Mid-Market",
      primary_goals: [answers["q1"] || "Transform operations and increase efficiency"],
      current_pain_points: [answers["q2"] || "Manual overhead and workflow bottlenecks"],
      existing_systems: [answers["q3"] || "Cloud Infrastructure + Modern APIs"],
      budget_range: "$20,000 - $40,000",
      target_timeline: "6-8 Weeks",
      compliance_requirements: ["SOC2", "GDPR", "Secure RLS Data Isolation"],
      discovery_completed: true
    }

    // Save to local storage for persistent context
    try {
      localStorage.setItem("ai_discovery_context", JSON.stringify(businessContext))
      localStorage.setItem("ai_discovery_questions", JSON.stringify(updatedQuestions))
    } catch (e) {
      console.warn("Could not save to localStorage", e)
    }

    onCompleteDiscovery(businessContext, updatedQuestions)
    onClose()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Goals & Audience":
        return <Target className="h-4 w-4 text-indigo-600" />
      case "Operations & Pain Points":
        return <Building className="h-4 w-4 text-amber-600" />
      case "Technology & Constraints":
        return <Cpu className="h-4 w-4 text-emerald-600" />
      case "AI & Innovation":
        return <Sparkles className="h-4 w-4 text-purple-600" />
      default:
        return <BrainCircuit className="h-4 w-4 text-indigo-600" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {isGuj ? "AI બિઝનેસ કન્સલ્ટન્ટ — ઇન્ટરેક્ટિવ ડિસ્કવરી" : "AI Business Consultant — Interactive Discovery"}
                </h3>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                  Phase 1 Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isGuj
                  ? "તમારી રિક્વાયરમેન્ટને સ્પષ્ટ કરીને ચોક્કસ એન્ટરપ્રાઈઝ આર્કિટેક્ચર બનાવો"
                  : "Clarify requirements, pain points, and target KPIs for precise blueprint synthesis"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar Steps */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>
              {isGuj ? `પગલું ${activeStep + 1} માંથી ${questions.length || 4}` : `Step ${activeStep + 1} of ${questions.length || 4}`}
            </span>
            <span className="text-indigo-600 font-bold">
              {questions.length > 0 ? Math.round(((activeStep + 1) / questions.length) * 100) : 25}% {isGuj ? "પૂર્ણ" : "Completed"}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= activeStep ? "bg-indigo-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-semibold text-slate-700">
                {isGuj ? "AI કન્સલ્ટન્ટ પ્રશ્નો તૈયાર કરી રહ્યું છે..." : "AI Consultant is analyzing domain and synthesizing discovery questions..."}
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Calibrating interview across Business Scope, Current Bottlenecks, Architecture Constraints, and AI Capabilities.
              </p>
            </div>
          ) : currentQ ? (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Question Banner */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs border border-slate-200">
                    {getCategoryIcon(currentQ.category)}
                    {currentQ.category}
                  </span>
                  <span className="text-[11px] text-indigo-700 font-medium">
                    {isGuj ? "AI કન્સલ્ટન્ટ સવાલ" : "Consultant Probing Point"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">{currentQ.question}</h4>
                {currentQ.context_hint && (
                  <p className="mt-1.5 text-xs text-slate-600 flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{currentQ.context_hint}</span>
                  </p>
                )}
              </div>

              {/* Selectable Options */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isGuj ? "ભલામણ કરેલા વિકલ્પો પસંદ કરો:" : "Select Recommended Strategy:"}
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQ.id] === opt && !customInputs[currentQ.id]
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt)}
                        className={`flex items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-600"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                            isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-3 w-3" />}
                        </div>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Input Override */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>{isGuj ? "અથવા તમારો કસ્ટમ જવાબ લખો:" : "Or provide custom specifications:"}</span>
                  <span className="text-[11px] font-normal text-slate-400">Optional</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    isGuj
                      ? "તમારો ચોક્કસ જવાબ અથવા રિક્વાયરમેન્ટ અહી લખો..."
                      : "Type specific domain requirements, existing software, or custom goals..."
                  }
                  value={customInputs[currentQ.id] || ""}
                  onChange={(e) => handleCustomInputChange(currentQ.id, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* AI Consultant Insight Box */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 flex items-start gap-3 text-xs text-emerald-900">
                <Bot className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-800">
                    {isGuj ? "કન્સલ્ટન્ટ એડવાઈસ:" : "Consultant Strategic Advice:"}
                  </p>
                  <p className="text-emerald-700 text-[11px] leading-relaxed">
                    {answers[currentQ.id]
                      ? `Selected: "${answers[currentQ.id]}". This feeds directly into the Solution Architecture & API models.`
                      : "Choosing high-specificity options accelerates the gap analysis and DDL generation accuracy."}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeStep === 0 || loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {isGuj ? "પાછળ" : "Previous"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={finalizeDiscovery}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              {isGuj ? "ડિસ્કવરી સ્કીપ કરો" : "Skip Discovery"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <span>
                {activeStep === questions.length - 1
                  ? isGuj
                    ? "વિશ્લેષણ અને બ્લુપ્રિન્ટ બનાવો"
                    : "Generate Business Analysis & Blueprint"
                  : isGuj
                  ? "આગળ વધો"
                  : "Next Step"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
