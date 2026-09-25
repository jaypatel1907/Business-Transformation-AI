/**
 * Canonical Project Plan Adapter & Calculation Engine
 * Bridges Planning & ROI ↔ Roadmap Integration with a Single Source of Truth
 */

import {
  CanonicalProjectPlan,
  CanonicalResource,
  CanonicalPhase,
  CanonicalMilestone,
  CanonicalFinancials,
  CanonicalEffort,
  CanonicalRisk
} from "./project-plan-types"

/**
 * Normalizes any blueprint data into a single canonical ProjectPlan.
 * Seamlessly handles legacy structures and persists the unified plan.
 */
export function getCanonicalProjectPlan(blueprintData?: any): CanonicalProjectPlan {
  if (blueprintData?.project_plan && blueprintData.project_plan.phases?.length > 0) {
    return blueprintData.project_plan
  }

  const projectId = blueprintData?.id || "proj-canonical-001"
  const projectTitle = blueprintData?.project_title || "Enterprise Solution Architecture"
  const timelineWindow = blueprintData?.timeline || "6-8 Weeks"
  const finEst = blueprintData?.financial_estimation || {}
  const planning = blueprintData?.planning || {}
  const legacySprints = blueprintData?.roadmap_sprints || []
  const ba = blueprintData?.business_analysis

  // 1. Resources
  const defaultRoles = [
    { id: "res-1", role: "Full-Stack Engineer", count: 2, hours: 140, hourlyRate: 75, allocationPercent: 100, skills: ["React", "Next.js", "PostgreSQL", "Node.js"] },
    { id: "res-2", role: "AI & ML Specialist", count: 1, hours: 60, hourlyRate: 95, allocationPercent: 50, skills: ["Gemini API", "Prompt Engineering", "RAG"] },
    { id: "res-3", role: "UI/UX Product Designer", count: 1, hours: 40, hourlyRate: 65, allocationPercent: 40, skills: ["Figma", "Design Systems", "Wireframing"] }
  ]

  const rawRoles = Array.isArray(finEst.team_roles) && finEst.team_roles.length > 0
    ? finEst.team_roles.map((r: any, idx: number) => ({
        id: `res-${idx + 1}`,
        role: r.role || `Engineering Role ${idx + 1}`,
        count: typeof r.count === "number" ? r.count : 1,
        hours: Math.round(Number(planning.effortHours || 240) / Math.max(1, finEst.team_roles.length)),
        hourlyRate: Number(String(finEst.hourly_rate || "75").replace(/[^0-9.]/g, "")) || 75,
        allocationPercent: Number(String(r.allocation || "100").replace(/[^0-9.]/g, "")) || 100,
        skills: ["TypeScript", "Full-Stack Development"]
      }))
    : defaultRoles

  const resources: CanonicalResource[] = rawRoles.map(r => ({
    ...r,
    estimatedCost: r.count * r.hours * r.hourlyRate
  }))

  // 2. Phases & Sprints
  let phases: CanonicalPhase[] = []
  if (Array.isArray(legacySprints) && legacySprints.length > 0) {
    phases = legacySprints.map((s: any, idx: number) => {
      const pId = `phase-${idx + 1}`
      const pName = s.phase || s.title || `Sprint ${idx + 1}`
      const pTimeframe = s.timeframe || `Week ${idx + 1}`
      const pEffort = typeof s.effortHours === "number" ? s.effortHours : Math.round(240 / legacySprints.length)
      const pCost = pEffort * 75
      
      const tasks = Array.isArray(s.tasks) ? s.tasks : [String(s.tasks || "Execute sprint backlog and component testing")]
      const techStack = Array.isArray(s.tech_stack) ? s.tech_stack : [String(s.tech_stack || "TypeScript, PostgreSQL")]
      const aiTools = Array.isArray(s.ai_tools) ? s.ai_tools : [String(s.ai_tools || "Cursor, Gemini 2.5 Flash")]

      return {
        id: pId,
        sprintNumber: idx + 1,
        timeframe: pTimeframe,
        name: pName,
        phase: pName,
        description: s.description || tasks.join("; "),
        owner: s.owner || "Full-Stack Engineer",
        tech_stack: techStack,
        ai_tools: aiTools,
        tasks: tasks,
        effortHours: pEffort,
        estimatedCost: pCost,
        resourceRoles: [s.owner || "Full-Stack Engineer"],
        dependencies: idx > 0 ? [`phase-${idx}`] : [],
        milestones: [`milestone-${idx + 1}`],
        status: idx === 0 ? "in_progress" : "planned"
      }
    })
  } else {
    phases = [
      {
        id: "phase-1",
        sprintNumber: 1,
        timeframe: "Week 1",
        name: "Discovery & Architecture Foundation",
        phase: "Phase 1: Architecture Setup",
        description: "Provision database schema, repository structure, and core UI layouts.",
        owner: "Lead Architect",
        tech_stack: ["Next.js", "TypeScript", "Tailwind CSS"],
        ai_tools: ["Cursor IDE", "Gemini 2.5 Flash"],
        tasks: ["Initialize GitHub repository", "Setup Supabase PostgreSQL schemas", "Design design system tokens"],
        effortHours: 60,
        estimatedCost: 4500,
        resourceRoles: ["Lead Architect", "UI/UX Product Designer"],
        dependencies: [],
        milestones: ["milestone-1"],
        status: "in_progress"
      },
      {
        id: "phase-2",
        sprintNumber: 2,
        timeframe: "Week 2-3",
        name: "Core Workflows & API Gateway",
        phase: "Phase 2: Workflow Engineering",
        description: "Develop REST API endpoints, business logic routing, and state machine.",
        owner: "Backend Engineer",
        tech_stack: ["Node.js", "PostgreSQL", "Next.js Route Handlers"],
        ai_tools: ["Gemini Code Assist"],
        tasks: ["Implement CRUD endpoints", "Build validation middleware", "Integrate transactional database queries"],
        effortHours: 100,
        estimatedCost: 7500,
        resourceRoles: ["Backend Engineer"],
        dependencies: ["phase-1"],
        milestones: ["milestone-2"],
        status: "planned"
      },
      {
        id: "phase-3",
        sprintNumber: 3,
        timeframe: "Week 4-5",
        name: "AI Copilot & Frontend Interfaces",
        phase: "Phase 3: AI Intelligence Integration",
        description: "Implement interactive UX views, live dashboard telemetry, and AI Assistant.",
        owner: "Full-Stack Engineer",
        tech_stack: ["React 19", "Lucide Icons", "Gemini API"],
        ai_tools: ["Gemini 2.5 Flash API"],
        tasks: ["Build responsive dashboard views", "Integrate streaming AI prompt synthesis", "Implement client notifications"],
        effortHours: 80,
        estimatedCost: 6000,
        resourceRoles: ["Full-Stack Engineer", "AI & ML Specialist"],
        dependencies: ["phase-2"],
        milestones: ["milestone-3"],
        status: "planned"
      }
    ]
  }

  // 3. Milestones
  const milestones: CanonicalMilestone[] = phases.map((p, idx) => ({
    id: `milestone-${idx + 1}`,
    phaseId: p.id,
    phaseName: p.name,
    name: `${p.name} Deliverable Gate`,
    description: `Validation and sign-off for ${p.name}`,
    targetWeek: p.timeframe,
    status: idx === 0 ? "in_progress" : "pending",
    deliverables: Array.isArray(p.tasks) ? p.tasks.slice(0, 2) : ["Production code and automated tests"]
  }))

  // 4. Effort Calculations
  const totalPhaseHours = phases.reduce((acc, p) => acc + (p.effortHours || 0), 0)
  const totalHours = totalPhaseHours || Number(planning.effortHours || 240)
  
  const effort: CanonicalEffort = {
    totalHours,
    developmentHours: Math.round(totalHours * 0.55),
    designHours: Math.round(totalHours * 0.15),
    testingHours: Math.round(totalHours * 0.15),
    managementHours: Math.round(totalHours * 0.15),
    hoursPerWeek: 40
  }

  // 5. Financials Calculations
  const laborCost = resources.reduce((acc, r) => acc + (r.estimatedCost || 0), 0) || (totalHours * 75)
  const cloudMonthlyCost = planning.cloudCost || "$120/mo"
  const cloudDetail = planning.cloudDetail || "Supabase PostgreSQL + Edge Functions"
  const aiApiMonthlyCost = "$45/mo"
  const contingencyAmount = Math.round(laborCost * 0.12)
  const totalInvestment = laborCost + contingencyAmount

  const projectedAnnualBenefit = ba?.executive_summary?.projected_roi_percentage
    ? Math.round(totalInvestment * 3.4)
    : Math.round(totalInvestment * 2.8)

  const roiPercentage = totalInvestment > 0
    ? Math.round(((projectedAnnualBenefit - totalInvestment) / totalInvestment) * 100)
    : 320

  const paybackMonths = projectedAnnualBenefit > 0
    ? Number(((totalInvestment / (projectedAnnualBenefit / 12))).toFixed(1))
    : 4.2

  const minBudget = finEst.min_budget || `$${Math.round(totalInvestment * 0.85).toLocaleString()}`
  const maxBudget = finEst.max_budget || `$${Math.round(totalInvestment * 1.25).toLocaleString()}`

  const financials: CanonicalFinancials = {
    currency: "$",
    minBudget,
    maxBudget,
    targetBudgetAmount: totalInvestment,
    laborCost,
    cloudMonthlyCost,
    cloudDetail,
    aiApiMonthlyCost,
    contingencyAmount,
    totalInvestment,
    projectedAnnualBenefit,
    roiPercentage,
    paybackMonths
  }

  // 6. Risks
  const risks: CanonicalRisk[] = [
    {
      id: "risk-1",
      level: planning.risk?.level || "Low-Medium",
      title: planning.risk?.title || "API Rate Limits & Latency",
      category: "Technical",
      mitigation: planning.risk?.mitigation || "Implement client-side caching and streaming responses.",
      owner: "Lead Architect"
    },
    {
      id: "risk-2",
      level: "Medium",
      title: "Data Schema Migration Consistency",
      category: "Data Integrity",
      mitigation: "Use idempotent PostgreSQL migrations with transaction rollbacks.",
      owner: "Backend Engineer"
    }
  ]

  return {
    projectId,
    projectTitle,
    version: "v1.0.0",
    status: "AI Generated",
    lastUpdated: new Date().toISOString(),
    timelineWindow,
    syncStatus: "synchronized",
    financials,
    effort,
    resources,
    phases,
    milestones,
    risks
  }
}

