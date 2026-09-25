/**
 * Phase 4 — Planning Engine Core
 *
 * DETERMINISTIC calculation engine. AI only populates structured inputs.
 * All arithmetic is done here in TypeScript, never delegated to AI.
 *
 * Adapters for Phase 1, Phase 2, Phase 3 data are all safe/optional.
 */

import {
  PlanningBlueprint,
  PlanningAssumptions,
  WorkItem,
  ResourceRole,
  Milestone,
  CostModel,
  ROIModel,
  ROIScenario,
  ProjectRisk,
  PlanningScenario,
  PlanningUXContext,
  PlanningProcessContext,
  ConfidenceLevel,
  WorkItemCategory,
} from "./planning-types";

// ──────────────────────────────────────────────────────────────────────────────
// DEFAULT ASSUMPTIONS (all clearly labelled as Planning Assumptions)
// ──────────────────────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────────────────────
// PHASE 3 ADAPTER — getPlanningUXContext()
// Safely consumes Phase 3 UX Studio data or falls back to wireframe_sections
// ──────────────────────────────────────────────────────────────────────────────
export function getPlanningUXContext(data: any): PlanningUXContext {
  // Phase 3 direct integration (when available)
  const p3Screens = data?.ux_studio?.screens || (Array.isArray(data?.screens) && data.screens[0]?.components ? data.screens : undefined);
  if (p3Screens && Array.isArray(p3Screens) && p3Screens.length > 0) {
    const totalComponents = p3Screens.reduce((acc: number, sc: any) => acc + (sc.components?.length || 4), 0);
    const hasComplex = p3Screens.some((sc: any) => (sc.components?.length || 0) > 8);
    return {
      screenCount: p3Screens.length,
      screenComplexity: hasComplex || p3Screens.length > 8 ? "complex" : p3Screens.length > 4 ? "medium" : "simple",
      userJourneyCount: data?.journeys?.length || data?.ux_studio?.journeys?.length || Math.ceil(p3Screens.length / 3),
      componentCount: totalComponents,
      hasDesignSystem: true,
      navigationDepth: 3,
      responsiveRequired: true,
      source: "phase3",
    };
  }

  // Fallback: wireframe_sections from blueprint
  if (data?.wireframe_sections && data.wireframe_sections.length > 0) {
    const count = data.wireframe_sections.length;
    return {
      screenCount: count,
      screenComplexity: count > 8 ? "complex" : count > 4 ? "medium" : "simple",
      userJourneyCount: Math.ceil(count / 3),
      componentCount: count * 5,
      hasDesignSystem: true,
      navigationDepth: 3,
      responsiveRequired: true,
      source: "wireframe_sections",
    };
  }

  // Transparent assumption fallback
  return {
    screenCount: 6,
    screenComplexity: "medium",
    userJourneyCount: 3,
    componentCount: 24,
    hasDesignSystem: true,
    navigationDepth: 3,
    responsiveRequired: true,
    source: "assumption",
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// PHASE 2 ADAPTER — getPlanningProcessContext()
// Safely consumes Phase 2 Process Intelligence data
// ──────────────────────────────────────────────────────────────────────────────
export function getPlanningProcessContext(data: any): PlanningProcessContext {
  // Phase 2 localStorage / data field
  const processFlows = data?.process_flows || data?.current_process;

  if (processFlows) {
    const autoOpps = processFlows.automationOpportunities?.length || 0;
    const aiOpps = processFlows.aiOpportunities?.length || 0;
    const bottlenecks = processFlows.bottlenecks?.length || 0;
    return {
      workflowCount: 2,
      hasCurrentState: true,
      hasFutureState: true,
      automationOpportunityCount: autoOpps,
      aiOpportunityCount: aiOpps,
      bottleneckCount: bottlenecks,
      integrationCount: Math.max(1, Math.floor(autoOpps / 2)),
      processComplexity: bottlenecks > 3 ? "complex" : bottlenecks > 1 ? "medium" : "simple",
      source: "phase2",
    };
  }

  // Fallback: bpmn_steps from blueprint
  if (data?.bpmn_steps && data.bpmn_steps.length > 0) {
    const count = data.bpmn_steps.length;
    return {
      workflowCount: 1,
      hasCurrentState: true,
      hasFutureState: false,
      automationOpportunityCount: Math.floor(count / 2),
      aiOpportunityCount: Math.floor(count / 3),
      bottleneckCount: Math.floor(count / 3),
      integrationCount: 2,
      processComplexity: count > 8 ? "complex" : count > 4 ? "medium" : "simple",
      source: "bpmn_steps",
    };
  }

  // Transparent assumption
  return {
    workflowCount: 2,
    hasCurrentState: false,
    hasFutureState: false,
    automationOpportunityCount: 3,
    aiOpportunityCount: 2,
    bottleneckCount: 3,
    integrationCount: 2,
    processComplexity: "medium",
    source: "assumption",
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// WORK BREAKDOWN STRUCTURE GENERATOR
// Derives actual WBS from project scope, not hardcoded
// ──────────────────────────────────────────────────────────────────────────────
export function generateWBS(
  data: any,
  uxCtx: PlanningUXContext,
  procCtx: PlanningProcessContext
): WorkItem[] {
  const items: WorkItem[] = [];
  const apis = data?.api_endpoints?.length || 6;
  const tables = data?.database_tables?.length || 5;
  const hasAI = Array.isArray(data?.initiatives)
    ? data.initiatives.some((i: any) => /ai|gemini|ml|intelligence/i.test(i.title || i))
    : true;
  const hasAuth = apis > 3 || tables > 3;
  const isEnterprise = data?.digital_maturity === "Enterprise" || (tables > 8 && apis > 10);

  // Helper to scale hours
  const scale = (base: number, factor: number = 1) => ({
    low: Math.round(base * 0.75 * factor),
    likely: Math.round(base * factor),
    high: Math.round(base * 1.4 * factor),
  });

  // 1. DISCOVERY & ANALYSIS
  items.push({
    id: "wbs_1_1", wbsCode: "1.1", title: "Business Requirements Analysis", description: "Validate and document all functional and non-functional requirements from blueprint and analysis",
    category: "discovery", phase: "Phase 1: Discovery", estimatedHours: scale(20), complexity: "medium", dependencies: [], assignedRole: "Business Analyst", status: "todo", isAIGenerated: false,
  });
  items.push({
    id: "wbs_1_2", wbsCode: "1.2", title: "Technical Architecture Design", description: "Define system architecture, data model, API contracts, and deployment topology",
    category: "discovery", phase: "Phase 1: Discovery", estimatedHours: scale(16), complexity: "high", dependencies: ["wbs_1_1"], assignedRole: "Solution Architect", status: "todo", isAIGenerated: false,
  });

  // 2. UX & DESIGN
  const uxHours = uxCtx.screenCount * (uxCtx.screenComplexity === "complex" ? 16 : uxCtx.screenComplexity === "medium" ? 10 : 6);
  items.push({
    id: "wbs_2_1", wbsCode: "2.1", title: "UI/UX Wireframes & Prototypes", description: `Design wireframes for ${uxCtx.screenCount} screens with user flows and interaction states`,
    category: "ux_design", phase: "Phase 2: Design", estimatedHours: scale(uxHours), complexity: uxCtx.screenComplexity === "complex" ? "high" : "medium", dependencies: ["wbs_1_1"], assignedRole: "UI/UX Designer", status: "todo", isAIGenerated: false,
  });
  items.push({
    id: "wbs_2_2", wbsCode: "2.2", title: "Design System & Component Library", description: "Build reusable component library, style guide, tokens, and responsive design system",
    category: "ux_design", phase: "Phase 2: Design", estimatedHours: scale(uxCtx.hasDesignSystem ? 20 : 36), complexity: "medium", dependencies: ["wbs_2_1"], assignedRole: "UI/UX Designer", status: "todo", isAIGenerated: false,
  });

  // 3. FRONTEND
  const frontendHours = uxCtx.screenCount * (uxCtx.screenComplexity === "complex" ? 20 : 14) + (uxCtx.componentCount * 1.5);
  items.push({
    id: "wbs_3_1", wbsCode: "3.1", title: "Frontend Application Development", description: `Build all ${uxCtx.screenCount} screens with responsive layouts, state management, and API integration`,
    category: "frontend", phase: "Phase 3: Development", estimatedHours: scale(frontendHours), complexity: uxCtx.screenComplexity === "complex" ? "high" : "medium", dependencies: ["wbs_2_2"], assignedRole: "Frontend Developer", status: "todo", isAIGenerated: false,
  });

  if (hasAuth) {
    items.push({
      id: "wbs_3_2", wbsCode: "3.2", title: "Authentication & Authorization", description: "Implement secure login, role-based access control, JWT/session management, and multi-factor auth",
      category: "frontend", phase: "Phase 3: Development", estimatedHours: scale(24), complexity: "high", dependencies: ["wbs_3_1"], assignedRole: "Frontend Developer", status: "todo", isAIGenerated: false,
    });
  }

  // 4. BACKEND
  const backendHours = apis * 8 + (hasAuth ? 20 : 0) + (isEnterprise ? 40 : 0);
  items.push({
    id: "wbs_4_1", wbsCode: "4.1", title: "Backend API Development", description: `Build ${apis} REST/GraphQL API endpoints with business logic, validation, and error handling`,
    category: "backend", phase: "Phase 3: Development", estimatedHours: scale(backendHours), complexity: apis > 10 ? "high" : "medium", dependencies: ["wbs_1_2"], assignedRole: "Backend Developer", status: "todo", isAIGenerated: false,
  });

  // 5. DATABASE
  const dbHours = tables * 6 + 20;
  items.push({
    id: "wbs_5_1", wbsCode: "5.1", title: "Database Design & Implementation", description: `Create ${tables} database tables, indexes, constraints, RLS policies, and seed data`,
    category: "database", phase: "Phase 3: Development", estimatedHours: scale(dbHours), complexity: tables > 8 ? "high" : "medium", dependencies: ["wbs_1_2"], assignedRole: "Backend Developer", status: "todo", isAIGenerated: false,
  });
  items.push({
    id: "wbs_5_2", wbsCode: "5.2", title: "Data Migration & Validation", description: "Migrate existing data, validate integrity, implement backup and rollback strategies",
    category: "database", phase: "Phase 3: Development", estimatedHours: scale(16), complexity: "medium", dependencies: ["wbs_5_1"], assignedRole: "Data Engineer", status: "todo", isAIGenerated: false,
  });

  // 6. AI/ML
  if (hasAI) {
    const aiHours = procCtx.aiOpportunityCount * 24 + 20;
    items.push({
      id: "wbs_6_1", wbsCode: "6.1", title: "AI Integration & Gemini API Setup", description: "Integrate Gemini API, configure model cascade, implement prompt engineering and response parsing",
      category: "ai_ml", phase: "Phase 3: Development", estimatedHours: scale(aiHours), complexity: "high", dependencies: ["wbs_4_1"], assignedRole: "AI/ML Engineer", status: "todo", isAIGenerated: false,
    });
    items.push({
      id: "wbs_6_2", wbsCode: "6.2", title: "AI Workflow Automation", description: `Implement ${procCtx.automationOpportunityCount} automation pipelines identified in process analysis`,
      category: "ai_ml", phase: "Phase 3: Development", estimatedHours: scale(procCtx.automationOpportunityCount * 16), complexity: "high", dependencies: ["wbs_6_1"], assignedRole: "AI/ML Engineer", status: "todo", isAIGenerated: false,
    });
    items.push({
      id: "wbs_6_3", wbsCode: "6.3", title: "AI Evaluation & Quality Tuning", description: "Evaluate AI output quality, refine prompts, set confidence thresholds, and implement fallbacks",
      category: "ai_ml", phase: "Phase 3: Development", estimatedHours: scale(20), complexity: "medium", dependencies: ["wbs_6_1", "wbs_6_2"], assignedRole: "AI/ML Engineer", status: "todo", isAIGenerated: false,
    });
  }

  // 7. INTEGRATION
  if (procCtx.integrationCount > 0) {
    items.push({
      id: "wbs_7_1", wbsCode: "7.1", title: "Third-Party Integrations", description: `Implement ${procCtx.integrationCount} external system integrations (webhooks, APIs, data sync)`,
      category: "integration", phase: "Phase 3: Development", estimatedHours: scale(procCtx.integrationCount * 16), complexity: "medium", dependencies: ["wbs_4_1"], assignedRole: "Backend Developer", status: "todo", isAIGenerated: false,
    });
  }

  // 8. TESTING
  const testHours = Math.round((frontendHours + backendHours) * 0.3);
  items.push({
    id: "wbs_8_1", wbsCode: "8.1", title: "Unit & Integration Testing", description: "Write and run automated unit tests, integration tests, and API contract tests",
    category: "testing", phase: "Phase 4: Testing", estimatedHours: scale(testHours), complexity: "medium", dependencies: ["wbs_3_1", "wbs_4_1"], assignedRole: "QA Engineer", status: "todo", isAIGenerated: false,
  });
  items.push({
    id: "wbs_8_2", wbsCode: "8.2", title: "User Acceptance Testing (UAT)", description: "Stakeholder UAT sessions, bug triage, and sign-off against acceptance criteria",
    category: "testing", phase: "Phase 4: Testing", estimatedHours: scale(24), complexity: "low", dependencies: ["wbs_8_1"], assignedRole: "QA Engineer", status: "todo", isAIGenerated: false,
  });

  // 9. DEVOPS & DEPLOYMENT
  items.push({
    id: "wbs_9_1", wbsCode: "9.1", title: "Infrastructure & CI/CD Setup", description: "Provision cloud infrastructure, configure CI/CD pipelines, environment variables, monitoring",
    category: "devops", phase: "Phase 5: Deployment", estimatedHours: scale(24), complexity: "medium", dependencies: ["wbs_5_1"], assignedRole: "DevOps Engineer", status: "todo", isAIGenerated: false,
  });
  items.push({
    id: "wbs_9_2", wbsCode: "9.2", title: "Production Deployment & Go-Live", description: "Production launch, DNS, SSL, load testing, monitoring alerts, and post-launch support",
    category: "devops", phase: "Phase 5: Deployment", estimatedHours: scale(16), complexity: "medium", dependencies: ["wbs_8_2", "wbs_9_1"], assignedRole: "DevOps Engineer", status: "todo", isAIGenerated: false,
  });

  // 10. PROJECT MANAGEMENT
  const totalLikelyHours = items.reduce((s, i) => s + i.estimatedHours.likely, 0);
  items.push({
    id: "wbs_10_1", wbsCode: "10.1", title: "Project Management & Coordination", description: "Sprint planning, standup facilitation, risk management, stakeholder reporting, and delivery oversight",
    category: "project_management", phase: "All Phases", estimatedHours: scale(Math.round(totalLikelyHours * 0.12)), complexity: "medium", dependencies: [], assignedRole: "Project Manager", status: "todo", isAIGenerated: false,
  });

  return items;
}

// ──────────────────────────────────────────────────────────────────────────────
// RESOURCE PLANNER
// Derives roles from actual scope
// ──────────────────────────────────────────────────────────────────────────────
export function generateResources(
  wbs: WorkItem[],
  assumptions: PlanningAssumptions,
  data: any
): ResourceRole[] {
  const sumHours = (roles: string[]) =>
    wbs.filter(w => roles.includes(w.assignedRole)).reduce((s, w) => s + w.estimatedHours.likely, 0);

  const resources: ResourceRole[] = [];

  const feHours = sumHours(["Frontend Developer"]);
  if (feHours > 0) resources.push({
    id: "r_fe", role: "Frontend Developer", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    allocationPercent: 100, estimatedHours: feHours, hourlyRate: assumptions.frontendDevRate,
    estimatedCost: feHours * assumptions.frontendDevRate, durationWeeks: Math.ceil(feHours / assumptions.hoursPerWeek),
    responsibilities: ["Build all UI screens and components", "Implement responsive design", "API integration and state management"],
    isAssumption: true,
  });

  const beHours = sumHours(["Backend Developer", "Data Engineer"]);
  if (beHours > 0) resources.push({
    id: "r_be", role: "Backend Developer", skills: ["Node.js", "PostgreSQL", "REST APIs", "Supabase"],
    allocationPercent: 100, estimatedHours: beHours, hourlyRate: assumptions.backendDevRate,
    estimatedCost: beHours * assumptions.backendDevRate, durationWeeks: Math.ceil(beHours / assumptions.hoursPerWeek),
    responsibilities: ["Build API endpoints", "Design database schema", "Implement authentication & authorization"],
    isAssumption: true,
  });

  const aiHours = sumHours(["AI/ML Engineer"]);
  if (aiHours > 0) resources.push({
    id: "r_ai", role: "AI/ML Engineer", skills: ["Gemini API", "Prompt Engineering", "LLM Integration", "Python"],
    allocationPercent: 75, estimatedHours: aiHours, hourlyRate: assumptions.aiMlRate,
    estimatedCost: aiHours * assumptions.aiMlRate, durationWeeks: Math.ceil(aiHours / (assumptions.hoursPerWeek * 0.75)),
    responsibilities: ["Integrate Gemini API", "Engineer and optimize prompts", "Build AI automation pipelines", "Evaluate and monitor AI quality"],
    isAssumption: true,
  });

  const uxHours = sumHours(["UI/UX Designer"]);
  if (uxHours > 0) resources.push({
    id: "r_ux", role: "UI/UX Designer", skills: ["Figma", "Design Systems", "UX Research", "Prototyping"],
    allocationPercent: 80, estimatedHours: uxHours, hourlyRate: assumptions.uiUxRate,
    estimatedCost: uxHours * assumptions.uiUxRate, durationWeeks: Math.ceil(uxHours / (assumptions.hoursPerWeek * 0.8)),
    responsibilities: ["Design all wireframes and high-fidelity screens", "Create component library", "Conduct UX reviews"],
    isAssumption: true,
  });

  const qaHours = sumHours(["QA Engineer"]);
  if (qaHours > 0) resources.push({
    id: "r_qa", role: "QA Engineer", skills: ["Test Planning", "Automated Testing", "API Testing", "UAT Facilitation"],
    allocationPercent: 60, estimatedHours: qaHours, hourlyRate: assumptions.qaRate,
    estimatedCost: qaHours * assumptions.qaRate, durationWeeks: Math.ceil(qaHours / (assumptions.hoursPerWeek * 0.6)),
    responsibilities: ["Write and execute test plans", "Run automated test suites", "Facilitate stakeholder UAT"],
    isAssumption: true,
  });

  const devopsHours = sumHours(["DevOps Engineer"]);
  if (devopsHours > 0) resources.push({
    id: "r_devops", role: "DevOps Engineer", skills: ["CI/CD", "Cloud (AWS/Vercel)", "Docker", "Monitoring"],
    allocationPercent: 50, estimatedHours: devopsHours, hourlyRate: assumptions.devopsRate,
    estimatedCost: devopsHours * assumptions.devopsRate, durationWeeks: Math.ceil(devopsHours / (assumptions.hoursPerWeek * 0.5)),
    responsibilities: ["Provision cloud infrastructure", "Configure CI/CD pipelines", "Setup monitoring and alerts"],
    isAssumption: true,
  });

  const pmHours = sumHours(["Project Manager", "Business Analyst", "Solution Architect"]);
  if (pmHours > 0) resources.push({
    id: "r_pm", role: "Project Manager / Business Analyst", skills: ["Agile/Scrum", "Stakeholder Management", "Risk Management", "Requirements"],
    allocationPercent: 50, estimatedHours: pmHours, hourlyRate: assumptions.pmRate,
    estimatedCost: pmHours * assumptions.pmRate, durationWeeks: Math.ceil(pmHours / (assumptions.hoursPerWeek * 0.5)),
    responsibilities: ["Facilitate sprints and standups", "Manage risks and scope", "Stakeholder reporting", "Requirements validation"],
    isAssumption: true,
  });

  return resources;
}

// ──────────────────────────────────────────────────────────────────────────────
// MILESTONE / TIMELINE GENERATOR
// ──────────────────────────────────────────────────────────────────────────────
export function generateMilestones(wbs: WorkItem[], assumptions: PlanningAssumptions): Milestone[] {
  const phases = Array.from(new Set(wbs.map(w => w.phase)));
  const milestones: Milestone[] = [];
  let offset = 0;

  const phaseConfig: Record<string, { icon: string; criticalPath: boolean; deliverables: string[] }> = {
    "Phase 1: Discovery": { icon: "🔍", criticalPath: true, deliverables: ["Requirements document", "Architecture design", "Risk register"] },
    "Phase 2: Design": { icon: "🎨", criticalPath: true, deliverables: ["Wireframes approved", "Design system complete", "Prototype sign-off"] },
    "Phase 3: Development": { icon: "💻", criticalPath: true, deliverables: ["Feature-complete build", "API documentation", "Database live"] },
    "Phase 4: Testing": { icon: "🧪", criticalPath: true, deliverables: ["Test report passed", "UAT sign-off", "Zero critical bugs"] },
    "Phase 5: Deployment": { icon: "🚀", criticalPath: true, deliverables: ["Production go-live", "Monitoring active", "Team trained"] },
    "All Phases": { icon: "📋", criticalPath: false, deliverables: ["Status reports", "Project closure report"] },
  };

  for (const phase of phases) {
    if (phase === "All Phases") continue;
    const phaseItems = wbs.filter(w => w.phase === phase);
    const totalLikely = phaseItems.reduce((s, w) => s + w.estimatedHours.likely, 0);
    const weeks = Math.max(1, Math.ceil(totalLikely / (assumptions.hoursPerWeek * 2)));

    const cfg = phaseConfig[phase] || { icon: "📦", criticalPath: false, deliverables: ["Phase deliverables"] };

    milestones.push({
      id: `ms_${milestones.length + 1}`,
      name: `${cfg.icon} ${phase.replace(/Phase \d+: /, "")} Complete`,
      description: `All ${phase} work items completed and reviewed`,
      phase,
      durationWeeks: weeks,
      offsetWeeks: offset,
      dependencies: milestones.length > 0 ? [milestones[milestones.length - 1].id] : [],
      deliverables: cfg.deliverables,
      criticalPath: cfg.criticalPath,
    });

    offset += weeks;
  }

  return milestones;
}

// ──────────────────────────────────────────────────────────────────────────────
// COST MODEL ENGINE (Deterministic)
// ──────────────────────────────────────────────────────────────────────────────
export function calculateCostModel(
  resources: ResourceRole[],
  milestones: Milestone[],
  assumptions: PlanningAssumptions
): CostModel {
  const totalWeeks = milestones.reduce((max, m) => Math.max(max, m.offsetWeeks + m.durationWeeks), 0);

  const devCost = resources
    .filter(r => !["Project Manager / Business Analyst", "UI/UX Designer", "QA Engineer", "DevOps Engineer"].includes(r.role))
    .reduce((s, r) => s + r.estimatedCost, 0);

  const uxCost = resources.filter(r => r.role === "UI/UX Designer").reduce((s, r) => s + r.estimatedCost, 0);
  const aiCost = resources.filter(r => r.role === "AI/ML Engineer").reduce((s, r) => s + r.estimatedCost, 0);
  const testCost = resources.filter(r => r.role === "QA Engineer").reduce((s, r) => s + r.estimatedCost, 0);
  const devopsCost = resources.filter(r => r.role === "DevOps Engineer").reduce((s, r) => s + r.estimatedCost, 0);
  const pmCost = resources.filter(r => r.role === "Project Manager / Business Analyst").reduce((s, r) => s + r.estimatedCost, 0);

  const infraMonthly = assumptions.monthlyCloudCost;
  const aiApiMonthly = assumptions.monthlyAIAPICost;
  const totalMonthly = infraMonthly + aiApiMonthly;

  const subtotal = devCost + uxCost + aiCost + testCost + devopsCost + pmCost
    + devopsCost // deployment one-time included in devops
    + (infraMonthly * Math.ceil(totalWeeks / 4.33));

  const contingency = Math.round(subtotal * 0.15);
  const total = subtotal + contingency;

  return {
    currency: assumptions.currency,
    developmentCost: devCost,
    uiUxDesignCost: uxCost,
    aiIntegrationCost: aiCost,
    infrastructureMonthlyCost: infraMonthly,
    aiApiMonthlyCost: aiApiMonthly,
    testingCost: testCost,
    deploymentCost: devopsCost,
    projectManagementCost: pmCost,
    contingencyPercent: 15,
    contingencyAmount: contingency,
    totalInitialCost: total,
    recurringMonthlyCost: totalMonthly,
    annualOperatingCost: totalMonthly * 12,
    lines: [
      { category: "Development", label: "Backend & AI Development", amount: devCost, type: "one_time", isAssumption: true },
      { category: "Design", label: "UI/UX Design", amount: uxCost, type: "one_time", isAssumption: true },
      { category: "AI", label: "AI/ML Engineering", amount: aiCost, type: "one_time", isAssumption: true },
      { category: "Testing", label: "QA & Testing", amount: testCost, type: "one_time", isAssumption: true },
      { category: "Infrastructure", label: "Cloud & DevOps Setup", amount: devopsCost, type: "one_time", isAssumption: true },
      { category: "Management", label: "Project Management & BA", amount: pmCost, type: "one_time", isAssumption: true },
      { category: "Contingency", label: "15% Contingency Buffer", amount: contingency, type: "one_time", isAssumption: true },
      { category: "Cloud", label: "Monthly Cloud Infrastructure", amount: infraMonthly, type: "monthly", isAssumption: true, notes: "Planning assumption — configure to your actual cloud provider" },
      { category: "AI API", label: "Monthly AI API Usage", amount: aiApiMonthly, type: "monthly", isAssumption: true, notes: "Planning assumption — based on estimated API call volume" },
    ],
    low: Math.round(total * 0.8),
    expected: total,
    high: Math.round(total * 1.3),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// ROI ENGINE (Deterministic, transparent formulas)
// ──────────────────────────────────────────────────────────────────────────────
export function calculateROIModel(
  costModel: CostModel,
  assumptions: PlanningAssumptions,
  data: any
): ROIModel {
  const initial = costModel.totalInitialCost;
  const annual = costModel.annualOperatingCost;
  const hourlyLabor = assumptions.staffHourlyCostForROI;
  const automationRate = assumptions.expectedAutomationRatePercent / 100;
  const adoptionRate = assumptions.expectedAdoptionRatePercent / 100;
  const transactions = assumptions.annualTransactionVolume;

  // Estimated hours saved = transactions × avg manual time per transaction × automation rate
  const avgManualMinutesPerTransaction = 30;
  const annualHoursSaved = transactions * (avgManualMinutesPerTransaction / 60) * automationRate * adoptionRate;
  const annualLaborSaving = Math.round(annualHoursSaved * hourlyLabor);

  // Revenue lift: assume 5% improvement in customer conversion/retention
  const annualRevenueLift = 0; // Conservative default — user can configure

  const buildScenario = (
    scenario: ROIScenario["scenario"],
    label: string,
    laborMult: number,
    revenueMult: number
  ): ROIScenario => {
    const laborSav = Math.round(annualLaborSaving * laborMult);
    const revLift = Math.round(annualRevenueLift * revenueMult);
    const other = 0;
    const totalBenefit = laborSav + revLift + other;
    const netBenefit = totalBenefit - annual;
    const payback = netBenefit > 0 ? Math.round((initial / netBenefit) * 12) : null;
    const firstYearROI = netBenefit > 0 ? Math.round(((totalBenefit - annual - initial) / initial) * 100) : null;
    const threeYearROI = netBenefit > 0 ? Math.round(((totalBenefit * 3 - annual * 3 - initial) / initial) * 100) : null;
    return { scenario, label, annualLaborSaving: laborSav, annualRevenueLift: revLift, annualOtherBenefit: other, annualBenefit: totalBenefit, annualOperatingCost: annual, netAnnualBenefit: netBenefit, paybackMonths: payback, firstYearROI, threeYearROI };
  };

  return {
    initialInvestment: initial,
    currency: assumptions.currency,
    assumptions: [
      { key: "staffHourlyRate", label: "Staff Hourly Labour Cost", value: hourlyLabor, unit: `${assumptions.currency}/hr`, isUserProvided: assumptions.userModified, notes: "Planning assumption — not market-guaranteed" },
      { key: "automationRate", label: "Automation Rate", value: assumptions.expectedAutomationRatePercent, unit: "%", isUserProvided: assumptions.userModified, notes: "Estimated % of manual steps automated" },
      { key: "adoptionRate", label: "Platform Adoption Rate", value: assumptions.expectedAdoptionRatePercent, unit: "%", isUserProvided: assumptions.userModified, notes: "Estimated % of staff/customers adopting the system" },
      { key: "annualTransactions", label: "Annual Transaction Volume", value: transactions, unit: "transactions/year", isUserProvided: assumptions.userModified, notes: "Estimated annual processing volume" },
      { key: "avgManualMins", label: "Avg Manual Minutes per Transaction", value: avgManualMinutesPerTransaction, unit: "minutes", isUserProvided: false, notes: "Estimated time spent per transaction currently" },
      { key: "annualHoursSaved", label: "Estimated Annual Hours Saved", value: Math.round(annualHoursSaved), unit: "hours/year", isUserProvided: false, notes: "Calculated: Volume × AvgTime × AutomationRate × AdoptionRate" },
    ],
    scenarios: [
      buildScenario("conservative", "Conservative (50% adoption realization)", 0.5, 0.3),
      buildScenario("expected", "Expected (Base Assumptions)", 1.0, 1.0),
      buildScenario("optimistic", "Optimistic (130% adoption, higher volume)", 1.3, 1.5),
    ],
    formulaNotes: [
      "Annual Labor Saving = Annual Transactions × Avg Manual Minutes ÷ 60 × Automation Rate × Adoption Rate × Staff Hourly Cost",
      "Net Annual Benefit = Annual Benefit − Annual Operating Cost",
      "Payback Period (months) = Initial Investment ÷ (Net Annual Benefit ÷ 12)",
      "First Year ROI = (Total Benefit − Operating Cost − Initial Investment) ÷ Initial Investment × 100",
      "3-Year ROI = (Total Benefit × 3 − Operating Cost × 3 − Initial Investment) ÷ Initial Investment × 100",
      "All figures are AI-generated planning estimates. Not guaranteed business outcomes.",
    ],
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// RISK REGISTER GENERATOR
// ──────────────────────────────────────────────────────────────────────────────
export function generateRisks(data: any, uxCtx: PlanningUXContext, procCtx: PlanningProcessContext): ProjectRisk[] {
  const risks: ProjectRisk[] = [];
  const hasAI = data?.initiatives?.some?.((i: any) => /ai|gemini|ml/i.test(i.title || i)) ?? true;
  const hasIntegrations = procCtx.integrationCount > 1;
  const apis = data?.api_endpoints?.length || 6;

  risks.push({
    id: "r_sched_1", title: "Scope Creep Causing Timeline Overrun", description: "Uncontrolled feature requests expanding scope beyond initial estimates",
    category: "schedule", probability: "medium", impact: "high", severity: "high",
    mitigation: "Implement formal change control process, freeze scope at sprint start, and use MoSCoW prioritization for new requests",
    owner: "Project Manager", contingency: "30% buffer in high estimate already built in",
  });

  risks.push({
    id: "r_tech_1", title: "Third-Party API Dependency Failure", description: `${apis} external API endpoints may have availability or breaking-change risks`,
    category: "technical", probability: "medium", impact: "high", severity: "high",
    mitigation: "Implement circuit breakers, API versioning locks, and local mock fallbacks for development and testing",
    owner: "Backend Developer",
  });

  if (hasAI) {
    risks.push({
      id: "r_ai_1", title: "AI Model Quality Below Expectation", description: "Gemini API responses may require significant prompt refinement to meet production quality standards",
      category: "ai", probability: "medium", impact: "medium", severity: "medium",
      mitigation: "Allocate dedicated AI evaluation sprint, implement confidence scoring and fallback chains, test with diverse edge case inputs",
      owner: "AI/ML Engineer",
    });
    risks.push({
      id: "r_ai_2", title: "AI API Cost Overrun", description: "Unoptimized prompts or high traffic may exceed planned AI API budget",
      category: "financial", probability: "low", impact: "medium", severity: "low",
      mitigation: "Implement response caching, token budgeting, prompt compression, and monthly spend alerts",
      owner: "DevOps Engineer",
    });
  }

  if (hasIntegrations) {
    risks.push({
      id: "r_int_1", title: "Integration Complexity Underestimated", description: "Third-party systems may have undocumented behaviors, rate limits, or schema differences",
      category: "integration", probability: "medium", impact: "medium", severity: "medium",
      mitigation: "Conduct integration spike in Phase 1, document API contracts, and allocate a dedicated integration testing phase",
      owner: "Backend Developer",
    });
  }

  risks.push({
    id: "r_sec_1", title: "Authentication & Data Security Vulnerabilities", description: "Insufficient access control or data exposure in multi-role web application",
    category: "security", probability: "low", impact: "critical", severity: "high",
    mitigation: "Implement Row-Level Security (RLS), OWASP Top-10 audit, penetration testing, and role-based access control (RBAC)",
    owner: "Security Engineer",
  });

  risks.push({
    id: "r_res_1", title: "Key Person Dependency & Staff Unavailability", description: "Critical team members leaving or becoming unavailable during implementation",
    category: "resource", probability: "low", impact: "high", severity: "medium",
    mitigation: "Ensure full documentation, pair programming on critical components, and cross-training on core modules",
    owner: "Project Manager",
  });

  risks.push({
    id: "r_data_1", title: "Data Quality Issues During Migration", description: "Existing data may have inconsistencies, duplicates, or gaps that block migration",
    category: "data", probability: "medium", impact: "medium", severity: "medium",
    mitigation: "Run data profiling and cleansing before migration, implement validation checkpoints and rollback scripts",
    owner: "Data Engineer",
  });

  risks.push({
    id: "r_ops_1", title: "Low User Adoption Rate", description: "Staff or customers resist adopting the new digital platform, reducing realized ROI",
    category: "operational", probability: "medium", impact: "high", severity: "medium",
    mitigation: "Involve end-users in UAT early, provide training and change management, and implement phased rollout",
    owner: "Project Manager",
  });

  return risks;
}

// ──────────────────────────────────────────────────────────────────────────────
// CONFIDENCE CALCULATOR
// ──────────────────────────────────────────────────────────────────────────────
export function calculateConfidence(data: any, uxCtx: PlanningUXContext, procCtx: PlanningProcessContext): {
  overall: ConfidenceLevel;
  requirementsScore: number;
  technicalScore: number;
  financialScore: number;
  notes: string[];
} {
  const notes: string[] = [];
  let reqScore = 50;
  let techScore = 50;
  let finScore = 50;

  if (data?.business_analysis?.gap_analysis?.length > 0) { reqScore += 20; }
  if (data?.user_role) { reqScore += 10; }
  if (data?.bpmn_steps?.length > 0 || procCtx.source === "phase2") { reqScore += 15; }
  if (uxCtx.source === "phase3") { techScore += 25; }
  if (uxCtx.source === "wireframe_sections") { techScore += 15; }
  if (data?.api_endpoints?.length > 0) { techScore += 15; }
  if (data?.database_tables?.length > 0) { techScore += 10; }
  if (data?.tech_stack) { techScore += 10; }
  if (data?.financial_estimation) { finScore += 20; }
  if (data?.planning?.effortHours) { finScore += 15; }

  if (uxCtx.source === "assumption") notes.push("UX scope based on assumptions — Phase 3 data not yet available");
  if (procCtx.source === "assumption") notes.push("Process complexity based on assumptions — Phase 2 data may enhance estimates");
  if (!data?.api_endpoints?.length) notes.push("API endpoint count not available — estimate uses heuristic");
  notes.push("All estimates are AI-generated planning ranges. Not guaranteed delivery commitments.");

  const avg = Math.round((reqScore + techScore + finScore) / 3);
  const overall: ConfidenceLevel = avg >= 70 ? "high" : avg >= 50 ? "medium" : "low";

  return { overall, requirementsScore: Math.min(reqScore, 95), technicalScore: Math.min(techScore, 95), financialScore: Math.min(finScore, 95), notes };
}

// ──────────────────────────────────────────────────────────────────────────────
// PLANNING SCENARIOS
// ──────────────────────────────────────────────────────────────────────────────
export function generateScenarios(
  costModel: CostModel,
  milestones: Milestone[],
  roiModel: ROIModel
): PlanningScenario[] {
  const totalWeeks = milestones.reduce((max, m) => Math.max(max, m.offsetWeeks + m.durationWeeks), 0);
  const expectedROI = roiModel.scenarios.find(s => s.scenario === "expected")?.firstYearROI;
  const expectedPayback = roiModel.scenarios.find(s => s.scenario === "expected")?.paybackMonths;

  return [
    {
      type: "mvp",
      label: "MVP — Lean Launch",
      description: "Core features only. Single developer or small team. Minimal design work. Fastest to market.",
      teamSize: "1–2 Developers",
      durationWeeks: Math.round(totalWeeks * 0.65),
      featuresIncluded: ["Core CRUD functionality", "Basic authentication", "Primary user workflow", "Production deployment"],
      featuresExcluded: ["Advanced AI features", "Full UX design system", "Third-party integrations", "Analytics dashboard"],
      estimatedCost: { low: costModel.low * 0.45, expected: costModel.expected * 0.5, high: costModel.high * 0.55 },
      estimatedROI: expectedROI ? Math.round(expectedROI * 0.5) : null,
      paybackMonths: expectedPayback ? Math.round(expectedPayback * 1.4) : null,
      riskLevel: "medium",
      recommendation: "Recommended for proof-of-concept, quick-win demos, and budget-constrained initial launches.",
    },
    {
      type: "standard",
      label: "Standard — Balanced Delivery",
      description: "Full feature scope with proper design, testing, and AI integration. Recommended approach.",
      teamSize: "3–5 People",
      durationWeeks: totalWeeks,
      featuresIncluded: ["All planned features", "Complete UX design", "AI integration", "Full testing", "Monitoring"],
      featuresExcluded: ["Custom ML model training", "Multi-region deployment"],
      estimatedCost: { low: costModel.low, expected: costModel.expected, high: costModel.high },
      estimatedROI: expectedROI ?? null,
      paybackMonths: expectedPayback ?? null,
      riskLevel: "low",
      recommendation: "Recommended for production systems with clear business requirements and defined scope.",
    },
    {
      type: "enterprise",
      label: "Enterprise — Accelerated & Scalable",
      description: "Larger team, parallel workstreams, advanced security, compliance, and enterprise integrations.",
      teamSize: "6–10 People",
      durationWeeks: Math.round(totalWeeks * 0.7),
      featuresIncluded: ["All standard features", "Enterprise security audit", "Compliance integration", "Multi-region deployment", "Advanced analytics", "SLA-backed infrastructure"],
      featuresExcluded: [],
      estimatedCost: { low: costModel.low * 1.6, expected: costModel.expected * 1.8, high: costModel.high * 2.1 },
      estimatedROI: expectedROI ? Math.round(expectedROI * 1.3) : null,
      paybackMonths: expectedPayback ? Math.round(expectedPayback * 0.8) : null,
      riskLevel: "low",
      recommendation: "Recommended for enterprise-grade deployments requiring compliance, multi-team collaboration, and faster time-to-value.",
    },
  ];
}

// ──────────────────────────────────────────────────────────────────────────────
// MASTER BUILDER — buildPlanningBlueprint()
// ──────────────────────────────────────────────────────────────────────────────
export function buildPlanningBlueprint(data: any, overrideAssumptions?: Partial<PlanningAssumptions>): PlanningBlueprint {
  const assumptions: PlanningAssumptions = { ...DEFAULT_ASSUMPTIONS, ...overrideAssumptions };

  const uxCtx = getPlanningUXContext(data);
  const procCtx = getPlanningProcessContext(data);

  const wbs = generateWBS(data, uxCtx, procCtx);
  const resources = generateResources(wbs, assumptions, data);
  const milestones = generateMilestones(wbs, assumptions);
  const costModel = calculateCostModel(resources, milestones, assumptions);
  const roiModel = calculateROIModel(costModel, assumptions, data);
  const risks = generateRisks(data, uxCtx, procCtx);
  const scenarios = generateScenarios(costModel, milestones, roiModel);
  const confidence = calculateConfidence(data, uxCtx, procCtx);

  const totalHours = wbs.reduce((acc, w) => ({
    low: acc.low + w.estimatedHours.low,
    likely: acc.likely + w.estimatedHours.likely,
    high: acc.high + w.estimatedHours.high,
  }), { low: 0, likely: 0, high: 0 });

  const totalWeeks = milestones.reduce((max, m) => Math.max(max, m.offsetWeeks + m.durationWeeks), 0);
  const criticalPath = milestones.filter(m => m.criticalPath).map(m => m.name);

  return {
    id: `plan_${Date.now()}`,
    projectTitle: data?.project_title || "Untitled Project",
    generatedAt: new Date().toISOString(),
    assumptions,
    confidence,
    workBreakdown: wbs,
    resources,
    milestones,
    costModel,
    roiModel,
    risks,
    scenarios,
    totalEstimatedHours: totalHours,
    durationWeeks: totalWeeks,
    criticalPath,
    isAIEnhanced: false,
    isAIGeneratedEstimate: true,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// PERSISTENCE
// ──────────────────────────────────────────────────────────────────────────────
const PLANNING_STORAGE_KEY = "planning_blueprint_v1_";

export function savePlanningBlueprint(projectId: string, plan: PlanningBlueprint): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PLANNING_STORAGE_KEY}${projectId}`, JSON.stringify(plan));
  } catch (e) {
    console.warn("Error saving planning blueprint:", e);
  }
}

export function loadPlanningBlueprint(projectId: string): PlanningBlueprint | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PLANNING_STORAGE_KEY}${projectId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
