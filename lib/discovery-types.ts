export type GapCategory = "People" | "Process" | "Technology" | "Data"
export type GapSeverity = "Critical" | "High" | "Medium" | "Low"
export type MaturityLevel = "Initial" | "Developing" | "Defined" | "Advanced" | "Optimized"

export interface GapItem {
  id: string
  category: GapCategory
  current_state: string
  future_state: string
  gap_description: string
  severity: GapSeverity
  mitigation_strategy: string
}

export interface MaturityDimension {
  name: string
  score: number // 0 - 100
  level: MaturityLevel
  description: string
  recommendation: string
}

export interface AIReadinessDimension {
  dimension: string
  score: number // 0 - 100
  status: "Ready" | "Needs Attention" | "Not Ready"
  finding: string
  action_item: string
}

export interface AIOpportunityItem {
  id: string
  title: string
  category: "Generative AI" | "Predictive Analytics" | "Intelligent Automation" | "Computer Vision & Voice"
  business_impact: "Transformational" | "High" | "Moderate"
  feasibility: "High (Plug & Play)" | "Medium (Custom Integration)" | "Complex (Custom Model Training)"
  estimated_roi: string
  time_to_value: string
  description: string
  recommended: boolean
}

export interface BusinessContext {
  business_domain: string
  target_audience: string
  operational_scale: "Startup / SME" | "Mid-Market" | "Enterprise" | "Global"
  primary_goals: string[]
  current_pain_points: string[]
  existing_systems: string[]
  budget_range: string
  target_timeline: string
  compliance_requirements: string[]
  discovery_completed: boolean
}

export interface DiscoveryQuestion {
  id: string
  category: "Goals & Audience" | "Operations & Pain Points" | "Technology & Constraints" | "AI & Innovation"
  question: string
  context_hint: string
  options: string[]
  selected_option?: string
  custom_answer?: string
}

export interface DeepBusinessAnalysis {
  project_title: string
  executive_summary: {
    strategic_intent: string
    key_value_drivers: string[]
    projected_roi_percentage: string
    estimated_payback_months: string
    operational_efficiency_gain: string
  }
  current_state: {
    summary: string
    manual_workflows: string[]
    core_bottlenecks: string[]
    legacy_limitations: string[]
  }
  future_state: {
    vision_summary: string
    automated_workflows: string[]
    ai_transformation_touchpoints: string[]
    target_kpis: string[]
  }
  gap_analysis: GapItem[]
  digital_maturity: {
    overall_score: number
    level: MaturityLevel
    dimensions: MaturityDimension[]
  }
  ai_readiness: {
    overall_score: number
    readiness_grade: "High AI Readiness" | "Moderate AI Readiness" | "Foundational Stage"
    dimensions: AIReadinessDimension[]
    key_enablers: string[]
    key_blockers: string[]
  }
  ai_opportunities: AIOpportunityItem[]
  is_approved?: boolean
  approved_at?: string
  approved_by?: string
}
