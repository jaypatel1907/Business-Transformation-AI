/**
 * Phase 2 — Process Intelligence Adapter & Analysis Engine
 * 
 * Bridges Phase 1 outputs (DeepBusinessAnalysis, Gap Analysis, AI Opportunities),
 * existing Blueprint data, and interactive Process Flows.
 * Includes rule-based Bottleneck Detection, Automation Opportunity Discovery,
 * AI Optimization generators, and localStorage persistence.
 */

import {
  ProcessFlow,
  ProcessNode,
  ProcessEdge,
  ProcessLane,
  ProcessBottleneck,
  AutomationOpportunity,
  AIOpportunity,
  ProcessOptimization,
  ProcessIntelligenceContext,
} from "./process-intelligence-types";

import { DeepBusinessAnalysis } from "./discovery-types";

import {
  RESTAURANT_CURRENT_STATE_FIXTURE,
  RESTAURANT_FUTURE_STATE_FIXTURE,
} from "./process-intelligence-fixtures";

const STORAGE_PREFIX = "process_intelligence_flow_";

/**
 * Clean adapter that ingests Phase 1 context, DeepBusinessAnalysis, or existing blueprintData
 * and returns active Current State and Future State workflows.
 */
export function buildProcessIntelligenceModel(
  context?: ProcessIntelligenceContext | any,
  targetLanguage: string = "English"
): { current: ProcessFlow; future: ProcessFlow } {
  // 1. Check if user has previously saved customizations for this project in localStorage
  const projectId = context?.projectId || context?.id || "active_project";
  const saved = loadProcessFlowFromStorage(projectId);
  if (saved) {
    return saved;
  }

  // 2. Check if Phase 1 has already attached pre-computed process flows
  if (context?.currentProcess && context?.futureProcess) {
    return {
      current: context.currentProcess,
      future: context.futureProcess,
    };
  }

  // 3. Phase 1 Direct Ingestion: If DeepBusinessAnalysis is provided by Phase 1
  const analysis: DeepBusinessAnalysis | undefined = context?.business_analysis || (context?.current_state && context?.future_state ? context : undefined);
  if (analysis && analysis.current_state && analysis.future_state) {
    return convertDeepBusinessAnalysisToFlows(analysis, context);
  }

  // 4. Check if user prompt is restaurant / dining related
  const promptText = (context?.user_problem || context?.businessContext || "").toLowerCase();
  if (promptText.includes("restaurant") || promptText.includes("dine") || promptText.includes("table") || promptText.includes("reservation") || promptText.includes("food")) {
    return {
      current: JSON.parse(JSON.stringify(RESTAURANT_CURRENT_STATE_FIXTURE)),
      future: JSON.parse(JSON.stringify(RESTAURANT_FUTURE_STATE_FIXTURE)),
    };
  }

  // 5. Dynamically synthesize domain-aware workflows from blueprint steps / initiatives
  return synthesizeDomainWorkflows(context, targetLanguage);
}

/**
 * Ingests Phase 1's DeepBusinessAnalysis and constructs rich Current State & Future State BPMN flows.
 */
