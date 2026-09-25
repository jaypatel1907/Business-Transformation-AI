import { UXBlueprint, UXScreen, UXComponent, UXNavigation, UXPersona, UXJourney, UXQualityIssue } from "./ux-wireframe-types"
import { restaurantUXFixture } from "./ux-wireframe-fixtures"

/**
 * Extracts comprehensive context from Phase 1 (Business Analysis, Discovery)
 * and Phase 2 (Process Intelligence, if available) to feed AI UX synthesis.
 */
export function getUXGenerationContext(blueprintData?: any) {
  if (!blueprintData) {
    return {
      title: "Enterprise Application",
      domain: "General Enterprise",
      problem: "Automate manual business workflows",
      targetAudience: "Business Users & Customers",
      goals: ["Digitize operations", "Improve turnaround time"],
      gaps: [],
      currentWorkflows: [],
      futureWorkflows: [],
      aiOpportunities: [],
      processTouchpoints: []
    }
  }

  const ba = blueprintData.business_analysis
  const pi = blueprintData.process_intelligence

  return {
    title: blueprintData.project_title || "Enterprise Solution",
    domain: blueprintData.user_problem || "Business Solution",
    problem: blueprintData.user_problem || "",
    targetAudience: ba?.executive_summary?.strategic_intent || "End Users & Enterprise Operators",
    goals: ba?.executive_summary?.key_value_drivers || ["Streamline customer journeys", "Automate core actions"],
    gaps: (ba?.gap_analysis || []).map((g: any) => `${g.category}: ${g.gap_description}`),
    currentWorkflows: ba?.current_state?.manual_workflows || [],
    futureWorkflows: ba?.future_state?.automated_workflows || [],
    aiOpportunities: (ba?.ai_opportunities || []).map((o: any) => `${o.title} (${o.category})`),
    processTouchpoints: (pi?.processFlow?.nodes || []).map((n: any) => `${n.name} [${n.role}]`),
    techStack: blueprintData.tech_stack || {}
  }
}

/**
 * Normalizes any blueprint data into a fully-functional, interactive UXBlueprint.
 * Guarantees backwards compatibility with legacy `wireframe_sections` array.
 */
