/**
 * Phase 6 — Continuous Knowledge Layer Types
 * 
 * Provides strong typing for:
 * - Continuous Knowledge Entries (Decisions, Insights, Architectural Choices)
 * - Formal Decision Logs (with reasons, impacts, owners, and statuses)
 * - End-to-End Requirement Traceability Matrix
 * - Chronological Transformation Lifecycle Timeline
 * - Grounded Project Knowledge Search
 */

export type KnowledgeType =
  | "decision"
  | "requirement"
  | "insight"
  | "risk"
  | "opportunity"
  | "process_change"
  | "ux_decision"
  | "architecture_decision"
  | "financial_assumption"
  | "approval"
  | "milestone"
  | "recommendation";

export type DecisionStatus = "approved" | "proposed" | "rejected" | "superseded";

export interface KnowledgeEntry {
  id: string;
  projectId: string;
  type: KnowledgeType;
  title: string;
  content: string;
  rationale?: string;
  businessImpact?: string;
  owner: string;
  phase: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  references?: {
    requirementId?: string;
    gapId?: string;
    processNodeId?: string;
    screenId?: string;
    apiPath?: string;
    tableName?: string;
    wbsCode?: string;
  };
  version: number;
}

export interface DecisionLogItem {
  id: string;
  decision: string;
  reason: string;
  impact: string;
  owner: string;
  date: string;
  status: DecisionStatus;
  phase: string;
  category: "architecture" | "ux" | "process" | "financial" | "scope" | "governance";
  alternativesConsidered?: string[];
}

export interface RequirementTraceabilityNode {
  id: string;
  requirementCode: string;
  requirementTitle: string;
  category: "Functional" | "Non-Functional" | "Compliance" | "AI & Automation";
  businessAnalysisRef?: {
    gapId?: string;
    strategicDriver?: string;
  };
  processNodeRef?: {
    flowState: "current" | "future";
    nodeLabel: string;
    lane: string;
  };
  uxScreenRef?: {
    screenName: string;
    route: string;
  };
  apiEndpointRef?: {
    method: string;
    path: string;
  };
  databaseTableRef?: {
    tableName: string;
  };
  wbsTaskRef?: {
    wbsCode: string;
    taskTitle: string;
  };
  status: "traced" | "in_progress" | "unassigned";
}

export interface KnowledgeTimelineEvent {
  id: string;
  date: string;
  phase: string;
  title: string;
  description: string;
  type: "discovery_complete" | "analysis_approved" | "process_designed" | "ux_frozen" | "architecture_locked" | "budget_calculated" | "milestone_achieved" | "decision_logged";
  author: string;
  badgeColor?: string;
}

export interface KnowledgeStore {
  projectId: string;
  projectTitle: string;
  lastUpdated: string;
  entries: KnowledgeEntry[];
  decisions: DecisionLogItem[];
  traceability: RequirementTraceabilityNode[];
  timeline: KnowledgeTimelineEvent[];
}