function convertDeepBusinessAnalysisToFlows(
  analysis: DeepBusinessAnalysis,
  rawContext: any
): { current: ProcessFlow; future: ProcessFlow } {
  const title = analysis.project_title || rawContext?.project_title || "Enterprise Solution";

  // Standard multi-stakeholder swimlanes
  const lanes: ProcessLane[] = [
    { id: "lane_client", name: "Client / Customer", role: "Primary User", color: "#3B82F6" },
    { id: "lane_ops", name: "Operations & Frontline Staff", role: "Business Execution", color: "#F59E0B" },
    { id: "lane_mgmt", name: "Management / Approver", role: "Governance", color: "#8B5CF6" },
    { id: "lane_system", name: "Core System & Database", role: "Infrastructure", color: "#64748B" },
  ];

  // 1. Build Current As-Is Flow from Phase 1 manual workflows and bottlenecks
  const currentNodes: ProcessNode[] = [
    {
      id: "node_p1_c_start",
      type: "start",
      label: "Customer Need Triggered",
      description: analysis.current_state.summary || "Client initiates request through legacy channels.",
      laneId: "lane_client",
      x: 60,
      y: 60,
      duration: "1 min",
    },
  ];

  const currentEdges: ProcessEdge[] = [];
  const currentBottlenecks: ProcessBottleneck[] = [];

  const manualSteps = (analysis.current_state.manual_workflows && analysis.current_state.manual_workflows.length > 0)
    ? analysis.current_state.manual_workflows
    : ["Manual intake and phone verification", "Physical document check", "Spreadsheet record update"];

  const coreBottlenecks = analysis.current_state.core_bottlenecks || [];

  manualSteps.forEach((step, idx) => {
    const nodeId = `node_p1_c_step_${idx + 1}`;
    const lane = idx % 2 === 0 ? "lane_ops" : "lane_mgmt";
    const yPos = idx % 2 === 0 ? 220 : 380;
    const xPos = 240 + idx * 220;

    const matchedBottleneck = coreBottlenecks[idx] || (idx === 0 ? "Manual transcription overhead" : undefined);

    currentNodes.push({
      id: nodeId,
      type: idx === 1 ? "decision" : "human-task",
      label: step,
      description: matchedBottleneck ? `Identified in Phase 1: ${matchedBottleneck}` : "Manual operational step.",
      laneId: lane,
      x: xPos,
      y: yPos,
      duration: "15-45 mins",
      isBottleneck: !!matchedBottleneck,
      bottleneckId: matchedBottleneck ? `btn_p1_${idx}` : undefined,
    });

    // Edge from previous node
    const prevNode = currentNodes[currentNodes.length - 2];
    currentEdges.push({
      id: `edge_p1_c_${idx}`,
      source: prevNode.id,
      target: nodeId,
      label: idx === 1 ? "Requires Review" : "Next Step",
    });

    if (matchedBottleneck) {
      currentBottlenecks.push({
        id: `btn_p1_${idx}`,
        nodeId,
        title: `Potential Bottleneck: ${matchedBottleneck}`,
        reason: `Discovered during Phase 1 business analysis. Step exhibits manual latency.`,
        severity: idx === 0 ? "high" : "medium",
        category: idx === 0 ? "manual_handoff" : "approval_delay",
        recommendation: "Replace manual queue with automated webhook ingestion and rule evaluation.",
        potentialTimeSaved: "30-60 mins per cycle",
      });
    }
  });

  // End node for current state
  const lastCurrentNode = currentNodes[currentNodes.length - 1];
  const endCurrentNode: ProcessNode = {
    id: "node_p1_c_end",
    type: "end",
    label: "Legacy Fulfillment Complete",
    description: "End of manual cycle with accumulated delays.",
    laneId: "lane_client",
    x: lastCurrentNode.x + 220,
    y: 60,
    duration: "Instant",
  };
  currentNodes.push(endCurrentNode);
  currentEdges.push({
    id: "edge_p1_c_final",
    source: lastCurrentNode.id,
    target: endCurrentNode.id,
    label: "Completed",
  });

  // 2. Build Future To-Be Flow from Phase 1 automated workflows and AI touchpoints
  const futureLanes: ProcessLane[] = [
    { id: "fl_client", name: "Client / User", role: "Digital Actor", color: "#3B82F6" },
    { id: "fl_ai", name: "AI Intelligence Layer", role: "Cognitive Decisioning", color: "#10B981" },
    { id: "fl_system", name: "Automated Platform / Backend", role: "System Automation", color: "#64748B" },
    { id: "fl_ops", name: "Operations (Exceptions Only)", role: "Human-in-the-Loop", color: "#F59E0B" },
  ];

  const futureNodes: ProcessNode[] = [
    {
      id: "node_p1_f_start",
      type: "start",
      label: "Customer Submits in Digital App",
      description: analysis.future_state.vision_summary || "Client triggers action with instant validation.",
      laneId: "fl_client",
      x: 60,
      y: 60,
      duration: "30 sec",
    },
  ];

  const futureEdges: ProcessEdge[] = [];

  const autoSteps = (analysis.future_state.automated_workflows && analysis.future_state.automated_workflows.length > 0)
    ? analysis.future_state.automated_workflows
    : ["Automated validation and ledger creation", "Instant multi-channel notifications"];

  const aiTouchpoints = analysis.future_state.ai_transformation_touchpoints || [
    "AI predictive scoring and real-time decisioning",
  ];

  // AI Task Node
  const aiNode: ProcessNode = {
    id: "node_p1_f_ai",
    type: "ai-task",
    label: aiTouchpoints[0] || "AI Intelligent Verification & Scoring",
    description: "Cognitive automation touchpoint generated in Phase 1.",
    laneId: "fl_ai",
    x: 280,
    y: 220,
    duration: "400 ms",
  };
  futureNodes.push(aiNode);
  futureEdges.push({
    id: "edge_p1_f_1",
    source: "node_p1_f_start",
    target: "node_p1_f_ai",
    label: "Payload Ingested",
  });

  // System Automation Node
  const sysNode: ProcessNode = {
    id: "node_p1_f_sys",
    type: "automated-task",
    label: autoSteps[0] || "Automated Transaction & DB Sync",
    description: "Atomic transactional execution with zero manual touches.",
    laneId: "fl_system",
    x: 520,
    y: 380,
    duration: "50 ms",
  };
  futureNodes.push(sysNode);
  futureEdges.push({
    id: "edge_p1_f_2",
    source: "node_p1_f_ai",
    target: "node_p1_f_sys",
    label: "Validated",
  });

  // End Node
  const endFutureNode: ProcessNode = {
    id: "node_p1_f_end",
    type: "end",
    label: "Automated Journey Complete",
    description: "Zero manual delay; real-time telemetry captured.",
    laneId: "fl_client",
    x: 760,
    y: 60,
    duration: "Instant",
  };
  futureNodes.push(endFutureNode);
  futureEdges.push({
    id: "edge_p1_f_3",
    source: "node_p1_f_sys",
    target: "node_p1_f_end",
    label: "Dispatched",
  });

  // Map Phase 1 AI Opportunities directly
  const mappedAIOpps: AIOpportunity[] = (analysis.ai_opportunities || []).map((opp, i) => ({
    id: opp.id || `ai_opp_${i}`,
    nodeId: "node_p1_f_ai",
    stepName: opp.title,
    aiCapability: `${opp.category}: ${opp.description}`,
    modelSuggestion: "Gemini 3.6 Flash",
    expectedImpact: `ROI: ${opp.estimated_roi} | Time to value: ${opp.time_to_value}`,
    complexity: opp.feasibility.includes("High") ? "low" : opp.feasibility.includes("Medium") ? "medium" : "high",
  }));

  // Map Phase 1 Gap Analysis into Optimizations
  const mappedOptimizations: ProcessOptimization[] = (analysis.gap_analysis || []).map((gap, i) => ({
    id: gap.id || `opt_gap_${i}`,
    type: gap.category === "Technology" || gap.category === "Data" ? "automate" : "reduce_handoff",
    title: `Close Gap: ${gap.gap_description}`,
    description: `Mitigation Strategy: ${gap.mitigation_strategy} (Current: ${gap.current_state} -> Target: ${gap.future_state})`,
    impact: `${gap.severity} Severity Gap Closed`,
    effort: gap.severity === "Critical" || gap.severity === "High" ? "medium" : "low",
  }));

  const currentFlow: ProcessFlow = {
    id: `flow_curr_p1_${Date.now()}`,
    name: `${title} (Current As-Is Process)`,
    description: analysis.current_state.summary || "Baseline workflow synthesized from Phase 1 discovery.",
    state: "current",
    lanes,
    nodes: currentNodes,
    edges: currentEdges,
    bottlenecks: currentBottlenecks,
    automationOpportunities: [
      {
        id: "auto_p1_1",
        nodeId: currentNodes[1]?.id || "node_p1_c_step_1",
        stepName: manualSteps[0] || "Manual Intake",
        opportunity: "End-to-End Digital Portal",
        rationale: "Eliminates initial manual transcription identified in Phase 1 analysis.",
        potentialBenefit: "Cuts cycle time by 80%",
        implementationComplexity: "low",
      },
    ],
    aiOpportunities: mappedAIOpps,
    optimizations: mappedOptimizations,
  };

  const futureFlow: ProcessFlow = {
    id: `flow_fut_p1_${Date.now()}`,
    name: `${title} (Optimized Future State)`,
    description: analysis.future_state.vision_summary || "Target architecture workflow synthesized from Phase 1 discovery.",
    state: "future",
    lanes: futureLanes,
    nodes: futureNodes,
    edges: futureEdges,
    bottlenecks: [],
    automationOpportunities: [],
    aiOpportunities: mappedAIOpps,
    optimizations: mappedOptimizations,
  };

  return { current: currentFlow, future: futureFlow };
}

