import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      documentText,
      language = "English",
      targetLanguage,
      role = "Manager",
      selectedModel = "gemini-1.5-flash",
    } = await req.json();

    const rawLang = targetLanguage || language || "English";
    const apiKey = process.env.GEMINI_API_KEY;

    let cleanPrompt = prompt ? prompt.trim() : "";
    if (documentText && documentText.trim().length > 0) {
      cleanPrompt += `\n\n[ATTACHED BUSINESS DOCUMENT / BRD]:\n${documentText.slice(0, 3000)}`;
    }

    if (!cleanPrompt) {
      cleanPrompt = "Build an enterprise AI solution architecture";
    }

    // Helper: Dynamic Domain-Aware Schema & API Generator
    const getDomainSpecificSchemaAndApis = (p: string) => {
      const lower = p.toLowerCase();

      // 1. E-Commerce & Retail
      if (
        lower.includes("shop") ||
        lower.includes("store") ||
        lower.includes("cart") ||
        lower.includes("product") ||
        lower.includes("ecommerce") ||
        lower.includes("e-commerce") ||
        lower.includes("retail") ||
        lower.includes("order") ||
        lower.includes("inventory")
      ) {
        return {
          tables: [
            {
              table_name: "tbl_products",
              columns: [
                "id (PK, UUID)",
                "title (VARCHAR)",
                "sku (UNIQUE VARCHAR)",
                "category_id (FK -> tbl_categories.id)",
                "price (NUMERIC)",
                "stock_quantity (INTEGER)",
                "created_at (TIMESTAMP)",
              ],
            },
            {
              table_name: "tbl_orders",
              columns: [
                "id (PK, UUID)",
                "customer_id (FK -> tbl_customers.id)",
                "order_status (ENUM)",
                "total_amount (DECIMAL)",
                "payment_status (VARCHAR)",
                "created_at (TIMESTAMP)",
              ],
            },
            {
              table_name: "tbl_order_items",
              columns: [
                "id (PK, UUID)",
                "order_id (FK -> tbl_orders.id)",
                "product_id (FK -> tbl_products.id)",
                "quantity (INTEGER)",
                "unit_price (DECIMAL)",
              ],
            },
            {
              table_name: "tbl_customers",
              columns: [
                "id (PK, UUID)",
                "full_name (VARCHAR)",
                "email (UNIQUE VARCHAR)",
                "shipping_address (JSONB)",
                "phone (VARCHAR)",
              ],
            },
          ],
          endpoints: [
            { method: "POST", path: "/api/v1/orders/checkout", desc: "Process cart checkout and initiate payment gateway" },
            { method: "GET", path: "/api/v1/products/catalog", desc: "Query product inventory with semantic AI search & filters" },
            { method: "GET", path: "/api/v1/orders/{id}/tracking", desc: "Retrieve real-time order & delivery logistics status" },
            { method: "PUT", path: "/api/v1/inventory/adjust", desc: "Update warehouse stock quantities and trigger restock alerts" },
            { method: "POST", path: "/api/v1/webhooks/payment", desc: "Listen for asynchronous payment confirmation webhooks" },
          ],
        };
      }

      // 2. Healthcare & Telemedicine
      if (
        lower.includes("health") ||
        lower.includes("doctor") ||
        lower.includes("patient") ||
        lower.includes("clinic") ||
        lower.includes("hospital") ||
        lower.includes("medical") ||
        lower.includes("appointment") ||
        lower.includes("prescription")
      ) {
        return {
          tables: [
            {
              table_name: "tbl_patients",
              columns: [
                "id (PK, UUID)",
                "full_name (VARCHAR)",
                "dob (DATE)",
                "blood_group (VARCHAR)",
                "emergency_contact (VARCHAR)",
                "created_at (TIMESTAMP)",
              ],
            },
            {
              table_name: "tbl_doctors",
              columns: [
                "id (PK, UUID)",
                "full_name (VARCHAR)",
                "specialization (VARCHAR)",
                "license_no (UNIQUE VARCHAR)",
                "consultation_fee (NUMERIC)",
                "schedule (JSONB)",
              ],
            },
            {
              table_name: "tbl_appointments",
              columns: [
                "id (PK, UUID)",
                "patient_id (FK -> tbl_patients.id)",
                "doctor_id (FK -> tbl_doctors.id)",
                "appointment_time (TIMESTAMPTZ)",
                "status (ENUM)",
              ],
            },
            {
              table_name: "tbl_medical_records",
              columns: [
                "id (PK, UUID)",
                "patient_id (FK -> tbl_patients.id)",
                "diagnosis_summary (TEXT)",
                "ai_risk_score (FLOAT)",
                "lab_attachments (JSONB)",
              ],
            },
          ],
          endpoints: [
            { method: "POST", path: "/api/v1/appointments/book", desc: "Book consultation slot and send calendar notifications" },
            { method: "GET", path: "/api/v1/patients/{id}/ehr", desc: "Query encrypted Electronic Health Records (EHR)" },
            { method: "POST", path: "/api/v1/ai/triage-assessment", desc: "Analyze symptoms with Gemini medical triage engine" },
            { method: "PUT", path: "/api/v1/prescriptions/issue", desc: "Generate and digitally sign e-prescription" },
          ],
        };
      }

      // 3. Fintech, Banking & Payments
      if (
        lower.includes("bank") ||
        lower.includes("fintech") ||
        lower.includes("wallet") ||
        lower.includes("loan") ||
        lower.includes("credit") ||
        lower.includes("payment") ||
        lower.includes("money") ||
        lower.includes("transaction")
      ) {
        return {
          tables: [
            {
              table_name: "tbl_accounts",
              columns: [
                "id (PK, UUID)",
                "account_number (UNIQUE VARCHAR)",
                "user_id (UUID)",
                "balance (NUMERIC)",
                "currency (VARCHAR)",
                "status (VARCHAR)",
              ],
            },
            {
              table_name: "tbl_transactions",
              columns: [
                "id (PK, UUID)",
                "source_account_id (FK -> tbl_accounts.id)",
                "dest_account_id (FK -> tbl_accounts.id)",
                "amount (NUMERIC)",
                "txn_type (ENUM)",
                "timestamp (TIMESTAMPTZ)",
              ],
            },
            {
              table_name: "tbl_kyc_records",
              columns: [
                "id (PK, UUID)",
                "user_id (UUID)",
                "id_document_type (VARCHAR)",
                "verification_status (VARCHAR)",
                "aml_score (FLOAT)",
              ],
            },
            {
              table_name: "tbl_loans",
              columns: [
                "id (PK, UUID)",
                "borrower_id (UUID)",
                "principal_amount (NUMERIC)",
                "interest_rate (FLOAT)",
                "approval_status (VARCHAR)",
              ],
            },
          ],
          endpoints: [
            { method: "POST", path: "/api/v1/transfers/execute", desc: "Process instantaneous fund transfer with 2FA check" },
            { method: "GET", path: "/api/v1/accounts/{id}/statement", desc: "Fetch transaction audit ledger and analytics" },
            { method: "POST", path: "/api/v1/kyc/verify-identity", desc: "Run AI facial match & ID OCR document verification" },
            { method: "POST", path: "/api/v1/loans/underwriting", desc: "Assess borrower credit risk and calculate loan approval" },
          ],
        };
      }

      // 4. Logistics, Supply Chain & Fleet
      if (
        lower.includes("delivery") ||
        lower.includes("shipment") ||
        lower.includes("logistics") ||
        lower.includes("fleet") ||
        lower.includes("warehouse") ||
        lower.includes("transport") ||
        lower.includes("freight")
      ) {
        return {
          tables: [
            {
              table_name: "tbl_shipments",
              columns: [
                "id (PK, UUID)",
                "tracking_number (UNIQUE VARCHAR)",
                "sender_id (UUID)",
                "destination_address (TEXT)",
                "status (ENUM)",
                "weight_kg (NUMERIC)",
              ],
            },
            {
              table_name: "tbl_fleet_vehicles",
              columns: [
                "id (PK, UUID)",
                "license_plate (VARCHAR)",
                "vehicle_type (VARCHAR)",
                "current_gps_lat (FLOAT)",
                "current_gps_lng (FLOAT)",
                "status (VARCHAR)",
              ],
            },
            {
              table_name: "tbl_warehouses",
              columns: [
                "id (PK, UUID)",
                "facility_name (VARCHAR)",
                "location_city (VARCHAR)",
                "capacity_sqft (INTEGER)",
                "manager_contact (VARCHAR)",
              ],
            },
          ],
          endpoints: [
            { method: "POST", path: "/api/v1/shipments/create", desc: "Register parcel consignment and generate barcode" },
            { method: "GET", path: "/api/v1/fleet/telemetry", desc: "Stream live GPS coordinates and route ETA" },
            { method: "PUT", path: "/api/v1/routes/optimize", desc: "Compute AI dispatch routing for lowest fuel consumption" },
          ],
        };
      }

      // 5. Education & Learning (EdTech)
      if (
        lower.includes("student") ||
        lower.includes("course") ||
        lower.includes("school") ||
        lower.includes("college") ||
        lower.includes("education") ||
        lower.includes("quiz") ||
        lower.includes("learning")
      ) {
        return {
          tables: [
            {
              table_name: "tbl_courses",
              columns: [
                "id (PK, UUID)",
                "course_title (VARCHAR)",
                "instructor_id (UUID)",
                "category (VARCHAR)",
                "duration_weeks (INTEGER)",
                "created_at (TIMESTAMP)",
              ],
            },
            {
              table_name: "tbl_students",
              columns: [
                "id (PK, UUID)",
                "full_name (VARCHAR)",
                "student_email (UNIQUE VARCHAR)",
                "grade_level (VARCHAR)",
                "enrolled_since (DATE)",
              ],
            },
            {
              table_name: "tbl_enrollments",
              columns: [
                "id (PK, UUID)",
                "student_id (FK -> tbl_students.id)",
                "course_id (FK -> tbl_courses.id)",
                "progress_percentage (INTEGER)",
                "completion_status (VARCHAR)",
              ],
            },
            {
              table_name: "tbl_assignments",
              columns: [
                "id (PK, UUID)",
                "course_id (FK -> tbl_courses.id)",
                "title (VARCHAR)",
                "due_date (TIMESTAMPTZ)",
                "max_score (INTEGER)",
              ],
            },
          ],
          endpoints: [
            { method: "POST", path: "/api/v1/courses/enroll", desc: "Register student in course track and assign syllabus" },
            { method: "GET", path: "/api/v1/students/{id}/gradebook", desc: "Fetch academic performance and milestone progress" },
            { method: "POST", path: "/api/v1/ai/tutor-assistant", desc: "Query interactive AI homework tutor for student guidance" },
            { method: "POST", path: "/api/v1/assignments/submit", desc: "Upload assignment response and trigger auto-grading" },
          ],
        };
      }

      // 6. Dynamic Custom Domain Extraction
      const words = cleanPrompt
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
        .slice(0, 4);

      const entity1 = words[0] ? words[0].toLowerCase() : "business";
      const entity2 = words[1] ? words[1].toLowerCase() : "workflow";
      const entity3 = words[2] ? words[2].toLowerCase() : "audit";

      return {
        tables: [
          {
            table_name: `tbl_${entity1}_master`,
            columns: [
              "id (PK, UUID)",
              "name (VARCHAR)",
              "code (UNIQUE VARCHAR)",
              "status (ENUM)",
              "metadata (JSONB)",
              "created_at (TIMESTAMP)",
            ],
          },
          {
            table_name: `tbl_${entity2}_events`,
            columns: [
              "id (PK, UUID)",
              `parent_id (FK -> tbl_${entity1}_master.id)`,
              "event_type (VARCHAR)",
              "payload (JSONB)",
              "timestamp (TIMESTAMPTZ)",
            ],
          },
          {
            table_name: `tbl_${entity3}_analytics`,
            columns: [
              "id (PK, UUID)",
              `reference_id (FK -> tbl_${entity1}_master.id)`,
              "kpi_metric_value (NUMERIC)",
              "confidence_score (FLOAT)",
              "calculated_at (TIMESTAMP)",
            ],
          },
        ],
        endpoints: [
          { method: "POST", path: `/api/v1/${entity1}/create`, desc: `Create new ${entity1} entity & trigger automated pipeline` },
          { method: "GET", path: `/api/v1/${entity1}/{id}/status`, desc: `Query real-time processing status and metadata payload` },
          { method: "PUT", path: `/api/v1/${entity1}/update-state`, desc: `Update state transitions and operational parameters` },
          { method: "POST", path: `/api/v1/${entity2}/process-ai`, desc: `Run AI inference engine on ${entity2} data streams` },
        ],
      };
    };

    // Multilingual Localization Strings Helper
    const getLocalizedStrings = (lang: string) => {
      const l = lang.toLowerCase();
      if (l.includes("gu") || l.includes("gujarat")) {
        return {
          titlePrefix: "એન્ટરપ્રાઇઝ સોલ્યુશન આર્કિટેક્ચર",
          step1: { title: "૧. ડેટા ઇન્ટેક અને ઇન્જેશન", desc: "યુઝર ઇનપુટ, ડોક્યુમેન્ટ્સ અને સિગ્નલ્સ એકત્રિત કરવા." },
          step2: { title: "૨. AI વિશ્લેષણ અને વેરિફિકેશન", desc: "બિઝનેસ નિયમો, પરવાનગીઓ અને નીતિઓની ચકાસણી." },
          step3: { title: "૩. એક્ઝિક્યુશન અને વર્કફ્લો ઓર્કેસ્ટ્રેશન", desc: "માઈક્રોસર્વિસિસ, ડેટાબેઝ રાઈટ્સ અને એપીઆઈ સંકલન." },
          step4: { title: "૪. મોનિટરિંગ અને સતત શિક્ષણ", desc: "ટેલિમેટ્રી લોગિંગ, ઓડિટ મેટ્રિક્સ અને ઓટોમેટિક એલર્ટ્સ." },
          initiative1: "મુખ્ય પ્રોસેસ ડિજિટાઈઝેશન",
          initiative2: "AI ઇન્ટેલિજન્સ એકીકરણ",
          riskTitle: "ડેટા સુરક્ષા અને ટેનન્ટ આઇસોલેશન",
          riskMitigation: "Supabase RLS સુરક્ષા નીતિઓ અને JWT ટોકન્સ લાગુ કરો.",
        };
      }
      if (l.includes("hi") || l.includes("hindi")) {
        return {
          titlePrefix: "उद्यम समाधान वास्तुकला",
          step1: { title: "१. डेटा सेवन और अंतर्ग्रहण", desc: "उपयोगकर्ता इनपुट, दस्तावेज़ और व्यावसायिक संकेत एकत्र करना।" },
          step2: { title: "२. AI विश्लेषण और सत्यापन", desc: "व्यावसायिक नियमों, अनुमतियों और नीति मिलान को मान्य करना।" },
          step3: { title: "३. निष्पादन और वर्कफ़्लो ऑर्केस्ट्रेशन", desc: "माइक्रोसर्विसेज, डेटाबेस और बाहरी APIs का समन्वय।" },
          step4: { title: "४. फीडबैक और निरंतर सीखना", desc: "टेलीमेट्री लॉगिंग, ऑडिट मेट्रिक्स और अलर्ट ट्रिगर करना।" },
          initiative1: "मुख्य प्रक्रिया डिजिटलीकरण",
          initiative2: "AI इंटेलिजेंस एकीकरण",
          riskTitle: "डेटा सुरक्षा और किरायेदार अलगाव",
          riskMitigation: "Supabase RLS सुरक्षा नीतियां और JWT प्रमाणीकरण लागू करें।",
        };
      }
      if (l.includes("es") || l.includes("span")) {
        return {
          titlePrefix: "Arquitectura Empresarial de Soluciones",
          step1: { title: "1. Ingesta y Captura de Datos", desc: "Capturar entradas de usuarios, documentos y señales operativas." },
          step2: { title: "2. Análisis y Verificación de IA", desc: "Validar reglas comerciales, permisos y cumplimiento normativo." },
          step3: { title: "3. Ejecución y Orquestación de Flujos", desc: "Coordinar microservicios, escrituras en base de datos y APIs externas." },
          step4: { title: "4. Retroalimentación y Aprendizaje Continuo", desc: "Registrar telemetría, métricas de auditoría y alertas proactivas." },
          initiative1: "Digitalización de Procesos Clave",
          initiative2: "Integración de Inteligencia Artificial",
          riskTitle: "Seguridad de Datos y Aislamiento Multinquilino",
          riskMitigation: "Implementar políticas de Row-Level Security (RLS) en Supabase.",
        };
      }
      if (l.includes("fr") || l.includes("french")) {
        return {
          titlePrefix: "Architecture de Solution d'Entreprise",
          step1: { title: "1. Ingestion et Capture de Données", desc: "Capturer les données utilisateurs, documents et flux métier." },
          step2: { title: "2. Analyse IA et Vérification", desc: "Valider les règles d'entreprise, permissions et conformité." },
          step3: { title: "3. Exécution et Orchestration des Flux", desc: "Coordonner les microservices, écritures base de données et APIs." },
          step4: { title: "4. Rétroaction et Apprentissage Continu", desc: "Journaliser la télémétrie, métriques d'audit et alertes." },
          initiative1: "Numérisation des Processus Clés",
          initiative2: "Intégration de l'Intelligence Artificielle",
          riskTitle: "Sécurité des Données & Isolation Multi-Locataire",
          riskMitigation: "Mettre en œuvre les politiques de sécurité au niveau des lignes (RLS).",
        };
      }
      if (l.includes("de") || l.includes("german")) {
        return {
          titlePrefix: "Unternehmens-Lösungsarchitektur",
          step1: { title: "1. Datenaufnahme & Erfassung", desc: "Erfassung von Benutzereingaben, Dokumenten und Geschäftssignalen." },
          step2: { title: "2. KI-Analyse & Verifikation", desc: "Validierung von Geschäftsregeln, Berechtigungen und Richtlinien." },
          step3: { title: "3. Ausführung & Workflow-Orchestrierung", desc: "Koordination von Microservices, Datenbanktransaktionen und APIs." },
          step4: { title: "4. Feedback & Kontinuierliches Lernen", desc: "Protokollierung von Telemetrie, Prüfmetriken und Warnungen." },
          initiative1: "Digitalisierung der Kernprozesse",
          initiative2: "KI-Intelligenz-Integration",
          riskTitle: "Datensicherheit und Mandantentrennung",
          riskMitigation: "Implementierung von Supabase Row-Level Security (RLS) Richtlinien.",
        };
      }
      return {
        titlePrefix: "Enterprise Solution Architecture",
        step1: { title: "1. Intake & Ingestion", desc: "Capture user input, documents, or business signals." },
        step2: { title: "2. AI Analysis & Verification", desc: "Validate business rules, permissions, and policy matching." },
        step3: { title: "3. Execution & Workflow Orchestration", desc: "Coordinate microservices, database writes, and external APIs." },
        step4: { title: "4. Feedback & Continuous Learning", desc: "Log telemetry, audit metrics, and trigger alerts." },
        initiative1: "Core Process Digitization",
        initiative2: "AI Intelligence Integration",
        riskTitle: "Data Security & Tenant Isolation",
        riskMitigation: "Implement Supabase Row-Level Security (RLS) and JWT token rotation.",
      };
    };

    // Deterministic Smart Fallback Generator with Role Context & Language
    const generateSmartDomainBlueprint = (p: string, targetLangStr: string, activeRole: string) => {
      let hash = 0;
      for (let i = 0; i < p.length; i++) {
        hash = (hash << 5) - hash + p.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash);

      const domainData = getDomainSpecificSchemaAndApis(p);
      const loc = getLocalizedStrings(targetLangStr);

      const maturityScore = 84 + (hash % 12);
      const aiReadinessScore = 86 + (hash % 11);
      const weeksTimeline = 6 + (hash % 6);
      const totalHours = weeksTimeline * 40;
      const hourlyRate = 75;
      const minBudget = totalHours * hourlyRate;
      const maxBudget = minBudget + 12000;

      const words = p.split(/\s+/).slice(0, 4).join(" ");
      const dynamicTitle = `${loc.titlePrefix}: ${words.charAt(0).toUpperCase() + words.slice(1)}`;

      return {
        project_title: dynamicTitle,
        user_problem: p,
        target_language: targetLangStr,
        user_role: activeRole,
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
            { role: "DevOps & Cloud Architect", count: 1, allocation: "50%" },
          ],
        },
        tech_stack: {
          frontend: "React / Next.js 16 + Tailwind CSS",
          backend: "Node.js / Express API Gateway",
          database: "PostgreSQL (Supabase RLS)",
          ai_layer: "Google Gemini 1.5 Flash",
        },
        initiatives: [
          {
            title: loc.initiative1,
            impact: "High Impact",
            desc: `Automate end-to-end processing for "${p.slice(0, 60)}".`,
          },
          {
            title: loc.initiative2,
            impact: "High Impact",
            desc: "Embed automated machine reasoning and predictive classification.",
          },
        ],
        bpmn_steps: [
          { id: 1, title: loc.step1.title, desc: loc.step1.desc, phase: "Ingestion" },
          { id: 2, title: loc.step2.title, desc: loc.step2.desc, phase: "Processing" },
          { id: 3, title: loc.step3.title, desc: loc.step3.desc, phase: "Execution" },
          { id: 4, title: loc.step4.title, desc: loc.step4.desc, phase: "Delivery" },
        ],
        database_tables: domainData.tables,
        api_endpoints: domainData.endpoints,
        wireframe_sections: [
          { title: "Navigation & Hero", components: ["Brand Logo", "Global Search", "User Profile", "Quick Action Bar"] },
          { title: "Operational Workbench", components: ["Data Table", "Live Analytics Cards", "Status Badges", "Filter Panel"] },
          { title: "System Analytics & Logs", components: ["Activity Stream", "KPI Summary", "Export PDF/JSON Action"] },
        ],
        roadmap_sprints: [
          { sprint: "Sprint 1-2", focus: "Architecture & Data Model", deliverable: "PostgreSQL schemas, Auth RLS & Base UI" },
          { sprint: "Sprint 3-4", focus: "Core Logic & AI Engine", deliverable: "API Gateway, Gemini integration & pipeline execution" },
          { sprint: "Sprint 5-6", focus: "Testing & Enterprise Launch", deliverable: "End-to-end verification, load testing & Vercel deployment" },
        ],
        planning: {
          effortHours: `${totalHours}`,
          cloudCost: `$${110 + (hash % 50)}/mo`,
          cloudDetail: "PostgreSQL + Edge Compute + Gemini API",
          risk: {
            level: "Low-Medium",
            title: loc.riskTitle,
            mitigation: loc.riskMitigation,
          },
        },
      };
    };

    // If Gemini API key is available and not in mock-mode
    if (apiKey && apiKey.trim() !== "" && selectedModel !== "mock-mode") {
      try {
        const targetLangName = rawLang;
        const modelName = selectedModel.includes("pro") ? "gemini-2.5-pro" : "gemini-3.6-flash";

        const roleInstructions =
          role === "Admin"
            ? "Emphasize deep enterprise security, Supabase Row-Level Security (RLS), microservice architecture, API gateways, cloud cost optimization, and compliance."
            : role === "Employee"
            ? "Emphasize clear developer tasks, step-by-step implementation guide, clean UI wireframe components, and practical code integration steps."
            : "Emphasize agile project management, sprint planning, cross-functional resource allocation, timeline risk mitigation, and business ROI.";

        const systemPrompt = `You are a Principal AI Solution Architect.
Analyze the user's business requirement and create a complete, bespoke, production-ready solution architecture for a user in the '${role}' role.

ROLE DIRECTIVE (${role}):
${roleInstructions}

CRITICAL INSTRUCTIONS:
1. TARGET LANGUAGE: You MUST output EVERY single text field (project_title, initiative titles & descriptions, bpmn_steps titles & descriptions, api_endpoints descriptions, wireframe_sections titles & component labels, roadmap_sprints deliverables, risk titles & mitigations) STRICTLY IN THIS LANGUAGE: ${targetLangName}.
2. CUSTOM DATABASE SCHEMA: Generate 3 to 5 realistic, domain-specific PostgreSQL database tables tailored specifically to the user's requirement. Include 5-7 meaningful column definitions per table with constraints like 'id (PK, UUID)', 'foreign_key (FK -> ...)', 'VARCHAR', 'JSONB', 'TIMESTAMPTZ'.
3. CUSTOM REST APIS: Generate 4 to 6 domain-specific REST API endpoints (POST, GET, PUT, DELETE) with realistic paths matching the domain.

USER REQUIREMENT: "${cleanPrompt}"

Output ONLY a single valid JSON object matching this schema:
{
  "project_title": "Descriptive Title in ${targetLangName}",
  "user_problem": "${cleanPrompt.slice(0, 150).replace(/"/g, '\\"')}",
  "target_language": "${targetLangName}",
  "user_role": "${role}",
  "digital_maturity": 88,
  "ai_adoption": 92,
  "timeline": "6-8 Weeks",
  "financial_estimation": {
    "min_budget": "$18,000",
    "max_budget": "$34,000",
    "total_hours": "240 Hours",
    "hourly_rate": "$75/hr",
    "team_roles": [
      { "role": "Senior Full-Stack Engineer", "count": 2, "allocation": "100%" },
      { "role": "UI/UX Product Designer", "count": 1, "allocation": "50%" },
      { "role": "AI Solutions Engineer", "count": 1, "allocation": "75%" },
      { "role": "DevOps & Cloud Architect", "count": 1, "allocation": "50%" }
    ]
  },
  "tech_stack": {
    "frontend": "React / Next.js 16 + Tailwind CSS",
    "backend": "Node.js / Express Edge Functions",
    "database": "PostgreSQL (Supabase RLS)",
    "ai_layer": "Google Gemini 3.6 Flash"
  },
  "initiatives": [
    { "title": "Initiative 1 in ${targetLangName}", "impact": "High Impact", "desc": "Description in ${targetLangName}" },
    { "title": "Initiative 2 in ${targetLangName}", "impact": "High Impact", "desc": "Description in ${targetLangName}" }
  ],
  "bpmn_steps": [
    { "id": 1, "title": "1. Step in ${targetLangName}", "desc": "Description in ${targetLangName}", "phase": "Phase" },
    { "id": 2, "title": "2. Step in ${targetLangName}", "desc": "Description in ${targetLangName}", "phase": "Phase" },
    { "id": 3, "title": "3. Step in ${targetLangName}", "desc": "Description in ${targetLangName}", "phase": "Phase" },
    { "id": 4, "title": "4. Step in ${targetLangName}", "desc": "Description in ${targetLangName}", "phase": "Phase" }
  ],
  "database_tables": [
    {
      "table_name": "tbl_custom_name",
      "columns": ["id (PK, UUID)", "name (VARCHAR)", "created_at (TIMESTAMP)"]
    }
  ],
  "api_endpoints": [
    { "method": "POST", "path": "/api/v1/resource/action", "desc": "Description in ${targetLangName}" }
  ],
  "wireframe_sections": [
    { "title": "Section Title in ${targetLangName}", "components": ["Component 1 in ${targetLangName}", "Component 2 in ${targetLangName}"] }
  ],
  "roadmap_sprints": [
    { "sprint": "Sprint 1-2", "focus": "Architecture & Data Model", "deliverable": "Deliverable in ${targetLangName}" },
    { "sprint": "Sprint 3-4", "focus": "AI Engine & Workflows", "deliverable": "Deliverable in ${targetLangName}" },
    { "sprint": "Sprint 5-6", "focus": "Testing & Launch", "deliverable": "Deliverable in ${targetLangName}" }
  ],
  "planning": {
    "effortHours": "240",
    "cloudCost": "$120/mo",
    "cloudDetail": "Supabase PostgreSQL + Edge Functions",
    "risk": { "level": "Low-Medium", "title": "Risk in ${targetLangName}", "mitigation": "Mitigation in ${targetLangName}" }
  }
}
Output raw JSON only.`;

        const candidateModels = [
          "gemini-3.5-flash",
          "gemini-3.6-flash",
          "gemini-3.7-flash",
          "gemini-flash-latest",
          "gemini-2.5-pro",
        ];

        for (const currentModel of candidateModels) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: systemPrompt }] }],
                  generationConfig: {
                    temperature: 0.3,
                    responseMimeType: "application/json",
                  },
                }),
              }
            );

            if (response.ok) {
              const resData = await response.json();
              const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (candidateText) {
                const parsed = JSON.parse(candidateText);
                console.log(`>>> [GEMINI ${currentModel.toUpperCase()} SUCCESS] Bespoke Architecture Generated!`);
                return NextResponse.json({ success: true, data: parsed, gemini_used: true, model: currentModel });
              }
            } else {
              const errBody = await response.text();
              console.warn(`[GEMINI ${currentModel} FAIL] Status: ${response.status} -> Trying next model...`);
            }
          } catch (modelErr) {
            console.warn(`[GEMINI ${currentModel} ERROR]`, modelErr);
          }
        }
      } catch (err) {
        console.warn("All live Gemini models failed, falling back to smart domain generator:", err);
      }
    }

    const data = generateSmartDomainBlueprint(cleanPrompt, rawLang, role);
    return NextResponse.json({ success: true, data, gemini_used: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}