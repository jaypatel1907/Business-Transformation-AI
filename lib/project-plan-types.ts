/**
 * Canonical Project Plan Types
 * Single Source of Truth for Planning & ROI ↔ Roadmap Integration
 */

export interface CanonicalResource {
  id: string
  role: string
  count: number
  hours: number
  hourlyRate: number
  estimatedCost: number
  allocationPercent: number
  skills?: string[]
}

export interface CanonicalMilestone {
  id: string
  phaseId?: string
  phaseName?: string
  name: string
  description: string
  targetWeek: string
  status: "pending" | "in_progress" | "completed"
  deliverables: string[]
}

export interface CanonicalPhase {
  id: string
  sprintNumber: number
  timeframe: string // e.g. "Week 1-2"
  name: string
  phase: string
  description: string
  owner: string
  tech_stack: string[] | string
  ai_tools: string[] | string
  tasks: string[] | string
  effortHours: number
  estimatedCost: number
  resourceRoles: string[]
  dependencies: string[]
  milestones: string[]
  status: "planned" | "in_progress" | "completed"
}

export interface CanonicalFinancials {
  currency: string
  minBudget: string
  maxBudget: string
  targetBudgetAmount: number
  laborCost: number
  cloudMonthlyCost: string
  cloudDetail: string
  aiApiMonthlyCost: string
  contingencyAmount: number
  totalInvestment: number
  projectedAnnualBenefit: number
  roiPercentage: number
  paybackMonths: number
}

export interface CanonicalEffort {
  totalHours: number
  developmentHours: number
  designHours: number
  testingHours: number
  managementHours: number
  hoursPerWeek: number
}

export interface CanonicalRisk {
  id: string
  level: "Low" | "Low-Medium" | "Medium" | "High" | "Critical"
  title: string
  category: string
  mitigation: string
  owner?: string
}

export interface CanonicalProjectPlan {
  projectId: string
  projectTitle: string
  version: string
  status: "Draft" | "AI Generated" | "User Edited" | "Reviewed" | "Approved"
  lastUpdated: string
  timelineWindow: string // e.g. "6-8 Weeks"
  syncStatus: "synchronized" | "recalculation_needed" | "manual_override"
  financials: CanonicalFinancials
  effort: CanonicalEffort
  resources: CanonicalResource[]
  phases: CanonicalPhase[]
  milestones: CanonicalMilestone[]
  risks: CanonicalRisk[]
}