/**
 * Synthesizes domain-specific Current and Future workflows using the
 * blueprintData's bpmn_steps, tech_stack, and domain entity.
 */
function synthesizeDomainWorkflows(
  data: any,
  lang: string
): { current: ProcessFlow; future: ProcessFlow } {
  const title = data?.project_title || "Enterprise Solution";
  const problem = data?.user_problem || "Core business operational workflow";

  // Default Standard Lanes
  const lanes: ProcessLane[] = [
    { id: "lane_user", name: "End User / Customer", role: "External Actor", color: "#3B82F6" },
    { id: "lane_ops", name: "Operations & Staff", role: "Internal Team", color: "#F59E0B" },
    { id: "lane_mgmt", name: "Management / Reviewer", role: "Supervisory", color: "#8B5CF6" },
    { id: "lane_tech", name: "System & Core Data Layer", role: "Technology Layer", color: "#64748B" },
  ];

  // Derive Current State (Manual, bottleneck-prone as-is operations)
  const currentNodes: ProcessNode[] = [
    {
      id: "node_curr_start",
      type: "start",
      label: "Customer Need / Request Initiated",
      description: "Trigger event: Customer reaches out via manual channels or email.",
      laneId: "lane_user",
      x: 60,
      y: 60,
      duration: "1 min",
    },
    {
      id: "node_curr_intake",
      type: "human-task",
      label: "Manual Request Intake & Logging",
      description: "Staff transcribes requirements manually into spreadsheets or legacy inbox.",
      laneId: "lane_ops",
      x: 260,
      y: 220,
      duration: "15-30 mins",
      isBottleneck: true,
      bottleneckId: "btn_curr_1",
    },
    {
      id: "node_curr_review",
      type: "human-task",
      label: "Information Validation & Paper Check",
      description: "Operations team manually verifies documents, identity, and inventory records.",
      laneId: "lane_ops",
      x: 480,
      y: 220,
      duration: "45 mins",
      isBottleneck: true,
      bottleneckId: "btn_curr_2",
    },
    {
      id: "node_curr_approval",
      type: "decision",
      label: "Manager Sign-Off Required?",
      description: "High-value or non-standard inquiries wait for supervisor review.",
      laneId: "lane_mgmt",
      x: 700,
      y: 380,
      duration: "2-4 hours",
      isBottleneck: true,
      bottleneckId: "btn_curr_3",
    },
    {
      id: "node_curr_process",
      type: "human-task",
      label: "Manual Transaction & Database Entry",
      description: "Employee copies data across disconnected accounting and operational systems.",
      laneId: "lane_tech",
      x: 920,
      y: 540,
      duration: "20 mins",
      isBottleneck: true,
      bottleneckId: "btn_curr_4",
    },
    {
      id: "node_curr_end",
      type: "end",
      label: "Manual Fulfillment & Slow Notification",
      description: "End of as-is cycle. Customer notified after noticeable delay.",
      laneId: "lane_user",
      x: 1140,
      y: 60,
      duration: "Instant",
    },
  ];

  const currentEdges: ProcessEdge[] = [
    { id: "ce_1", source: "node_curr_start", target: "node_curr_intake", label: "Request Sent" },
    { id: "ce_2", source: "node_curr_intake", target: "node_curr_review", label: "Handoff to Review" },
    { id: "ce_3", source: "node_curr_review", target: "node_curr_approval", label: "Escalation" },
    { id: "ce_4", source: "node_curr_approval", target: "node_curr_process", label: "Approved" },
    { id: "ce_5", source: "node_curr_process", target: "node_curr_end", label: "Dispatched" },
  ];

  const currentBottlenecks: ProcessBottleneck[] = [
    {
      id: "btn_curr_1",
      nodeId: "node_curr_intake",
      title: "Potential Bottleneck: Manual Data Entry & Fragmentation",
      reason: "Staff relies on manual transcription from email/phone into disconnected systems.",
      severity: "high",
      category: "duplicate_data",
      recommendation: "Deploy self-service client onboarding with automated schema validation.",
      potentialTimeSaved: "20 mins per transaction",
    },
    {
      id: "btn_curr_2",
      nodeId: "node_curr_review",
      title: "Potential Bottleneck: Unstructured Verification Delays",
      reason: "Manual verification leads to customer wait times and high error risk during peak hours.",
      severity: "high",
      category: "manual_handoff",
      recommendation: "Implement automated AI OCR document extraction and verification rules.",
      potentialTimeSaved: "35 mins per request",
    },
    {
      id: "btn_curr_3",
      nodeId: "node_curr_approval",
      title: "Potential Bottleneck: Supervisory Approval Queue",
      reason: "Transactions pause in manager inbox without automatic SLA escalation.",
      severity: "medium",
      category: "approval_delay",
      recommendation: "Establish algorithmic risk scoring with auto-approval for low-risk requests.",
      potentialTimeSaved: "2-3 hours per batch",
    },
    {
      id: "btn_curr_4",
      nodeId: "node_curr_process",
      title: "Potential Bottleneck: Disconnected Legacy Record Keeping",
      reason: "Double data entry across separate systems introduces data drift.",
      severity: "high",
      category: "system_dependency",
      recommendation: "Unify under transactional cloud database with REST/GraphQL integration.",
      potentialTimeSaved: "100% elimination of re-keying",
    },
  ];

  const currentAutomationOpps: AutomationOpportunity[] = [
    {
      id: "auto_curr_1",
      nodeId: "node_curr_intake",
      stepName: "Manual Request Intake",
      opportunity: "Digital Self-Service Portal & Webhook Ingestion",
      rationale: "Captures 100% of inputs in standardized JSON format directly from client.",
      potentialBenefit: "Eliminates initial intake latency.",
      implementationComplexity: "low",
      suggestedToolOrAI: "React Client Form + Next.js Server Actions",
    },
    {
      id: "auto_curr_2",
      nodeId: "node_curr_process",
      stepName: "Transaction Database Entry",
      opportunity: "Automated Supabase / PostgreSQL Pipeline",
      rationale: "Triggers relational database writes atomically with Row-Level Security.",
      potentialBenefit: "Zero human transcription errors and instantaneous sync.",
      implementationComplexity: "low",
      suggestedToolOrAI: "PostgreSQL Database Triggers",
    },
  ];

  const currentAIOpps: AIOpportunity[] = [
    {
      id: "ai_curr_1",
      nodeId: "node_curr_review",
      stepName: "Verification & Compliance",
      aiCapability: "Multimodal Document Extraction & Automated Compliance Auditing",
      modelSuggestion: "Gemini 3.6 Flash / Structured JSON Output",
      expectedImpact: "Validates complex incoming files and flags discrepancies in 2 seconds.",
      complexity: "medium",
    },
    {
      id: "ai_curr_2",
      nodeId: "node_curr_approval",
      stepName: "Supervisory Approval",
      aiCapability: "Intelligent Anomaly & Fraud Risk Scoring",
      modelSuggestion: "Predictive Risk Model",
      expectedImpact: "Auto-approves 85% of standard requests without human manager intervention.",
      complexity: "medium",
    },
  ];

  const currentOptimizations: ProcessOptimization[] = [
    {
      id: "opt_curr_1",
      type: "automate",
      title: "End-to-End Digital Workflow Streamlining",
      description: "Replace phone/manual forms with instant responsive web application.",
      impact: "Cuts cycle time from 3 hours to 4 minutes",
      effort: "medium",
    },
    {
      id: "opt_curr_2",
      type: "ai_assist",
      title: "AI Intelligent Triage & Auto-Approval",
      description: "Empower staff with an AI co-pilot that highlights anomalies and suggests decisions.",
      impact: "+40% Operational throughput",
      effort: "low",
    },
  ];

  const currentFlow: ProcessFlow = {
    id: `flow_curr_${Date.now()}`,
    name: `${title} (Current As-Is Process)`,
    description: `Current operational baseline for: ${problem}`,
    state: "current",
    lanes,
    nodes: currentNodes,
    edges: currentEdges,
    bottlenecks: currentBottlenecks,
    automationOpportunities: currentAutomationOpps,
    aiOpportunities: currentAIOpps,
    optimizations: currentOptimizations,
  };

  // Derive Future State (Modern, AI-Assisted, Automated To-Be operations)
  const futureLanes: ProcessLane[] = [
    { id: "fl_user", name: "User / Customer", role: "Digital Client", color: "#3B82F6" },
    { id: "fl_ai", name: "AI Agent & Intelligence Layer", role: "Cognitive Layer", color: "#10B981" },
    { id: "fl_system", name: "Automated Platform / Backend", role: "System Automation", color: "#64748B" },
    { id: "fl_ops", name: "Human-in-the-Loop Operations", role: "Exception Handling", color: "#F59E0B" },
  ];

  const futureNodes: ProcessNode[] = [
    {
      id: "node_fut_1",
      type: "start",
      label: "Customer Submits in Web Application",
      description: "Client submits structured data with instant field validation.",
      laneId: "fl_user",
      x: 60,
      y: 60,
      duration: "30 sec",
    },
    {
      id: "node_fut_2",
      type: "ai-task",
      label: "AI Parsing & Real-Time Verification",
      description: "AI extracts key attributes, scores compliance, and validates business rules instantly.",
      laneId: "fl_ai",
      x: 280,
      y: 220,
      duration: "1.2 sec",
    },
    {
      id: "node_fut_3",
      type: "decision",
      label: "High Risk or Flagged Exception?",
      description: "Automated routing gateway evaluates AI confidence score.",
      laneId: "fl_system",
      x: 500,
      y: 380,
      duration: "10 ms",
    },
    {
      id: "node_fut_4",
      type: "human-task",
      label: "Exception Review by Specialist",
      description: "Human specialist only handles rare edge cases with AI recommendations pre-filled.",
      laneId: "fl_ops",
      x: 720,
      y: 540,
      duration: "5 mins (Rare: < 5% cases)",
    },
    {
      id: "node_fut_5",
      type: "automated-task",
      label: "Automated Transaction Execution & DB Commit",
      description: "PostgreSQL transactional commit, webhook execution, and ledger balance update.",
      laneId: "fl_system",
      x: 720,
      y: 380,
      duration: "45 ms",
    },
    {
      id: "node_fut_6",
      type: "automated-task",
      label: "Instant Multi-Channel Status Notification",
      description: "Web push, SMS, and email sent with live tracking link and receipt.",
      laneId: "fl_ai",
      x: 940,
      y: 220,
      duration: "100 ms",
    },
    {
      id: "node_fut_7",
      type: "end",
      label: "Automated Fulfillment Complete",
      description: "Process successfully concluded with full audit trail and zero manual re-entry.",
      laneId: "fl_user",
      x: 1160,
      y: 60,
      duration: "Instant",
    },
  ];

  const futureEdges: ProcessEdge[] = [
    { id: "fe_1", source: "node_fut_1", target: "node_fut_2", label: "Payload Sent" },
    { id: "fe_2", source: "node_fut_2", target: "node_fut_3", label: "Confidence Scored" },
    { id: "fe_3", source: "node_fut_3", target: "node_fut_4", condition: "Flagged (5%)", label: "Exception" },
    { id: "fe_4", source: "node_fut_3", target: "node_fut_5", condition: "Normal (95%)", label: "Auto-Approve" },
    { id: "fe_5", source: "node_fut_4", target: "node_fut_5", label: "Manual Override" },
    { id: "fe_6", source: "node_fut_5", target: "node_fut_6", label: "Committed" },
    { id: "fe_7", source: "node_fut_6", target: "node_fut_7", label: "Realtime Notice" },
  ];

  const futureFlow: ProcessFlow = {
    id: `flow_fut_${Date.now()}`,
    name: `${title} (Optimized Future State)`,
    description: `Target architecture workflow with automated gateways and AI assistance: ${problem}`,
    state: "future",
    lanes: futureLanes,
    nodes: futureNodes,
    edges: futureEdges,
    bottlenecks: [], // No structural bottlenecks in optimized future state
    automationOpportunities: [],
    aiOpportunities: [
      {
        id: "ai_fut_deep_1",
        nodeId: "node_fut_2",
        stepName: "AI Verification",
        aiCapability: "Continuous Self-Improving Rule Feedback Loop",
        modelSuggestion: "Gemini 3.6 Flash fine-tuned telemetry",
        expectedImpact: "Shrinks exception rate by another 50% over 90 days.",
        complexity: "low",
      },
    ],
    optimizations: [
      {
        id: "opt_fut_1",
        type: "parallelize",
        title: "Parallel Database & Notification Pipeline",
        description: "Runs messaging and analytics asynchronously via event bus.",
        impact: "Zero API latency impact on customer response",
        effort: "low",
      },
    ],
  };

  return { current: currentFlow, future: futureFlow };
}