export function normalizeToUXBlueprint(blueprintData?: any): UXBlueprint {
  if (blueprintData?.ux_blueprint && Array.isArray(blueprintData.ux_blueprint.screens) && blueprintData.ux_blueprint.screens.length > 0) {
    return {
      ...blueprintData.ux_blueprint,
      activeScreenId: blueprintData.ux_blueprint.activeScreenId || blueprintData.ux_blueprint.screens[0].id
    }
  }

  const title = blueprintData?.project_title || "Interactive Solution Wireframes"
  const rawPrompt = (blueprintData?.project_title + " " + (blueprintData?.user_problem || "")).toLowerCase()

  // If this is a restaurant or food ordering app, use the rich restaurant fixture
  if (rawPrompt.includes("restaurant") || rawPrompt.includes("food") || rawPrompt.includes("dine") || rawPrompt.includes("table") || rawPrompt.includes("booking")) {
    return {
      ...restaurantUXFixture,
      projectTitle: title,
      projectId: blueprintData?.id || undefined
    }
  }

  // If legacy wireframe_sections exists, convert them gracefully
  const legacySections = blueprintData?.wireframe_sections
  if (Array.isArray(legacySections) && legacySections.length > 0) {
    const screens: UXScreen[] = legacySections.map((sec: any, idx: number) => {
      const screenId = `screen-${idx + 1}`
      const screenName = sec.title || `Screen ${idx + 1}`
      const route = idx === 0 ? "/" : `/${screenName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      
      const components: UXComponent[] = (sec.components || []).map((cmpName: string, cIdx: number) => {
        const cmpId = `cmp-${idx + 1}-${cIdx + 1}`
        const lowerName = cmpName.toLowerCase()

        if (lowerName.includes("button") || lowerName.includes("sign in") || lowerName.includes("checkout") || lowerName.includes("pay") || lowerName.includes("submit") || lowerName.includes("book")) {
          return {
            id: cmpId,
            type: "button",
            label: cmpName,
            variant: cIdx === 0 ? "primary" : "secondary",
            width: "full",
            action: {
              type: "navigate",
              targetScreenId: idx < legacySections.length - 1 ? `screen-${idx + 2}` : "screen-1",
              label: `Proceed to ${idx < legacySections.length - 1 ? legacySections[idx + 1].title || "Next" : "Home"}`
            }
          }
        }

        if (lowerName.includes("input") || lowerName.includes("email") || lowerName.includes("password") || lowerName.includes("search") || lowerName.includes("card")) {
          return {
            id: cmpId,
            type: lowerName.includes("search") ? "search" : "input",
            label: cmpName,
            placeholder: `Enter ${cmpName}...`,
            width: "full",
            properties: {
              inputType: lowerName.includes("password") ? "password" : lowerName.includes("email") ? "email" : "text",
              required: true
            }
          }
        }

        if (lowerName.includes("table") || lowerName.includes("grid") || lowerName.includes("list") || lowerName.includes("order history")) {
          return {
            id: cmpId,
            type: "table",
            label: cmpName,
            width: "full",
            properties: {
              columns: ["ID", "Record Name", "Status", "Timestamp", "Actions"],
              dataRows: [
                ["#REC-101", "Primary Active Record", "Active", "Just now", "View"],
                ["#REC-102", "Secondary Completed Task", "Completed", "2 hrs ago", "View"]
              ]
            }
          }
        }

        // Default card container
        return {
          id: cmpId,
          type: "card",
          label: cmpName,
          variant: "outline",
          width: "full",
          content: `Interactive ${cmpName} display panel with real-time state synchronization.`,
          properties: {
            badge: "Live Component"
          }
        }
      })

      return {
        id: screenId,
        name: screenName,
        route,
        description: `Interactive wireframe layout for ${screenName}.`,
        purpose: `Allow users to interact with ${screenName} components.`,
        deviceType: "desktop",
        isInitial: idx === 0,
        components: components.length > 0 ? components : [
          {
            id: `cmp-${idx}-default`,
            type: "card",
            label: screenName,
            content: "Primary operational interface for this view.",
            width: "full"
          }
        ]
      }
    })

    const navigation: UXNavigation[] = []
    for (let i = 0; i < screens.length - 1; i++) {
      navigation.push({
        id: `nav-${i + 1}`,
        sourceScreenId: screens[i].id,
        targetScreenId: screens[i + 1].id,
        trigger: "click",
        label: `Navigate to ${screens[i + 1].name}`
      })
    }

    return {
      projectTitle: title,
      projectId: blueprintData?.id || undefined,
      screens,
      navigation,
      personas: [
        {
          id: "persona-1",
          name: "Standard End User",
          role: "Primary Platform User",
          avatar: "👤",
          goals: ["Complete core workflows with minimum clicks", "Access real-time information"],
          painPoints: ["Complex multi-step processes", "Unclear action confirmations"],
          keyScreens: screens.map((s) => s.id)
        }
      ],
      journeys: [
        {
          id: "journey-1",
          personaId: "persona-1",
          title: "End-to-End Core User Journey",
          goal: "Execute primary tasks from entry to confirmation",
          steps: screens.map((s, sIdx) => ({
            stepNumber: sIdx + 1,
            title: `Navigate to ${s.name}`,
            description: s.description,
            screenId: s.id,
            action: sIdx < screens.length - 1 ? `Proceed to ${screens[sIdx + 1].name}` : "Finish Journey"
          }))
        }
      ],
      activeScreenId: screens[0]?.id || "screen-1",
      status: "draft",
      updatedAt: new Date().toISOString()
    }
  }

  // Fallback: Synthesize standard 4-screen Enterprise SaaS layout
  const defaultScreens: UXScreen[] = [
    {
      id: "screen-1",
      name: "Dashboard & Executive Overview",
      route: "/dashboard",
      description: "Central command center with KPIs, recent transactions, and actionable quick shortcuts.",
      purpose: "Provide 360-degree operational visibility and rapid access to core functions.",
      deviceType: "desktop",
      isInitial: true,
      metadata: { category: "Admin", tags: ["Dashboard", "KPIs"] },
      components: [
        {
          id: "cmp-dash-header",
          type: "heading",
          label: `${title} Dashboard`,
          content: "Welcome back! Here is your live business summary for today.",
          width: "full"
        },
        {
          id: "cmp-stat-1",
          type: "stat_card",
          label: "Total Volume / Activity",
          width: "1/3",
          properties: { statValue: "$124,500", statChange: "+18.2% this month", badgeTone: "emerald" }
        },
        {
          id: "cmp-stat-2",
          type: "stat_card",
          label: "Active Operations",
          width: "1/3",
          properties: { statValue: "84 Active", statChange: "All systems healthy", badgeTone: "indigo" }
        },
        {
          id: "cmp-stat-3",
          type: "stat_card",
          label: "Automated AI Actions",
          width: "1/3",
          properties: { statValue: "94.8% Success", statChange: "Autonomous Copilot", badgeTone: "purple" }
        },
        {
          id: "cmp-btn-new",
          type: "button",
          label: "+ Create New Record / Request",
          variant: "primary",
          width: "1/2",
          action: { type: "navigate", targetScreenId: "screen-2", label: "Open Creation Form" }
        },
        {
          id: "cmp-btn-records",
          type: "button",
          label: "Browse Complete Data Records →",
          variant: "secondary",
          width: "1/2",
          action: { type: "navigate", targetScreenId: "screen-3", label: "View Data Records" }
        }
      ]
    },
    {
      id: "screen-2",
      name: "Create / Ingest Record",
      route: "/records/new",
      description: "Structured submission form with input validation and AI assistant autofill.",
      purpose: "Enable fast manual entry and document parsing.",
      deviceType: "desktop",
      metadata: { category: "Core", tags: ["Form", "Create"] },
      components: [
        {
          id: "cmp-form-header",
          type: "heading",
          label: "Create New Transformation Entry",
          content: "Fill out the required attributes to trigger the automated backend pipeline.",
          width: "full"
        },
        {
          id: "cmp-input-title",
          type: "input",
          label: "Record Title / Identifier",
          placeholder: "e.g. Q3 Logistics Fleet Modernization",
          width: "1/2",
          properties: { required: true }
        },
        {
          id: "cmp-input-type",
          type: "select",
          label: "Category / Type",
          placeholder: "Select Category",
          width: "1/2",
          properties: { options: ["Standard Operation", "High-Priority Transformation", "Compliance Audit", "Routine Maintenance"] }
        },
        {
          id: "cmp-input-desc",
          type: "textarea",
          label: "Detailed Description & Scope",
          placeholder: "Describe operational parameters...",
          width: "full"
        },
        {
          id: "cmp-btn-submit",
          type: "button",
          label: "Submit & Execute Workflow →",
          variant: "success",
          width: "full",
          action: { type: "navigate", targetScreenId: "screen-3", label: "Save and View Details" }
        }
      ]
    },
    {
      id: "screen-3",
      name: "Records Explorer & Detail View",
      route: "/records",
      description: "Searchable data table with filter badges and detail drawer.",
      purpose: "Provide searchable access to all system records.",
      deviceType: "desktop",
      metadata: { category: "Catalog", tags: ["Table", "Explorer"] },
      components: [
        {
          id: "cmp-search-records",
          type: "search",
          label: "Search Records by Keyword or ID...",
          placeholder: "Filter records...",
          width: "full"
        },
        {
          id: "cmp-records-table",
          type: "table",
          label: "System Records Master Table",
          width: "full",
          properties: {
            columns: ["ID", "Title", "Status", "Priority", "Actions"],
            dataRows: [
              ["#REC-001", "Automated Dispatch Service", "Active", "High", "Inspect"],
              ["#REC-002", "Customer Voice Verification", "In Review", "Medium", "Inspect"],
              ["#REC-003", "Payment Webhook Gateway", "Active", "Critical", "Inspect"]
            ]
          }
        },
        {
          id: "cmp-btn-dash",
          type: "button",
          label: "← Back to Executive Dashboard",
          variant: "outline",
          width: "full",
          action: { type: "navigate", targetScreenId: "screen-1", label: "Return to Dashboard" }
        }
      ]
    }
  ]

  return {
    projectTitle: title,
    projectId: blueprintData?.id || undefined,
    screens: defaultScreens,
    navigation: [
      { id: "nav-1", sourceScreenId: "screen-1", targetScreenId: "screen-2", trigger: "click", label: "Create Entry CTA" },
      { id: "nav-2", sourceScreenId: "screen-1", targetScreenId: "screen-3", trigger: "click", label: "Browse Records CTA" },
      { id: "nav-3", sourceScreenId: "screen-2", targetScreenId: "screen-3", trigger: "submit", label: "Form Submit Redirection" },
      { id: "nav-4", sourceScreenId: "screen-3", targetScreenId: "screen-1", trigger: "click", label: "Return Home Navigation" }
    ],
    personas: [
      {
        id: "persona-1",
        name: "Enterprise Operations Manager",
        role: "System Coordinator",
        avatar: "📊",
        goals: ["Monitor high-level metrics", "Approve operational entries", "Track exceptions"],
        painPoints: ["Lack of real-time visibility", "Manual spreadsheet reconciliations"],
        keyScreens: ["screen-1", "screen-2", "screen-3"]
      }
    ],
    journeys: [
      {
        id: "journey-1",
        personaId: "persona-1",
        title: "Standard Entry Creation & Verification Journey",
        goal: "Create new operational entry and verify in records table",
        steps: [
          { stepNumber: 1, title: "Review Dashboard Summary", description: "Inspect KPI metrics", screenId: "screen-1", action: "Click 'Create New Record'" },
          { stepNumber: 2, title: "Fill Details in Form", description: "Provide title and category", screenId: "screen-2", action: "Submit Form" },
          { stepNumber: 3, title: "Verify Ingested Record", description: "Check status in records table", screenId: "screen-3", action: "Complete Task" }
        ]
      }
    ],
    activeScreenId: "screen-1",
    status: "draft",
    updatedAt: new Date().toISOString()
  }
}

/**
 * Validates UX blueprint quality, identifying disconnected screens or unlinked actions.
 */
export function validateUXQuality(blueprint: UXBlueprint): UXQualityIssue[] {
  const issues: UXQualityIssue[] = []

  const screenIds = new Set(blueprint.screens.map((s) => s.id))
  const targetedScreenIds = new Set<string>()

  // Check navigation links
  blueprint.navigation.forEach((nav) => {
    targetedScreenIds.add(nav.targetScreenId)
    if (!screenIds.has(nav.sourceScreenId)) {
      issues.push({
        id: `issue-nav-src-${nav.id}`,
        type: "error",
        title: "Invalid Navigation Source",
        description: `Navigation "${nav.label}" points from non-existent screen ID "${nav.sourceScreenId}".`
      })
    }
    if (!screenIds.has(nav.targetScreenId)) {
      issues.push({
        id: `issue-nav-tgt-${nav.id}`,
        type: "error",
        title: "Invalid Navigation Target",
        description: `Navigation "${nav.label}" points to non-existent screen ID "${nav.targetScreenId}".`
      })
    }
  })

  // Check for orphan screens
  blueprint.screens.forEach((screen) => {
    if (!screen.isInitial && !targetedScreenIds.has(screen.id)) {
      issues.push({
        id: `issue-orphan-${screen.id}`,
        type: "warning",
        title: "Unlinked / Orphan Screen",
        description: `Screen "${screen.name}" (${screen.route}) has no incoming navigation links.`,
        screenId: screen.id
      })
    }

    // Check components inside screen
    screen.components.forEach((cmp) => {
      if (cmp.type === "button" && (!cmp.action || !cmp.action.targetScreenId)) {
        issues.push({
          id: `issue-btn-no-action-${cmp.id}`,
          type: "info",
          title: "Button Without Navigation Target",
          description: `Button "${cmp.label}" on screen "${screen.name}" does not navigate anywhere.`,
          screenId: screen.id,
          componentId: cmp.id
        })
      }

      if ((cmp.type === "input" || cmp.type === "textarea" || cmp.type === "select") && !cmp.label) {
        issues.push({
          id: `issue-input-no-label-${cmp.id}`,
          type: "warning",
          title: "Accessibility: Input Without Label",
          description: `Form field on screen "${screen.name}" is missing an accessible label.`,
          screenId: screen.id,
          componentId: cmp.id
        })
      }
    })
  })

  return issues
}
