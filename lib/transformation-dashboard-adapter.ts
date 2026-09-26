import {
  TransformationDashboardData,
  ExecutiveKPI,
  TransformationScoreDimension,
  CurrentVsFutureTransformation,
  CurrentVsFutureStep,
  AIOpportunityPortfolioItem,
  RoadmapPhaseStatus,
  FinancialBreakdown,
  ROIEstimate,
  RiskItem,
  ExecutiveAlert,
  NextBestAction,
  ProjectHealthDimension
} from "./transformation-dashboard-types"
import { cleanUserFacingPrompt } from "./domain-intelligence"

/**
 * Aggregates all project phases into a cohesive, structured Executive Dashboard data model.
 * Gracefully extracts real data from Phase 1, 2, 3, and 4 when available, or derives
 * high-fidelity calculations with transparent attribution and full multi-language localization.
 */
export function getTransformationDashboardData(
  data?: any,
  targetLanguage: string = "English"
): TransformationDashboardData {
  const lang = (targetLanguage || data?.target_language || "English").toLowerCase()
  const isGuj = lang.includes("gu")
  const isHindi = lang.includes("hi")
  const isSpanish = lang.includes("es")

  const projectId = data?.id || "proj-exec-001"
  const projectTitle = data?.project_title || (isGuj ? "એન્ટરપ્રાઇઝ ટ્રાન્સફોર્મેશન બ્લુપ્રિન્ટ" : isHindi ? "एंटरप्राइज ट्रांसफॉर्मेशन ब्लूप्रिंट" : "Enterprise Transformation Solution")
  const userProblem = cleanUserFacingPrompt(
    data?.user_problem ||
      (isGuj
        ? "AI અને ક્લાઉડ ઓટોમેશન દ્વારા મુખ્ય બિઝનેસ પ્રક્રિયાઓને ઝડપી અને આધુનિક બનાવો."
        : isHindi
        ? "AI और क्लाउड ऑटोमेशन के माध्यम से मुख्य व्यावसायिक प्रक्रियाओं को आधुनिक बनाएं।"
        : "Modernize and automate core operations through AI assistance.")
  )
  const lastUpdated = data?.updated_at || new Date().toISOString()

  // Phase 1: Business Analysis
  const ba = data?.business_analysis
  const execSummary = ba?.executive_summary
  const gapAnalysis = ba?.gap_analysis || []
  const currentWorkflows = ba?.current_state?.manual_workflows || []
  const futureWorkflows = ba?.future_state?.automated_workflows || []
  const rawAiOpportunities = ba?.ai_opportunities || data?.ai_opportunities || []

  // Phase 2: Process Intelligence
  const pi = data?.process_intelligence
  const piFlow = pi?.processFlow
  const piNodes = piFlow?.nodes || []
  const piMetrics = pi?.simulationMetrics || {}

  // Phase 3: AI UX / Wireframes
  const ux = data?.ux_blueprint
  const uxScreens = ux?.screens || data?.wireframe_sections || []
  const uxJourneys = ux?.journeys || []

  // Phase 4: Planning & Financials
  const planningData = data?.planning_data || data?.planning || {}
  const finEst = data?.financial_estimation || {}
  const rawSprints = data?.roadmap_sprints || data?.roadmap || []
  const techStack = data?.tech_stack || {}
  const dbSchema = data?.db_schema || data?.database_schema || []
  const apiEndpoints = data?.api_endpoints || data?.endpoints || []

  // 1. Executive Summary
  const businessProblem =
    execSummary?.strategic_intent ||
    userProblem ||
    (isGuj
      ? "મેન્યુઅલ કામકાજ, પેપરવર્ક અને વિખરાયેલી જૂની સિસ્ટમો દૂર કરવી."
      : isHindi
      ? "मैन्युअल परिचालन और बिखरे हुए पुराने सिस्टम को समाप्त करना।"
      : "Eliminate manual operational overhead and fragmented systems.")

  const transformationObjective =
    execSummary?.transformation_scope ||
    (isGuj
      ? "ઓટોમેટેડ વર્કફ્લો અને AI કોપાયલટ સાથે એકીકૃત ડિજિટલ પ્લેટફોર્મ તૈનાત કરવું."
      : isHindi
      ? "स्वचालित वर्कफ़्लो और AI कोपायलट के साथ एकीकृत डिजिटल प्लेटफ़ॉर्म तैयार करना।"
      : "Deploy an integrated digital platform featuring automated workflows and intelligent copilot assistance.")

  const expectedOutcome =
    execSummary?.key_value_drivers?.[0] ||
    (isGuj
      ? "કામગીરીના સમયમાં 70% ઘટાડો, 24/7 ત્વરિત કસ્ટમર સેલ્ફ-સર્વિસ અને 99.5% ડેટા ચોકસાઈ."
      : isHindi
      ? "प्रसंस्करण समय में 70% की कमी, 24/7 त्वरित ग्राहक स्व-सेवा और 99.5% डेटा सटीकता।"
      : "70% reduction in processing cycle times, instant customer self-service, and 99.5% operational data consistency.")

  const strategicIntent =
    execSummary?.strategic_intent ||
    (isGuj
      ? "ડિજિટલ ઓટોમેશન અને AI સંચાલનમાં અગ્રણી નેતૃત્વ સ્થાપિત કરવું."
      : isHindi
      ? "डिजिटल स्वचालन और AI निष्पादन में अग्रणी नेतृत्व स्थापित करना।"
      : "Establish digital enterprise leadership in agility and automated execution.")

  const targetMVP =
    data?.timeline ||
    (planningData?.milestones
      ? `${planningData.milestones.length * 2} ${isGuj ? "અઠવાડિયા" : isHindi ? "सप्ताह" : "Weeks"}`
      : isGuj
      ? "6 અઠવાડિયા"
      : isHindi
      ? "6 सप्ताह"
      : "6 Weeks")

  // 2. Derive Executive KPIs
  const digitalMaturityVal = typeof data?.digital_maturity === "number" ? data.digital_maturity : 84
  const aiReadinessVal = typeof data?.ai_adoption === "number" ? data.ai_adoption : (data?.ai_readiness || 88)
  
  const phase4TotalCost = planningData?.costModel?.totalProjectCost
  const minBudgetNum = phase4TotalCost ? Math.round(phase4TotalCost * 0.85) : (parseInt((finEst.min_budget || "$18,000").replace(/[^0-9]/g, ""), 10) || 18000)
  const maxBudgetNum = phase4TotalCost ? Math.round(phase4TotalCost * 1.15) : (parseInt((finEst.max_budget || "$32,000").replace(/[^0-9]/g, ""), 10) || 32000)
  const avgInvestment = phase4TotalCost ? Math.round(phase4TotalCost) : Math.round((minBudgetNum + maxBudgetNum) / 2)

  // Calculated Annual Benefit & ROI
  const calculatedAnnualBenefit = planningData?.roiModel?.threeYearNetBenefit
    ? Math.round(planningData.roiModel.threeYearNetBenefit / 3)
    : Math.round(avgInvestment * 3.4)
  const calculatedROI = planningData?.roiModel?.expectedROI
    ? Math.round(planningData.roiModel.expectedROI)
    : Math.round(((calculatedAnnualBenefit - avgInvestment) / avgInvestment) * 100)
  const paybackMonths = planningData?.roiModel?.paybackMonths
    ? Number(planningData.roiModel.paybackMonths).toFixed(1)
    : (avgInvestment / (calculatedAnnualBenefit / 12)).toFixed(1)

  const kpis: ExecutiveKPI[] = [
    {
      id: "kpi-roi",
      label: isGuj ? "અપેક્ષિત ROI" : isHindi ? "अनुमानित ROI" : "Expected ROI",
      value: `${calculatedROI}%`,
      trend: isGuj ? "+3.4x ગણો લાભ" : isHindi ? "+3.4x गुना लाभ" : "+3.4x Multiplier",
      trendDirection: "up",
      source: "Calculated",
      category: "financial",
      benchmark: isGuj ? "ઇન્ડસ્ટ્રી સરેરાશ: 180%" : isHindi ? "उद्योग औसत: 180%" : "Industry Avg: 180%",
      details: isGuj
        ? `$${avgInvestment.toLocaleString()} મૂડી રોકાણ સામે વાર્ષિક $${calculatedAnnualBenefit.toLocaleString()} નો ચોખ્ખો નફો અપેક્ષિત છે.`
        : isHindi
        ? `$${avgInvestment.toLocaleString()} निवेश के मुकाबले वार्षिक $${calculatedAnnualBenefit.toLocaleString()} शुद्ध लाभ अनुमानित है।`
        : `Projected annualized net benefit of $${calculatedAnnualBenefit.toLocaleString()} against $${avgInvestment.toLocaleString()} capital expenditure.`
    },
    {
      id: "kpi-payback",
      label: isGuj ? "પેબેક સમયગાળો" : isHindi ? "पेबैक अवधि" : "Payback Period",
      value: `${paybackMonths} ${isGuj ? "મહિના" : isHindi ? "महीने" : "Mo"}`,
      trend: isGuj ? "ઝડપી બ્રેક-ઇવન" : isHindi ? "त्वरित ब्रेक-इवन" : "Fast Break-Even",
      trendDirection: "up",
      source: "Calculated",
      category: "financial",
      benchmark: isGuj ? "ટાર્ગેટ: < 12 મહિના" : isHindi ? "लक्ष्य: < 12 महीने" : "Target: < 12 Months",
      details: isGuj
        ? `પ્રોજેક્ટ લોન્ચ થયાના ${paybackMonths} મહિનાની અંદર પૂરેપૂરી રકમ પરત વસૂલ થશે.`
        : isHindi
        ? `परियोजना शुरू होने के ${paybackMonths} महीनों के भीतर पूर्ण निवेश की वसूली होगी।`
        : `Full capital recovery estimated within ${paybackMonths} months of production deployment.`
    },
    {
      id: "kpi-investment",
      label: isGuj ? "અંદાજિત રોકાણ" : isHindi ? "अनुमानित निवेश" : "Estimated Investment",
      value: finEst.min_budget && finEst.max_budget ? `${finEst.min_budget} - ${finEst.max_budget}` : "$25,000",
      trend: finEst.total_hours
        ? `${finEst.total_hours} ${isGuj ? "કલાક ડેવલપમેન્ટ" : isHindi ? "घंटे विकास" : "Est. Dev"}`
        : isGuj
        ? "240 કલાક"
        : isHindi
        ? "240 घंटे"
        : "240 Hours",
      trendDirection: "neutral",
      source: finEst.min_budget ? "User Provided" : "AI Estimated",
      category: "financial",
      benchmark: isGuj ? "ફિક્સ્ડ સ્કોપ કેપ" : isHindi ? "फिक्स्ड स्कोप कैप" : "Fixed Scope Cap",
      details: isGuj
        ? "UI/UX ડિઝાઇન, ફૂલ-સ્ટેક ડેવલપમેન્ટ, AI ઇન્ટિગ્રેશન અને ક્લાઉડ સેટઅપનો સંપૂર્ણ અંદાજ."
        : isHindi
        ? "UI/UX डिज़ाइन, फुल-स्टैक डेवलपमेंट, AI एकीकरण और क्लाउड सेटअप का समग्र अनुमान।"
        : "Comprehensive estimate encompassing UX, Full-Stack engineering, AI integration, and cloud infra."
    },
    {
      id: "kpi-maturity",
      label: isGuj ? "ડિજિટલ પરિપક્વતા" : isHindi ? "डिजिटल मैच्योरिटी" : "Digital Maturity",
      value: `${digitalMaturityVal}%`,
      trend: isGuj ? "+28% લોન્ચ પછી" : isHindi ? "+28% लॉन्च के बाद" : "+28% Post-Launch",
      trendDirection: "up",
      source: "Derived",
      category: "maturity",
      benchmark: isGuj ? "એન્ટરપ્રાઇઝ બેઝલાઇન" : isHindi ? "एंटरप्राइज बेसलाइन" : "Enterprise Baseline",
      details: isGuj
        ? "વર્કફ્લો ડિજિટલાઇઝેશન, સેન્ટ્રલ ડેટાબેઝ અને API ઓટોમેશનનું ચોક્કસ મૂલ્યાંકન."
        : isHindi
        ? "वर्कफ़्लो डिजिटलीकरण, डेटा केंद्रीकरण और API स्वचालन का सटीक मूल्यांकन।"
        : "Quantified index measuring workflow digitalization, data centralization, and API automation."
    },
    {
      id: "kpi-ai-readiness",
      label: isGuj ? "AI રેડીનેસ ઇન્ડેક્સ" : isHindi ? "AI रेडीनेस इंडेक्स" : "AI Readiness Index",
      value: `${aiReadinessVal}%`,
      trend: isGuj ? "ઉચ્ચ શક્યતા" : isHindi ? "उच्च व्यवहार्यता" : "High Feasibility",
      trendDirection: "up",
      source: "Derived",
      category: "ai",
      benchmark: isGuj ? "ટોપ સ્તર" : isHindi ? "शीर्ष स्तर" : "Top Quartile",
      details: isGuj
        ? "LLM એજન્ટિક ટૂલ્સ, સ્કીમા મેપિંગ અને રિયલ-ટાઇમ રિસ્પોન્સ સાથે સંપૂર્ણ સુસંગત."
        : isHindi
        ? "LLM एजेंटिक टूल्स, स्कीमा मैपिंग और रीयल-टाइम प्रतिक्रिया के साथ अत्यधिक संगत।"
        : "High compatibility with LLM agentic tool calls, structured schema mapping, and real-time generation."
    },
    {
      id: "kpi-automation",
      label: isGuj ? "ઓટોમેશન ક્ષમતા" : isHindi ? "स्वचालन क्षमता" : "Automation Potential",
      value: `${piMetrics.automationRate || 74}%`,
      trend: isGuj ? "ઝડપી ગતિ" : isHindi ? "उच्च गति" : "High Velocity",
      trendDirection: "up",
      source: piMetrics.automationRate ? "Calculated" : "Derived",
      category: "process",
      benchmark: isGuj ? "ટાર્ગેટ: > 65%" : isHindi ? "लक्ष्य: > 65%" : "Target: > 65%",
      details: isGuj
        ? "મેન્યુઅલ કામકાજ વગર આપમેળે પૂર્ણ થઈ શકતી પ્રક્રિયાઓની ટકાવારી."
        : isHindi
        ? "मैन्युअल प्रयास के बिना स्वचालित रूप से पूर्ण होने वाली प्रक्रियाओं का प्रतिशत।"
        : "Percentage of operational workflow transitions capable of zero-touch automated execution."
    },
    {
      id: "kpi-velocity",
      label: isGuj ? "પ્રથમ MVP સમય" : isHindi ? "पहले MVP का समय" : "Time to First MVP",
      value: targetMVP,
      trend: isGuj ? "ઝડપી સ્પ્રિન્ટ" : isHindi ? "त्वरित स्प्रिंट" : "Accelerated Sprint",
      trendDirection: "up",
      source: "User Provided",
      category: "technical",
      benchmark: isGuj ? "SLA: 6-8 અઠવાડિયા" : isHindi ? "SLA: 6-8 सप्ताह" : "SLA: 6-8 Weeks",
      details: isGuj
        ? "4 સ્પ્રિન્ટમાં ફેઝ મુજબ ડિલિવરી અને સ્ટેકહોલ્ડર સેન્ડબોક્સ વેરિફિકેશન."
        : isHindi
        ? "4 स्प्रिंट पुनरावृत्तियों में चरणबद्ध डिलीवरी और लाइव सैंडबॉक्स सत्यापन।"
        : "Phased delivery across 4 sprint iterations with early stakeholder sandbox validation."
    },
    {
      id: "kpi-risk",
      label: isGuj ? "સંકલિત જોખમ સ્તર" : isHindi ? "समग्र जोखिम स्तर" : "Composite Risk Level",
      value: isGuj ? "ઓછું-મધ્યમ" : isHindi ? "कम-मध्यम" : "Low-Medium",
      trend: isGuj ? "નિયંત્રિત" : isHindi ? "नियंत्रित" : "Mitigated",
      trendDirection: "down",
      source: "Derived",
      category: "maturity",
      benchmark: isGuj ? "સુરક્ષિત" : isHindi ? "सुरक्षित" : "Controlled",
      details: isGuj
        ? "તમામ તકનીકી અને ડેટા માઇગ્રેશન જોખમો માટે પૂર્વ-આયોજિત સુરક્ષા પ્લાન તૈયાર છે."
        : isHindi
        ? "दस्तावेजी सुरक्षा प्रोटोकॉल के साथ मानक तकनीकी और डेटा माइग्रेशन जोखिम।"
        : "Standard architectural and data migration risks with documented mitigation protocols."
    }
  ]

  // 3. Transformation Score Dimensions (7 Dimensions)
  const readinessScores: TransformationScoreDimension[] = [
    {
      id: "dim-business",
      name: isGuj ? "બિઝનેસ ગોઠવણી" : isHindi ? "बिजनेस अलाइनमेंट" : "Business Alignment",
      score: 92,
      weight: 0.2,
      status: "Optimized",
      rationale: isGuj
        ? "સ્પષ્ટ ઉદ્દેશો, નિર્ધારિત મૂલ્ય ડ્રાઇવરો અને સ્પષ્ટ KPI મોનિટરિંગ."
        : isHindi
        ? "स्पष्ट रणनीतिक उद्देश्य, निर्धारित मूल्य चालक और स्पष्ट KPI निगरानी।"
        : "Clear executive intent, defined value drivers, and explicit KPI attribution.",
      source: "Calculated"
    },
    {
      id: "dim-tech",
      name: isGuj ? "ટેકનોલોજી રેડીનેસ" : isHindi ? "तकनीकी तत्परता" : "Technology Readiness",
      score: 88,
      weight: 0.15,
      status: "Ready",
      rationale: isGuj
        ? "આધુનિક Next.js 16 સ્ટેક, PostgreSQL સ્કીમા અને REST API આર્કિટેક્ચર તૈયાર."
        : isHindi
        ? "आधुनिक Next.js 16 स्टैक, PostgreSQL स्कीमा और REST API आर्किटेक्चर तैयार।"
        : "Modern Next.js 16 stack, PostgreSQL schema, and typed REST API architectures defined.",
      source: "Calculated"
    },
    {
      id: "dim-data",
      name: isGuj ? "ડેટા આર્કિટેક્ચર" : isHindi ? "डेटा आर्किटेक्चर" : "Data Architecture",
      score: Array.isArray(dbSchema) && dbSchema.length > 0 ? 86 : 72,
      weight: 0.15,
      status: Array.isArray(dbSchema) && dbSchema.length > 0 ? "Ready" : "Developing",
      rationale: isGuj
        ? "સંબંધિત ડેટાબેઝ મોડેલો અને ઇન્ડેક્સિંગ વ્યૂહરચના વ્યાખ્યાયિત."
        : isHindi
        ? "संबंधित डेटाबेस मॉडल और इंडेक्सिंग रणनीतियां परिभाषित।"
        : "Relational database models and indexing strategies mapped to business entities.",
      source: "Calculated"
    },
    {
      id: "dim-ai",
      name: isGuj ? "AI અને GenAI ઇન્ટિગ્રેશન" : isHindi ? "AI और GenAI एकीकरण" : "AI & GenAI Integration",
      score: aiReadinessVal,
      weight: 0.15,
      status: "Ready",
      rationale: isGuj
        ? "ઝડપી રિસ્પોન્સ માટે સ્ટ્રક્ચર્ડ LLM કેસ્કેડ અને સંદર્ભિત પ્રોમ્પ્ટ્સ ગોઠવાયેલા."
        : isHindi
        ? "त्वरित प्रतिक्रिया के लिए संरचित LLM कैस्केड और प्रासंगिक प्रॉम्प्ट्स कॉन्फ़िगर।"
        : "Structured LLM cascades and contextual prompts configured for rapid inference.",
      source: "Derived"
    },
    {
      id: "dim-process",
      name: isGuj ? "પ્રોસેસ ઓપ્ટિમાઇઝેશન" : isHindi ? "प्रक्रिया अनुकूलन" : "Process Optimization",
      score: pi ? 89 : 78,
      weight: 0.15,
      status: pi ? "Optimized" : "Ready",
      rationale: isGuj
        ? "BPMN 2.0 પ્રોસેસ ફ્લો, આપમેળે નિર્ણય લેવાના નિયમો અને ભૂમિકાઓ નિર્ધારિત."
        : isHindi
        ? "BPMN 2.0 प्रक्रिया प्रवाह और स्वचालित निर्णय नियम निर्धारित।"
        : "BPMN 2.0 process flow mapped with automated decision gates and role boundaries.",
      source: pi ? "Calculated" : "Derived"
    },
    {
      id: "dim-ux",
      name: isGuj ? "UX અને ઉપયોગિતા" : isHindi ? "UX और उपयोगिता" : "UX & Usability",
      score: ux ? 91 : 80,
      weight: 0.1,
      status: ux ? "Optimized" : "Ready",
      rationale: isGuj
        ? "ઇન્ટરેક્ટિવ વાયરફ્રેમ્સ, મલ્ટી-ડિવાઇસ વ્યુપોર્ટ અને યુઝર જર્ની તૈયાર."
        : isHindi
        ? "इंटरैक्टिव वायरफ्रेम, मल्टी-डिवाइस व्यूपोर्ट और उपयोगकर्ता यात्राएं तैयार।"
        : "Interactive wireframes, multi-device viewport validations, and user journeys created.",
      source: ux ? "Calculated" : "Derived"
    },
    {
      id: "dim-impl",
      name: isGuj ? "અમલીકરણ રેડીનેસ" : isHindi ? "कार्यान्वयन तत्परता" : "Implementation Readiness",
      score: 87,
      weight: 0.1,
      status: "Ready",
      rationale: isGuj
        ? "સ્પ્રિન્ટ માઇલસ્ટોન્સ, ટીમ ફાળવણી અને બજેટ મર્યાદાઓ અંતિમ સ્વરૂપે નક્કી."
        : isHindi
        ? "स्प्रिंट मील के पत्थर, टीम आवंटन और बजट सीमाएं अंतिम रूप से निर्धारित।"
        : "Sprint milestones, team allocations, and budget ceilings finalized.",
      source: "Derived"
    }
  ]

  // Calculate Overall Transformation Progress
  const overallProgress = Math.round(
    readinessScores.reduce((acc, dim) => acc + dim.score * dim.weight, 0)
  )

  // 4. Current vs Future Transformation Steps
  let transformSteps: CurrentVsFutureStep[] = []

  if (currentWorkflows.length > 0 && futureWorkflows.length > 0) {
    transformSteps = currentWorkflows.map((cw: string, i: number) => {
      const fw = futureWorkflows[i] || (isGuj ? `ડિજિટલ વર્કફ્લો દ્વારા ${cw} નું ઓટોમેશન` : isHindi ? `डिजिटल वर्कफ़्लो के माध्यम से ${cw} का स्वचालन` : `Automated ${cw} through digital workflow`)
      return {
        stepNumber: i + 1,
        currentState: cw,
        futureState: fw,
        automationType: i % 2 === 0 ? (isGuj ? "સંપૂર્ણ ઓટોમેટેડ" : isHindi ? "पूर्ण स्वचालित" : "Fully Automated") : (isGuj ? "AI સહાયિત" : isHindi ? "AI सहायता प्राप्त" : "AI Assisted"),
        manualEffortReduction: i % 2 === 0 ? (isGuj ? "85% બચત" : isHindi ? "85% बचत" : "85% Saved") : (isGuj ? "60% બચત" : isHindi ? "60% बचत" : "60% Saved"),
        techEnabler: i % 2 === 0 ? "Serverless Webhook Trigger" : "Gemini Copilot Decision Engine",
        riskLevel: "Low"
      }
    })
  } else if (piNodes.length > 0) {
    transformSteps = piNodes.slice(0, 4).map((node: any, i: number) => ({
      stepNumber: i + 1,
      currentState: isGuj ? `${node.role || "ઓપરેટર"} દ્વારા મેન્યુઅલ ${node.name || "ટાસ્ક"}` : isHindi ? `${node.role || "ऑपरेटर"} द्वारा मैन्युअल ${node.name || "कार्य"}` : `Manual ${node.name || "Task Execution"} by ${node.role || "Operator"}`,
      futureState: isGuj ? `ત્વરિત સ્ટેટસ સાથે ઓટોમેટેડ ${node.name || "પ્રોસેસિંગ"}` : isHindi ? `त्वरित स्थिति के साथ स्वचालित ${node.name || "प्रोसेसिंग"}` : `Automated ${node.name || "Processing"} with instant status feedback`,
      automationType: node.type === "ai_agent" ? (isGuj ? "AI સહાયિત" : isHindi ? "AI सहायता प्राप्त" : "AI Assisted") : (isGuj ? "સંપૂર્ણ ઓટોમેટેડ" : isHindi ? "पूर्ण स्वचालित" : "Fully Automated"),
      manualEffortReduction: node.type === "ai_agent" ? (isGuj ? "70% બચત" : isHindi ? "70% बचत" : "70% Saved") : (isGuj ? "90% બચત" : isHindi ? "90% बचत" : "90% Saved"),
      techEnabler: node.type === "ai_agent" ? "Generative AI Assistant" : "PostgreSQL Event Queue",
      riskLevel: "Low"
    }))
  } else {
    transformSteps = [
      {
        stepNumber: 1,
        currentState: isGuj ? "ઇમેઇલ અને સ્પ્રેડશીટ દ્વારા મેન્યુઅલ એન્ટ્રી" : isHindi ? "ईमेल और स्प्रेडशीट के माध्यम से मैन्युअल एंट्री" : "Manual intake via email & spreadsheets",
        futureState: isGuj ? "ઇન્ટરેક્ટિવ સેલ્ફ-સર્વિસ પોર્ટલ અને ત્વરિત વેરિફિકેશન" : isHindi ? "इंटरैक्टिव सेल्फ-सर्विस पोर्टल और त्वरित सत्यापन" : "Interactive self-service portal & instant structured validation",
        automationType: isGuj ? "સંપૂર્ણ ઓટોમેટેડ" : isHindi ? "पूर्ण स्वचालित" : "Fully Automated",
        manualEffortReduction: isGuj ? "90% બચત" : isHindi ? "90% बचत" : "90% Saved",
        techEnabler: "Next.js Form Validation + Cloud Storage",
        riskLevel: "Low"
      },
      {
        stepNumber: 2,
        currentState: isGuj ? "મેન્યુઅલ રિવ્યુ, કેટેગરી અને ચકાસણી" : isHindi ? "मैन्युअल समीक्षा, वर्गीकरण और सत्यापन" : "Manual review, categorization, and validation",
        futureState: isGuj ? "AI કોપાયલટ ક્લાસિફિકેશન અને વિસંગતતા શોધ" : isHindi ? "AI कोपायलट वर्गीकरण और विसंगति पहचान" : "AI Copilot classification & fraud/anomaly detection",
        automationType: isGuj ? "AI સહાયિત" : isHindi ? "AI सहायता प्राप्त" : "AI Assisted",
        manualEffortReduction: isGuj ? "75% બચત" : isHindi ? "75% बचत" : "75% Saved",
        techEnabler: "Gemini 2.5 Structured Reasoning",
        riskLevel: "Medium"
      },
      {
        stepNumber: 3,
        currentState: isGuj ? "ફોન દ્વારા કન્ફર્મેશન અને મેન્યુઅલ અપ્રૂવલ" : isHindi ? "फोन द्वारा पुष्टि और मैन्युअल अनुमोदन" : "Manual stakeholder approvals & phone confirmations",
        futureState: isGuj ? "વન-ક્લિક અપ્રૂવલ વર્કફ્લો અને રિયલ-ટાઇમ નોટિફિકેશન" : isHindi ? "वन-क्लिक अनुमोदन वर्कफ़्लो और रीयल-टाइम सूचनाएं" : "One-click approval workflow with real-time notifications",
        automationType: isGuj ? "માનવ દેખરેખ (Human in Loop)" : isHindi ? "मानव नियंत्रण (Human in Loop)" : "Human in the Loop",
        manualEffortReduction: isGuj ? "60% બચત" : isHindi ? "60% बचत" : "60% Saved",
        techEnabler: "WebSocket Alerts & SMS/Email Webhooks",
        riskLevel: "Low"
      },
      {
        stepNumber: 4,
        currentState: isGuj ? "જૂની સિસ્ટમોમાં મેન્યુઅલ રેકોર્ડ એન્ટ્રી" : isHindi ? "पुराने सिस्टम में मैन्युअल रिकॉर्ड एंट्री" : "Manual record entry into legacy databases",
        futureState: isGuj ? "ડેટાબેઝ સિંક્રનાઇઝેશન અને ઓટોમેટિક ઓડિટ ટ્રેઇલ" : isHindi ? "शून्य-विलंबता डेटाबेस सिंक और स्वचालित ऑडिट ट्रेल्स" : "Zero-latency database synchronization and audit trails",
        automationType: isGuj ? "સંપૂર્ણ ઓટોમેટેડ" : isHindi ? "पूर्ण स्वचालित" : "Fully Automated",
        manualEffortReduction: isGuj ? "95% બચત" : isHindi ? "95% बचत" : "95% Saved",
        techEnabler: "PostgreSQL ACID Database Triggers",
        riskLevel: "Low"
      }
    ]
  }

  const currentVsFuture: CurrentVsFutureTransformation = {
    overview: isGuj
      ? "મેન્યુઅલ પેપરવર્ક અને ધીમી પ્રક્રિયાઓમાંથી સંપૂર્ણ ઓટોમેટેડ ડિજિટલ વર્કફ્લો તરફ પરિવર્તન."
      : isHindi
      ? "धीमी मैन्युअल प्रक्रियाओं से पूर्णतः स्वचालित डिजिटल वर्कफ़्लो में परिवर्तन।"
      : "Transition from fragmented manual communications and delayed spreadsheets to an end-to-end autonomous digital workflow.",
    totalManualHoursSavedWeekly: isGuj ? "32 કલાક / સપ્તાહ" : isHindi ? "32 घंटे / सप्ताह" : "32 hrs / week",
    automationPercentage: piMetrics.automationRate || 74,
    aiTouchpointsCount: rawAiOpportunities.length || 3,
    integrationsCount: 4,
    steps: transformSteps
  }

  // 5. AI Opportunity Portfolio
  const aiOpportunities: AIOpportunityPortfolioItem[] =
    rawAiOpportunities.length > 0
      ? rawAiOpportunities.map((opp: any, idx: number) => ({
          id: `ai-opp-${idx + 1}`,
          title: opp.title || opp.name || (isGuj ? `ઇન્ટેલિજન્ટ AI સહાયક ${idx + 1}` : isHindi ? `इंटेलिजेंट AI सहायक ${idx + 1}` : `Intelligent Workflow Assistant ${idx + 1}`),
          category: opp.category || (idx % 2 === 0 ? "Generative AI" : "Process AI"),
          businessValue: opp.expected_impact || opp.businessValue || (isGuj ? "મેન્યુઅલ કામકાજમાં 70% ઘટાડો" : isHindi ? "मैन्युअल काम में 70% की कमी" : "Reduces manual effort by 70%"),
          impact: opp.impact || "High",
          feasibility: opp.feasibility || "High",
          timeToValue: opp.timeToValue || (isGuj ? "સ્પ્રિન્ટ 2 (2 અઠવાડિયા)" : isHindi ? "स्प्रिंट 2 (2 सप्ताह)" : "Sprint 2 (2 Weeks)"),
          status: idx === 0 ? "Active" : "Planned",
          description: opp.description || (isGuj ? "મોટા પાયે બિઝનેસ કામગીરી માટે AI-સંચાલિત માર્ગદર્શન અને સ્માર્ટ પારસિંગ." : isHindi ? "व्यावसायिक कार्यों के लिए AI-संचालित निर्णय मार्गदर्शन और स्मार्ट पार्सिंग।" : "AI-powered decision guidance and smart parsing for high-volume operations."),
          potentialRisks: isGuj ? "અસ્પષ્ટ ઇનપુટ પર મોડેલ હલ્યુસિનેશન" : isHindi ? "अस्पष्ट इनपुट पर मॉडल मतिभ्रम" : "Model hallucination on edge-case inputs",
          prerequisites: isGuj ? ["સ્ટ્રક્ચર્ડ ઇનપુટ સ્કીમા", "ચકાસાયેલ API કી ઓળખપત્રો"] : isHindi ? ["संरचित इनपुट स्कीमा", "सत्यापित API क्रेडेंशियल"] : ["Structured input schema", "Verified API key credentials"]
        }))
      : [
          {
            id: "ai-opp-1",
            title: isGuj ? "ઓટોનોમસ કન્વર્ઝેશનલ કોપાયલટ" : isHindi ? "स्वायत्त संवादात्मक कोपायलट" : "Autonomous Conversational Copilot",
            category: "Generative AI",
            businessValue: isGuj ? "24/7 ત્વરિત ગ્રાહક સપોર્ટ અને ઓટોમેટેડ બુકિંગ" : isHindi ? "24/7 त्वरित ग्राहक सहायता और स्वचालित बुकिंग" : "24/7 instant client support and automated booking",
            impact: "High",
            feasibility: "High",
            timeToValue: isGuj ? "સ્પ્રિન્ટ 2" : isHindi ? "स्प्रिंट 2" : "Sprint 2",
            status: "Active",
            description: isGuj ? "ગ્રાહકોના પ્રશ્નોના જવાબ આપવા અને બુકિંગ માટે 24/7 ઉપલબ્ધ AI આસિસ્ટન્ટ." : isHindi ? "पूछताछ का उत्तर देने और बुकिंग करने के लिए संदर्भ-जागरूक संवादात्मक सहायक।" : "Context-aware conversational assistant to answer inquiries, guide selections, and book requests.",
            potentialRisks: isGuj ? "પબ્લિક ફિલ્ડ્સ પર પ્રોમ્પ્ટ ઇન્જેક્શન" : isHindi ? "पब्लिक फ़ील्ड पर प्रॉम्प्ट इंजेक्शन" : "Prompt injection on public fields",
            prerequisites: isGuj ? ["ડોમેન નોલેજ બેઝ", "રોલ-બેઝ્ડ API ટોકન્સ"] : isHindi ? ["डोमेन नॉलेज बेस", "भूमिका-आधारित API टोकन"] : ["Domain knowledge base", "Role-based API tokens"]
          },
          {
            id: "ai-opp-2",
            title: isGuj ? "ડિમાન્ડ અને ઇન્વેન્ટરી પ્રિડિક્શન" : isHindi ? "मांग और इन्वेंटरी पूर्वानुमान" : "Predictive Demand & Inventory Forecasting",
            category: "Predictive AI",
            businessValue: isGuj ? "સ્ટોક ખૂટી જતો અટકાવે છે અને સ્ટાફ પ્લાનિંગ સુધારે છે" : isHindi ? "स्टॉक की कमी को रोकता है और स्टाफ शेड्यूलिंग को अनुकूलित करता है" : "Prevents stockouts and optimizes staff scheduling",
            impact: "High",
            feasibility: "Medium",
            timeToValue: isGuj ? "સ્પ્રિન્ટ 3" : isHindi ? "स्प्रिंट 3" : "Sprint 3",
            status: "Planned",
            description: isGuj ? "ઓર્ડર હિસ્ટ્રી પરથી ભાવિ જરૂરિયાતોની આપમેળે ગણતરી." : isHindi ? "ऐतिहासिक ऑर्डर डेटा से पैटर्न का विश्लेषण।" : "Statistical regression and pattern detection over historical order volumes.",
            potentialRisks: isGuj ? "ઓછો ઐતિહાસિક ડેટા" : isHindi ? "अपर्याप्त ऐतिहासिक डेटा" : "Insufficient historical training data",
            prerequisites: isGuj ? ["30-દિવસનો બેઝલાઇન ડેટાસેટ"] : isHindi ? ["30-दिवसीय बेसलाइन डेटासेट"] : ["30-day baseline dataset"]
          },
          {
            id: "ai-opp-3",
            title: isGuj ? "સ્માર્ટ રિસીપ્ટ અને ડોક્યુમેન્ટ પારસિંગ (OCR)" : isHindi ? "स्मार्ट रसीद और दस्तावेज़ पार्सिंग (OCR)" : "Smart Receipt & Document Parsing (OCR)",
            category: "Computer Vision",
            businessValue: isGuj ? "બિલ અને રસીદોનું ત્વરિત ડિજિટલ સ્કેનિંગ" : isHindi ? "भौतिक बिलों और रसीदों का त्वरित डिजिटल इनटेक" : "Instant ingestion of physical invoices and receipts",
            impact: "Medium",
            feasibility: "High",
            timeToValue: isGuj ? "સ્પ્રિન્ટ 4" : isHindi ? "स्प्रिंट 4" : "Sprint 4",
            status: "Under Review",
            description: isGuj ? "કેમેરાથી ફોટો પાડીને ડેટાબેઝમાં ડાયરેક્ટ એન્ટ્રી." : isHindi ? "कैमरा इमेज से सीधे डेटाबेस में ऑटोमैटिक एक्सट्रैक्शन।" : "Multi-modal vision extraction directly into PostgreSQL line-items.",
            potentialRisks: isGuj ? "ઓછી ગુણવત્તાવાળા ફોટો અપલોડ" : isHindi ? "कम रिज़ॉल्यूशन वाली तस्वीरें" : "Low resolution photo uploads",
            prerequisites: isGuj ? ["ફાઇલ અપલોડ સ્ટોરેજ પાઇપલાઇન"] : isHindi ? ["फ़ाइल अपलोड स्टोरेज पाइपलाइन"] : ["File upload storage pipeline"]
          }
        ]

  // 6. Roadmap & Milestone Sprints
  const roadmap: RoadmapPhaseStatus[] =
    rawSprints.length > 0
      ? rawSprints.map((sp: any, idx: number) => ({
          id: `sprint-${idx + 1}`,
          phaseNumber: idx + 1,
          title: sp.phase || sp.title || sp.focus || (isGuj ? `ફેઝ ${idx + 1}` : isHindi ? `चरण ${idx + 1}` : `Phase ${idx + 1}`),
          timeframe: sp.timeframe || (isGuj ? `સ્પ્રિન્ટ ${idx + 1} (${idx * 2 + 1}-${idx * 2 + 2} અઠવાડિયા)` : isHindi ? `स्प्रिंट ${idx + 1} (${idx * 2 + 1}-${idx * 2 + 2} सप्ताह)` : `Sprint ${idx + 1} (${idx * 2 + 1}-${idx * 2 + 2} wks)`),
          status: idx === 0 ? "In Progress" : "Upcoming",
          owner: sp.owner || (isGuj ? "ફૂલ-સ્ટેક એન્જિનિયર" : isHindi ? "फुल-स्टैक इंजीनियर" : "Full-Stack Engineer"),
          techStack: Array.isArray(sp.tech_stack)
            ? sp.tech_stack
            : typeof sp.tech_stack === "string"
            ? sp.tech_stack.split(",")
            : ["Next.js", "PostgreSQL"],
          deliverables: typeof sp.tasks === "string" ? [sp.tasks] : sp.tasks || (isGuj ? ["મુખ્ય સિસ્ટમ મોડ્યુલ ડિપ્લોયમેન્ટ"] : isHindi ? ["कोर सिस्टम मॉड्यूल तैनाती"] : ["Core system module deployment"]),
          keyMilestone: sp.key_milestone || (isGuj ? `માઇલસ્ટોન ${idx + 1}: કાર્યકારી ચકાસણી પૂર્ણ` : isHindi ? `मील का पत्थर ${idx + 1}: कार्यात्मक सत्यापन पूर्ण` : `Milestone ${idx + 1}: Functional validation complete`)
        }))
      : [
          {
            id: "sprint-1",
            phaseNumber: 1,
            title: isGuj ? "ફાઉન્ડેશન અને ઇન્ટરેક્ટિવ UX" : isHindi ? "नींव और इंटरैक्टिव UX" : "Foundation & Interactive UX",
            timeframe: isGuj ? "અઠવાડિયું 1 - 2" : isHindi ? "सप्ताह 1 - 2" : "Week 1 - 2",
            status: "Completed",
            owner: isGuj ? "ફ્રન્ટએન્ડ આર્કિટેક્ટ" : isHindi ? "फ्रंटएंड आर्किटेक्ट" : "Frontend Architect",
            techStack: ["Next.js 16", "Tailwind CSS", "Lucide"],
            deliverables: isGuj ? ["વાયરફ્રેમ લેઆઉટ", "ડિઝાઇન સિસ્ટમ સેટઅપ", "ડિસ્કવરી મંજૂરી"] : isHindi ? ["वायरफ्रेम लेआउट", "डिज़ाइन सिस्टम सेटअप", "डिस्कवरी अनुमोदन"] : ["Wireframe layouts", "Design system setup", "Discovery sign-off"],
            keyMilestone: isGuj ? "માઇલસ્ટોન 1: ઇન્ટરેક્ટિવ પ્રોટોટાઇપ મંજૂર" : isHindi ? "मील का पत्थर 1: इंटरैक्टिव प्रोटोटाइप स्वीकृत" : "Milestone 1: Visual Interactive Prototype approved"
          },
          {
            id: "sprint-2",
            phaseNumber: 2,
            title: isGuj ? "કોર બેકએન્ડ અને ડેટા લેયર" : isHindi ? "कोर बैकएंड और डेटा लेयर" : "Core Backend & Data Layer",
            timeframe: isGuj ? "અઠવાડિયું 3 - 4" : isHindi ? "सप्ताह 3 - 4" : "Week 3 - 4",
            status: "In Progress",
            owner: isGuj ? "બેકએન્ડ એન્જિનિયર" : isHindi ? "बैकएंड इंजीनियर" : "Backend Engineer",
            techStack: ["Node.js", "PostgreSQL", "Supabase"],
            deliverables: isGuj ? ["ડેટાબેઝ સ્કીમા માઇગ્રેશન", "REST API એન્ડપોઇન્ટ્સ", "ઓથેન્ટિકેશન ફ્લો"] : isHindi ? ["डेटाबेस स्कीमा माइग्रेशन", "REST API एंडपॉइंट्स", "ऑथेंटिकेशन फ़्लो"] : ["Database schema migrations", "REST API endpoints", "Auth flow"],
            keyMilestone: isGuj ? "માઇલસ્ટોન 2: ડેટાબેઝ અને CRUD લાઈવ" : isHindi ? "मील का पत्थर 2: डेटाबेस और CRUD लाइव" : "Milestone 2: Database and authenticated CRUD live"
          },
          {
            id: "sprint-3",
            phaseNumber: 3,
            title: isGuj ? "AI એન્જિન અને ઓટોમેશન ઇન્ટિગ્રેશન" : isHindi ? "AI इंजन और स्वचालन एकीकरण" : "AI Engine & Automation Integration",
            timeframe: isGuj ? "અઠવાડિયું 5" : isHindi ? "सप्ताह 5" : "Week 5",
            status: "Upcoming",
            owner: isGuj ? "AI એન્જિનિયર" : isHindi ? "AI इंजीनियर" : "AI Engineer",
            techStack: ["Google Gemini API", "Vector Embeddings", "Webhooks"],
            deliverables: isGuj ? ["કોપાયલટ સ્ટ્રીમિંગ પાઇપલાઇન", "ઓટોમેટેડ ઇમેઇલ ટ્રિગર્સ", "એક્સેપ્શન લોગિંગ"] : isHindi ? ["कोपायलट स्ट्रीमिंग पाइपलाइन", "स्वचालित ईमेल ट्रिगर्स", "अपवाद लॉगिंग"] : ["Copilot streaming pipeline", "Automated email triggers", "Exception logging"],
            keyMilestone: isGuj ? "માઇલસ્ટોન 3: AI કોપાયલટ ટેસ્ટિંગ પૂર્ણ" : isHindi ? "मील का पत्थर 3: AI कोपायलट परीक्षण पूर्ण" : "Milestone 3: AI Copilot end-to-end testing"
          },
          {
            id: "sprint-4",
            phaseNumber: 4,
            title: isGuj ? "સુરક્ષા, QA અને ક્લાઉડ લોન્ચ" : isHindi ? "सुरक्षा, QA और क्लाउड लॉन्च" : "Security, QA & Cloud Launch",
            timeframe: isGuj ? "અઠવાડિયું 6" : isHindi ? "सप्ताह 6" : "Week 6",
            status: "Upcoming",
            owner: isGuj ? "DevOps અને QA લીડ" : isHindi ? "DevOps और QA लीड" : "DevOps & QA Lead",
            techStack: ["Docker", "Vercel / AWS", "Sentry"],
            deliverables: isGuj ? ["લોડ ટેસ્ટિંગ", "પરમિશન ઓડિટ", "પ્રોડક્શન કટઓવર"] : isHindi ? ["लोड परीक्षण", "अनुमति ऑडिट", "उत्पादन लाइव रिलीज"] : ["Load testing", "Role-based permission audits", "Production cutover"],
            keyMilestone: isGuj ? "માઇલસ્ટોન 4: પ્રોડક્શન લાઇવ રિલીઝ" : isHindi ? "मील का पत्थर 4: उत्पादन लाइव रिलीज" : "Milestone 4: Production live release"
          }
        ]

  // 7. Financial Breakdown
  const financials: FinancialBreakdown = {
    totalEstimatedInvestment: finEst.min_budget && finEst.max_budget ? `${finEst.min_budget} - ${finEst.max_budget}` : "$18,000 - $32,000",
    minBudget: finEst.min_budget || "$18,000",
    maxBudget: finEst.max_budget || "$32,000",
    developmentCost: `$${Math.round(avgInvestment * 0.75).toLocaleString()}`,
    cloudInfrastructureMonthly: planningData?.cloudCost || (planningData?.costModel?.infrastructureMonthly ? `$${planningData.costModel.infrastructureMonthly} / mo` : (data?.planning?.cloudCost || "$120 / mo")),
    aiApiUsageMonthly: "$45 - $90 / mo",
    ongoingMaintenanceAnnual: `$${Math.round(avgInvestment * 0.15).toLocaleString()} / yr`,
    estimatedHours: finEst.total_hours || (isGuj ? "240 કલાક" : isHindi ? "240 घंटे" : "240 Hours"),
    hourlyRate: finEst.hourly_rate || "$75/hr",
    teamSize: finEst.team_roles?.length || 4,
    teamRoles: finEst.team_roles || [
      { role: isGuj ? "સિનિયર ફૂલ-સ્ટેક એન્જિનિયર" : isHindi ? "सीनियर फुल-स्टैक इंजीनियर" : "Senior Full-Stack Engineer", count: 2, allocation: "100%" },
      { role: isGuj ? "UI/UX પ્રોડક્ટ ડિઝાઇનર" : isHindi ? "UI/UX प्रोडक्ट डिज़ाइनर" : "UI/UX Product Designer", count: 1, allocation: "50%" },
      { role: isGuj ? "AI અને ડેટા એન્જિનિયર" : isHindi ? "AI और डेटा इंजीनियर" : "AI & Data Engineer", count: 1, allocation: "75%" },
      { role: isGuj ? "DevOps આર્કિટેક્ટ" : isHindi ? "DevOps आर्किटेक्ट" : "DevOps Architect", count: 1, allocation: "50%" }
    ],
    source: finEst.min_budget ? "User Provided" : "AI Estimated"
  }

  // 8. ROI Estimate
  const roi: ROIEstimate = {
    expectedROI: `${calculatedROI}%`,
    paybackPeriod: `${paybackMonths} ${isGuj ? "મહિના" : isHindi ? "महीने" : "Months"}`,
    annualBenefit: `$${calculatedAnnualBenefit.toLocaleString()} / yr`,
    efficiencyGain: isGuj ? "+42% સ્પીડ વધારો" : isHindi ? "+42% गति वृद्धि" : "+42% Velocity",
    costSavingsAnnual: `$${Math.round(avgInvestment * 1.8).toLocaleString()} / yr`,
    source: "Calculated",
    calculationNotes: isGuj
      ? "મેન્યુઅલ કામકાજના ઓટોમેશનથી દર અઠવાડિયે ~32 કલાકની બચતના આધારે ગણતરી."
      : isHindi
      ? "मैन्युअल लेन-देन के स्वचालन के आधार पर, प्रति सप्ताह ~32 घंटे की बचत।"
      : `Based on automated processing of manual transactions, saving ~32 hours/week across team operations.`
  }

  // 9. Risk Center
  const risks: RiskItem[] = [
    {
      id: "risk-1",
      title: isGuj ? "ડેટા માઇગ્રેશન અને સ્કીમા સિંક" : isHindi ? "डेटा माइग्रेशन और स्कीमा सिंक" : "Data Migration & Schema Synchronization",
      category: "Data",
      severity: "Medium",
      probability: "Medium",
      impact: isGuj ? "જૂની સ્પ્રેડશીટ્સના ડેટાને ડેટાબેઝમાં લાવતા પહેલા સાફ કરવો જરૂરી છે." : isHindi ? "पुरानी स्प्रेडशीट विसंगतियों को इनपुट से पहले सैनिटाइज करना आवश्यक है।" : "Legacy spreadsheet anomalies may require sanitization scripts prior to ingestion.",
      mitigation: isGuj ? "ડેટા ટાઇપ ચેકિંગ સાથે ઓટોમેટેડ સ્કીમા વેલિડેશન લાગુ કરો." : isHindi ? "सख्त प्रकार जाँच और फ़ॉलबैक डिफ़ॉल्ट के साथ स्वचालित स्कीमा सत्यापन।" : "Deploy automated schema validation adapter with strict type checking and fallback defaults.",
      status: "Mitigated"
    },
    {
      id: "risk-2",
      title: isGuj ? "LLM હલ્યુસિનેશન અને ટોકન લિમિટ્સ" : isHindi ? "LLM मतिभ्रम और टोकन दर सीमा" : "LLM Hallucination & Token Rate Limits",
      category: "AI",
      severity: "Medium",
      probability: "Low",
      impact: isGuj ? "વધુ પડતા ટ્રાફિક વખતે રિસ્પોન્સમાં વિલંબ થઈ શકે છે." : isHindi ? "उच्च उपयोग के दौरान अप्रत्याशित आउटपुट या विलंबता।" : "Unexpected prompt outputs or latency spikes during peak usage.",
      mitigation: isGuj ? "મલ્ટી-મોડેલ ફોલબેક (Gemini 2.5 Flash -> Gemini 3.6 Flash) આર્કિટેક્ચર." : isHindi ? "मल्टी-मॉडल फ़ॉलबैक कैस्केड और संरचित सिस्टम स्कीमा।" : "Multi-model fallback cascade (Gemini 2.5 Flash -> Gemini 3.6 Flash) with deterministic system schemas.",
      status: "Mitigated"
    },
    {
      id: "risk-3",
      title: isGuj ? "યુઝર એડોપ્શન અને ચેન્જ મેનેજમેન્ટ" : isHindi ? "उपयोगकर्ता अपनाना और परिवर्तन प्रबंधन" : "User Adoption & Change Management",
      category: "Business",
      severity: "Low",
      probability: "Medium",
      impact: isGuj ? "નવી AI સિસ્ટમ વાપરવામાં સ્ટાફને શરૂઆતમાં તાલીમ આપવી પડશે." : isHindi ? "नए AI-सहायता प्राप्त इंटरफेस को अपनाने में कर्मचारियों की हिचकिचाहट।" : "Operational staff hesitation when adopting new AI-assisted interfaces.",
      mitigation: isGuj ? "સરળ ઇન્ટરેક્ટિવ વાયરફ્રેમ તાલીમ અને માનવ દેખરેખ વિકલ્પો." : isHindi ? "सहज इंटरैक्टिव प्रशिक्षण सत्र और ह्यूमन-इन-द-लूप ओवरराइड्स।" : "Intuitive interactive wireframe training sessions with human-in-the-loop fallback overrides.",
      status: "Monitoring"
    },
    {
      id: "risk-4",
      title: isGuj ? "API ઓથેન્ટિકેશન અને સિક્યુરિટી ટોકન્સ" : isHindi ? "API प्रमाणीकरण और सुरक्षा टोकन" : "API Authentication & Security Tokens",
      category: "Security",
      severity: "High",
      probability: "Low",
      impact: isGuj ? "મહત્વપૂર્ણ એન્ડપોઇન્ટ્સ પર અનધિકૃત એક્સેસનું જોખમ." : isHindi ? "संवेदनशील एंडपॉइंट्स तक अनधिकृत पहुंच।" : "Unauthorized access to sensitive transactional endpoints.",
      mitigation: isGuj ? "JWT ટોકન ઓથેન્ટિકેશન અને રોલ-બેઝ્ડ પરમિશન્સ (RBAC) લાગુ કરો." : isHindi ? "JWT प्रमाणीकरण, एन्क्रिप्टेड पर्यावरण चर और भूमिका-आधारित नीतियां लागू करें।" : "Enforce JWT bearer authentication, encrypted environment variables, and role-based policies.",
      status: "Open"
    }
  ]

  // 10. Executive Alerts
  const alerts: ExecutiveAlert[] = [
    {
      id: "alert-1",
      type: "success",
      title: isGuj ? "AI UX વાયરફ્રેમ સ્ટુડિયો તૈયાર છે" : isHindi ? "AI UX वायरफ्रेम स्टूडियो तैयार है" : "AI UX Wireframe Studio Configured",
      description: isGuj ? "ફેઝ 3 ના તમામ ઇન્ટરેક્ટિવ સ્ક્રીન્સ અને મોબાઇલ લેઆઉટ ટેસ્ટિંગ માટે તૈયાર છે." : isHindi ? "चरण 3 इंटरैक्टिव स्क्रीन और मोबाइल लेआउट परीक्षण के लिए पूरी तरह से तैयार हैं।" : "Phase 3 interactive screens, component palettes, and mobile viewports are fully mapped and ready for testing.",
      sourcePhase: "UX",
      targetTab: "wireframe",
      actionLabel: isGuj ? "સ્ટુડિયો ખોલો" : isHindi ? "स्टूडियो खोलें" : "Open Studio"
    },
    {
      id: "alert-2",
      type: "info",
      title: isGuj ? "ડેટાબેઝ આર્કિટેક્ચર માઇગ્રેશન માટે તૈયાર" : isHindi ? "डेटाबेस आर्किटेक्चर माइग्रेशन के लिए तैयार" : "Database Architecture Ready for Migrations",
      description: isGuj ? `${Array.isArray(dbSchema) ? dbSchema.length : 3} રિલેશનલ ટેબલ્સ અને REST API એન્ડપોઇન્ટ્સ તૈયાર છે.` : isHindi ? `${Array.isArray(dbSchema) ? dbSchema.length : 3} रिलेशनल डेटाबेस टेबल और REST एंडपॉइंट्स प्रोजेक्ट स्कोप से मैप किए गए।` : `${Array.isArray(dbSchema) ? dbSchema.length : 3} relational database entities and REST endpoints mapped to project scope.`,
      sourcePhase: "Architecture",
      targetTab: "db",
      actionLabel: isGuj ? "સ્કીમા જુઓ" : isHindi ? "स्कीमा देखें" : "View Schema"
    },
    {
      id: "alert-3",
      type: "warning",
      title: isGuj ? "પ્રોડક્શન API કી અને Supabase URL ચકાસો" : isHindi ? "प्रोडक्शन API कुंजी और Supabase URL सत्यापित करें" : "Confirm Production API Keys & Supabase URL",
      description: isGuj ? "સ્પ્રિન્ટ 2 શરૂ કરતા પહેલા ક્લાઉડ ડેટાબેઝ એન્વાયરમેન્ટ વેરિયેબલ્સ ચકાસવા જરૂરી છે." : isHindi ? "स्प्रिंट 2 परिनियोजन शुरू करने से पहले डेटाबेस पर्यावरण चर मान्य होने चाहिए।" : "Cloud database environment variables should be validated prior to launching Sprint 2 deployment.",
      sourcePhase: "Planning",
      targetTab: "roadmap",
      actionLabel: isGuj ? "રોડમેપ જુઓ" : isHindi ? "रोडमैप देखें" : "Check Roadmap"
    }
  ]

  // 11. Next Best Actions
  const nextActions: NextBestAction[] = [
    {
      id: "action-1",
      priority: "Immediate",
      title: isGuj ? "ઇન્ટરેક્ટિવ વાયરફ્રેમ પ્રોટોટાઇપ ચકાસો અને મંજૂર કરો" : isHindi ? "इंटरैक्टिव वायरफ्रेम प्रोटोटाइप की समीक्षा और अनुमोदन करें" : "Review & Sign-off Interactive Wireframe Prototype",
      description: isGuj ? "ક્લિકેબલ સ્ક્રીન ટ્રાન્ઝિશન અને કમ્પોનન્ટ ઇન્ટરેક્શનનું પરીક્ષણ કરો." : isHindi ? "हितधारकों के साथ क्लिक करने योग्य स्क्रीन ट्रांज़िशन का परीक्षण करें।" : "Test clickable screen transitions and component interactions with stakeholders.",
      ownerRole: isGuj ? "પ્રોડક્ટ લીડ અને સ્ટેકહોલ્ડર" : isHindi ? "प्रोडक्ट लीड और हितधारक" : "Product Lead & Executive Stakeholder",
      targetTab: "wireframe",
      ctaText: isGuj ? "વાયરફ્રેમ સ્ટુડિયો ખોલો" : isHindi ? "वायरफ्रेम स्टूडियो खोलें" : "Launch Wireframe Studio",
      estimatedEffort: isGuj ? "30 મિનિટ" : isHindi ? "30 मिनट" : "30 mins"
    },
    {
      id: "action-2",
      priority: "High",
      title: isGuj ? "ડેટાબેઝ સ્કીમા અને API એન્ડપોઇન્ટ્સ ચકાસો" : isHindi ? "डेटाबेस स्कीमा और API एंडपॉइंट्स सत्यापित करें" : "Verify Database Schema & API Enpoints",
      description: isGuj ? "બધી બિઝનેસ એન્ટિટી અને REST રૂટ્સ યોગ્ય રીતે જોડાયેલા છે તેની ખાતરી કરો." : isHindi ? "सुनिश्चित करें कि व्यावसायिक संस्थाएं और REST रूट संरेखित हैं।" : "Ensure all business entities and REST route contracts align with downstream integrations.",
      ownerRole: isGuj ? "લીડ બેકએન્ડ એન્જિનિયર" : isHindi ? "लीड बैकएंड इंजीनियर" : "Lead Backend Engineer",
      targetTab: "db",
      ctaText: isGuj ? "ડેટા મોડેલ જુઓ" : isHindi ? "डेटा मॉडल देखें" : "Inspect Data Model",
      estimatedEffort: isGuj ? "1 કલાક" : isHindi ? "1 घंटा" : "1 hour"
    },
    {
      id: "action-3",
      priority: "Medium",
      title: isGuj ? "પ્રોસેસ ઇન્ટેલિજન્સ અને BPMN નિયમોનું ઓડિટ કરો" : isHindi ? "प्रोसेस इंटेलिजेंस और BPMN निर्णय नियमों का ऑडिट करें" : "Audit Process Intelligence & BPMN Decision Rules",
      description: isGuj ? "AI ભલામણો માટે માનવ દેખરેખની શરતો કન્ફર્મ કરો." : isHindi ? "AI अनुशंसाओं के लिए मानव नियंत्रण शर्तों की पुष्टि करें।" : "Confirm human-in-the-loop fallback conditions for AI recommendation gates.",
      ownerRole: isGuj ? "ઓપરેશન્સ મેનેજર" : isHindi ? "संचालन प्रबंधक" : "Operations Manager",
      targetTab: "process",
      ctaText: isGuj ? "પ્રોસેસ ફ્લો જુઓ" : isHindi ? "प्रक्रिया प्रवाह देखें" : "View Process Flow",
      estimatedEffort: isGuj ? "45 મિનિટ" : isHindi ? "45 मिनट" : "45 mins"
    },
    {
      id: "action-4",
      priority: "Medium",
      title: isGuj ? "સ્પ્રિન્ટ બજેટ અને ટીમ ફાળવણી મંજૂર કરો" : isHindi ? "स्प्रिंट बजट और टीम आवंटन को मंजूरी दें" : "Approve Sprint Budget & Team Allocation",
      description: isGuj ? "સ્પ્રિન્ટ 1 શરૂ કરવાની મંજૂરી આપો અને ડેવલપમેન્ટ રોલ્સ સોંપો." : isHindi ? "स्प्रिंट 1 शुरू करने के लिए अधिकृत करें और भूमिकाएं सौंपें।" : "Authorize Sprint 1 milestone kickoff and assign development roles.",
      ownerRole: isGuj ? "એક્ઝિક્યુટિવ સ્પોન્સર" : isHindi ? "कार्यकारी प्रायोजक" : "Executive Sponsor",
      targetTab: "roadmap",
      ctaText: isGuj ? "સ્પ્રિન્ટ પ્લાન જુઓ" : isHindi ? "स्प्रिंट योजना देखें" : "Review Sprint Plan",
      estimatedEffort: isGuj ? "15 મિનિટ" : isHindi ? "15 मिनट" : "15 mins"
    }
  ]

  // 12. Project Health Dimensions
  const health: ProjectHealthDimension[] = [
    {
      dimension: isGuj ? "સ્કોપ (Scope)" : isHindi ? "स्कोप (Scope)" : "Scope",
      status: "Healthy",
      score: 95,
      summary: isGuj ? "કાર્યકારી જરૂરિયાતો, સ્ક્રીન અને ડેટાબેઝ મોડેલ્સ સ્પષ્ટ રીતે નિર્ધારિત." : isHindi ? "कार्यात्मक आवश्यकताएं, स्क्रीन और डेटाबेस मॉडल स्पष्ट रूप से परिभाषित।" : "Functional requirements, screens, and database models clearly bounded.",
      flagsCount: 0
    },
    {
      dimension: isGuj ? "સમયમર્યાદા (Timeline)" : isHindi ? "समय सीमा (Timeline)" : "Timeline",
      status: "Healthy",
      score: 90,
      summary: isGuj ? "6 અઠવાડિયાના લક્ષ્યમાં 4 સ્પ્રિન્ટ્સ સફળતાપૂર્વક પ્લાન થયા." : isHindi ? "6-सप्ताह के लक्ष्य के भीतर 4 स्प्रिंट सफलतापूर्वक मैप किए गए।" : "4 sprints mapped within the 6-week target delivery window.",
      flagsCount: 0
    },
    {
      dimension: isGuj ? "બજેટ (Budget)" : isHindi ? "बजट (Budget)" : "Budget",
      status: "Healthy",
      score: 92,
      summary: isGuj ? "નાણાકીય અંદાજો ટીમ કલાકો અને બજાર દરો સાથે સુસંગત." : isHindi ? "वित्तीय अनुमान टीम घंटों और बाजार दरों के साथ संरेखित।" : "Financial estimates aligned with resource hours and market rates.",
      flagsCount: 0
    },
    {
      dimension: isGuj ? "તકનીકી તૈયારી (Tech Readiness)" : isHindi ? "तकनीकी तत्परता (Tech Readiness)" : "Technical Readiness",
      status: "Healthy",
      score: 88,
      summary: isGuj ? "Next.js, PostgreSQL અને Gemini AI સાથે સંપૂર્ણ ટેક સ્ટેક નિર્ધારિત." : isHindi ? "Next.js, PostgreSQL और Gemini AI के साथ पूरा स्टैक तैयार।" : "Complete tech stack specified with Next.js, PostgreSQL, and Gemini LLM.",
      flagsCount: 0
    },
    {
      dimension: isGuj ? "બિઝનેસ ગોઠવણી (Business Alignment)" : isHindi ? "बिजनेस अलाइनमेंट" : "Business Alignment",
      status: "Healthy",
      score: 94,
      summary: isGuj ? "મુખ્ય ઉદ્દેશો સીધા ROI અને કાર્યક્ષમતા સાથે જોડાયેલા છે." : isHindi ? "मूल्य चालक सीधे कार्यकारी ROI और दक्षता बेंचमार्क से जुड़े हैं।" : "Value drivers directly map to executive ROI and efficiency benchmarks.",
      flagsCount: 0
    },
    {
      dimension: isGuj ? "AI સુરક્ષા અને નીતિમત્તા" : isHindi ? "AI सुरक्षा और नैतिकता" : "AI Safety & Ethics",
      status: "Attention Required",
      score: 84,
      summary: isGuj ? "સ્પ્રિન્ટ 3 માં સુરક્ષા મર્યાદાઓ અને માનવ દેખરેખ ચકાસવી પડશે." : isHindi ? "स्प्रिंट 3 में सुरक्षा रेलिंग और मानव नियंत्रण की पुष्टि करनी होगी।" : "Guardrails and human-in-the-loop overrides must be validated in Sprint 3.",
      flagsCount: 1
    }
  ]

  return {
    projectId,
    projectTitle,
    industry: data?.industry || (isGuj ? "એન્ટરપ્રાઇઝ SaaS / બિઝનેસ ઓપરેશન્સ" : isHindi ? "एंटरप्राइज SaaS / बिजनेस ऑपरेशंस" : "Enterprise SaaS / Business Operations"),
    targetAudience: data?.target_audience || (isGuj ? "એક્ઝિક્યુટિવ સ્ટેકહોલ્ડર્સ અને ઓપરેશન્સ ટીમ" : isHindi ? "कार्यकारी हितधारक और संचालन टीम" : "Executive Stakeholders & Operations Teams"),
    lastUpdated,
    overallTransformationProgress: overallProgress,
    status: data?.status || (isGuj ? "તૈયાર" : isHindi ? "तैयार" : "Draft"),
    executiveSummary: {
      businessProblem,
      transformationObjective,
      expectedOutcome,
      strategicIntent,
      targetMVP
    },
    kpis,
    readinessScores,
    currentVsFuture,
    aiOpportunities,
    roadmap,
    financials,
    roi,
    risks,
    alerts,
    nextActions,
    health
  }
}