/**
 * Dynamic Rule-Based Bottleneck Analysis Engine
 * Evaluates any active ProcessFlow and detects structural and operational bottlenecks.
 */
export function analyzeProcessBottlenecks(flow: ProcessFlow): ProcessBottleneck[] {
  const bottlenecks: ProcessBottleneck[] = [];

  flow.nodes.forEach((node) => {
    // 1. Chains of manual human tasks
    if (node.type === "human-task") {
      const incoming = flow.edges.filter((e) => e.target === node.id);

      const hasManualPredecessor = incoming.some((edge) => {
        const sourceNode = flow.nodes.find((n) => n.id === edge.source);
        return sourceNode?.type === "human-task";
      });

      if (hasManualPredecessor) {
        bottlenecks.push({
          id: `btn_auto_${node.id}`,
          nodeId: node.id,
          title: `Potential Bottleneck: Sequential Manual Handoff at "${node.label}"`,
          reason: "Step relies on consecutive manual human action. Prone to idle waiting and queue buildup.",
          severity: "high",
          category: "manual_handoff",
          recommendation: "Introduce automated event triggers or AI assistance to bypass manual handoff.",
          potentialTimeSaved: "Estimated 15-45 minutes per occurrence",
        });
      }
    }

    // 2. High Fan-in Bottleneck (Node with 3 or more incoming paths)
    const incomingEdges = flow.edges.filter((e) => e.target === node.id);
    if (incomingEdges.length >= 3 && node.type !== "end") {
      bottlenecks.push({
        id: `btn_fanin_${node.id}`,
        nodeId: node.id,
        title: `Potential Bottleneck: Convergence Traffic at "${node.label}"`,
        reason: `Node has ${incomingEdges.length} converging workflow paths without asynchronous queuing.`,
        severity: "medium",
        category: "waiting",
        recommendation: "Decouple into parallel processing tracks with an asynchronous message queue.",
        potentialTimeSaved: "Estimated 20-30% throughput increase",
      });
    }

    // 3. Manual Decision Gateway
    if (node.type === "decision") {
      const isManualRole = flow.lanes.find((l) => l.id === node.laneId)?.role.toLowerCase().includes("human") ||
                           flow.lanes.find((l) => l.id === node.laneId)?.name.toLowerCase().includes("manager") ||
                           flow.lanes.find((l) => l.id === node.laneId)?.name.toLowerCase().includes("staff");
      if (isManualRole) {
        bottlenecks.push({
          id: `btn_dec_${node.id}`,
          nodeId: node.id,
          title: `Potential Bottleneck: Human Approval Gate at "${node.label}"`,
          reason: "Manual decision-making causes work items to stall awaiting staff availability.",
          severity: "medium",
          category: "approval_delay",
          recommendation: "Implement automated business rule thresholding with instant escalation policies.",
          potentialTimeSaved: "Estimated 1-4 hours reduction in idle cycle time",
        });
      }
    }
  });

  return bottlenecks;
}

/**
 * Storage helpers to persist process edits locally per project
 */
export function saveProcessFlowToStorage(
  projectId: string,
  current: ProcessFlow,
  future: ProcessFlow
): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        current: { ...current, updatedAt: new Date().toISOString() },
        future: { ...future, updatedAt: new Date().toISOString() },
      })
    );
  } catch (e) {
    console.warn("Error saving Process Intelligence to localStorage:", e);
  }
}

export function loadProcessFlowFromStorage(
  projectId: string
): { current: ProcessFlow; future: ProcessFlow } | null {
  if (typeof window === "undefined") return null;
  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Error loading Process Intelligence from localStorage:", e);
    return null;
  }
}