/**
 * Re-computes all derived fields across Effort, Financials, Resources, Milestones, and Timeline.
 */
export function recalculateProjectPlan(plan: CanonicalProjectPlan): CanonicalProjectPlan {
  // 1. Recalculate phase hours and phase costs
  const updatedPhases = plan.phases.map((p, idx) => {
    const hours = Math.max(1, p.effortHours || 40)
    // Find matching resource rate or default
    const matchingRes = plan.resources.find(r => p.resourceRoles?.includes(r.role)) || plan.resources[0]
    const rate = matchingRes?.hourlyRate || 75
    const cost = hours * rate

    return {
      ...p,
      sprintNumber: idx + 1,
      effortHours: hours,
      estimatedCost: cost,
      timeframe: p.timeframe || `Week ${idx + 1}`
    }
  })

  // 2. Recalculate total hours
  const totalPhaseHours = updatedPhases.reduce((acc, p) => acc + p.effortHours, 0)
  const totalHours = Math.max(1, totalPhaseHours)

  const effort: CanonicalEffort = {
    totalHours,
    developmentHours: Math.round(totalHours * 0.55),
    designHours: Math.round(totalHours * 0.15),
    testingHours: Math.round(totalHours * 0.15),
    managementHours: Math.round(totalHours * 0.15),
    hoursPerWeek: plan.effort.hoursPerWeek || 40
  }

  // 3. Recalculate resources
  const updatedResources = plan.resources.map(r => {
    const cost = r.count * r.hours * r.hourlyRate
    return { ...r, estimatedCost: cost }
  })
  const totalLaborCost = updatedResources.reduce((acc, r) => acc + r.estimatedCost, 0) || (totalHours * 75)
  const contingencyAmount = Math.round(totalLaborCost * 0.12)
  const totalInvestment = totalLaborCost + contingencyAmount

  // 4. Recalculate ROI & Payback
  const annualBenefit = plan.financials.projectedAnnualBenefit > 0
    ? plan.financials.projectedAnnualBenefit
    : Math.round(totalInvestment * 3.2)

  const roiPercentage = totalInvestment > 0
    ? Math.round(((annualBenefit - totalInvestment) / totalInvestment) * 100)
    : 320

  const paybackMonths = annualBenefit > 0
    ? Number(((totalInvestment / (annualBenefit / 12))).toFixed(1))
    : 4.2

  const minBudget = `$${Math.round(totalInvestment * 0.85).toLocaleString()}`
  const maxBudget = `$${Math.round(totalInvestment * 1.25).toLocaleString()}`

  const financials: CanonicalFinancials = {
    ...plan.financials,
    laborCost: totalLaborCost,
    contingencyAmount,
    totalInvestment,
    projectedAnnualBenefit: annualBenefit,
    roiPercentage,
    paybackMonths,
    minBudget,
    maxBudget,
    targetBudgetAmount: totalInvestment
  }

  // 5. Recalculate timeline weeks
  const calculatedWeeks = Math.max(2, Math.ceil(totalHours / (effort.hoursPerWeek * Math.max(1, plan.resources.reduce((acc, r) => acc + r.count, 0) || 1))))
  const timelineWindow = `${calculatedWeeks}-${calculatedWeeks + 2} Weeks`

  // 6. Recalculate milestones
  const updatedMilestones = updatedPhases.map((p, idx) => ({
    id: `milestone-${idx + 1}`,
    phaseId: p.id,
    phaseName: p.name,
    name: `${p.name} Deliverables Sign-off`,
    description: `Complete verification of ${p.name} objectives.`,
    targetWeek: p.timeframe,
    status: p.status === "completed" ? "completed" as const : p.status === "in_progress" ? "in_progress" as const : "pending" as const,
    deliverables: Array.isArray(p.tasks) ? p.tasks : [String(p.tasks)]
  }))

  return {
    ...plan,
    lastUpdated: new Date().toISOString(),
    syncStatus: "synchronized",
    timelineWindow,
    phases: updatedPhases,
    effort,
    resources: updatedResources,
    financials,
    milestones: updatedMilestones
  }
}

