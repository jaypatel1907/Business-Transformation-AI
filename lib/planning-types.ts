/**
 * Phase 4 — AI Planning, Cost, ROI & Resource Estimation Types
 *
 * All types used by the Planning Engine, UI components, and adapters.
 * Phase 3 compatibility: getPlanningUXContext() adapter is included.
 * Phase 2 compatibility: getPlanningProcessContext() adapter is included.
 * Calculations are deterministic — AI only generates structured inputs.
 */

// ──────────────────────────────────────────────────────────────────────────────
// 1. CORE ENUMS
// ──────────────────────────────────────────────────────────────────────────────
export type WorkItemCategory =
  | "discovery"
  | "ux_design"
  | "frontend"
  | "backend"
  | "database"
  | "ai_ml"
  | "integration"
  | "testing"
  | "devops"
  | "security"
  | "documentation"
  | "project_management";

export type ComplexityLevel = "low" | "medium" | "high" | "very_high";
export type RiskProbability = "low" | "medium" | "high";
export type RiskImpact = "low" | "medium" | "high" | "critical";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type RiskCategory =
  | "technical"
  | "financial"
  | "operational"
  | "security"
  | "data"
  | "ai"
  | "integration"
  | "resource"
  | "schedule";
export type ScenarioType = "mvp" | "standard" | "enterprise";
export type ConfidenceLevel = "high" | "medium" | "low";

