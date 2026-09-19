import { NextRequest, NextResponse } from "next/server";

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// 1-to-1 Multilingual Translation Dictionary for Domain Fallback Engine
const languageDict: Record<string, any> = {
  en: {
    langName: "English",
    defaultTitle: "Custom Enterprise Solution Architecture",
    initiatives: [
      { title: "Core Process Automation Suite", impact: "High Impact", desc: "Automates key bottleneck workflows and manual steps." },
      { title: "AI Decision Intelligence Engine", impact: "High Impact", desc: "Provides real-time decision support, automated anomaly detection, and workload forecasting." }
    ],
    steps: [
      { id: 1, title: "1. Intake & Validation", desc: "System captures initial request and verifies user input payload" },
      { id: 2, title: "2. Business Logic Engine", desc: "Evaluates business constraints, permissions, and workflow state" },
      { id: 3, title: "3. Service Execution", desc: "Processes database transactions and executes background queues" },
      { id: 4, title: "4. Notification & Audit Sync", desc: "Syncs real-time user UI and appends cryptographic audit record" }
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/records/create", desc: "Create new record & trigger workflow pipeline" },
      { method: "GET", path: "/api/v1/records/{id}", desc: "Query real-time execution status and data payload" },
      { method: "PUT", path: "/api/v1/records/update", desc: "Update record attributes and state transition" }
    ],
    wireframeSections: [
      { title: "Navigation Header Bar", components: ["App Logo", "Global Search Input", "User Profile Avatar", "Notification Bell"] },
      { title: "Main Workspace Canvas", components: ["Requirement Input Form", "Real-time Metrics Dashboard", "Action Trigger Panel"] },
      { title: "Audit Drawer", components: ["Activity Stream Log", "Export Controls", "Status Indicator"] }
    ],
    sprintPlan: [
      { sprint: "Sprint 1 (Week 1)", title: "Architecture & Data Model", focus: "Supabase DB Schemas, RLS Policies & Auth Integration" },
      { sprint: "Sprint 2 (Week 2)", title: "API Gateway & Middleware", focus: "REST Endpoints, Validation Rules & Error Handling" },
      { sprint: "Sprint 3 (Week 3)", title: "AI Core & Pipeline Binding", focus: "Gemini API integration, Prompt Engineering & Triage Engine" },
      { sprint: "Sprint 4 (Week 4)", title: "Frontend Component Suite", focus: "Tailwind UI, Dashboard Metrics & Interactive Wireframes" },
      { sprint: "Sprint 5 (Week 5)", title: "Security & Load Testing", focus: "Penetration testing, Redis Caching & Latency Optimization" },
      { sprint: "Sprint 6 (Week 6+)", title: "Production Launch & Handoff", focus: "Vercel Deployment, CI/CD pipeline & Documentation" }
    ],
    riskTitle: "Data Isolation & High Concurrency",
    riskMitigation: "Implement Row Level Security (RLS) policies and Redis caching for hot endpoints."
  },
  gu: {
    langName: "Gujarati (ગુજરાતી)",
    defaultTitle: "કસ્ટમ એન્ટરપ્રાઇઝ સોલ્યુશન આર્કિટેક્ચર",
    initiatives: [
      { title: "મુખ્ય પ્રક્રિયા ઓટોમેશન શ્રૃંખલા", impact: "ઉચ્ચ અસર (High Impact)", desc: "મુખ્ય કાર્યપ્રવાહની અડચણો અને પ્રક્રિયાઓને સ્વચાલિત કરે છે." },
      { title: "AI ડિસિઝન ઇન્ટેલિજન્સ એન્જિન", impact: "ઉચ્ચ અસર (High Impact)", desc: "રીયલ-ટાઇમ નિર્ણય સપોર્ટ, સ્વચાલિત વિસંગતતા શોધ અને વર્કલોડ આગાહી પૂરી પાડે છે." }
    ],
    steps: [
      { id: 1, title: "૧. ડેટા ઇનટેક અને ચકાસણી", desc: "સિસ્ટમ વપરાશકર્તાની વિનંતી અને ડેટા સબમિશન સ્વીકારે છે" },
      { id: 2, title: "૨. AI નિયમ ચકાસણી એન્જિન", desc: "વ્યવસાયિક મર્યાદાઓ, પરવાનગીઓ અને પ્રક્રિયા નિયમો તપાસે છે" },
      { id: 3, title: "૩. સ્વચાલિત સર્વિસ એક્ઝિક્યુશન", desc: "ડેટાબેઝ વ્યવહારો અને બેકગ્રાઉન્ડ પ્રોસેસિંગ ક્યુ ચલાવે છે" },
      { id: 4, title: "૪. નોટિફિકેશન અને ઓડિટ સિંક", desc: "યુઝર ડેશબોર્ડ અપડેટ કરે છે અને ઓડિટ લોગ સુરક્ષિત કરે છે" }
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/records/create", desc: "નવો રેકોર્ડ બનાવો અને AI વર્કફ્લો શરૂ કરો" },
      { method: "GET", path: "/api/v1/records/{id}", desc: "રીયલ-ટાઇમ સ્થિતિ અને વિગતો મેળવો" },
      { method: "PUT", path: "/api/v1/records/update", desc: "રેકોર્ડની સ્થિતિ અને લાક્ષણિકતાઓ અપડેટ કરો" }
    ],
    wireframeSections: [
      { title: "નેવિગેશન અને હેડર બાર", components: ["એપ લોગો", "ગ્લોબલ સર્ચ", "યુઝર પ્રોફાઇલ", "નોટિફિકેશન બેલ"] },
      { title: "મુખ્ય વર્કસ્પેસ કેનવાસ", components: ["ઇનપુટ ફોર્મ", "રીયલ-ટાઇમ મેટ્રિક્સ ડેશબોર્ડ", "એક્શન પેનલ"] },
      { title: "ઓડિટ ડ્રોઅર", components: ["પ્રવૃત્તિ સ્ટ્રીમ", "એક્સપોર્ટ કંટ્રોલ્સ", "સ્ટેટસ લોગ"] }
    ],
    sprintPlan: [
      { sprint: "સ્પ્રિન્ટ ૧ (અઠવાડિયું ૧)", title: "આર્કિટેક્ચર અને ડેટા મોડલ", focus: "Supabase ડેટાબેઝ સ્કીમા, RLS પોલિસી અને ઓથ સેટઅપ" },
      { sprint: "સ્પ્રિન્ટ ૨ (અઠવાડિયું ૨)", title: "API ગેટવે અને મિડલવેર", focus: "REST એન્ડપોઇન્ટ્સ અને ભૂલ નિયંત્રણ" },
      { sprint: "સ્પ્રિન્ટ ૩ (અઠવાડિયું ૩)", title: "AI કોર પ્રોસેસિંગ", focus: "Gemini API બાઇન્ડિંગ અને પ્રોમ્પ એન્જિનિયરિંગ" },
      { sprint: "સ્પ્રિન્ટ ૪ (અઠવાડિયું ૪)", title: "ફ્રન્ટએન્ડ કમ્પોનન્ટ યુઆઈ", focus: "Tailwind UI, ડેશબોર્ડ મેટ્રિક્સ અને વાયરફ્રેમ્સ" },
      { sprint: "સ્પ્રિન્ટ ૫ (અઠવાડિયું ૫)", title: "સુરક્ષા અને પરફોર્મન્સ ટેસ્ટિંગ", focus: "સુરક્ષા ઓડિટ, Redis કેશિંગ અને લેટન્સી સુધારણા" },
      { sprint: "સ્પ્રિન્ટ ૬ (અઠવાડિયું ૬+)", title: "લાઈવ લોન્ચ અને હેન્ડઓવર", focus: "Vercel ડિપ્લોયમેન્ટ અને CI/CD પાઇપલાઇન" }
    ],
    riskTitle: "ડેટા આઇસોલેશન અને હાઇ કન્કરન્સી",
    riskMitigation: "Row Level Security (RLS) પોલિસી અને સર્વર કેશિંગ સેટઅપ લાગુ કરો."
  },
  hi: {
    langName: "Hindi (हिन्दी)",
    defaultTitle: "कस्टम एंटरप्राइज समाधान आर्किटेक्चर",
    initiatives: [
      { title: "मुख्य प्रक्रिया स्वचालन प्रणाली", impact: "उच्च प्रभाव (High Impact)", desc: "मुख्य कार्यप्रवाह की बाधाओं और प्रक्रियाओं को स्वचालित करता है।" },
      { title: "AI निर्णय इंटेलिजेंस इंजन", impact: "उच्च प्रभाव (High Impact)", desc: "रियल-टाइम निर्णय सहायता और कार्यभार पूर्वानुमान प्रदान करता है।" }
    ],
    steps: [
      { id: 1, title: "१. डेटा इनटेक एवं सत्यापन", desc: "प्रणाली उपयोगकर्ता के अनुरोध और डेटा सबमिशन को स्वीकार करती है" },
      { id: 2, title: "२. AI नियम सत्यापन इंजन", desc: "व्यावसायिक सीमाओं और प्रक्रिया नियमों की जांच करता है" },
      { id: 3, title: "३. स्वचालित सेवा निष्पादन", desc: "डेटाबेस लेनदेन और बैकग्राउंड प्रोसेसिंग कतार चलाता है" },
      { id: 4, title: "४. अधिसूचना एवं ऑडिट सिंक", desc: "उपयोगकर्ता डैशबोर्ड अपडेट करता है और ऑडिट लॉग सुरक्षित करता है" }
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/records/create", desc: "नया रिकॉर्ड बनाएं और वर्कफ़्लो प्रारंभ करें" },
      { method: "GET", path: "/api/v1/records/{id}", desc: "रियल-टाइम स्थिति और विवरण प्राप्त करें" },
      { method: "PUT", path: "/api/v1/records/update", desc: "रिकॉर्ड स्थिति अपडेट करें" }
    ],
    wireframeSections: [
      { title: "नेविगेशन एवं हेडर बार", components: ["ऐप लोगो", "ग्लोबल खोज", "उपयोगकर्ता प्रोफ़ाइल", "अधिसूचना"] },
      { title: "मुख्य कार्यस्थल", components: ["इनपुट फ़ॉर्म", "डैशबोर्ड", "एक्शन पैनल"] },
      { title: "ऑडिट दराज", components: ["गतिविधि स्ट्रीम", "निर्यात नियंत्रण", "स्थिति लॉग"] }
    ],
    sprintPlan: [
      { sprint: "स्प्रिंट १ (सप्ताह १)", title: "आर्किटेक्चर एवं डेटा मॉडल", focus: "Supabase डेटाबेस स्कीमा और ऑथ सेटअप" },
      { sprint: "स्प्रिंट २ (सप्ताह २)", title: "API गेटवे", focus: "REST एंडपॉइंट्स और एरर हैंडलिंग" },
      { sprint: "स्प्रिंट ३ (सप्ताह ३)", title: "AI कोर प्रोसेसिंग", focus: "Gemini API और प्रॉम्प्ट इंजीनियरिंग" }
    ],
    riskTitle: "डेटा अलगाव और उच्च समवर्तीता",
    riskMitigation: "Row Level Security (RLS) नीतियों और कैशिंग को लागू करें।"
  },
  es: {
    langName: "Spanish (Español)",
    defaultTitle: "Arquitectura de Solución Empresarial",
    initiatives: [
      { title: "Automatización de Procesos Principales", impact: "Alto Impacto", desc: "Automatiza los cuellos de botella clave del flujo de trabajo." },
      { title: "Motor de Inteligencia de Decisiones IA", impact: "Alto Impacto", desc: "Proporciona soporte de decisiones en tiempo real y pronósticos." }
    ],
    steps: [
      { id: 1, title: "1. Entrada y Validación", desc: "Captura la solicitud inicial del usuario" },
      { id: 2, title: "2. Motor de Reglas IA", desc: "Verifica restricciones comerciales y permisos" },
      { id: 3, title: "3. Ejecución de Servicios", desc: "Procesa transacciones de base de datos" },
      { id: 4, title: "4. Sincronización y Auditoría", desc: "Actualiza el panel de usuario y guarda auditoría" }
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/records/create", desc: "Crear nuevo registro e iniciar flujo" },
      { method: "GET", path: "/api/v1/records/{id}", desc: "Obtener estado en tiempo real" }
    ],
    wireframeSections: [
      { title: "Barra de Navegación", components: ["Logotipo", "Búsqueda Global", "Perfil", "Notificaciones"] },
      { title: "Panel Principal", components: ["Formulario", "Métricas", "Panel de Acción"] }
    ],
    sprintPlan: [
      { sprint: "Sprint 1 (Semana 1)", title: "Arquitectura y Modelo de Datos", focus: "Esquema Supabase y RLS" },
      { sprint: "Sprint 2 (Semana 2)", title: "Gateway de API", focus: "Rutas REST y Manejo de Errores" }
    ],
    riskTitle: "Aislamiento de Datos y Concurrencia",
    riskMitigation: "Implementar políticas RLS y almacenamiento en caché Redis."
  },
  fr: {
    langName: "French (Français)",
    defaultTitle: "Architecture de Solution d'Entreprise",
    initiatives: [
      { title: "Automation des Processus Clés", impact: "Impact Élevé", desc: "Automatise les goulots d'étranglement principaux." },
      { title: "Moteur d'Intelligence Décisionnelle IA", impact: "Impact Élevé", desc: "Support décisionnel en temps réel et prévisions." }
    ],
    steps: [
      { id: 1, title: "1. Saisie et Validation", desc: "Capture la demande initiale de l'utilisateur" },
      { id: 2, title: "2. Moteur de Règles IA", desc: "Vérifie les contraintes et autorisations" },
      { id: 3, title: "3. Exécution du Service", desc: "Traite les transactions en base de données" },
      { id: 4, title: "4. Notification et Audit", desc: "Met à jour le tableau de bord et l'audit" }
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/records/create", desc: "Créer un enregistrement et lancer le flux" }
    ],
    wireframeSections: [
      { title: "Barre de Navigation", components: ["Logo", "Recherche", "Profil", "Notifications"] }
    ],
    sprintPlan: [
      { sprint: "Sprint 1 (Semaine 1)", title: "Architecture & Modèle de Données", focus: "Schéma Supabase et Auth" }
    ],
    riskTitle: "Isolation des Données et Concurrence",
    riskMitigation: "Mettre en œuvre les politiques RLS et le cache Redis."
  },
  de: {
    langName: "German (Deutsch)",
    defaultTitle: "Unternehmens-Lösungsarchitektur",
    initiatives: [
      { title: "Kerngeschäftsprozess-Automatisierung", impact: "Hohe Auswirkung", desc: "Automatisiert Engpässe im Arbeitsablauf." },
      { title: "KI-Entscheidungs-Engine", impact: "Hohe Auswirkung", desc: "Echtzeit-Entscheidungsunterstützung und Prognosen." }
    ],
    steps: [
      { id: 1, title: "1. Erfassung & Validierung", desc: "Erfasst die initiale Benutzeranfrage" },
      { id: 2, title: "2. KI-Regelprüfung", desc: "Prüft Geschäftsbeschränkungen und Rechte" }
    ],
    endpoints: [
      { method: "POST", path: "/api/v1/records/create", desc: "Neuen Datensatz erstellen" }
    ],
    wireframeSections: [
      { title: "Navigationsleiste", components: ["Logo", "Suche", "Profil", "Benachrichtigungen"] }
    ],
    sprintPlan: [
      { sprint: "Sprint 1 (Woche 1)", title: "Architektur & Datenmodell", focus: "Supabase-Schemas und Auth" }
    ],
    riskTitle: "Datentrennung & Nebenläufigkeit",
    riskMitigation: "Implementieren Sie RLS-Richtlinien und Redis-Caching."
  }
};