/**
 * Synchronizes the canonical plan into the legacy blueprint data format
 * to guarantee backwards compatibility with all PDF exporters and views.
 */
export function exportPlanToBlueprintData(plan: CanonicalProjectPlan, originalBlueprintData?: any): any {
  return {
    ...originalBlueprintData,
    project_plan: plan,
    timeline: plan.timelineWindow,
    financial_estimation: {
      min_budget: plan.financials.minBudget,
      max_budget: plan.financials.maxBudget,
      total_hours: `${plan.effort.totalHours} Hours`,
      hourly_rate: `$${Math.round(plan.financials.laborCost / Math.max(1, plan.effort.totalHours))}/hr`,
      team_roles: plan.resources.map(r => ({
        role: r.role,
        count: r.count,
        allocation: `${r.allocationPercent}%`
      }))
    },
    roadmap_sprints: plan.phases.map(p => ({
      timeframe: p.timeframe,
      phase: p.name,
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.tech_stack,
      ai_tools: Array.isArray(p.ai_tools) ? p.ai_tools.join(", ") : p.ai_tools,
      owner: p.owner,
      tasks: Array.isArray(p.tasks) ? p.tasks.join(", ") : p.tasks,
      effortHours: p.effortHours,
      estimatedCost: p.estimatedCost
    })),
    planning: {
      effortHours: String(plan.effort.totalHours),
      cloudCost: plan.financials.cloudMonthlyCost,
      cloudDetail: plan.financials.cloudDetail,
      risk: {
        level: plan.risks[0]?.level || "Low-Medium",
        title: plan.risks[0]?.title || "Scaling & Performance",
        mitigation: plan.risks[0]?.mitigation || "Implement caching and optimized queries."
      }
    }
  }
}