// ──────────────────────────────────────────────────────────────────────────────
// 2. WORK BREAKDOWN STRUCTURE
// ──────────────────────────────────────────────────────────────────────────────
export interface WorkItem {
  id: string;
  wbsCode: string;       // e.g. "3.1", "3.2.1"
  title: string;
  description: string;
  category: WorkItemCategory;
  phase: string;
  estimatedHours: {
    low: number;
    likely: number;
    high: number;
  };
  complexity: ComplexityLevel;
  dependencies: string[];  // IDs of other WorkItems
  assignedRole: string;
  status: "todo" | "in_progress" | "done";
  isAIGenerated: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. RESOURCES
// ──────────────────────────────────────────────────────────────────────────────
export interface ResourceRole {
  id: string;
  role: string;
  skills: string[];
  allocationPercent: number;
  estimatedHours: number;
  hourlyRate: number;          // Planning Assumption (not market guaranteed)
  estimatedCost: number;       // calculated: estimatedHours × hourlyRate
  durationWeeks: number;
  responsibilities: string[];
  isAssumption: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// 4. MILESTONE & TIMELINE
// ──────────────────────────────────────────────────────────────────────────────
export interface Milestone {
  id: string;
  name: string;
  description: string;
  phase: string;
  durationWeeks: number;
  offsetWeeks: number;     // weeks from project start
  dependencies: string[];
  deliverables: string[];
  criticalPath: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// 5. COST MODEL
// ──────────────────────────────────────────────────────────────────────────────
export interface CostLine {
  category: string;
  label: string;
  amount: number;
  type: "one_time" | "monthly" | "annual";
  isAssumption: boolean;
  notes?: string;
}

export interface CostModel {
  currency: string;
  developmentCost: number;
  uiUxDesignCost: number;
  aiIntegrationCost: number;
  infrastructureMonthlyCost: number;
  aiApiMonthlyCost: number;
  testingCost: number;
  deploymentCost: number;
  projectManagementCost: number;
  contingencyPercent: number;
  contingencyAmount: number;
  totalInitialCost: number;
  recurringMonthlyCost: number;
  annualOperatingCost: number;
  lines: CostLine[];
  // Range
  low: number;
  expected: number;
  high: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// 6. ROI MODEL
// ──────────────────────────────────────────────────────────────────────────────
export interface ROIAssumption {
  key: string;
  label: string;
  value: number;
  unit: string;
  isUserProvided: boolean;
  notes: string;
}

export interface ROIScenario {
  scenario: "conservative" | "expected" | "optimistic";
  label: string;
  annualLaborSaving: number;
  annualRevenueLift: number;
  annualOtherBenefit: number;
  annualBenefit: number;
  annualOperatingCost: number;
  netAnnualBenefit: number;
  paybackMonths: number | null;
  firstYearROI: number | null;
  threeYearROI: number | null;
}

export interface ROIModel {
  initialInvestment: number;
  currency: string;
  assumptions: ROIAssumption[];
  scenarios: ROIScenario[];
  formulaNotes: string[];
}

// ──────────────────────────────────────────────────────────────────────────────
// 7. RISK REGISTER
// ──────────────────────────────────────────────────────────────────────────────
export interface ProjectRisk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: RiskProbability;
  impact: RiskImpact;
  severity: RiskSeverity;
  mitigation: string;
  owner: string;
  contingency?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// 8. PLANNING SCENARIO (MVP vs Standard vs Enterprise)
// ──────────────────────────────────────────────────────────────────────────────
export interface PlanningScenario {
  type: ScenarioType;
  label: string;
  description: string;
  teamSize: string;
  durationWeeks: number;
  featuresIncluded: string[];
  featuresExcluded: string[];
  estimatedCost: { low: number; expected: number; high: number };
  estimatedROI: number | null;
  paybackMonths: number | null;
  riskLevel: "low" | "medium" | "high";
  recommendation?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// 9. PLANNING ASSUMPTIONS
// ──────────────────────────────────────────────────────────────────────────────
export interface PlanningAssumptions {
  currency: string;
  // Labor rates
  frontendDevRate: number;
  backendDevRate: number;
  fullstackDevRate: number;
  aiMlRate: number;
  uiUxRate: number;
  qaRate: number;
  devopsRate: number;
  pmRate: number;
  // Hours
  hoursPerWeek: number;
  // Cloud
  monthlyCloudCost: number;
  monthlyAIAPICost: number;
  // ROI
  staffHourlyCostForROI: number;
  expectedAutomationRatePercent: number;
  expectedAdoptionRatePercent: number;
  annualTransactionVolume: number;
  // Team
  teamScenario: "lean" | "standard" | "accelerated";
  // Source flags
  userModified: boolean;
}

export const DEFAULT_ASSUMPTIONS: PlanningAssumptions = {
  currency: "₹",
  frontendDevRate: 1800,
  backendDevRate: 2200,
  fullstackDevRate: 2400,
  aiMlRate: 3200,
  uiUxRate: 1600,
  qaRate: 1200,
  devopsRate: 2600,
  pmRate: 2000,
  hoursPerWeek: 40,
  monthlyCloudCost: 8500,
  monthlyAIAPICost: 3500,
  staffHourlyCostForROI: 500,
  expectedAutomationRatePercent: 65,
  expectedAdoptionRatePercent: 80,
  annualTransactionVolume: 5000,
  teamScenario: "standard",
  userModified: false,
};

export interface PlanningBlueprint {
  id: string;
  projectTitle: string;
  generatedAt: string;
  assumptions: PlanningAssumptions;
  confidence: {
    overall: ConfidenceLevel;
    requirementsScore: number;
    technicalScore: number;
    financialScore: number;
    notes: string[];
  };
  workBreakdown: WorkItem[];
  resources: ResourceRole[];
  milestones: Milestone[];
  costModel: CostModel;
  roiModel: ROIModel;
  risks: ProjectRisk[];
  scenarios: PlanningScenario[];
  totalEstimatedHours: { low: number; likely: number; high: number };
  durationWeeks: number;
  criticalPath: string[];
  isAIEnhanced: boolean;
  isAIGeneratedEstimate: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// 11. PHASE 3 COMPATIBILITY CONTEXT (adapter type)
// ──────────────────────────────────────────────────────────────────────────────
export interface PlanningUXContext {
  screenCount: number;
  screenComplexity: "simple" | "medium" | "complex";
  userJourneyCount: number;
  componentCount: number;
  hasDesignSystem: boolean;
  navigationDepth: number;
  responsiveRequired: boolean;
  source: "phase3" | "wireframe_sections" | "assumption";
}

// ──────────────────────────────────────────────────────────────────────────────
// 12. PHASE 2 COMPATIBILITY CONTEXT (adapter type)
// ──────────────────────────────────────────────────────────────────────────────
export interface PlanningProcessContext {
  workflowCount: number;
  hasCurrentState: boolean;
  hasFutureState: boolean;
  automationOpportunityCount: number;
  aiOpportunityCount: number;
  bottleneckCount: number;
  integrationCount: number;
  processComplexity: "simple" | "medium" | "complex";
  source: "phase2" | "bpmn_steps" | "assumption";
}