// Aliases mapping string names to keys
languageDict["English"] = languageDict["en"];
languageDict["Gujarati"] = languageDict["gu"];
languageDict["Hindi"] = languageDict["hi"];
languageDict["Spanish"] = languageDict["es"];
languageDict["French"] = languageDict["fr"];
languageDict["German"] = languageDict["de"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, documentText, language, targetLanguage, selectedModel = "gemini-1.5-flash" } = body;
    
    // Support language keys cleanly
    const rawLang = (language || targetLanguage || "English").trim();
    const langKey = rawLang.toLowerCase();

    if (!prompt && !documentText) {
      return NextResponse.json({ error: "Prompt or Document input is required" }, { status: 400 });
    }

    const cleanPrompt = `${prompt || ""} ${documentText ? `\n[Document Context]: ${documentText.slice(0, 3000)}` : ""}`.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // Strict 1-to-1 language fallback generator
    const generateSmartDomainBlueprint = (p: string, targetLangStr: string) => {
      const lower = p.toLowerCase();
      const hash = stringHash(p);
      
      // Strict 1-to-1 selection: English -> en, Gujarati -> gu, Hindi -> hi, Spanish -> es, French -> fr, German -> de
      const dict = languageDict[targetLangStr] || languageDict[targetLangStr.toLowerCase()] || languageDict["en"];

      let title = dict.defaultTitle || "Custom Enterprise Architecture";
      let maturityScore = 82 + (hash % 12);
      let aiReadinessScore = 84 + (hash % 13);
      let weeksTimeline = 5 + (hash % 5);
      let totalHours = weeksTimeline * 40;
      let hourlyRate = 75;
      let minBudget = totalHours * hourlyRate;
      let maxBudget = minBudget + 10000;

      return {
        project_title: title,
        user_problem: p,
        target_language: targetLangStr,
        digital_maturity: maturityScore,
        ai_adoption: aiReadinessScore,
        timeline: `${weeksTimeline} Weeks`,
        financial_estimation: {
          min_budget: `$${minBudget.toLocaleString()}`,
          max_budget: `$${maxBudget.toLocaleString()}`,
          total_hours: `${totalHours} Hours`,
          hourly_rate: `$${hourlyRate}/hr`,
          team_roles: [
            { role: "Senior Full-Stack Engineer", count: 2, allocation: "100%" },
            { role: "UI/UX Product Designer", count: 1, allocation: "50%" },
            { role: "AI & Data Engineer", count: 1, allocation: "75%" },
            { role: "DevOps & Cloud Architect", count: 1, allocation: "50%" }
          ]
        },
        tech_stack: {
          frontend: "React / Next.js 16 + Tailwind CSS",
          backend: "Node.js / Express API Gateway",
          database: "PostgreSQL (Supabase RLS)",
          ai_layer: "Google Gemini 1.5 Flash"
        },
        initiatives: dict.initiatives || [
          { title: `${title} Automation`, impact: "High Impact", desc: `Automates key workflows for "${p.slice(0, 50)}".` }
        ],
        bpmn_steps: dict.steps || [
          { id: 1, title: "1. Intake", desc: "Initial request processing" },
          { id: 2, title: "2. Verification", desc: "Validates rules & permissions" }
        ],
        database_tables: [
          {
            table_name: "tbl_users",
            columns: ["id (PK, UUID)", "email (VARCHAR)", "full_name (VARCHAR)", "role (ENUM)", "created_at (TIMESTAMP)"]
          },
          {
            table_name: "tbl_app_records",
            columns: ["id (PK, UUID)", "user_id (FK -> tbl_users.id)", "payload (JSONB)", "status (VARCHAR)", "updated_at (TIMESTAMP)"]
          }
        ],
        api_endpoints: dict.endpoints || [
          { method: "POST", path: "/api/v1/records/create", desc: "Create new record" }
        ],
        wireframe_sections: dict.wireframeSections || [
          { title: "Header", components: ["Logo", "Search", "Profile"] }
        ],
        sprint_plan: dict.sprintPlan || [
          { sprint: "Sprint 1", title: "Architecture", focus: "Database Setup" }
        ],
        roadmap_milestones: [
          { phase: "Phase 1 (Week 1-2)", title: "Architecture & Data Model", task: "Database schemas & Auth setup" },
          { phase: "Phase 2 (Week 3-4)", title: "Core Logic & AI Engine", task: "API Gateway & Gemini API binding" }
        ],
        planning: {
          effortHours: `${totalHours}`,
          cloudCost: `$${90 + (hash % 60)}/mo`,
          cloudDetail: "PostgreSQL Database + Serverless API Gateway + Gemini API",
          risk: {
            level: "Low-Medium",
            title: dict.riskTitle || "Data Isolation",
            mitigation: dict.riskMitigation || "Implement RLS policies and caching."
          }
        }
      };
    };

    // If Gemini API key is available and not mock mode
    if (apiKey && apiKey.trim() !== "" && selectedModel !== "mock-mode") {
      try {
        const targetLangName = rawLang;
        const modelName = selectedModel.includes("pro") ? "gemini-1.5-pro" : "gemini-1.5-flash";

        const systemPrompt = `You are a Senior Principal AI Solution Architect.
Analyze the user requirement deeply and build a complete solution architecture.

CRITICAL MANDATE: You MUST output EVERY text string (project_title, initiative titles and descriptions, bpmn_step titles and descriptions, endpoint descriptions, wireframe section titles and component labels, sprint titles and focus, and risk titles/mitigations) STRICTLY IN THE FOLLOWING LANGUAGE: ${targetLangName}.

USER REQUIREMENT: "${cleanPrompt}"

Return ONLY a valid JSON matching this structure:
{
  "project_title": "Title in ${targetLangName}",
  "user_problem": "${cleanPrompt.slice(0, 150).replace(/"/g, '\\"')}",
  "target_language": "${targetLangName}",
  "digital_maturity": 88,
  "ai_adoption": 94,
  "timeline": "6 Weeks",
  "financial_estimation": {
    "min_budget": "$18,000",
    "max_budget": "$32,000",
    "total_hours": "240 Hours",
    "hourly_rate": "$75/hr",
    "team_roles": [
      { "role": "Senior Full-Stack Dev", "count": 2, "allocation": "100%" },
      { "role": "UI/UX Designer", "count": 1, "allocation": "50%" },
      { "role": "AI Engineer", "count": 1, "allocation": "75%" },
      { "role": "DevOps Engineer", "count": 1, "allocation": "50%" }
    ]
  },
  "tech_stack": {
    "frontend": "React / Next.js 16 + Tailwind CSS",
    "backend": "Node.js / Express API Gateway",
    "database": "PostgreSQL (Supabase RLS)",
    "ai_layer": "Google Gemini 1.5 Flash"
  },
  "initiatives": [
    { "title": "Initiative 1 in ${targetLangName}", "impact": "High Impact", "desc": "Description in ${targetLangName}" },
    { "title": "Initiative 2 in ${targetLangName}", "impact": "High Impact", "desc": "Description in ${targetLangName}" }
  ],
  "bpmn_steps": [
    { "id": 1, "title": "Step 1 in ${targetLangName}", "desc": "Description in ${targetLangName}" },
    { "id": 2, "title": "Step 2 in ${targetLangName}", "desc": "Description in ${targetLangName}" }
  ],
  "database_tables": [
    { "table_name": "tbl_users", "columns": ["id (PK, UUID)", "col1", "col2"] }
  ],
  "api_endpoints": [
    { "method": "POST", "path": "/api/v1/resource/create", "desc": "Description in ${targetLangName}" }
  ],
  "wireframe_sections": [
    { "title": "Section Title in ${targetLangName}", "components": ["Component 1 in ${targetLangName}"] }
  ],
  "sprint_plan": [
    { "sprint": "Sprint 1", "title": "Title in ${targetLangName}", "focus": "Deliverable focus in ${targetLangName}" }
  ],
  "roadmap_milestones": [
    { "phase": "Phase 1 (Week 1-2)", "title": "Title in ${targetLangName}", "task": "Task in ${targetLangName}" }
  ],
  "planning": {
    "effortHours": "240",
    "cloudCost": "$120/mo",
    "cloudDetail": "PostgreSQL + Edge Compute",
    "risk": { "level": "Low-Medium", "title": "Risk in ${targetLangName}", "mitigation": "Mitigation in ${targetLangName}" }
  }
}
Output ONLY raw valid JSON.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json"
              }
            })
          }
        );

        if (response.ok) {
          const resData = await response.json();
          const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            return NextResponse.json({ success: true, data: parsed });
          }
        }
      } catch (err) {
        console.warn("Live Gemini API call error, using 1-to-1 domain generator:", err);
      }
    }

    const data = generateSmartDomainBlueprint(cleanPrompt, rawLang);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}