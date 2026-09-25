export type DataSourceType = "Calculated" | "AI Estimated" | "User Provided" | "Derived" | "System"

export type HealthStatusType = "Healthy" | "Attention Required" | "Blocked" | "Incomplete"

export type ExecutiveFilterType = "all" | "executive" | "business" | "technology" | "ai" | "process" | "financial"

export interface ExecutiveKPI {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  source: DataSourceType
  category: "financial" | "technical" | "process" | "ai" | "maturity"
  benchmark?: string
  details?: string
}

export interface TransformationScoreDimension {
  id: string
  name: string
  score: number // 0 - 100
  weight: number
  status: "Optimized" | "Ready" | "Developing" | "Nascent" | "Not Available"
  rationale: string
  source: DataSourceType
}

export interface CurrentVsFutureStep {
  stepNumber: number
  currentState: string
  futureState: string
  automationType: "Fully Automated" | "AI Assisted" | "Human in the Loop" | "Optimized Manual"
  manualEffortReduction: string
  techEnabler: string
  riskLevel?: "Low" | "Medium" | "High"
}

export interface CurrentVsFutureTransformation {
  overview: string
  totalManualHoursSavedWeekly: number | string
  automationPercentage: number
  aiTouchpointsCount: number
  integrationsCount: number
  steps: CurrentVsFutureStep[]
}

export interface AIOpportunityPortfolioItem {
  id: string
  title: string
  category: "Generative AI" | "Predictive AI" | "Computer Vision" | "NLP / Chat" | "RPA & Automation" | "Process AI"
  businessValue: string
  impact: "High" | "Medium" | "Low"
  feasibility: "High" | "Medium" | "Low"
  timeToValue: string
  status: "Recommended" | "Planned" | "Under Review" | "Active"
  description: string
  potentialRisks?: string
  prerequisites?: string[]
}

export interface RoadmapPhaseStatus {
  id: string
  phaseNumber: number
  title: string
  timeframe: string
  status: "Completed" | "In Progress" | "Upcoming" | "Pending Approval"
  owner: string
  techStack: string[]
  deliverables: string[]
  keyMilestone: string
}

export interface FinancialBreakdown {
  totalEstimatedInvestment: string
  minBudget: string
  maxBudget: string
  developmentCost: string
  cloudInfrastructureMonthly: string
  aiApiUsageMonthly: string
  ongoingMaintenanceAnnual: string
  estimatedHours: string
  hourlyRate: string
  teamSize: number
  teamRoles: Array<{
    role: string
    count: number
    allocation: string
  }>
  source: DataSourceType
}

export interface ROIEstimate {
  expectedROI: string // e.g. "280%"
  paybackPeriod: string // e.g. "7.5 Months"
  annualBenefit: string // e.g. "$145,000 / yr"
  efficiencyGain: string // e.g. "+42% Velocity"
  costSavingsAnnual: string // e.g. "$68,000 / yr"
  source: DataSourceType
  calculationNotes: string
}

export interface RiskItem {
  id: string
  title: string
  category: "Technical" | "Business" | "Data" | "Security" | "AI" | "Operational" | "Timeline" | "Budget"
  severity: "Critical" | "High" | "Medium" | "Low"
  probability: "High" | "Medium" | "Low"
  impact: string
  mitigation: string
  status: "Open" | "Mitigated" | "Monitoring" | "Accepted"
}

export interface ExecutiveAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  description: string
  sourcePhase: "Discovery" | "Analysis" | "Process" | "UX" | "Planning" | "Architecture"
  targetTab?: "analysis" | "dashboard" | "process" | "bpmn" | "db" | "wireframe" | "roadmap"
  actionLabel?: string
}

export interface NextBestAction {
  id: string
  priority: "Immediate" | "High" | "Medium" | "Low"
  title: string
  description: string
  ownerRole: string
  targetTab: "analysis" | "dashboard" | "process" | "bpmn" | "db" | "wireframe" | "roadmap"
  ctaText: string
  estimatedEffort: string
}

export interface ProjectHealthDimension {
  dimension: "Scope" | "Timeline" | "Budget" | "Technical Readiness" | "Business Alignment" | "AI Safety & Ethics"
  status: HealthStatusType
  score: number // 0 - 100
  summary: string
  flagsCount: number
}

export interface TransformationDashboardData {
  projectId: string
  projectTitle: string
  industry: string
  targetAudience: string
  lastUpdated: string
  overallTransformationProgress: number // 0 - 100
  status: "Draft" | "Under Review" | "Approved" | "In Execution"

  // Core Sections
  executiveSummary: {
    businessProblem: string
    transformationObjective: string
    expectedOutcome: string
    strategicIntent: string
    targetMVP: string
  }

  kpis: ExecutiveKPI[]
  readinessScores: TransformationScoreDimension[]
  currentVsFuture: CurrentVsFutureTransformation
  aiOpportunities: AIOpportunityPortfolioItem[]
  roadmap: RoadmapPhaseStatus[]
  financials: FinancialBreakdown
  roi: ROIEstimate
  risks: RiskItem[]
  alerts: ExecutiveAlert[]
  nextActions: NextBestAction[]
  health: ProjectHealthDimension[]
}
