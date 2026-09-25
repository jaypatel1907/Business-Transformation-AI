/**
 * Phase 6 — Enterprise Export Platform Types & Canonical Model
 * 
 * Canonical data contract normalizing:
 * - Business Context & Discovery Findings
 * - Deep Business Analysis & Gap Matrices
 * - Process Intelligence (As-Is & To-Be BPMN flows)
 * - Interactive UX Wireframes & User Journeys
 * - Technical Architecture, Relational DB & REST APIs
 * - Implementation Planning, WBS, Timeline & Resource Allocation
 * - Total Cost of Ownership (CapEx/OpEx) & ROI Realization
 * - Continuous Knowledge & Decision Logs
 */

import { DeepBusinessAnalysis } from "./discovery-types";
import { ProcessFlow } from "./process-intelligence-types";
import { PlanningBlueprint } from "./planning-types";

export type ExportDocumentType =
  | "executive_report"
  | "business_analysis"
  | "transformation_plan"
  | "technical_architecture"
  | "process_intelligence"
  | "ux_wireframes"
  | "financial_plan"
  | "risk_register"
  | "full_project_package"
  | "raw_json";

export type ExportFormat = "pdf" | "docx" | "xlsx" | "pptx" | "json" | "zip";

export interface ExportProjectMetadata {
  projectId: string;
  projectTitle: string;
  industry: string;
  clientOrganization?: string;
  userRole: string;
  targetLanguage: string;
  versionTag: string;
  generatedAt: string;
  exportAuthor: string;
  digitalMaturityScore: number;
  aiReadinessScore: number;
}

export interface ExportExecutiveSummary {
  problemStatement: string;
  strategicIntent: string;
  visionSummary: string;
  targetTimeline: string;
  totalInitialInvestment: string;
  monthlyOperatingCost: string;
  projectedROI: string;
  estimatedPayback: string;
  efficiencyGain: string;
  keyDrivers: string[];
}

export interface ExportTechnicalSection {
  frontendTech: string;
  backendTech: string;
  databaseTech: string;
  aiTech: string;
  hostingPlatform: string;
  tables: Array<{
    name: string;
    description?: string;
    columns: string[];
  }>;
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
    authRequired?: boolean;
  }>;
  securityControls: string[];
}

export interface ExportUXSection {
  screenCount: number;
  screens: Array<{
    id: string;
    name: string;
    route: string;
    purpose: string;
    components: string[];
  }>;
  userJourneys: Array<{
    title: string;
    goal: string;
    stepCount: number;
  }>;
}

export interface ExportProcessSection {
  currentStateSummary: string;
  currentBottlenecksCount: number;
  futureStateSummary: string;
  automationOpportunitiesCount: number;
  aiTouchpointsCount: number;
  bottlenecks: Array<{
    title: string;
    reason: string;
    severity: string;
    recommendation: string;
  }>;
  optimizations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

export interface ExportPlanningSection {
  totalHoursLikely: number;
  durationWeeks: number;
  workBreakdownSummary: Array<{
    wbsCode: string;
    title: string;
    category: string;
    likelyHours: number;
    assignedRole: string;
  }>;
  resourcesSummary: Array<{
    role: string;
    estimatedHours: number;
    hourlyRate: number;
    estimatedCost: number;
  }>;
  milestonesSummary: Array<{
    name: string;
    durationWeeks: number;
    criticalPath: boolean;
  }>;
  risksSummary: Array<{
    title: string;
    category: string;
    severity: string;
    mitigation: string;
    owner: string;
  }>;
}

/**
 * Master Canonical Model consumed by all exporters (PDF, DOCX, XLSX, PPTX, JSON, ZIP)
 */
export interface ExportProjectModel {
  schemaVersion: "1.0.0";
  metadata: ExportProjectMetadata;
  executiveSummary: ExportExecutiveSummary;
  businessAnalysis?: DeepBusinessAnalysis;
  technicalArchitecture: ExportTechnicalSection;
  uxWireframes: ExportUXSection;
  processIntelligence: ExportProcessSection;
  planningAndEstimation: ExportPlanningSection;
  rawPlanningBlueprint?: PlanningBlueprint;
  rawCurrentProcess?: ProcessFlow;
  rawFutureProcess?: ProcessFlow;
}

export interface ExportProgressState {
  status: "idle" | "preparing" | "generating" | "finalizing" | "complete" | "failed";
  activeFormat?: ExportFormat;
  progressPercent: number;
  message: string;
  error?: string;
  downloadUrl?: string;
  fileName?: string;
}
