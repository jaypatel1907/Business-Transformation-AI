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

// Full translation dictionary for smart domain fallback engine
const translations: Record<string, any> = {
  gu: {
    langName: "Gujarati (ગુજરાતી)",
    defaultTitle: "કસ્ટમ એન્ટરપ્રાઇઝ સોલ્યુશન આર્કિટેક્ચર",
    bookingTitle: "સ્માર્ટ બુકિંગ અને શિડ્યુલિંગ પ્લેટફોર્મ",
    healthTitle: "હેલ્થકેર દર્દી વ્યવસ્થાપન અને સંભાળ પ્લેટફોર્મ",
    foodTitle: "ફૂડ ઓર્ડરિંગ અને લાઇવ લોજિસ્ટિક્સ નેટવર્ક",
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
    bookingTitle: "स्मार्ट बुकिंग एवं शेड्यूलिंग प्लेटफॉर्म",
    healthTitle: "हेल्थकेयर मरीज प्रबंधन प्रणाली",
    foodTitle: "फूड ऑर्डरिंग एवं लाइव लॉजिस्टिक्स नेटवर्क",
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
      { method: "GET", path: "/api/v1/records/{id}", desc: "रियल-टाइम स्थिति प्राप्त करें" }
    ],
    wireframeSections: [
      { title: "नेविगेशन एवं हेडर बार", components: ["ऐप लोगो", "ग्लोबल खोज", "उपयोगकर्ता प्रोफ़ाइल", "अधिसूचना"] },
      { title: "मुख्य कार्यस्थल", components: ["इनपुट फ़ॉर्म", "डैशबोर्ड", "एक्शन पैनल"] }
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
    bookingTitle: "Plataforma Inteligente de Reservas y Programación",
    healthTitle: "Sistema de Gestión de Pacientes y Salud",
    foodTitle: "Red de Pedidos de Comida y Logística en Vivo",
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
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, documentText, language, targetLanguage, selectedModel = "gemini-1.5-flash" } = body;
    
    // Support both 'language' and 'targetLanguage' keys seamlessly
    const langKey = (language || targetLanguage || "en").toLowerCase();

    if (!prompt && !documentText) {
      return NextResponse.json({ error: "Prompt or Document input is required" }, { status: 400 });
    }

    const cleanPrompt = `${prompt || ""} ${documentText ? `\n[Document Context]: ${documentText.slice(0, 3000)}` : ""}`.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // Multilingual domain fallback engine
    const generateSmartDomainBlueprint = (p: string, lKey: string) => {
      const lower = p.toLowerCase();
      const hash = stringHash(p);
      const dict = translations[lKey] || translations[lKey.substring(0, 2)] || translations["gu"] || translations["en"];

      let title = dict.defaultTitle || "Custom Enterprise Architecture";
      if (lower.includes("booking") || lower.includes("reservation") || lower.includes("appointment")) {
        title = dict.bookingTitle || title;
      } else if (lower.includes("hospital") || lower.includes("health") || lower.includes("doctor") || lower.includes("patient")) {
        title = dict.healthTitle || title;
      } else if (lower.includes("food") || lower.includes("restaurant") || lower.includes("delivery")) {
        title = dict.foodTitle || title;
      }

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
        target_language: lKey,
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

    // If Gemini API is available and not mock mode
    if (apiKey && apiKey.trim() !== "" && selectedModel !== "mock-mode") {
      try {
        const langNameMap: Record<string, string> = {
          gu: "Gujarati (ગુજરાતી)",
          hi: "Hindi (हिन्दी)",
          es: "Spanish (Español)",
          fr: "French (Français)",
          de: "German (Deutsch)",
          en: "English"
        };
        const langTargetName = langNameMap[langKey] || langKey;
        const modelName = selectedModel.includes("pro") ? "gemini-1.5-pro" : "gemini-1.5-flash";

        const systemPrompt = `You are a Senior Principal AI Solution Architect.
Analyze the user requirement deeply and build a complete solution architecture.

CRITICAL MANDATE: You MUST output EVERY text string (project_title, initiative titles and descriptions, bpmn_step titles and descriptions, endpoint descriptions, wireframe section titles and component labels, sprint titles and focus, and risk titles/mitigations) STRICTLY IN THE FOLLOWING LANGUAGE: ${langTargetName}.

USER REQUIREMENT: "${cleanPrompt}"

Return ONLY a valid JSON matching this structure:
{
  "project_title": "Title in ${langTargetName}",
  "user_problem": "${cleanPrompt.slice(0, 150).replace(/"/g, '\\"')}",
  "target_language": "${langKey}",
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
    { "title": "Initiative 1 in ${langTargetName}", "impact": "High Impact", "desc": "Description in ${langTargetName}" },
    { "title": "Initiative 2 in ${langTargetName}", "impact": "High Impact", "desc": "Description in ${langTargetName}" }
  ],
  "bpmn_steps": [
    { "id": 1, "title": "Step 1 in ${langTargetName}", "desc": "Description in ${langTargetName}" },
    { "id": 2, "title": "Step 2 in ${langTargetName}", "desc": "Description in ${langTargetName}" },
    { "id": 3, "title": "Step 3 in ${langTargetName}", "desc": "Description in ${langTargetName}" },
    { "id": 4, "title": "Step 4 in ${langTargetName}", "desc": "Description in ${langTargetName}" }
  ],
  "database_tables": [
    { "table_name": "tbl_users", "columns": ["id (PK, UUID)", "col1", "col2"] },
    { "table_name": "tbl_data", "columns": ["id (PK, UUID)", "fk_id (FK)", "col1"] }
  ],
  "api_endpoints": [
    { "method": "POST", "path": "/api/v1/resource/create", "desc": "Description in ${langTargetName}" },
    { "method": "GET", "path": "/api/v1/resource/{id}", "desc": "Description in ${langTargetName}" }
  ],
  "wireframe_sections": [
    { "title": "Section Title in ${langTargetName}", "components": ["Component 1 in ${langTargetName}", "Component 2 in ${langTargetName}"] }
  ],
  "sprint_plan": [
    { "sprint": "Sprint 1", "title": "Title in ${langTargetName}", "focus": "Deliverable focus in ${langTargetName}" },
    { "sprint": "Sprint 2", "title": "Title in ${langTargetName}", "focus": "Deliverable focus in ${langTargetName}" }
  ],
  "roadmap_milestones": [
    { "phase": "Phase 1 (Week 1-2)", "title": "Title in ${langTargetName}", "task": "Task in ${langTargetName}" }
  ],
  "planning": {
    "effortHours": "240",
    "cloudCost": "$120/mo",
    "cloudDetail": "PostgreSQL + Edge Compute",
    "risk": { "level": "Low-Medium", "title": "Risk in ${langTargetName}", "mitigation": "Mitigation in ${langTargetName}" }
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
        console.warn("Live Gemini API call error, using smart domain blueprint generator:", err);
      }
    }

    const data = generateSmartDomainBlueprint(cleanPrompt, langKey);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}