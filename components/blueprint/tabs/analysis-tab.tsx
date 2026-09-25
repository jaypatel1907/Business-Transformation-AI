"use client"

import { useState } from "react"
import { useRole } from "@/lib/role-context"
import { getTranslation } from "@/lib/i18n"
import { DeepBusinessAnalysis, GapItem, GapCategory, GapSeverity, AIOpportunityItem } from "@/lib/discovery-types"
import {
  BrainCircuit,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  Save,
  Check,
  Building,
  Target,
  Cpu,
  Zap,
  BarChart3,
  Users,
  Database,
  Briefcase
} from "lucide-react"

interface AnalysisTabProps {
  generated: boolean
  data?: any
  targetLanguage?: string
  onUpdateAnalysis?: (updatedAnalysis: DeepBusinessAnalysis) => void
  onApproveAnalysis?: (analysis: DeepBusinessAnalysis) => void
}

export function AnalysisTab({
  generated,
  data,
  targetLanguage = "English",
  onUpdateAnalysis,
  onApproveAnalysis
}: AnalysisTabProps) {
  const { role } = useRole()
  const isEmployee = role === "Employee"
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const t = getTranslation(targetLanguage || data?.target_language || "English")

  // Fallback / default rich analysis structure if not populated
  const defaultAnalysis: DeepBusinessAnalysis = data?.business_analysis || {
    project_title: data?.project_title || "Enterprise Solution Architecture",
    executive_summary: {
      strategic_intent:
        data?.user_problem || "Transform core operations with AI automation, real-time analytics, and scalable cloud architecture.",
      key_value_drivers: [
        "70% reduction in manual operational latency",
        "Automated 24/7 client interactions via AI agents",
        "Unified real-time data visibility across departments",
        "Elimination of double-bookings & inventory mismatches"
      ],
      projected_roi_percentage: "320%",
      estimated_payback_months: "4.5 Months",
      operational_efficiency_gain: "65%"
    },
    current_state: {
      summary: "Fragmented operations with manual spreadsheets, disconnected legacy tools, and slow customer resolution times.",
      manual_workflows: [
        "Manual phone/email order & booking processing",
        "Disjointed inventory counting and spreadsheet updates",
        "Manual customer query triage and delayed response"
      ],
      core_bottlenecks: [
        "High staff overtime during peak operational hours",
        "Lack of real-time multi-channel synchronization",
        "Prone to human entry errors and data inconsistency"
      ],
      legacy_limitations: [
        "No centralized API gateway or real-time event streaming",
        "Siloed user records without unified analytics"
      ]
    },
    future_state: {
      vision_summary: "AI-augmented digital enterprise with autonomous agent workflows, instant checkout, and real-time operational telemetry.",
      automated_workflows: [
        "Instant self-service web & mobile digital journey",
        "Autonomous AI agent for 24/7 customer queries & booking",
        "Real-time PostgreSQL database state with instant webhook sync"
      ],
      ai_transformation_touchpoints: [
        "Conversational AI Assistant for order & appointment triage",
        "Predictive demand forecasting & resource allocation",
        "Intelligent exception alerts & anomaly detection"
      ],
      target_kpis: [
        "Sub-second order confirmation latency",
        "99.9% uptime with scalable serverless cloud",
        "90%+ positive customer satisfaction score (CSAT)"
      ]
    },
    gap_analysis: [
      {
        id: "gap-1",
        category: "Process",
        current_state: "Manual order taking and reservation tracking via paper/phone",
        future_state: "Automated end-to-end digital booking & order dispatch",
        gap_description: "Missing automated scheduling and payment gateway capture",
        severity: "Critical",
        mitigation_strategy: "Implement direct API checkout with webhook payment confirmation"
      },
      {
        id: "gap-2",
        category: "Technology",
        current_state: "Fragmented tools with no central API database",
        future_state: "Cloud-native PostgreSQL database with Row-Level Security (RLS)",
        gap_description: "Lack of relational schema and unified REST endpoints",
        severity: "High",
        mitigation_strategy: "Provision structured tables and role-based access control (RBAC)"
      },
      {
        id: "gap-3",
        category: "Data",
        current_state: "Customer purchase history stored in disparate offline files",
        future_state: "Unified customer 360 profile with real-time telemetry",
        gap_description: "Inability to run personalized recommendation or loyalty engines",
        severity: "Medium",
        mitigation_strategy: "Consolidate user profiles in a secure encrypted database"
      },
      {
        id: "gap-4",
        category: "People",
        current_state: "Staff spends 60% of work hours on routine repetitive queries",
        future_state: "AI Copilot assists staff; routine requests resolved autonomously",
        gap_description: "Staff bandwidth exhausted on non-revenue administrative overhead",
        severity: "High",
        mitigation_strategy: "Deploy conversational AI assistant for frontline customer triage"
      }
    ],
    digital_maturity: {
      overall_score: data?.digital_maturity || 84,
      level: "Advanced",
      dimensions: [
        {
          name: "Strategy & Vision",
          score: 88,
          level: "Advanced",
          description: "Clear roadmap aligned with digital business transformation.",
          recommendation: "Establish quarterly KPI review cycles."
        },
        {
          name: "Technology Architecture",
          score: 82,
          level: "Defined",
          description: "Transitioning from legacy tools to modern cloud & API layers.",
          recommendation: "Implement microservices and automated CI/CD."
        },
        {
          name: "Data & Analytics",
          score: 78,
          level: "Defined",
          description: "Structured schemas designed for real-time tracking.",
          recommendation: "Build automated reporting dashboards."
        },
        {
          name: "Operations & Automation",
          score: 86,
          level: "Advanced",
          description: "Workflow automation eliminating manual handoffs.",
          recommendation: "Enable predictive inventory & scheduling."
        }
      ]
    },
    ai_readiness: {
      overall_score: data?.ai_adoption || 90,
      readiness_grade: "High AI Readiness",
      dimensions: [
        {
          dimension: "Data Quality & Availability",
          score: 84,
          status: "Ready",
          finding: "Relational tables and clean attributes prepared for LLM embeddings.",
          action_item: "Maintain data validation schemas."
        },
        {
          dimension: "Infrastructure & API Agility",
          score: 92,
          status: "Ready",
          finding: "Next.js / Node.js stack ready for high-throughput AI inference calls.",
          action_item: "Set up rate limiting and fallback cascades."
        },
        {
          dimension: "Team & Organizational Adoption",
          score: 86,
          status: "Ready",
          finding: "Staff eager to automate repetitive manual workloads.",
          action_item: "Provide interactive AI copilot training."
        },
        {
          dimension: "Governance, Security & Ethics",
          score: 88,
          status: "Ready",
          finding: "Role-based authentication (RBAC) and data isolation configured.",
          action_item: "Enforce audit logging and compliance checks."
        }
      ],
      key_enablers: [
        "Modern cloud API readiness",
        "Clean relational database schema",
        "Multi-model Gemini fallback architecture"
      ],
      key_blockers: [
        "Legacy staff habit of using manual spreadsheets",
        "Initial customer onboarding to self-service app"
      ]
    },
    ai_opportunities: [
      {
        id: "opp-1",
        title: "Conversational Customer Service AI Agent",
        category: "Generative AI",
        business_impact: "Transformational",
        feasibility: "High (Plug & Play)",
        estimated_roi: "340% ROI",
        time_to_value: "2-3 Weeks",
        description: "24/7 automated customer assistance for inquiries, bookings, orders, and instant FAQs.",
        recommended: true
      },
      {
        id: "opp-2",
        title: "Intelligent Dynamic Recommendation Engine",
        category: "Predictive Analytics",
        business_impact: "High",
        feasibility: "Medium (Custom Integration)",
        estimated_roi: "210% ROI",
        time_to_value: "4 Weeks",
        description: "Contextual upsell & cross-sell suggestions based on user preferences and purchase history.",
        recommended: true
      },
      {
        id: "opp-3",
        title: "Automated Workflow Dispatch & Anomaly Alerts",
        category: "Intelligent Automation",
        business_impact: "High",
        feasibility: "High (Plug & Play)",
        estimated_roi: "180% ROI",
        time_to_value: "1-2 Weeks",
        description: "Automated task triggers on new orders with instant manager alerts for delays.",
        recommended: true
      }
    ],
    is_approved: data?.business_analysis?.is_approved || false
  }

  const [analysis, setAnalysis] = useState<DeepBusinessAnalysis>(defaultAnalysis)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isEditing, setIsEditing] = useState(false)
  const [isApproved, setIsApproved] = useState(analysis.is_approved || false)
  const [newGap, setNewGap] = useState<Partial<GapItem>>({
    category: "Process",
    severity: "High",
    current_state: "",
    future_state: "",
    gap_description: "",
    mitigation_strategy: ""
  })
  const [showAddGapModal, setShowAddGapModal] = useState(false)

  if (!generated) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm space-y-3">
        <BrainCircuit className="h-10 w-10 text-indigo-400 mx-auto" />
        <p className="font-bold text-slate-700 text-base">
          {isGuj ? "બિઝનેસ એનાલિસિસ હજુ તૈયાર નથી" : "No Business Analysis Generated Yet"}
        </p>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {isGuj
            ? "ડાબી બાજુ બિઝનેસ રિક્વાયરમેન્ટ લખો અથવા 'Start Guided AI Discovery' પર ક્લિક કરીને ઊંડાણપૂર્વક એનાલિસિસ મેળવો."
            : "Enter your business idea on the left or run the Guided AI Discovery to generate the comprehensive Gap Analysis & Digital Maturity assessment."}
        </p>
      </div>
    )
  }

  const filteredGaps =
    selectedCategory === "All"
      ? analysis.gap_analysis
      : analysis.gap_analysis.filter((g) => g.category === selectedCategory)

  const handleApprove = () => {
    const updated = {
      ...analysis,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: role || "Manager"
    }
    setAnalysis(updated)
    setIsApproved(true)
    if (onApproveAnalysis) onApproveAnalysis(updated)
    if (onUpdateAnalysis) onUpdateAnalysis(updated)
  }

  const handleAddGap = () => {
    if (!newGap.current_state || !newGap.gap_description) return
    const gapToAdd: GapItem = {
      id: `gap-${Date.now()}`,
      category: (newGap.category as GapCategory) || "Process",
      current_state: newGap.current_state,
      future_state: newGap.future_state || "Automated Target State",
      gap_description: newGap.gap_description,
      severity: (newGap.severity as GapSeverity) || "High",
      mitigation_strategy: newGap.mitigation_strategy || "Implement engineered workflow"
    }
    const updated = {
      ...analysis,
      gap_analysis: [gapToAdd, ...analysis.gap_analysis]
    }
    setAnalysis(updated)
    if (onUpdateAnalysis) onUpdateAnalysis(updated)
    setShowAddGapModal(false)
    setNewGap({
      category: "Process",
      severity: "High",
      current_state: "",
      future_state: "",
      gap_description: "",
      mitigation_strategy: ""
    })
  }

  const handleDeleteGap = (id: string) => {
    const updated = {
      ...analysis,
      gap_analysis: analysis.gap_analysis.filter((g) => g.id !== id)
    }
    setAnalysis(updated)
    if (onUpdateAnalysis) onUpdateAnalysis(updated)
  }

  const getSeverityBadge = (sev: GapSeverity) => {
    switch (sev) {
      case "Critical":
        return "bg-rose-100 text-rose-800 border-rose-300"
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-slate-100 text-slate-700 border-slate-300"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Approval & Review Header */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/40 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                <BrainCircuit className="h-3.5 w-3.5" />
                {isGuj ? "ડીપ બિઝનેસ એનાલિસિસ એન્જિન" : "Deep Business Analysis & AI Consultant"}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                  isApproved
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }`}
              >
                {isApproved ? (isGuj ? "✅ એનાલિસિસ માન્ય (Approved)" : "✅ Analysis Approved") : (isGuj ? "⏳ સમીક્ષા બાકી (Pending Review)" : "⏳ Pending Review")}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
              {analysis.project_title || "Enterprise Digital Transformation"}
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              {analysis.executive_summary.strategic_intent}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
              {isEditing ? (isGuj ? "સેવ કરો" : "Done Editing") : (isGuj ? "એડિટ મોડ" : "Edit Analysis")}
            </button>

            {!isEmployee && !isApproved && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isGuj ? "એનાલિસિસ મંજૂર કરો (Approve)" : "Approve & Enrich Blueprint"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Value Driver Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{isGuj ? "અંદાજિત ROI" : "Projected ROI"}</span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">
            {analysis.executive_summary.projected_roi_percentage}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {isGuj ? "પેબેક પિરિયડ:" : "Payback Period:"} {analysis.executive_summary.estimated_payback_months}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{isGuj ? "ઓપરેશનલ કાર્યક્ષમતા" : "Efficiency Gain"}</span>
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-600">
            +{analysis.executive_summary.operational_efficiency_gain}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {isGuj ? "મેન્યુઅલ સમય બચત" : "Reduction in manual latency"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{isGuj ? "ડિજિટલ મેચ્યોરિટી" : "Digital Maturity"}</span>
            <Gauge className="h-5 w-5 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-purple-600">
            {analysis.digital_maturity.overall_score}%
          </p>
          <p className="mt-1 text-[11px] text-purple-700 font-semibold">
            {analysis.digital_maturity.level} Tier
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{isGuj ? "AI સ્વીકૃતિ રેડીનેસ" : "AI Adoption Grade"}</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {analysis.ai_readiness.overall_score}%
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
            {analysis.ai_readiness.readiness_grade}
          </p>
        </div>
      </div>

      {/* Current State vs Future State Split Comparator */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {isGuj ? "વર્તમાન સ્થિતિ vs ભવિષ્યની લક્ષિત સ્થિતિ" : "Current State vs. Target Future State Architecture"}
            </h3>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            Operational Paradigm Shift
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current State Card */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-white text-xs font-bold">
                1
              </span>
              <h4 className="font-bold text-rose-950 text-xs uppercase tracking-wider">
                {isGuj ? "વર્તમાન અડચણો (Current Bottlenecks)" : "As-Is: Current State Inefficiencies"}
              </h4>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {analysis.current_state.summary}
            </p>
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                {isGuj ? "મેન્યુઅલ પ્રક્રિયાઓ:" : "Manual Workflows & Pain Points:"}
              </p>
              <ul className="space-y-1.5 text-xs text-rose-900">
                {analysis.current_state.manual_workflows.map((wf, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{wf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Target Future State Card */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold">
                2
              </span>
              <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                {isGuj ? "ભવિષ્યની AI-ઓટોમેટેડ સિસ્ટમ (Target State)" : "To-Be: AI-Driven Target Architecture"}
              </h4>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {analysis.future_state.vision_summary}
            </p>
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                {isGuj ? "AI ઓટોમેશન ટચપોઇન્ટ્સ:" : "Automated Touchpoints & KPI Impact:"}
              </p>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {analysis.future_state.ai_transformation_touchpoints.map((tp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* PPTD Gap Analysis Matrix */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                {isGuj ? "PPTD ગેપ એનાલિસિસ મેટ્રિક્સ" : "People, Process, Technology & Data (PPTD) Gap Matrix"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isGuj
                ? "હાલની સિસ્ટમ અને લક્ષિત આર્કિટેક્ચર વચ્ચેના તફાવતો અને ઉકેલો"
                : "Identified operational & architectural gaps with severity and mitigation strategies"}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "People", "Process", "Technology", "Data"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
            {isEditing && (
              <button
                onClick={() => setShowAddGapModal(true)}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                {isGuj ? "ગેપ ઉમેરો" : "Add Gap"}
              </button>
            )}
          </div>
        </div>

        {/* Gap Cards Table */}
        <div className="grid grid-cols-1 gap-3">
          {filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-white space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    {gap.category}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getSeverityBadge(
                      gap.severity
                    )}`}
                  >
                    {gap.severity} Severity
                  </span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleDeleteGap(gap.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {isGuj ? "વર્તમાન ગેપ:" : "Identified Gap:"}
                  </p>
                  <p className="font-semibold text-slate-900 mt-0.5">{gap.gap_description}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {isGuj ? "હાલની પરિસ્થિતિ:" : "As-Is Status:"}
                  </p>
                  <p className="text-slate-600 mt-0.5">{gap.current_state}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    {isGuj ? "મિટીગેશન પ્લાન:" : "Mitigation Architecture:"}
                  </p>
                  <p className="text-emerald-800 font-medium mt-0.5">{gap.mitigation_strategy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Opportunities Portfolio */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {isGuj ? "AI ઓપોર્ચ્યુનિટી પોર્ટફોલિયો અને ROI" : "High-Impact AI Opportunity Portfolio"}
            </h3>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
            Prioritized Use Cases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.ai_opportunities.map((opp) => (
            <div
              key={opp.id}
              className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/30 to-white p-5 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                    {opp.category}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {opp.estimated_roi}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug">{opp.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{opp.description}</p>
              </div>

              <div className="pt-2 border-t border-purple-100/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {isGuj ? "ડિલિવરી:" : "Time-to-Value:"} <strong>{opp.time_to_value}</strong>
                </span>
                <span className="font-semibold text-indigo-600">{opp.feasibility}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Gap Modal */}
      {showAddGapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              {isGuj ? "નવો ગેપ ઉમેરો" : "Add Operational / Architectural Gap"}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={newGap.category}
                    onChange={(e) => setNewGap({ ...newGap, category: e.target.value as GapCategory })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                  >
                    <option value="Process">Process</option>
                    <option value="Technology">Technology</option>
                    <option value="Data">Data</option>
                    <option value="People">People</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Severity</label>
                  <select
                    value={newGap.severity}
                    onChange={(e) => setNewGap({ ...newGap, severity: e.target.value as GapSeverity })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Gap Description</label>
                <input
                  type="text"
                  placeholder="e.g. Lack of automated booking confirmation"
                  value={newGap.gap_description}
                  onChange={(e) => setNewGap({ ...newGap, gap_description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Current As-Is State</label>
                <input
                  type="text"
                  placeholder="e.g. Manual phone call confirmation"
                  value={newGap.current_state}
                  onChange={(e) => setNewGap({ ...newGap, current_state: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Mitigation Strategy</label>
                <input
                  type="text"
                  placeholder="e.g. Implement webhook notification trigger"
                  value={newGap.mitigation_strategy}
                  onChange={(e) => setNewGap({ ...newGap, mitigation_strategy: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddGapModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGap}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Add Gap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
