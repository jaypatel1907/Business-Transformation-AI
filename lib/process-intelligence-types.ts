/**
 * Phase 2 — Process Intelligence Types & Integration Contract
 * 
 * Provides strong typing for:
 * - Process flows (Current State vs Future State)
 * - Swimlanes, BPMN-style nodes, directed edges
 * - Bottleneck analysis & risk categorization
 * - Automation & AI opportunity detection
 * - Phase 1 Integration Contract (ProcessIntelligenceContext)
 */

export type ProcessNodeType =
  | "start"
  | "end"
  | "task"
  | "human-task"
  | "system-task"
  | "automated-task"
  | "ai-task"
  | "decision"
  | "subprocess";

export type BottleneckCategory =
  | "manual_handoff"
  | "waiting"
  | "duplicate_data"
  | "approval_delay"
  | "system_dependency"
  | "high_error_rate";

export interface ProcessNode {
  id: string;
  type: ProcessNodeType;
  label: string;
  description: string;
  laneId: string;
  x: number;
  y: number;
  duration?: string;
  costPerExec?: string;
  automationPotential?: "high" | "medium" | "low" | "none";
  isBottleneck?: boolean;
  bottleneckId?: string;
  metadata?: Record<string, any>;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string; // e.g. "Approved", "Rejected", "Yes", "No"
  animated?: boolean;
}

export interface ProcessLane {
  id: string;
  name: string;
  role: string;
  color?: string; // Hex or Tailwind color token
  description?: string;
}

export interface ProcessBottleneck {
  id: string;
  nodeId: string;
  title: string;
  reason: string;
  severity: "high" | "medium" | "low";
  category: BottleneckCategory;
  recommendation: string;
  potentialTimeSaved?: string;
}

export interface AutomationOpportunity {
  id: string;
  nodeId: string;
  stepName: string;
  opportunity: string;
  rationale: string;
  potentialBenefit: string;
  implementationComplexity: "low" | "medium" | "high";
  suggestedToolOrAI?: string;
}

export interface AIOpportunity {
  id: string;
  nodeId: string;
  stepName: string;
  aiCapability: string;
  modelSuggestion?: string;
  expectedImpact: string;
  complexity: "low" | "medium" | "high";
}

export interface ProcessOptimization {
  id: string;
  type: "eliminate_step" | "automate" | "ai_assist" | "parallelize" | "reduce_handoff";
  title: string;
  description: string;
  impact: string;
  effort: "low" | "medium" | "high";
}

export interface ProcessFlow {
  id: string;
  name: string;
  description: string;
  state: "current" | "future";
  lanes: ProcessLane[];
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  bottlenecks: ProcessBottleneck[];
  automationOpportunities: AutomationOpportunity[];
  aiOpportunities: AIOpportunity[];
  optimizations: ProcessOptimization[];
  updatedAt?: string;
}

/**
 * Clean integration contract for Phase 1 (Discovery & Deep Business Analysis).
 * When Developer 1 delivers Phase 1, Phase 2 will consume this interface seamlessly.
 */
export interface ProcessIntelligenceContext {
  projectId?: string;
  businessContext?: string;
  requirements?: string[];
  currentStateSummary?: string;
  futureStateSummary?: string;
  painPoints?: string[];
  gaps?: string[];
  automationOpportunities?: string[];
  aiOpportunities?: string[];
  currentProcess?: ProcessFlow;
  futureProcess?: ProcessFlow;
  metadata?: Record<string, any>;
}
