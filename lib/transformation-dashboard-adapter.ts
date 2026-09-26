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
 * high-fidelity calculations with transparent attribution and full multi-language localization
 * across English, Gujarati, Hindi, Spanish, French, and German.
 */
export function getTransformationDashboardData(
  data?: any,
  targetLanguage: string = "English"
): TransformationDashboardData {
  const rawLang = targetLanguage || data?.target_language || "English"
  const lang = rawLang.toLowerCase()
  const isGuj = lang.includes("gu")
  const isHindi = lang.includes("hi")
  const isSpanish = lang.includes("es") || lang.includes("span")
  const isFr = lang.includes("fr") || lang.includes("fren")
  const isDe = lang.includes("de") || lang.includes("germ")

  // Multi-language translation helper
  const t = (gu: string, hi: string, es: string, fr: string, de: string, en: string): string => {
    if (isGuj) return gu
    if (isHindi) return hi
    if (isSpanish) return es
    if (isFr) return fr
    if (isDe) return de
    return en
  }

  const projectId = data?.id || "proj-exec-001"
  const projectTitle =
    data?.project_title ||
    t(
      "એન્ટરપ્રાઇઝ ટ્રાન્સફોર્મેશન બ્લુપ્રિન્ટ",
      "एंटरप्राइज ट्रांसफॉर्मेशन ब्लूप्रिंट",
      "Plano de Transformación Empresarial",
      "Plan de Transformation d'Entreprise",
      "Blueprint für Unternehmenstransformation",
      "Enterprise Transformation Solution"
    )

  const userProblem = cleanUserFacingPrompt(
    data?.user_problem ||
      t(
        "AI અને ક્લાઉડ ઓટોમેશન દ્વારા મુખ્ય બિઝનેસ પ્રક્રિયાઓને ઝડપી અને આધુનિક બનાવો.",
        "AI और क्लाउड ऑटोमेशन के माध्यम से मुख्य व्यावसायिक प्रक्रियाओं को आधुनिक बनाएं।",
        "Modernizar y automatizar operaciones clave mediante IA y la nube.",
        "Moderniser et automatiser les opérations clés grâce à l'IA et au cloud.",
        "Kernprozesse durch KI und Cloud-Automatisierung modernisieren.",
        "Modernize and automate core operations through AI assistance."
      )
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
    t(
      "મેન્યુઅલ કામકાજ, પેપરવર્ક અને વિખરાયેલી જૂની સિસ્ટમો દૂર કરવી.",
      "मैन्युअल परिचालन और बिखरे हुए पुराने सिस्टम को समाप्त करना।",
      "Eliminar el trabajo manual, papeleo y sistemas heredados fragmentados.",
      "Éliminer le travail manuel, les formulaires papier et les systèmes fragmentés.",
      "Manuelle Arbeitsabläufe, Papierkram und fragmentierte Altsysteme beseitigen.",
      "Eliminate manual operational overhead and fragmented systems."
    )

  const transformationObjective =
    execSummary?.transformation_scope ||
    t(
      "ઓટોમેટેડ વર્કફ્લો અને AI કોપાયલટ સાથે એકીકૃત ડિજિટલ પ્લેટફોર્મ તૈનાત કરવું.",
      "स्वचालित वर्कफ़्लो और AI कोपायलट के साथ एकीकृत डिजिटल प्लेटफ़ॉर्म तैयार करना।",
      "Desplegar una plataforma digital integrada con flujos automatizados y copiloto de IA.",
      "Déployer une plateforme numérique intégrée avec des flux automatisés et un copilote IA.",
      "Eine integrierte digitale Plattform mit automatisierten Workflows und KI-Copilot bereitstellen.",
      "Deploy an integrated digital platform featuring automated workflows and intelligent copilot assistance."
    )

  const expectedOutcome =
    execSummary?.key_value_drivers?.[0] ||
    t(
      "કામગીરીના સમયમાં 70% ઘટાડો, 24/7 ત્વરિત કસ્ટમર સેલ્ફ-સર્વિસ અને 99.5% ડેટા ચોકસાઈ.",
      "प्रसंस्करण समय में 70% की कमी, 24/7 त्वरित ग्राहक स्व-सेवा और 99.5% डेटा सटीकता।",
      "Reducción del 70% en tiempos de proceso, autoservicio 24/7 y 99.5% de precisión.",
      "Réduction de 70% des délais de traitement, libre-service 24/7 et précision de 99.5%.",
      "70% Reduzierung der Durchlaufzeiten, 24/7 Self-Service und 99,5% Datengenauigkeit.",
      "70% reduction in processing cycle times, instant customer self-service, and 99.5% operational data consistency."
    )

  const strategicIntent =
    execSummary?.strategic_intent ||
    t(
      "ડિજિટલ ઓટોમેશન અને AI સંચાલનમાં અગ્રણી નેતૃત્વ સ્થાપિત કરવું.",
      "डिजिटल स्वचालन और AI निष्पादन में अग्रणी नेतृत्व स्थापित करना।",
      "Establecer liderazgo digital mediante automatización inteligente.",
      "Établir un leadership numérique grâce à l'automatisation intelligente.",
      "Digitale Marktführerschaft durch intelligente Automatisierung etablieren.",
      "Establish digital enterprise leadership in agility and automated execution."
    )

  const targetMVP =
    data?.timeline ||
    (planningData?.milestones
      ? `${planningData.milestones.length * 2} ${t("અઠવાડિયા", "सप्ताह", "Semanas", "Semaines", "Wochen", "Weeks")}`
      : t("6 અઠવાડિયા", "6 सप्ताह", "6 Semanas", "6 Semaines", "6 Wochen", "6 Weeks"))

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
      label: t("અપેક્ષિત ROI", "अनुमानित ROI", "ROI Esperado", "ROI Attendu", "Erwarteter ROI", "Expected ROI"),
      value: `${calculatedROI}%`,
      trend: t("+3.4x ગણો લાભ", "+3.4x गुना लाभ", "+3.4x Multiplicador", "+3.4x Multiplicateur", "+3.4x Multiplikator", "+3.4x Multiplier"),
      trendDirection: "up",
      source: "Calculated",
      category: "financial",
      benchmark: t("ઇન્ડસ્ટ્રી સરેરાશ: 180%", "उद्योग औसत: 180%", "Promedio Industria: 180%", "Moyenne Industrie : 180%", "Branchendurchschnitt: 180%", "Industry Avg: 180%"),
      details: t(
        `$${avgInvestment.toLocaleString()} મૂડી રોકાણ સામે વાર્ષિક $${calculatedAnnualBenefit.toLocaleString()} નો ચોખ્ખો નફો અપેક્ષિત છે.`,
        `$${avgInvestment.toLocaleString()} निवेश के मुकाबले वार्षिक $${calculatedAnnualBenefit.toLocaleString()} शुद्ध लाभ अनुमानित है।`,
        `Beneficio neto anual estimado de $${calculatedAnnualBenefit.toLocaleString()} sobre $${avgInvestment.toLocaleString()} de inversión.`,
        `Bénéfice net annuel estimé de $${calculatedAnnualBenefit.toLocaleString()} pour un investissement de $${avgInvestment.toLocaleString()}.`,
        `Geschätzter jährlicher Nettonutzen von $${calculatedAnnualBenefit.toLocaleString()} bei $${avgInvestment.toLocaleString()} Investition.`,
        `Projected annualized net benefit of $${calculatedAnnualBenefit.toLocaleString()} against $${avgInvestment.toLocaleString()} capital expenditure.`
      )
    },
    {
      id: "kpi-payback",
      label: t("પેબેક સમયગાળો", "पेबैक अवधि", "Período de Recuperación", "Délai de Récupération", "Amortisationszeit", "Payback Period"),
      value: `${paybackMonths} ${t("મહિના", "महीने", "Meses", "Mois", "Monate", "Mo")}`,
      trend: t("ઝડપી બ્રેક-ઇવન", "त्वरित ब्रेक-इवन", "Rápido Retorno", "Retour Rapide", "Schneller Break-Even", "Fast Break-Even"),
      trendDirection: "up",
      source: "Calculated",
      category: "financial",
      benchmark: t("ટાર્ગેટ: < 12 મહિના", "लक्ष्य: < 12 महीने", "Objetivo: < 12 Meses", "Objectif : < 12 Mois", "Ziel: < 12 Monate", "Target: < 12 Months"),
      details: t(
        `પ્રોજેક્ટ લોન્ચ થયાના ${paybackMonths} મહિનાની અંદર પૂરેપૂરી રકમ પરત વસૂલ થશે.`,
        `परियोजना शुरू होने के ${paybackMonths} महीनों के भीतर पूर्ण निवेश की वसूली होगी।`,
        `Recuperación total del capital dentro de ${paybackMonths} meses posteriores al lanzamiento.`,
        `Récupération intégrale du capital dans les ${paybackMonths} mois suivant le déploiement.`,
        `Vollständige Kapitalrückzahlung innerhalb von ${paybackMonths} Monaten nach Inbetriebnahme.`,
        `Full capital recovery estimated within ${paybackMonths} months of production deployment.`
      )
    },
    {
      id: "kpi-investment",
      label: t("અંદાજિત રોકાણ", "अनुमानित निवेश", "Inversión Estimada", "Investissement Estimé", "Geschätzte Investition", "Estimated Investment"),
      value: finEst.min_budget && finEst.max_budget ? `${finEst.min_budget} - ${finEst.max_budget}` : "$25,000",
      trend: finEst.total_hours
        ? `${finEst.total_hours} ${t("કલાક ડેવલપમેન્ટ", "घंटे विकास", "Horas Dev", "Heures Dév", "Std. Entw.", "Est. Dev")}`
        : t("240 કલાક", "240 घंटे", "240 Horas", "240 Heures", "240 Stunden", "240 Hours"),
      trendDirection: "neutral",
      source: finEst.min_budget ? "User Provided" : "AI Estimated",
      category: "financial",
      benchmark: t("ફિક્સ્ડ સ્કોપ કેપ", "फिक्स्ड स्कोप कैप", "Límite de Alcance Fijo", "Plafond de Portée Fixe", "Feste Budgetobergrenze", "Fixed Scope Cap"),
      details: t(
        "UI/UX ડિઝાઇન, ફૂલ-સ્ટેક ડેવલપમેન્ટ, AI ઇન્ટિગ્રેશન અને ક્લાઉડ સેટઅપનો સંપૂર્ણ અંદાજ.",
        "UI/UX डिज़ाइन, फुल-स्टैक डेवलपमेंट, AI एकीकरण और क्लाउड सेटअप का समग्र अनुमान।",
        "Estimación integral que abarca diseño UI/UX, desarrollo full-stack, IA y nube.",
        "Estimation globale comprenant l'UI/UX, le développement full-stack, l'IA et le cloud.",
        "Umfassende Schätzung für UI/UX-Design, Full-Stack-Entwicklung, KI und Cloud-Infrastruktur.",
        "Comprehensive estimate encompassing UX, Full-Stack engineering, AI integration, and cloud infra."
      )
    },
    {
      id: "kpi-maturity",
      label: t("ડિજિટલ પરિપક્વતા", "डिजिटल मैच्योरिटी", "Madurez Digital", "Maturité Numérique", "Digitale Reife", "Digital Maturity"),
      value: `${digitalMaturityVal}%`,
      trend: t("+28% લોન્ચ પછી", "+28% लॉन्च के बाद", "+28% Post-Lanzamiento", "+28% Post-Lancement", "+28% Nach Launch", "+28% Post-Launch"),
      trendDirection: "up",
      source: "Derived",
      category: "maturity",
      benchmark: t("એન્ટરપ્રાઇઝ બેઝલાઇન", "एंटरप्राइज बेसलाइन", "Línea Base Empresarial", "Référence Entreprise", "Unternehmens-Benchmark", "Enterprise Baseline"),
      details: t(
        "વર્કફ્લો ડિજિટલાઇઝેશન, સેન્ટ્રલ ડેટાબેઝ અને API ઓટોમેશનનું ચોક્કસ મૂલ્યાંકન.",
        "वर्कफ़्लो डिजिटलीकरण, डेटा केंद्रीकरण और API स्वचालन का सटीक मूल्यांकन।",
        "Índice cuantificado que mide digitalización de flujos, base de datos y APIs.",
        "Indice quantifié mesurant la numérisation des flux, les bases de données et les APIs.",
        "Quantifizierter Index zur Messung von Workflow-Digitalisierung, Datenzentralisierung und APIs.",
        "Quantified index measuring workflow digitalization, data centralization, and API automation."
      )
    },
    {
      id: "kpi-ai-readiness",
      label: t("AI રેડીનેસ ઇન્ડેક્સ", "AI रेडीनेस इंडेक्स", "Índice Preparación IA", "Indice Préparation IA", "KI-Bereitschaftsindex", "AI Readiness Index"),
      value: `${aiReadinessVal}%`,
      trend: t("ઉચ્ચ શક્યતા", "उच्च व्यवहार्यता", "Alta Viabilidad", "Haute Faisabilité", "Hohe Machbarkeit", "High Feasibility"),
      trendDirection: "up",
      source: "Derived",
      category: "ai",
      benchmark: t("ટોપ સ્તર", "शीर्ष स्तर", "Nivel Superior", "Premier Quartile", "Spitzenniveau", "Top Quartile"),
      details: t(
        "LLM એજન્ટિક ટૂલ્સ, સ્કીમા મેપિંગ અને રિયલ-ટાઇમ રિસ્પોન્સ સાથે સંપૂર્ણ સુસંગત.",
        "LLM एजेंटिक टूल्स, स्कीमा मैपिंग और रीयल-टाइम प्रतिक्रिया के साथ अत्यधिक संगत।",
        "Alta compatibilidad con llamadas a herramientas LLM y mapeo de esquemas.",
        "Haute compatibilité avec les outils d'agents LLM et le mappage de schémas.",
        "Hohe Kompatibilität mit LLM-Agenten-Tools, Schemamapping und Echtzeit-Generierung.",
        "High compatibility with LLM agentic tool calls, structured schema mapping, and real-time generation."
      )
    },
    {
      id: "kpi-automation",
      label: t("ઓટોમેશન ક્ષમતા", "स्वचालन क्षमता", "Potencial de Automatización", "Potentiel d'Automatisation", "Automatisierungspotenzial", "Automation Potential"),
      value: `${piMetrics.automationRate || 74}%`,
      trend: t("ઝડપી ગતિ", "उच्च गति", "Alta Velocidad", "Haute Vélocité", "Hohe Geschwindigkeit", "High Velocity"),
      trendDirection: "up",
      source: piMetrics.automationRate ? "Calculated" : "Derived",
      category: "process",
      benchmark: t("ટાર્ગેટ: > 65%", "लक्ष्य: > 65%", "Objetivo: > 65%", "Objectif : > 65%", "Ziel: > 65%", "Target: > 65%"),
      details: t(
        "મેન્યુઅલ કામકાજ વગર આપમેળે પૂર્ણ થઈ શકતી પ્રક્રિયાઓની ટકાવારી.",
        "मैन्युअल प्रयास के बिना स्वचालित रूप से पूर्ण होने वाली प्रक्रियाओं का प्रतिशत।",
        "Porcentaje de transiciones de flujo de trabajo capaces de ejecutarse automáticamente.",
        "Pourcentage des transitions de flux capables d'une exécution sans intervention manuelle.",
        "Prozentsatz der betrieblichen Arbeitsabläufe, die völlig automatisiert ablaufen können.",
        "Percentage of operational workflow transitions capable of zero-touch automated execution."
      )
    },
    {
      id: "kpi-velocity",
      label: t("પ્રથમ MVP સમય", "पहले MVP का समय", "Tiempo para Primer MVP", "Délai Premier MVP", "Zeit bis zum ersten MVP", "Time to First MVP"),
      value: targetMVP,
      trend: t("ઝડપી સ્પ્રિન્ટ", "त्वरित स्प्रिंट", "Sprint Acelerado", "Sprint Accéléré", "Beschleunigter Sprint", "Accelerated Sprint"),
      trendDirection: "up",
      source: "User Provided",
      category: "technical",
      benchmark: t("SLA: 6-8 અઠવાડિયા", "SLA: 6-8 सप्ताह", "SLA: 6-8 Semanas", "SLA : 6-8 Semaines", "SLA: 6-8 Wochen", "SLA: 6-8 Weeks"),
      details: t(
        "4 સ્પ્રિન્ટમાં ફેઝ મુજબ ડિલિવરી અને સ્ટેકહોલ્ડર સેન્ડબોક્સ વેરિફિકેશન.",
        "4 स्प्रिंट पुनरावृत्तियों में चरणबद्ध डिलीवरी और लाइव सैंडबॉक्स सत्यापन।",
        "Entrega por fases en 4 sprints con validación temprana de partes interesadas.",
        "Livraison échelonnée sur 4 sprints avec validation précoce par les parties prenantes.",
        "Phasenweise Bereitstellung über 4 Sprints mit frühzeitiger Validierung.",
        "Phased delivery across 4 sprint iterations with early stakeholder sandbox validation."
      )
    },
    {
      id: "kpi-risk",
      label: t("સંકલિત જોખમ સ્તર", "समग्र जोखिम स्तर", "Nivel de Riesgo Compuesto", "Niveau de Risque Global", "Gesamtrisikoniveau", "Composite Risk Level"),
      value: t("ઓછું-મધ્યમ", "कम-मध्यम", "Bajo-Medio", "Faible-Moyen", "Niedrig-Mittel", "Low-Medium"),
      trend: t("નિયંત્રિત", "नियंत्रित", "Mitigado", "Atténué", "Gemindert", "Mitigated"),
      trendDirection: "down",
      source: "Derived",
      category: "maturity",
      benchmark: t("સુરક્ષિત", "सुरक्षित", "Controlado", "Contrôlé", "Kontrolliert", "Controlled"),
      details: t(
        "તમામ તકનીકી અને ડેટા માઇગ્રેશન જોખમો માટે પૂર્વ-આયોજિત સુરક્ષા પ્લાન તૈયાર છે.",
        "दस्तावेजी सुरक्षा प्रोटोकॉल के साथ मानक तकनीकी और डेटा माइग्रेशन जोखिम।",
        "Riesgos técnicos y de migración estándar con protocolos de mitigación documentados.",
        "Risques techniques et de migration standards avec protocoles d'atténuation documentés.",
        "Standard-Architektur- und Migrationsrisiken mit dokumentierten Schutzmaßnahmen.",
        "Standard architectural and data migration risks with documented mitigation protocols."
      )
    }
  ]

  // 3. Transformation Score Dimensions (7 Dimensions)
  const readinessScores: TransformationScoreDimension[] = [
    {
      id: "dim-business",
      name: t("બિઝનેસ ગોઠવણી", "बिजनेस अलाइनमेंट", "Alineación de Negocio", "Alignement Métier", "Business-Alignment", "Business Alignment"),
      score: 92,
      weight: 0.2,
      status: "Optimized",
      rationale: t(
        "સ્પષ્ટ ઉદ્દેશો, નિર્ધારિત મૂલ્ય ડ્રાઇવરો અને સ્પષ્ટ KPI મોનિટરિંગ.",
        "स्पष्ट रणनीतिक उद्देश्य, निर्धारित मूल्य चालक और स्पष्ट KPI निगरानी।",
        "Objetivos estratégicos claros, impulsores de valor y atribución de KPI.",
        "Objectifs stratégiques clairs, leviers de valeur définis et suivi des KPI.",
        "Klare strategische Ziele, definierte Werttreiber und explizites KPI-Tracking.",
        "Clear executive intent, defined value drivers, and explicit KPI attribution."
      ),
      source: "Calculated"
    },
    {
      id: "dim-tech",
      name: t("ટેકનોલોજી રેડીનેસ", "तकनीकी तत्परता", "Preparación Tecnológica", "Maturité Technologique", "Technologie-Bereitschaft", "Technology Readiness"),
      score: 88,
      weight: 0.15,
      status: "Ready",
      rationale: t(
        "આધુનિક Next.js 16 સ્ટેક, PostgreSQL સ્કીમા અને REST API આર્કિટેક્ચર તૈયાર.",
        "आधुनिक Next.js 16 स्टैक, PostgreSQL स्कीमा और REST API आर्किटेक्चर तैयार।",
        "Pila moderna Next.js 16, esquema PostgreSQL y APIs REST tipadas.",
        "Stack Next.js 16 moderne, schéma PostgreSQL et architectures REST typées.",
        "Moderner Next.js 16 Stack, PostgreSQL-Schema und typisierte REST-APIs definiert.",
        "Modern Next.js 16 stack, PostgreSQL schema, and typed REST API architectures defined."
      ),
      source: "Calculated"
    },
    {
      id: "dim-data",
      name: t("ડેટા આર્કિટેક્ચર", "डेटा आर्किटेक्चर", "Arquitectura de Datos", "Architecture des Données", "Datenarchitektur", "Data Architecture"),
      score: Array.isArray(dbSchema) && dbSchema.length > 0 ? 86 : 72,
      weight: 0.15,
      status: Array.isArray(dbSchema) && dbSchema.length > 0 ? "Ready" : "Developing",
      rationale: t(
        "સંબંધિત ડેટાબેઝ મોડેલો અને ઇન્ડેક્સિંગ વ્યૂહરચના વ્યાખ્યાયિત.",
        "संबंधित डेटाबेस मॉडल और इंडेक्सिंग रणनीतियां परिभाषित।",
        "Modelos relacionales y estrategias de indexación mapeados a entidades de negocio.",
        "Modèles relationnels et stratégies d'indexation alignés sur les entités métier.",
        "Relationale Datenbankmodelle und Indexierungsstrategien für Entitäten definiert.",
        "Relational database models and indexing strategies mapped to business entities."
      ),
      source: "Calculated"
    },
    {
      id: "dim-ai",
      name: t("AI અને GenAI ઇન્ટિગ્રેશન", "AI और GenAI एकीकरण", "Integración de IA", "Intégration IA & GenAI", "KI- & GenAI-Integration", "AI & GenAI Integration"),
      score: aiReadinessVal,
      weight: 0.15,
      status: "Ready",
      rationale: t(
        "ઝડપી રિસ્પોન્સ માટે સ્ટ્રક્ચર્ડ LLM કેસ્કેડ અને સંદર્ભિત પ્રોમ્પ્ટ્સ ગોઠવાયેલા.",
        "त्वरित प्रतिक्रिया के लिए संरचित LLM कैस्केड और प्रासंगिक प्रॉम्प्ट्स कॉन्फ़िगर।",
        "Cascadas de LLM estructuradas y prompts contextuales para inferencia rápida.",
        "Cascades LLM structurées et invites contextuelles pour une inférence rapide.",
        "Strukturierte LLM-Kaskaden und kontextbezogene Prompts für schnelle Inferenz.",
        "Structured LLM cascades and contextual prompts configured for rapid inference."
      ),
      source: "Derived"
    },
    {
      id: "dim-process",
      name: t("પ્રોસેસ ઓપ્ટિમાઇઝેશન", "प्रक्रिया अनुकूलन", "Optimización de Procesos", "Optimisation des Processus", "Prozessoptimierung", "Process Optimization"),
      score: pi ? 89 : 78,
      weight: 0.15,
      status: pi ? "Optimized" : "Ready",
      rationale: t(
        "BPMN 2.0 પ્રોસેસ ફ્લો, આપમેળે નિર્ણય લેવાના નિયમો અને ભૂમિકાઓ નિર્ધારિત.",
        "BPMN 2.0 प्रक्रिया प्रवाह और स्वचालित निर्णय नियम निर्धारित।",
        "Flujo BPMN 2.0 mapeado con reglas automáticas de decisión y roles.",
        "Flux de processus BPMN 2.0 avec portes de décision automatisées et rôles.",
        "BPMN 2.0-Prozessfluss mit automatisierten Entscheidungstoren und Rollen.",
        "BPMN 2.0 process flow mapped with automated decision gates and role boundaries."
      ),
      source: pi ? "Calculated" : "Derived"
    },
    {
      id: "dim-ux",
      name: t("UX અને ઉપયોગિતા", "UX और उपयोगिता", "UX y Usabilidad", "UX & Ergonomie", "UX & Benutzerfreundlichkeit", "UX & Usability"),
      score: ux ? 91 : 80,
      weight: 0.1,
      status: ux ? "Optimized" : "Ready",
      rationale: t(
        "ઇન્ટરેક્ટિવ વાયરફ્રેમ્સ, મલ્ટી-ડિવાઇસ વ્યુપોર્ટ અને યુઝર જર્ની તૈયાર.",
        "इंटरैक्टिव वायरफ्रेम, मल्टी-डिवाइस व्यूपोर्ट और उपयोगकर्ता यात्राएं तैयार।",
        "Wireframes interactivos, vistas multidispositivo y flujos de usuario.",
        "Maquettes interactives, validation multi-écrans et parcours utilisateurs.",
        "Interaktive Wireframes, Multi-Device-Validierungen und User Journeys erstellt.",
        "Interactive wireframes, multi-device viewport validations, and user journeys created."
      ),
      source: ux ? "Calculated" : "Derived"
    },
    {
      id: "dim-impl",
      name: t("અમલીકરણ રેડીનેસ", "कार्यान्वयन तत्परता", "Preparación de Implementación", "Mise en Œuvre", "Umsetzungsbereitschaft", "Implementation Readiness"),
      score: 87,
      weight: 0.1,
      status: "Ready",
      rationale: t(
        "સ્પ્રિન્ટ માઇલસ્ટોન્સ, ટીમ ફાળવણી અને બજેટ મર્યાદાઓ અંતિમ સ્વરૂપે નક્કી.",
        "स्प्रिंट मील के पत्थर, टीम आवंटन और बजट सीमाएं अंतिम रूप से निर्धारित।",
        "Hitos de sprint, asignaciones de equipo y techos de presupuesto finalizados.",
        "Jalons de sprint, affectations d'équipe et plafonds budgétaires finalisés.",
        "Sprint-Meilensteine, Teamzuweisungen und Budgetgrenzen finalisiert.",
        "Sprint milestones, team allocations, and budget ceilings finalized."
      ),
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
      const fw =
        futureWorkflows[i] ||
        t(
          `ડિજિટલ વર્કફ્લો દ્વારા ${cw} નું ઓટોમેશન`,
          `डिजिटल वर्कफ़्लो के माध्यम से ${cw} का स्वचालन`,
          `Automatización de ${cw} mediante flujo digital`,
          `Automatisation de ${cw} via flux numérique`,
          `Automatisierung von ${cw} durch digitalen Workflow`,
          `Automated ${cw} through digital workflow`
        )
      return {
        stepNumber: i + 1,
        currentState: cw,
        futureState: fw,
        automationType:
          i % 2 === 0
            ? t("સંપૂર્ણ ઓટોમેટેડ", "पूर्ण स्वचालित", "Totalmente Automatizado", "Entièrement Automatisé", "Vollautomatisiert", "Fully Automated")
            : t("AI સહાયિત", "AI सहायता प्राप्त", "Asistido por IA", "Assisté par IA", "KI-unterstützt", "AI Assisted"),
        manualEffortReduction:
          i % 2 === 0
            ? t("85% બચત", "85% बचत", "85% Ahorro", "85% Économisé", "85% Eingespart", "85% Saved")
            : t("60% બચત", "60% बचत", "60% Ahorro", "60% Économisé", "60% Eingespart", "60% Saved"),
        techEnabler: i % 2 === 0 ? "Serverless Webhook Trigger" : "Gemini Copilot Decision Engine",
        riskLevel: "Low"
      }
    })
  } else if (piNodes.length > 0) {
    transformSteps = piNodes.slice(0, 4).map((node: any, i: number) => ({
      stepNumber: i + 1,
      currentState: t(
        `${node.role || "ઓપરેટર"} દ્વારા મેન્યુઅલ ${node.name || "ટાસ્ક"}`,
        `${node.role || "ऑपरेटर"} द्वारा मैन्युअल ${node.name || "कार्य"}`,
        `Ejecución manual de ${node.name || "Tarea"} por ${node.role || "Operador"}`,
        `Exécution manuelle de ${node.name || "Tâche"} par ${node.role || "Opérateur"}`,
        `Manuelle Ausführung von ${node.name || "Aufgabe"} durch ${node.role || "Operator"}`,
        `Manual ${node.name || "Task Execution"} by ${node.role || "Operator"}`
      ),
      futureState: t(
        `ત્વરિત સ્ટેટસ સાથે ઓટોમેટેડ ${node.name || "પ્રોસેસિંગ"}`,
        `त्वरित स्थिति के साथ स्वचालित ${node.name || "प्रोसेसिंग"}`,
        `Procesamiento automatizado de ${node.name || "Tarea"} en tiempo real`,
        `Traitement automatisé de ${node.name || "Tâche"} avec état en direct`,
        `Automatisierte Verarbeitung von ${node.name || "Aufgabe"} mit Echtzeitstatus`,
        `Automated ${node.name || "Processing"} with instant status feedback`
      ),
      automationType:
        node.type === "ai_agent"
          ? t("AI સહાયિત", "AI सहायता प्राप्त", "Asistido por IA", "Assisté par IA", "KI-unterstützt", "AI Assisted")
          : t("સંપૂર્ણ ઓટોમેટેડ", "पूर्ण स्वचालित", "Totalmente Automatizado", "Entièrement Automatisé", "Vollautomatisiert", "Fully Automated"),
      manualEffortReduction:
        node.type === "ai_agent"
          ? t("70% બચત", "70% बचत", "70% Ahorro", "70% Économisé", "70% Eingespart", "70% Saved")
          : t("90% બચત", "90% बचत", "90% Ahorro", "90% Économisé", "90% Eingespart", "90% Saved"),
      techEnabler: node.type === "ai_agent" ? "Generative AI Assistant" : "PostgreSQL Event Queue",
      riskLevel: "Low"
    }))
  } else {
    transformSteps = [
      {
        stepNumber: 1,
        currentState: t(
          "ઇમેઇલ અને સ્પ્રેડશીટ દ્વારા મેન્યુઅલ એન્ટ્રી",
          "ईमेल और स्प्रेडशीट के माध्यम से मैन्युअल एंट्री",
          "Entrada manual mediante correo y hojas de cálculo",
          "Saisie manuelle via e-mails et tableurs",
          "Manuelle Erfassung über E-Mails und Tabellen",
          "Manual intake via email & spreadsheets"
        ),
        futureState: t(
          "ઇન્ટરેક્ટિવ સેલ્ફ-સર્વિસ પોર્ટલ અને ત્વરિત વેરિફિકેશન",
          "इंटरैक्टिव सेल्फ-सर्विस पोर्टल और त्वरित सत्यापन",
          "Portal interactivo de autoservicio y validación instantánea",
          "Portail libre-service interactif et validation instantanée",
          "Interaktives Self-Service-Portal mit sofortiger Validierung",
          "Interactive self-service portal & instant structured validation"
        ),
        automationType: t("સંપૂર્ણ ઓટોમેટેડ", "पूर्ण स्वचालित", "Totalmente Automatizado", "Entièrement Automatisé", "Vollautomatisiert", "Fully Automated"),
        manualEffortReduction: t("90% બચત", "90% बचत", "90% Ahorro", "90% Économisé", "90% Eingespart", "90% Saved"),
        techEnabler: "Next.js Form Validation + Cloud Storage",
        riskLevel: "Low"
      },
      {
        stepNumber: 2,
        currentState: t(
          "મેન્યુઅલ રિવ્યુ, કેટેગરી અને ચકાસણી",
          "मैन्युअल समीक्षा, वर्गीकरण और सत्यापन",
          "Revisión, categorización y validación manual",
          "Examen manuel, catégorisation et validation",
          "Manuelle Prüfung, Kategorisierung und Validierung",
          "Manual review, categorization, and validation"
        ),
        futureState: t(
          "AI કોપાયલટ ક્લાસિફિકેશન અને વિસંગતતા શોધ",
          "AI कोपायलट वर्गीकरण और विसंगति पहचान",
          "Clasificación con copiloto de IA y detección de anomalías",
          "Classification par copilote IA et détection d'anomalies",
          "KI-Copilot-Klassifizierung und Anomalieerkennung",
          "AI Copilot classification & fraud/anomaly detection"
        ),
        automationType: t("AI સહાયિત", "AI सहायता प्राप्त", "Asistido por IA", "Assisté par IA", "KI-unterstützt", "AI Assisted"),
        manualEffortReduction: t("75% બચત", "75% बचत", "75% Ahorro", "75% Économisé", "75% Eingespart", "75% Saved"),
        techEnabler: "Gemini 2.5 Structured Reasoning",
        riskLevel: "Medium"
      },
      {
        stepNumber: 3,
        currentState: t(
          "ફોન દ્વારા કન્ફર્મેશન અને મેન્યુઅલ અપ્રૂવલ",
          "फोन द्वारा पुष्टि और मैन्युअल अनुमोदन",
          "Aprobaciones manuales y confirmaciones telefónicas",
          "Approbations manuelles et confirmations par téléphone",
          "Manuelle Freigaben und telefonische Bestätigungen",
          "Manual stakeholder approvals & phone confirmations"
        ),
        futureState: t(
          "વન-ક્લિક અપ્રૂવલ વર્કફ્લો અને રિયલ-ટાઇમ નોટિફિકેશન",
          "वन-क्लिक अनुमोदन वर्कफ़्लो और रीयल-टाइम सूचनाएं",
          "Flujo de aprobación en un clic con alertas en tiempo real",
          "Flux d'approbation en un clic avec notifications en temps réel",
          "1-Klick-Freigabe-Workflow mit Echtzeit-Benachrichtigungen",
          "One-click approval workflow with real-time notifications"
        ),
        automationType: t("માનવ દેખરેખ (Human in Loop)", "मानव नियंत्रण (Human in Loop)", "Humano en el bucle", "Humain dans la boucle", "Menschliche Kontrolle", "Human in the Loop"),
        manualEffortReduction: t("60% બચત", "60% बचत", "60% Ahorro", "60% Économisé", "60% Eingespart", "60% Saved"),
        techEnabler: "WebSocket Alerts & SMS/Email Webhooks",
        riskLevel: "Low"
      },
      {
        stepNumber: 4,
        currentState: t(
          "જૂની સિસ્ટમોમાં મેન્યુઅલ રેકોર્ડ એન્ટ્રી",
          "पुराने सिस्टम में मैन्युअल रिकॉर्ड एंट्री",
          "Entrada manual de registros en sistemas heredados",
          "Saisie manuelle dans les systèmes existants",
          "Manuelle Dateneingabe in Altsysteme",
          "Manual record entry into legacy databases"
        ),
        futureState: t(
          "ડેટાબેઝ સિંક્રનાઇઝેશન અને ઓટોમેટિક ઓડિટ ટ્રેઇલ",
          "शून्य-विलंबता डेटाबेस सिंक और स्वचालित ऑडिट ट्रेल्स",
          "Sincronización de base de datos sin latencia y pistas de auditoría",
          "Synchronisation de base de données instantanée et pistes d'audit",
          "Echtzeit-Datenbanksynchronisierung und automatisierte Audit-Trails",
          "Zero-latency database synchronization and audit trails"
        ),
        automationType: t("સંપૂર્ણ ઓટોમેટેડ", "पूर्ण स्वचालित", "Totalmente Automatizado", "Entièrement Automatisé", "Vollautomatisiert", "Fully Automated"),
        manualEffortReduction: t("95% બચત", "95% बचत", "95% Ahorro", "95% Économisé", "95% Eingespart", "95% Saved"),
        techEnabler: "PostgreSQL ACID Database Triggers",
        riskLevel: "Low"
      }
    ]
  }

  const currentVsFuture: CurrentVsFutureTransformation = {
    overview: t(
      "મેન્યુઅલ પેપરવર્ક અને ધીમી પ્રક્રિયાઓમાંથી સંપૂર્ણ ઓટોમેટેડ ડિજિટલ વર્કફ્લો તરફ પરિવર્તન.",
      "धीमी मैन्युअल प्रक्रियाओं से पूर्णतः स्वचालित डिजिटल वर्कफ़्लो में परिवर्तन।",
      "Transición desde comunicaciones manuales y hojas de cálculo hacia un flujo digital autónomo de extremo a extremo.",
      "Transition des communications manuelles et tableurs vers un flux numérique autonome de bout en bout.",
      "Übergang von fragmentierter manueller Arbeit zu einem durchgängig autonomen digitalen Workflow.",
      "Transition from fragmented manual communications and delayed spreadsheets to an end-to-end autonomous digital workflow."
    ),
    totalManualHoursSavedWeekly: t("32 કલાક / સપ્તાહ", "32 घंटे / सप्ताह", "32 hrs / sem", "32 h / sem", "32 Std. / Woche", "32 hrs / week"),
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
          title:
            opp.title ||
            opp.name ||
            t(
              `ઇન્ટેલિજન્ટ AI સહાયક ${idx + 1}`,
              `इंटेलिजेंट AI सहायक ${idx + 1}`,
              `Asistente de Flujo IA ${idx + 1}`,
              `Assistant IA Intelligent ${idx + 1}`,
              `Intelligenter KI-Assistent ${idx + 1}`,
              `Intelligent Workflow Assistant ${idx + 1}`
            ),
          category: opp.category || (idx % 2 === 0 ? "Generative AI" : "Process AI"),
          businessValue:
            opp.expected_impact ||
            opp.businessValue ||
            t("મેન્યુઅલ કામકાજમાં 70% ઘટાડો", "मैन्युअल काम में 70% की कमी", "Reduce esfuerzo manual en un 70%", "Réduit le travail manuel de 70%", "Reduziert manuellen Aufwand um 70%", "Reduces manual effort by 70%"),
          impact: opp.impact || "High",
          feasibility: opp.feasibility || "High",
          timeToValue:
            opp.timeToValue ||
            t("સ્પ્રિન્ટ 2 (2 અઠવાડિયા)", "स्प्रिंट 2 (2 सप्ताह)", "Sprint 2 (2 Semanas)", "Sprint 2 (2 Semaines)", "Sprint 2 (2 Wochen)", "Sprint 2 (2 Weeks)"),
          status: idx === 0 ? "Active" : "Planned",
          description:
            opp.description ||
            t(
              "મોટા પાયે બિઝનેસ કામગીરી માટે AI-સંચાલિત માર્ગદર્શન અને સ્માર્ટ પારસિંગ.",
              "व्यावसायिक कार्यों के लिए AI-संचालित निर्णय मार्गदर्शन और स्मार्ट पार्सिंग।",
              "Guía de decisiones impulsada por IA y análisis inteligente para operaciones de gran escala.",
              "Aide à la décision basée sur l'IA et analyse intelligente pour les opérations à fort volume.",
              "KI-gestützte Entscheidungsführung und intelligentes Parsing für skalierbare Abläufe.",
              "AI-powered decision guidance and smart parsing for high-volume operations."
            ),
          potentialRisks: t("અસ્પષ્ટ ઇનપુટ પર મોડેલ હલ્યુસિનેશન", "अस्पष्ट इनपुट पर मॉडल मतिभ्रम", "Alucinación en casos límite", "Hallucination sur entrées imprécises", "Modellhalluzination bei unklaren Eingaben", "Model hallucination on edge-case inputs"),
          prerequisites: [
            t("સ્ટ્રક્ચર્ડ ઇનપુટ સ્કીમા", "संरचित इनपुट स्कीमा", "Esquema de entrada estructurado", "Schéma d'entrée structuré", "Strukturiertes Eingabeschema", "Structured input schema"),
            t("ચકાસાયેલ API કી ઓળખપત્રો", "सत्यापित API क्रेडेंशियल", "Credenciales API verificadas", "Identifiants API vérifiés", "Verifizierte API-Schlüssel", "Verified API key credentials")
          ]
        }))
      : [
          {
            id: "ai-opp-1",
            title: t("ઓટોનોમસ કન્વર્ઝેશનલ કોપાયલટ", "स्वायत्त संवादात्मक कोपायलट", "Copiloto Conversacional Autónomo", "Copilote Conversationnel Autonome", "Autonomer Konversations-Copilot", "Autonomous Conversational Copilot"),
            category: "Generative AI",
            businessValue: t("24/7 ત્વરિત ગ્રાહક સપોર્ટ અને ઓટોમેટેડ બુકિંગ", "24/7 त्वरित ग्राहक सहायता और स्वचालित बुकिंग", "Soporte al cliente instantáneo 24/7 y reservas automatizadas", "Support client instantané 24/7 et réservations automatisées", "24/7 Sofortkundensupport und automatisierte Buchungen", "24/7 instant client support and automated booking"),
            impact: "High",
            feasibility: "High",
            timeToValue: t("સ્પ્રિન્ટ 2", "स्प्रिंट 2", "Sprint 2", "Sprint 2", "Sprint 2", "Sprint 2"),
            status: "Active",
            description: t(
              "ગ્રાહકોના પ્રશ્નોના જવાબ આપવા અને બુકિંગ માટે 24/7 ઉપલબ્ધ AI આસિસ્ટન્ટ.",
              "पूछताछ का उत्तर देने और बुकिंग करने के लिए संदर्भ-जागरूक संवादात्मक सहायक।",
              "Asistente conversacional consciente del contexto para responder consultas y gestionar reservas.",
              "Assistant conversationnel contextuel pour répondre aux questions et gérer les réservations.",
              "Kontextbewusster KI-Assistent zur Beantwortung von Anfragen und automatischen Buchungsabwicklung.",
              "Context-aware conversational assistant to answer inquiries, guide selections, and book requests."
            ),
            potentialRisks: t("પબ્લિક ફિલ્ડ્સ પર પ્રોમ્પ્ટ ઇન્જેક્શન", "पब्लिक फ़ील्ड पर प्रॉम्प्ट इंजेक्शन", "Inyección de prompts en campos públicos", "Injection d'invites sur les champs publics", "Prompt-Injection auf öffentlichen Feldern", "Prompt injection on public fields"),
            prerequisites: [
              t("ડોમેન નોલેજ બેઝ", "डोमेन नॉलेज बेस", "Base de conocimiento del dominio", "Base de connaissances du domaine", "Domänen-Wissensbasis", "Domain knowledge base"),
              t("રોલ-બેઝ્ડ API ટોકન્સ", "भूमिका-आधारित API टोकन", "Tokens de API basados en roles", "Jetons API basés sur les rôles", "Rollenbasierte API-Tokens", "Role-based API tokens")
            ]
          },
          {
            id: "ai-opp-2",
            title: t("ડિમાન્ડ અને ઇન્વેન્ટરી પ્રિડિક્શન", "मांग और इन्वेंटरी पूर्वानुमान", "Predicción de Demanda e Inventario", "Prévision de la Demande & des Stocks", "Nachfrage- & Bestandsprognose", "Predictive Demand & Inventory Forecasting"),
            category: "Predictive AI",
            businessValue: t("સ્ટોક ખૂટી જતો અટકાવે છે અને સ્ટાફ પ્લાનિંગ સુધારે છે", "स्टॉक की कमी को रोकता है और स्टाफ शेड्यूलिंग को अनुकूलित करता है", "Evita desabastecimientos y optimiza la programación del personal", "Évite les ruptures de stock et optimise les plannings d'équipe", "Verhindert Engpässe und optimiert die Personalplanung", "Prevents stockouts and optimizes staff scheduling"),
            impact: "High",
            feasibility: "Medium",
            timeToValue: t("સ્પ્રિન્ટ 3", "स्प्रिंट 3", "Sprint 3", "Sprint 3", "Sprint 3", "Sprint 3"),
            status: "Planned",
            description: t(
              "ઓર્ડર હિસ્ટ્રી પરથી ભાવિ જરૂરિયાતોની આપમેળે ગણતરી.",
              "ऐतिहासिक ऑर्डर डेटा से पैटर्न का विश्लेषण।",
              "Regresión estadística y detección de patrones sobre volúmenes históricos de pedidos.",
              "Régression statistique et détection de modèles sur l'historique des commandes.",
              "Statistische Regression und Mustererkennung über historische Bestellvolumina.",
              "Statistical regression and pattern detection over historical order volumes."
            ),
            potentialRisks: t("ઓછો ઐતિહાસિક ડેટા", "अपर्याप्त ऐतिहासिक डेटा", "Datos históricos de entrenamiento insuficientes", "Données d'entraînement historiques insuffisantes", "Unzureichende historische Trainingsdaten", "Insufficient historical training data"),
            prerequisites: [
              t("30-દિવસનો બેઝલાઇન ડેટાસેટ", "30-दिवसीय बेसलाइन डेटासेट", "Conjunto de datos de referencia de 30 días", "Jeu de données de référence sur 30 jours", "30-Tage-Baseline-Datensatz", "30-day baseline dataset")
            ]
          },
          {
            id: "ai-opp-3",
            title: t("સ્માર્ટ રિસીપ્ટ અને ડોક્યુમેન્ટ પારસિંગ (OCR)", "स्मार्ट रसीद और दस्तावेज़ पार्सिंग (OCR)", "Análisis Inteligente de Facturas y Documentos (OCR)", "Analyse Intelligente de Factures & Documents (OCR)", "Intelligente Belegerkennung & OCR-Dokumentenanalyse", "Smart Receipt & Document Parsing (OCR)"),
            category: "Computer Vision",
            businessValue: t("બિલ અને રસીદોનું ત્વરિત ડિજિટલ સ્કેનિંગ", "भौतिक बिलों और रसीदों का त्वरित डिजिटल इनटेक", "Ingesta digital instantánea de facturas y recibos físicos", "Numérisation instantanée des factures et reçus physiques", "Sofortige digitale Erfassung physischer Rechnungen und Quittungen", "Instant ingestion of physical invoices and receipts"),
            impact: "Medium",
            feasibility: "High",
            timeToValue: t("સ્પ્રિન્ટ 4", "સ્પ્રિન્ટ 4", "Sprint 4", "Sprint 4", "Sprint 4", "Sprint 4"),
            status: "Under Review",
            description: t(
              "કેમેરાથી ફોટો પાડીને ડેટાબેઝમાં ડાયરેક્ટ એન્ટ્રી.",
              "कैमरा इमेज से सीधे डेटाबेस में ऑटोमैटिक एक्सट्रैक्शन।",
              "Extracción visual multimodal directamente en elementos de base de datos PostgreSQL.",
              "Extraction visuelle multimodale directement dans la base de données PostgreSQL.",
              "Multimodale visuelle Extraktion direkt in PostgreSQL-Datenbankzeilen.",
              "Multi-modal vision extraction directly into PostgreSQL line-items."
            ),
            potentialRisks: t("ઓછી ગુણવત્તાવાળા ફોટો અપલોડ", "कम रिज़ॉल्यूशन वाली तस्वीरें", "Cargas de fotos de baja resolución", "Téléversements de photos en basse résolution", "Upload von Fotos mit geringer Auflösung", "Low resolution photo uploads"),
            prerequisites: [
              t("ફાઇલ અપલોડ સ્ટોરેજ પાઇપલાઇન", "फ़ाइल अपलोड स्टोरेज पाइपलाइन", "Canal de almacenamiento de carga de archivos", "Pipeline de stockage pour téléversement de fichiers", "Dateiupload-Speicherpipeline", "File upload storage pipeline")
            ]
          }
        ]

  // 6. Roadmap & Milestone Sprints
  const roadmap: RoadmapPhaseStatus[] =
    rawSprints.length > 0
      ? rawSprints.map((sp: any, idx: number) => ({
          id: `sprint-${idx + 1}`,
          phaseNumber: idx + 1,
          title: sp.phase || sp.title || sp.focus || t(`ફેઝ ${idx + 1}`, `चरण ${idx + 1}`, `Fase ${idx + 1}`, `Phase ${idx + 1}`, `Phase ${idx + 1}`, `Phase ${idx + 1}`),
          timeframe: sp.timeframe || t(`સ્પ્રિન્ટ ${idx + 1} (${idx * 2 + 1}-${idx * 2 + 2} અઠવાડિયા)`, `स्प्रिंट ${idx + 1} (${idx * 2 + 1}-${idx * 2 + 2} सप्ताह)`, `Sprint ${idx + 1} (Sem. ${idx * 2 + 1}-${idx * 2 + 2})`, `Sprint ${idx + 1} (Sem. ${idx * 2 + 1}-${idx * 2 + 2})`, `Sprint ${idx + 1} (Wo. ${idx * 2 + 1}-${idx * 2 + 2})`, `Sprint ${idx + 1} (${idx * 2 + 1}-${idx * 2 + 2} wks)`),
          status: idx === 0 ? "In Progress" : "Upcoming",
          owner: sp.owner || t("ફૂલ-સ્ટેક એન્જિનિયર", "फुल-स्टैक इंजीनियर", "Ingeniero Full-Stack", "Ingénieur Full-Stack", "Full-Stack-Entwickler", "Full-Stack Engineer"),
          techStack: Array.isArray(sp.tech_stack)
            ? sp.tech_stack
            : typeof sp.tech_stack === "string"
            ? sp.tech_stack.split(",")
            : ["Next.js", "PostgreSQL"],
          deliverables: typeof sp.tasks === "string" ? [sp.tasks] : sp.tasks || [t("મુખ્ય સિસ્ટમ મોડ્યુલ ડિપ્લોયમેન્ટ", "कोर सिस्टम मॉड्यूल तैनाती", "Despliegue del módulo central del sistema", "Déploiement du module système principal", "Bereitstellung des Kernsystemmoduls", "Core system module deployment")],
          keyMilestone: sp.key_milestone || t(`માઇલસ્ટોન ${idx + 1}: કાર્યકારી ચકાસણી પૂર્ણ`, `मील का पत्थर ${idx + 1}: कार्यात्मक सत्यापन पूर्ण`, `Hito ${idx + 1}: Validación funcional completada`, `Jalon ${idx + 1} : Validation fonctionnelle terminée`, `Meilenstein ${idx + 1}: Funktionale Validierung abgeschlossen`, `Milestone ${idx + 1}: Functional validation complete`)
        }))
      : [
          {
            id: "sprint-1",
            phaseNumber: 1,
            title: t("ફાઉન્ડેશન અને ઇન્ટરેક્ટિવ UX", "नींव और इंटरैक्टिव UX", "Fundación y UX Interactivo", "Fondations & UX Interactif", "Grundlagen & Interaktive UX", "Foundation & Interactive UX"),
            timeframe: t("અઠવાડિયું 1 - 2", "सप्ताह 1 - 2", "Semana 1 - 2", "Semaine 1 - 2", "Woche 1 - 2", "Week 1 - 2"),
            status: "Completed",
            owner: t("ફ્રન્ટએન્ડ આર્કિટેક્ટ", "फ्रंटएंड आर्किटेक्ट", "Arquitecto Frontend", "Architecte Frontend", "Frontend-Architekt", "Frontend Architect"),
            techStack: ["Next.js 16", "Tailwind CSS", "Lucide"],
            deliverables: [
              t("વાયરફ્રેમ લેઆઉટ", "वायरफ्रेम लेआउट", "Diseños de wireframe", "Mises en page de maquettes", "Wireframe-Layouts", "Wireframe layouts"),
              t("ડિઝાઇન સિસ્ટમ સેટઅપ", "डिज़ाइन सिस्टम सेटअप", "Configuración del sistema de diseño", "Configuration du design system", "Einrichtung des Designsystems", "Design system setup"),
              t("ડિસ્કવરી મંજૂરી", "डिस्कवरी अनुमोदन", "Aprobación de descubrimiento", "Validation de la phase de cadrage", "Discovery-Freigabe", "Discovery sign-off")
            ],
            keyMilestone: t("માઇલસ્ટોન 1: ઇન્ટરેક્ટિવ પ્રોટોટાઇપ મંજૂર", "मील का पत्थर 1: इंटरैक्टिव प्रोटोटाइप स्वीकृत", "Hito 1: Prototipo interactivo aprobado", "Jalon 1 : Prototype visuel interactif approuvé", "Meilenstein 1: Visueller interaktiver Prototyp genehmigt", "Milestone 1: Visual Interactive Prototype approved")
          },
          {
            id: "sprint-2",
            phaseNumber: 2,
            title: t("કોર બેકએન્ડ અને ડેટા લેયર", "कोर बैकएंड और डेटा लेयर", "Backend Central y Capa de Datos", "Backend Principal & Couche Données", "Kern-Backend & Datenebene", "Core Backend & Data Layer"),
            timeframe: t("અઠવાડિયું 3 - 4", "सप्ताह 3 - 4", "Semana 3 - 4", "Semaine 3 - 4", "Woche 3 - 4", "Week 3 - 4"),
            status: "In Progress",
            owner: t("બેકએન્ડ એન્જિનિયર", "बैकएंड इंजीनियर", "Ingeniero Backend", "Ingénieur Backend", "Backend-Entwickler", "Backend Engineer"),
            techStack: ["Node.js", "PostgreSQL", "Supabase"],
            deliverables: [
              t("ડેટાબેઝ સ્કીમા માઇગ્રેશન", "डेटाबेस स्कीमा माइग्रेशन", "Migraciones de esquema de BD", "Migrations de schéma de base de données", "Datenbank-Schemamigrationen", "Database schema migrations"),
              t("REST API એન્ડપોઇન્ટ્સ", "REST API एंडपॉइंट्स", "Endpoints de API REST", "Points de terminaison API REST", "REST-API-Endpunkte", "REST API endpoints"),
              t("ઓથેન્ટિકેશન ફ્લો", "ऑथेंटिकेशन फ़्लो", "Flujo de autenticación segura", "Flux d'authentification", "Authentifizierungs-Flow", "Auth flow")
            ],
            keyMilestone: t("માઇલસ્ટોન 2: ડેટાબેઝ અને CRUD લાઈવ", "मील का पत्थर 2: डेटाबेस और CRUD लाइव", "Hito 2: Base de datos y CRUD en vivo", "Jalon 2 : Base de données et CRUD fonctionnels", "Meilenstein 2: Datenbank und authentifiziertes CRUD live", "Milestone 2: Database and authenticated CRUD live")
          },
          {
            id: "sprint-3",
            phaseNumber: 3,
            title: t("AI એન્જિન અને ઓટોમેશન ઇન્ટિગ્રેશન", "AI इंजन और स्वचालन एकीकरण", "Motor de IA e Integración de Automatización", "Moteur IA & Intégration de l'Automatisation", "KI-Engine & Automatisierungsintegration", "AI Engine & Automation Integration"),
            timeframe: t("અઠવાડિયું 5", "सप्ताह 5", "Semana 5", "Semaine 5", "Woche 5", "Week 5"),
            status: "Upcoming",
            owner: t("AI એન્જિનિયર", "AI इंजीनियर", "Ingeniero de IA", "Ingénieur IA", "KI-Entwickler", "AI Engineer"),
            techStack: ["Google Gemini API", "Vector Embeddings", "Webhooks"],
            deliverables: [
              t("કોપાયલટ સ્ટ્રીમિંગ પાઇપલાઇન", "कोपायलट स्ट्रीमिंग पाइपलाइन", "Canal de streaming de copiloto", "Pipeline de streaming du copilote", "Copilot-Streaming-Pipeline", "Copilot streaming pipeline"),
              t("ઓટોમેટેડ ઇમેઇલ ટ્રિગર્સ", "स्वचालित ईमेल ट्रिगर्स", "Disparadores de correo automatizados", "Déclencheurs d'e-mails automatisés", "Automatisierte E-Mail-Trigger", "Automated email triggers"),
              t("એક્સેપ્શન લોગિંગ", "अपवाद लॉगिंग", "Registro de excepciones", "Journalisation des exceptions", "Fehlerprotokollierung", "Exception logging")
            ],
            keyMilestone: t("માઇલસ્ટોન 3: AI કોપાયલટ ટેસ્ટિંગ પૂર્ણ", "मील का पत्थर 3: AI कोपायलट परीक्षण पूर्ण", "Hito 3: Pruebas de extremo a extremo del copiloto de IA", "Jalon 3 : Tests de bout en bout du copilote IA", "Meilenstein 3: KI-Copilot End-to-End-Tests", "Milestone 3: AI Copilot end-to-end testing")
          },
          {
            id: "sprint-4",
            phaseNumber: 4,
            title: t("સુરક્ષા, QA અને ક્લાઉડ લોન્ચ", "सुरक्षा, QA और क्लाउड लॉन्च", "Seguridad, Control de Calidad y Lanzamiento Cloud", "Sécurité, QA & Lancement Cloud", "Sicherheit, QA & Cloud-Launch", "Security, QA & Cloud Launch"),
            timeframe: t("અઠવાડિયું 6", "सप्ताह 6", "Semana 6", "Semaine 6", "Woche 6", "Week 6"),
            status: "Upcoming",
            owner: t("DevOps અને QA લીડ", "DevOps और QA लीड", "Líder de DevOps y QA", "Responsable DevOps & QA", "DevOps & QA-Leiter", "DevOps & QA Lead"),
            techStack: ["Docker", "Vercel / AWS", "Sentry"],
            deliverables: [
              t("લોડ ટેસ્ટિંગ", "लोड परीक्षण", "Pruebas de carga y estrés", "Tests de charge", "Lasttests", "Load testing"),
              t("પરમિશન ઓડિટ", "अनुमति ऑडिट", "Auditorías de permisos basadas en roles", "Audits d'autorisations RBAC", "Rollenbasierte Berechtigungsaudits", "Role-based permission audits"),
              t("પ્રોડક્શન કટઓવર", "उत्पादन लाइव रिलीज", "Lanzamiento final en producción", "Bascule en production", "Produktions-Cutover", "Production cutover")
            ],
            keyMilestone: t("માઇલસ્ટોન 4: પ્રોડક્શન લાઇવ રિલીઝ", "मील का पत्थर 4: उत्पादन लाइव रिलीज", "Hito 4: Lanzamiento en vivo en producción", "Jalon 4 : Mise en production finale", "Meilenstein 4: Produktiver Live-Release", "Milestone 4: Production live release")
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
    estimatedHours: finEst.total_hours || t("240 કલાક", "240 घंटे", "240 Horas", "240 Heures", "240 Stunden", "240 Hours"),
    hourlyRate: finEst.hourly_rate || "$75/hr",
    teamSize: finEst.team_roles?.length || 4,
    teamRoles: finEst.team_roles || [
      { role: t("સિનિયર ફૂલ-સ્ટેક એન્જિનિયર", "सीनियर फुल-स्टैक इंजीनियर", "Ingeniero Full-Stack Senior", "Ingénieur Full-Stack Senior", "Senior Full-Stack-Entwickler", "Senior Full-Stack Engineer"), count: 2, allocation: "100%" },
      { role: t("UI/UX પ્રોડક્ટ ડિઝાઇનર", "UI/UX प्रोडक्ट डिज़ाइनर", "Diseñador de Producto UI/UX", "Designer Produit UI/UX", "UI/UX-Produktdesigner", "UI/UX Product Designer"), count: 1, allocation: "50%" },
      { role: t("AI અને ડેટા એન્જિનિયર", "AI और डेटा इंजीनियर", "Ingeniero de IA y Datos", "Ingénieur IA & Données", "KI- & Daten-Ingenieur", "AI & Data Engineer"), count: 1, allocation: "75%" },
      { role: t("DevOps આર્કિટેક્ટ", "DevOps आर्किटेक्ट", "Arquitecto DevOps", "Architecte DevOps", "DevOps-Architekt", "DevOps Architect"), count: 1, allocation: "50%" }
    ],
    source: finEst.min_budget ? "User Provided" : "AI Estimated"
  }

  // 8. ROI Estimate
  const roi: ROIEstimate = {
    expectedROI: `${calculatedROI}%`,
    paybackPeriod: `${paybackMonths} ${t("મહિના", "महीने", "Meses", "Mois", "Monate", "Months")}`,
    annualBenefit: `$${calculatedAnnualBenefit.toLocaleString()} / yr`,
    efficiencyGain: t("+42% સ્પીડ વધારો", "+42% गति वृद्धि", "+42% Velocidad", "+42% Vélocité", "+42% Effizienzgewinn", "+42% Velocity"),
    costSavingsAnnual: `$${Math.round(avgInvestment * 1.8).toLocaleString()} / yr`,
    source: "Calculated",
    calculationNotes: t(
      "મેન્યુઅલ કામકાજના ઓટોમેશનથી દર અઠવાડિયે ~32 કલાકની બચતના આધારે ગણતરી.",
      "मैन्युअल लेन-देन के स्वचालन के आधार पर, प्रति सप्ताह ~32 घंटे की बचत।",
      "Basado en el procesamiento automatizado de transacciones manuales, ahorrando ~32 horas/semana.",
      "Basé sur l'automatisation des transactions manuelles, économisant ~32 heures/semaine.",
      "Basiert auf der automatisierten Bearbeitung manueller Vorgänge mit ~32 Std./Woche Einsparung.",
      `Based on automated processing of manual transactions, saving ~32 hours/week across team operations.`
    )
  }

  // 9. Risk Center
  const risks: RiskItem[] = [
    {
      id: "risk-1",
      title: t("ડેટા માઇગ્રેશન અને સ્કીમા સિંક", "डेटा माइग्रेशन और स्कीमा सिंक", "Migración de Datos y Sincronización de Esquema", "Migration des Données & Synchronisation de Schéma", "Datenmigration & Schemasynchronisierung", "Data Migration & Schema Synchronization"),
      category: "Data",
      severity: "Medium",
      probability: "Medium",
      impact: t(
        "જૂની સ્પ્રેડશીટ્સના ડેટાને ડેટાબેઝમાં લાવતા પહેલા સાફ કરવો જરૂરી છે.",
        "पुरानी स्प्रेडशीट विसंगतियों को इनपुट से पहले सैनिटाइज करना आवश्यक है।",
        "Las anomalías en hojas de cálculo heredadas requieren scripts de saneamiento previos.",
        "Les anomalies des anciens tableurs nécessitent des scripts de nettoyage préalables.",
        "Anomalien in Alttabellen erfordern Bereinigungsskripte vor dem Import.",
        "Legacy spreadsheet anomalies may require sanitization scripts prior to ingestion."
      ),
      mitigation: t(
        "ડેટા ટાઇપ ચેકિંગ સાથે ઓટોમેટેડ સ્કીમા વેલિડેશન લાગુ કરો.",
        "सख्त प्रकार जाँच और फ़ॉलबैक डिफ़ॉल्ट के साथ स्वचालित स्कीमा सत्यापन।",
        "Desplegar adaptador de validación de esquemas con verificación estricta de tipos.",
        "Déployer un adaptateur de validation de schéma automatisé avec vérification stricte des types.",
        "Automatisierte Schemavalidierung mit strikter Typprüfung und Fallbacks implementieren.",
        "Deploy automated schema validation adapter with strict type checking and fallback defaults."
      ),
      status: "Mitigated"
    },
    {
      id: "risk-2",
      title: t("LLM હલ્યુસિનેશન અને ટોકન લિમિટ્સ", "LLM मतिभ्रम और टोकन दर सीमा", "Alucinación de LLM y Límites de Tasa de Tokens", "Hallucination LLM & Limites de Débit de Jetons", "LLM-Halluzination & Token-Ratenbegrenzungen", "LLM Hallucination & Token Rate Limits"),
      category: "AI",
      severity: "Medium",
      probability: "Low",
      impact: t(
        "વધુ પડતા ટ્રાફિક વખતે રિસ્પોન્સમાં વિલંબ થઈ શકે છે.",
        "उच्च उपयोग के दौरान अप्रत्याशित आउटपुट या विलंबता।",
        "Salidas inesperadas de prompts o picos de latencia durante el uso pico.",
        "Sorties inattendues ou pics de latence lors des périodes de pointe.",
        "Unerwartete Modellausgaben oder Latenzspitzen bei hoher Auslastung.",
        "Unexpected prompt outputs or latency spikes during peak usage."
      ),
      mitigation: t(
        "મલ્ટી-મોડેલ ફોલબેક (Gemini 2.5 Flash -> Gemini 3.6 Flash) આર્કિટેક્ચર.",
        "मल्टी-मॉडल फ़ॉलबैक कैस्केड और संरचित सिस्टम स्कीमा।",
        "Cascada de respaldo multimodelo (Gemini 2.5 Flash -> Gemini 3.6 Flash) con esquemas deterministas.",
        "Cascade de secours multi-modèles (Gemini 2.5 Flash -> Gemini 3.6 Flash) avec schémas déterministes.",
        "Multi-Modell-Fallback-Kaskade (Gemini 2.5 Flash -> Gemini 3.6 Flash) mit deterministischen Schemas.",
        "Multi-model fallback cascade (Gemini 2.5 Flash -> Gemini 3.6 Flash) with deterministic system schemas."
      ),
      status: "Mitigated"
    },
    {
      id: "risk-3",
      title: t("યુઝર એડોપ્શન અને ચેન્જ મેનેજમેન્ટ", "उपयोगकर्ता अपनाना और परिवर्तन प्रबंधन", "Adopción de Usuarios y Gestión del Cambio", "Adoption Utilisateur & Conduite du Changement", "Nutzerakzeptanz & Change Management", "User Adoption & Change Management"),
      category: "Business",
      severity: "Low",
      probability: "Medium",
      impact: t(
        "નવી AI સિસ્ટમ વાપરવામાં સ્ટાફને શરૂઆતમાં તાલીમ આપવી પડશે.",
        "नए AI-सहायता प्राप्त इंटरफेस को अपनाने में कर्मचारियों की हिचकिचाहट।",
        "Dudas del personal operativo al adoptar las nuevas interfaces con IA.",
        "Hésitation du personnel opérationnel lors de l'adoption des nouvelles interfaces IA.",
        "Zurückhaltung der Mitarbeiter bei der Einführung neuer KI-gestützter Schnittstellen.",
        "Operational staff hesitation when adopting new AI-assisted interfaces."
      ),
      mitigation: t(
        "સરળ ઇન્ટરેક્ટિવ વાયરફ્રેમ તાલીમ અને માનવ દેખરેખ વિકલ્પો.",
        "सहज इंटरैक्टिव प्रशिक्षण सत्र और ह्यूमन-इन-द-लूप ओवरराइड्स।",
        "Sesiones de capacitación interactivas e intuitivas con anulaciones manuales.",
        "Sessions de formation interactives et intuitives avec contrôle humain prioritaire.",
        "Intuitive interaktive Wireframe-Schulungen mit manuellen Eingriffsmöglichkeiten.",
        "Intuitive interactive wireframe training sessions with human-in-the-loop fallback overrides."
      ),
      status: "Monitoring"
    },
    {
      id: "risk-4",
      title: t("API ઓથેન્ટિકેશન અને સિક્યુરિટી ટોકન્સ", "API प्रमाणीकरण और सुरक्षा टोकन", "Autenticación de API y Tokens de Seguridad", "Authentification API & Jetons de Sécurité", "API-Authentifizierung & Sicherheitstokens", "API Authentication & Security Tokens"),
      category: "Security",
      severity: "High",
      probability: "Low",
      impact: t(
        "મહત્વપૂર્ણ એન્ડપોઇન્ટ્સ પર અનધિકૃત એક્સેસનું જોખમ.",
        "संवेदनशील एंडपॉइंट्स तक अनधिकृत पहुंच।",
        "Acceso no autorizado a endpoints transaccionales sensibles.",
        "Accès non autorisé à des points de terminaison transactionnels sensibles.",
        "Unbefugter Zugriff auf sensible Transaktionsendpunkte.",
        "Unauthorized access to sensitive transactional endpoints."
      ),
      mitigation: t(
        "JWT ટોકન ઓથેન્ટિકેશન અને રોલ-બેઝ્ડ પરમિશન્સ (RBAC) લાગુ કરો.",
        "JWT प्रमाणीकरण, एन्क्रिप्टेड पर्यावरण चर और भूमिका-आधारित नीतियां लागू करें।",
        "Hacer cumplir la autenticación JWT y políticas basadas en roles (RBAC).",
        "Appliquer l'authentification JWT et les politiques de contrôle d'accès basées sur les rôles (RBAC).",
        "JWT-Authentifizierung, verschlüsselte Umgebungsvariablen und RBAC-Richtlinien erzwingen.",
        "Enforce JWT bearer authentication, encrypted environment variables, and role-based policies."
      ),
      status: "Open"
    }
  ]

  // 10. Executive Alerts
  const alerts: ExecutiveAlert[] = [
    {
      id: "alert-1",
      type: "success",
      title: t("AI UX વાયરફ્રેમ સ્ટુડિયો તૈયાર છે", "AI UX वायरफ्रेम स्टूडियो तैयार है", "Estudio de Wireframes AI UX Configurado", "Studio de Maquettes IA UX Configuré", "KI UX Wireframe-Studio konfiguriert", "AI UX Wireframe Studio Configured"),
      description: t(
        "ફેઝ 3 ના તમામ ઇન્ટરેક્ટિવ સ્ક્રીન્સ અને મોબાઇલ લેઆઉટ ટેસ્ટિંગ માટે તૈયાર છે.",
        "चरण 3 इंटरैक्टिव स्क्रीन और मोबाइल लेआउट परीक्षण के लिए पूरी तरह से तैयार हैं।",
        "Las pantallas interactivas de la Fase 3 y vistas móviles están listas para pruebas.",
        "Les écrans interactifs de la Phase 3 et les vues mobiles sont prêts pour les tests.",
        "Interaktive Bildschirme der Phase 3 und mobile Ansichten sind vollständig testbereit.",
        "Phase 3 interactive screens, component palettes, and mobile viewports are fully mapped and ready for testing."
      ),
      sourcePhase: "UX",
      targetTab: "wireframe",
      actionLabel: t("સ્ટુડિયો ખોલો", "स्टूडियो खोलें", "Abrir Estudio", "Ouvrir le Studio", "Studio öffnen", "Open Studio")
    },
    {
      id: "alert-2",
      type: "info",
      title: t("ડેટાબેઝ આર્કિટેક્ચર માઇગ્રેશન માટે તૈયાર", "डेटाबेस आर्किटेक्चर माइग्रेशन के लिए तैयार", "Arquitectura de BD Lista para Migraciones", "Architecture BD Prête pour les Migrations", "Datenbankarchitektur bereit für Migrationen", "Database Architecture Ready for Migrations"),
      description: t(
        `${Array.isArray(dbSchema) ? dbSchema.length : 3} રિલેશનલ ટેબલ્સ અને REST API એન્ડપોઇન્ટ્સ તૈયાર છે.`,
        `${Array.isArray(dbSchema) ? dbSchema.length : 3} रिलेशनल डेटाबेस टेबल और REST एंडपॉइंट्स प्रोजेक्ट स्कोप से मैप किए गए।`,
        `${Array.isArray(dbSchema) ? dbSchema.length : 3} entidades relacionales y endpoints mapeados al alcance del proyecto.`,
        `${Array.isArray(dbSchema) ? dbSchema.length : 3} entités relationnelles et points de terminaison REST configurés.`,
        `${Array.isArray(dbSchema) ? dbSchema.length : 3} relationale Tabellen und REST-Endpunkte für das Projekt definiert.`,
        `${Array.isArray(dbSchema) ? dbSchema.length : 3} relational database entities and REST endpoints mapped to project scope.`
      ),
      sourcePhase: "Architecture",
      targetTab: "db",
      actionLabel: t("સ્કીમા જુઓ", "स्कीमा देखें", "Ver Esquema", "Voir le Schéma", "Schema anzeigen", "View Schema")
    },
    {
      id: "alert-3",
      type: "warning",
      title: t("પ્રોડક્શન API કી અને Supabase URL ચકાસો", "प्रोडक्शन API कुंजी और Supabase URL सत्यापित करें", "Confirmar Claves API y URL de Supabase", "Confirmer les Clés API & l'URL Supabase", "Produktions-API-Schlüssel & Supabase-URL bestätigen", "Confirm Production API Keys & Supabase URL"),
      description: t(
        "સ્પ્રિન્ટ 2 શરૂ કરતા પહેલા ક્લાઉડ ડેટાબેઝ એન્વાયરમેન્ટ વેરિયેબલ્સ ચકાસવા જરૂરી છે.",
        "स्प्रिंट 2 परिनियोजन शुरू करने से पहले डेटाबेस पर्यावरण चर मान्य होने चाहिए।",
        "Las variables de entorno de la base de datos cloud deben validarse antes del Sprint 2.",
        "Les variables d'environnement de la base de données cloud doivent être validées avant le Sprint 2.",
        "Cloud-Datenbank-Umgebungsvariablen sollten vor dem Start von Sprint 2 überprüft werden.",
        "Cloud database environment variables should be validated prior to launching Sprint 2 deployment."
      ),
      sourcePhase: "Planning",
      targetTab: "roadmap",
      actionLabel: t("રોડમેપ જુઓ", "रोडमैप देखें", "Ver Hoja de Ruta", "Voir la Feuille de Route", "Roadmap prüfen", "Check Roadmap")
    }
  ]

  // 11. Next Best Actions
  const nextActions: NextBestAction[] = [
    {
      id: "action-1",
      priority: "Immediate",
      title: t("ઇન્ટરેક્ટિવ વાયરફ્રેમ પ્રોટોટાઇપ ચકાસો અને મંજૂર કરો", "इंटरैक्टिव वायरफ्रेम प्रोटोटाइप की समीक्षा और अनुमोदन करें", "Revisar y Aprobar Prototipo de Wireframe Interactivo", "Examiner & Valider le Prototype de Maquette Interactif", "Interaktiven Wireframe-Prototyp prüfen & freigeben", "Review & Sign-off Interactive Wireframe Prototype"),
      description: t(
        "ક્લિકેબલ સ્ક્રીન ટ્રાન્ઝિશન અને કમ્પોનન્ટ ઇન્ટરેક્શનનું પરીક્ષણ કરો.",
        "हितधारकों के साथ क्लिक करने योग्य स्क्रीन ट्रांज़िशन का परीक्षण करें।",
        "Probar transiciones de pantalla clicables e interacciones de componentes con las partes interesadas.",
        "Tester les transitions d'écran cliquables et les interactions de composants avec les parties prenantes.",
        "Klickbare Bildschirmübergänge und Komponenten-Interaktionen mit Stakeholdern testen.",
        "Test clickable screen transitions and component interactions with stakeholders."
      ),
      ownerRole: t("પ્રોડક્ટ લીડ અને સ્ટેકહોલ્ડર", "प्रोडक्ट लीड और हितधारक", "Líder de Producto e Interesado Principal", "Responsable Produit & Partie Prenante", "Produktleiter & Stakeholder", "Product Lead & Executive Stakeholder"),
      targetTab: "wireframe",
      ctaText: t("વાયરફ્રેમ સ્ટુડિયો ખોલો", "वायरफ्रेम स्टूडियो खोलें", "Lanzar Estudio de Wireframes", "Ouvrir le Studio de Maquettes", "Wireframe-Studio starten", "Launch Wireframe Studio"),
      estimatedEffort: t("30 મિનિટ", "30 मिनट", "30 mins", "30 min", "30 Min.", "30 mins")
    },
    {
      id: "action-2",
      priority: "High",
      title: t("ડેટાબેઝ સ્કીમા અને API એન્ડપોઇન્ટ્સ ચકાસો", "डेटाबेस स्कीमा और API एंडपॉइंट्स सत्यापित करें", "Verificar Esquema de BD y Endpoints de API", "Vérifier le Schéma de BD et les Endpoints API", "Datenbankschema & API-Endpunkte verifizieren", "Verify Database Schema & API Enpoints"),
      description: t(
        "બધી બિઝનેસ એન્ટિટી અને REST રૂટ્સ યોગ્ય રીતે જોડાયેલા છે તેની ખાતરી કરો.",
        "सुनिश्चित करें कि व्यावसायिक संस्थाएं और REST रूट संरेखित हैं।",
        "Garantizar que todas las entidades y contratos de rutas REST estén alineados.",
        "S'assurer que toutes les entités métier et les contrats de routes REST sont bien alignés.",
        "Sicherstellen, dass alle Geschäftsentitäten und REST-Routenverträge korrekt ausgerichtet sind.",
        "Ensure all business entities and REST route contracts align with downstream integrations."
      ),
      ownerRole: t("લીડ બેકએન્ડ એન્જિનિયર", "लीड बैकएंड इंजीनियर", "Ingeniero Backend Principal", "Ingénieur Backend Principal", "Lead Backend-Entwickler", "Lead Backend Engineer"),
      targetTab: "db",
      ctaText: t("ડેટા મોડેલ જુઓ", "डेटा मॉडल देखें", "Inspeccionar Modelo de Datos", "Inspecter le Modèle de Données", "Datenmodell prüfen", "Inspect Data Model"),
      estimatedEffort: t("1 કલાક", "1 घंटा", "1 hora", "1 heure", "1 Std.", "1 hour")
    },
    {
      id: "action-3",
      priority: "Medium",
      title: t("પ્રોસેસ ઇન્ટેલિજન્સ અને BPMN નિયમોનું ઓડિટ કરો", "प्रोसेस इंटेलिजेंस और BPMN निर्णय नियमों का ऑडिट करें", "Auditar Inteligencia de Procesos y Reglas BPMN", "Auditer l'Intelligence des Processus & Règles BPMN", "Prozess-Intelligenz & BPMN-Entscheidungsregeln prüfen", "Audit Process Intelligence & BPMN Decision Rules"),
      description: t(
        "AI ભલામણો માટે માનવ દેખરેખની શરતો કન્ફર્મ કરો.",
        "AI अनुशंसाओं के लिए मानव नियंत्रण शर्तों की पुष्टि करें।",
        "Confirmar condiciones de control humano para recomendaciones de IA.",
        "Confirmer les conditions de secours avec contrôle humain pour l'IA.",
        "Bedingungen für menschliche Kontrolle bei KI-Empfehlungen bestätigen.",
        "Confirm human-in-the-loop fallback conditions for AI recommendation gates."
      ),
      ownerRole: t("ઓપરેશન્સ મેનેજર", "संचालन प्रबंधक", "Gerente de Operaciones", "Responsable des Opérations", "Betriebsleiter", "Operations Manager"),
      targetTab: "process",
      ctaText: t("પ્રોસેસ ફ્લો જુઓ", "प्रक्रिया प्रवाह देखें", "Ver Flujo de Procesos", "Voir le Flux de Processus", "Prozessablauf ansehen", "View Process Flow"),
      estimatedEffort: t("45 મિનિટ", "45 मिनट", "45 mins", "45 min", "45 Min.", "45 mins")
    },
    {
      id: "action-4",
      priority: "Medium",
      title: t("સ્પ્રિન્ટ બજેટ અને ટીમ ફાળવણી મંજૂર કરો", "स्प्रिंट बजट और टीम आवंटन को मंजूरी दें", "Aprobar Presupuesto de Sprint y Asignación de Equipo", "Approuver le Budget de Sprint & l'Allocation d'Équipe", "Sprint-Budget & Teamzuweisung freigeben", "Approve Sprint Budget & Team Allocation"),
      description: t(
        "સ્પ્રિન્ટ 1 શરૂ કરવાની મંજૂરી આપો અને ડેવલપમેન્ટ રોલ્સ સોંપો.",
        "स्प्रिंट 1 शुरू करने के लिए अधिकृत करें और भूमिकाएं सौंपें।",
        "Autorizar el inicio del Sprint 1 y asignar los roles de desarrollo.",
        "Autoriser le lancement du Sprint 1 et attribuer les rôles de développement.",
        "Start von Sprint 1 autorisieren und Entwicklungsrollen zuweisen.",
        "Authorize Sprint 1 milestone kickoff and assign development roles."
      ),
      ownerRole: t("એક્ઝિક્યુટિવ સ્પોન્સર", "कार्यकारी प्रायोजक", "Patrocinador Ejecutivo", "Sponsor Exécutif", "Executive Sponsor", "Executive Sponsor"),
      targetTab: "roadmap",
      ctaText: t("સ્પ્રિન્ટ પ્લાન જુઓ", "स्प्रिंट योजना देखें", "Revisar Plan de Sprint", "Examiner le Plan de Sprint", "Sprint-Plan prüfen", "Review Sprint Plan"),
      estimatedEffort: t("15 મિનિટ", "15 मिनट", "15 mins", "15 min", "15 Min.", "15 mins")
    }
  ]

  // 12. Project Health Dimensions
  const health: ProjectHealthDimension[] = [
    {
      dimension: t("સ્કોપ (Scope)", "स्कोप (Scope)", "Alcance (Scope)", "Périmètre (Scope)", "Umfang (Scope)", "Scope"),
      status: "Healthy",
      score: 95,
      summary: t(
        "કાર્યકારી જરૂરિયાતો, સ્ક્રીન અને ડેટાબેઝ મોડેલ્સ સ્પષ્ટ રીતે નિર્ધારિત.",
        "कार्यात्मक आवश्यकताएं, स्क्रीन और डेटाबेस मॉडल स्पष्ट रूप से परिभाषित।",
        "Requisitos funcionales, pantallas y modelos de base de datos claramente delimitados.",
        "Exigences fonctionnelles, écrans et modèles de données clairement délimités.",
        "Funktionale Anforderungen, Bildschirme und Datenbankmodelle klar abgegrenzt.",
        "Functional requirements, screens, and database models clearly bounded."
      ),
      flagsCount: 0
    },
    {
      dimension: t("સમયમર્યાદા (Timeline)", "समय सीमा (Timeline)", "Plazo (Timeline)", "Calendrier (Timeline)", "Zeitplan (Timeline)", "Timeline"),
      status: "Healthy",
      score: 90,
      summary: t(
        "6 અઠવાડિયાના લક્ષ્યમાં 4 સ્પ્રિન્ટ્સ સફળતાપૂર્વક પ્લાન થયા.",
        "6-सप्ताह के लक्ष्य के भीतर 4 स्प्रिंट सफलतापूर्वक मैप किए गए।",
        "4 sprints mapeados dentro del objetivo de entrega de 6 semanas.",
        "4 sprints planifiés dans la fenêtre cible de livraison de 6 semaines.",
        "4 Sprints innerhalb des 6-Wochen-Lieferziels erfolgreich geplant.",
        "4 sprints mapped within the 6-week target delivery window."
      ),
      flagsCount: 0
    },
    {
      dimension: t("બજેટ (Budget)", "बजट (Budget)", "Presupuesto (Budget)", "Budget", "Budget", "Budget"),
      status: "Healthy",
      score: 92,
      summary: t(
        "નાણાકીય અંદાજો ટીમ કલાકો અને બજાર દરો સાથે સુસંગત.",
        "वित्तीय अनुमान टीम घंटों और बाजार दरों के साथ संरेखित।",
        "Estimaciones financieras alineadas con horas de recursos y tarifas del mercado.",
        "Estimations financières alignées sur les heures d'équipe et les tarifs du marché.",
        "Finanzielle Schätzungen an Ressourcenstunden und Marktpreisen ausgerichtet.",
        "Financial estimates aligned with resource hours and market rates."
      ),
      flagsCount: 0
    },
    {
      dimension: t("તકનીકી તૈયારી (Tech Readiness)", "तकनीकी तत्परता (Tech Readiness)", "Preparación Técnica", "Maturité Technique", "Technische Bereitschaft", "Technical Readiness"),
      status: "Healthy",
      score: 88,
      summary: t(
        "Next.js, PostgreSQL અને Gemini AI સાથે સંપૂર્ણ ટેક સ્ટેક નિર્ધારિત.",
        "Next.js, PostgreSQL और Gemini AI के साथ पूरा स्टैक तैयार।",
        "Pila tecnológica completa especificada con Next.js, PostgreSQL y LLM Gemini.",
        "Stack technologique complet spécifié avec Next.js, PostgreSQL et le LLM Gemini.",
        "Vollständiger Tech-Stack mit Next.js, PostgreSQL und Gemini LLM definiert.",
        "Complete tech stack specified with Next.js, PostgreSQL, and Gemini LLM."
      ),
      flagsCount: 0
    },
    {
      dimension: t("બિઝનેસ ગોઠવણી (Business Alignment)", "बिजनेस अलाइनमेंट", "Alineación de Negocio", "Alignement Métier", "Business-Alignment", "Business Alignment"),
      status: "Healthy",
      score: 94,
      summary: t(
        "મુખ્ય ઉદ્દેશો સીધા ROI અને કાર્યક્ષમતા સાથે જોડાયેલા છે.",
        "मूल्य चालक सीधे कार्यकारी ROI और दक्षता बेंचमार्क से जुड़े हैं।",
        "Los impulsores de valor se asignan directamente al ROI y puntos de referencia.",
        "Les leviers de valeur s'alignent directement sur le ROI et l'efficacité opérationnelle.",
        "Werttreiber sind direkt mit ROI und Effizienz-Benchmarks verknüpft.",
        "Value drivers directly map to executive ROI and efficiency benchmarks."
      ),
      flagsCount: 0
    },
    {
      dimension: t("AI સુરક્ષા અને નીતિમત્તા", "AI सुरक्षा और नैतिकता", "Seguridad y Ética de IA", "Sécurité & Éthique de l'IA", "KI-Sicherheit & Ethik", "AI Safety & Ethics"),
      status: "Attention Required",
      score: 84,
      summary: t(
        "સ્પ્રિન્ટ 3 માં સુરક્ષા મર્યાદાઓ અને માનવ દેખરેખ ચકાસવી પડશે.",
        "स्प्रिंट 3 में सुरक्षा रेलिंग और मानव नियंत्रण की पुष्टि करनी होगी।",
        "Las directrices de seguridad y controles manuales deben validarse en el Sprint 3.",
        "Les garde-fous et contrôles humains doivent être validés au Sprint 3.",
        "Sicherheitsleitplanken und manuelle Kontrollen müssen in Sprint 3 validiert werden.",
        "Guardrails and human-in-the-loop overrides must be validated in Sprint 3."
      ),
      flagsCount: 1
    }
  ]

  return {
    projectId,
    projectTitle,
    industry:
      data?.industry ||
      t(
        "એન્ટરપ્રાઇઝ SaaS / બિઝનેસ ઓપરેશન્સ",
        "एंटरप्राइज SaaS / बिजनेस ऑपरेशंस",
        "SaaS Empresarial / Operaciones Comerciales",
        "SaaS d'Entreprise / Opérations Métier",
        "Enterprise SaaS / Geschäftsbetrieb",
        "Enterprise SaaS / Business Operations"
      ),
    targetAudience:
      data?.target_audience ||
      t(
        "એક્ઝિક્યુટિવ સ્ટેકહોલ્ડર્સ અને ઓપરેશન્સ ટીમ",
        "कार्यकारी हितधारक और संचालन टीम",
        "Partes Interesadas Ejecutivas y Equipos de Operaciones",
        "Parties Prenantes Exécutives et Équipes Opérationnelles",
        "Führungskräfte & Betriebsteams",
        "Executive Stakeholders & Operations Teams"
      ),
    lastUpdated,
    overallTransformationProgress: overallProgress,
    status: data?.status || t("તૈયાર", "तैयार", "Borrador", "Brouillon", "Entwurf", "Draft"),
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
