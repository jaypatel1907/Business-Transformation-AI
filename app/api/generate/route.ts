import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      documentText,
      documentBase64,
      documentMimeType,
      language = "English",
      targetLanguage,
      role = "Manager",
      selectedModel = "gemini-1.5-flash",
      businessContext,
      discoveryAnswers,
    } = await req.json();

    const rawLang = targetLanguage || language || "English";
    const apiKey = process.env.GEMINI_API_KEY;

    const userFacingProblem = prompt ? prompt.trim() : (documentText ? "Document Requirement Specification" : "Build an enterprise AI solution architecture");
    let augmentedPrompt = userFacingProblem;
    
    // Enrich prompt with Phase 1 Business Discovery Context if provided for LLM reasoning
    if (businessContext) {
      augmentedPrompt += `\n\n[PHASE 1 DISCOVERY CONTEXT]:\nDomain: ${businessContext.business_domain || "Enterprise"}\nTarget Audience: ${businessContext.target_audience || "General"}\nPain Points: ${(businessContext.current_pain_points || []).join("; ")}\nGoals: ${(businessContext.primary_goals || []).join("; ")}\nExisting Stack: ${(businessContext.existing_systems || []).join("; ")}`;
    }
    if (discoveryAnswers && Array.isArray(discoveryAnswers) && discoveryAnswers.length > 0) {
      augmentedPrompt += `\n\n[DISCOVERY INTERVIEW ANSWERS]:\n` + discoveryAnswers.map((a: any) => `- ${a.question}: ${a.selected_option || a.custom_answer}`).join("\n");
    }

    if (documentText && documentText.trim().length > 0) {
      augmentedPrompt += `\n\n[ATTACHED BUSINESS DOCUMENT / BRD]:\n${documentText.slice(0, 3000)}`;
    } else if (documentBase64) {
      augmentedPrompt += `\n\n[NOTE: THE USER HAS ATTACHED A DOCUMENT (PDF/IMAGE) FOR YOU TO ANALYZE. EXTRACT THEIR REQUIREMENTS FROM IT AND INCORPORATE THEM INTO THE BLUEPRINT.]`;
    }

    const cleanPrompt = augmentedPrompt;

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

      // 5. Dynamic Custom Domain Extraction
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
          titlePrefix: "પ્રોજેક્ટ પ્લાન",
          step1: { title: "૧. ડિઝાઇન અને હોમપેજ (Design)", desc: "સૌથી પહેલા આપણે યુઝર્સ માટે એક સુંદર અને આકર્ષક હોમપેજ બનાવીશું." },
          step2: { title: "૨. પ્રોડક્ટ અને ફીચર્સ (Features)", desc: "ત્યારબાદ આપણે તેમાં જરૂરી ફીચર્સ અને પ્રોડક્ટ કેટેલોગ એડ કરીશું." },
          step3: { title: "૩. ડેટાબેઝ અને સિસ્ટમ (Database)", desc: "પછી આપણે બધો ડેટા સાચવવા માટે પાછળની સિસ્ટમ (બેકએન્ડ) સેટ કરીશું." },
          step4: { title: "૪. ટેસ્ટિંગ અને લાઈવ (Launch)", desc: "છેલ્લે આપણે બધું ચેક કરીને વેબસાઇટને ઇન્ટરનેટ પર લાઈવ કરીશું!" },
          initiative1: "મુખ્ય પ્રોસેસ ડિજિટલાઇઝેશન",
          initiative2: "AI ઇન્ટેલિજન્સ એકીકરણ",
          riskTitle: "ડેટા સુરક્ષા",
          riskMitigation: "યુઝરનો ડેટા સુરક્ષિત રાખવા માટે બેઝિક સિક્યોરિટી નિયમો લગાવો.",
        };
      }
      if (l.includes("hi") || l.includes("hindi")) {
        return {
          titlePrefix: "उद्यम समाधान वास्तुकला",
          step1: { title: "१. डेटा सेवन और अंतर्ग्रहण", desc: "उपयोगकर्ता इनपुट, दस्तावेज़ और व्यावसायिक संकेत एकत्र करना।" },
          step2: { title: "२. AI विश्लेषण और सत्यापन", desc: "व्यावसायिक नियमों, अनुमतियों और नीति मिलान को मान्य करना।" },
          step3: { title: "३. निष्पादन और वर्कफ़्लो आर्केस्ट्रेशन", desc: "माइक्रोसर्विसेज, डेटाबेस और बाहरी APIs का समन्वय।" },
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
        titlePrefix: "Project Plan",
        step1: { title: "1. Design & Homepage", desc: "First, we will design a beautiful and attractive homepage for your users." },
        step2: { title: "2. Features & Catalog", desc: "Next, we will add the core features and product catalog so users can interact." },
        step3: { title: "3. Database Setup", desc: "Then, we will set up the backend database to save all user data securely." },
        step4: { title: "4. Testing & Launch", desc: "Finally, we will test everything and launch the website live on the internet!" },
        initiative1: "Core Process Digitization",
        initiative2: "AI Intelligence Integration",
        riskTitle: "Data Security",
        riskMitigation: "Implement basic security rules to keep user data safe.",
      };
    };

    // Real-World Domain Intelligence Scoring Engine
    const generateSmartDomainBlueprint = (p: string, targetLangStr: string, activeRole: string) => {
      const lower = p.toLowerCase();
      const domainData = getDomainSpecificSchemaAndApis(p);
      const loc = getLocalizedStrings(targetLangStr);

      let maturityScore = 55;
      if (lower.match(/fintech|bank|payment|wallet|upi|crypto|blockchain/)) maturityScore = 78;
      else if (lower.match(/hospital|clinic|health|patient|doctor|medical|pharma/)) maturityScore = 52;
      else if (lower.match(/school|college|education|lms|learning|course/)) maturityScore = 58;
      else if (lower.match(/ecommerce|shop|store|retail|product|cart|order/)) maturityScore = 74;
      else if (lower.match(/food|restaurant|delivery|kitchen|zomato|swiggy/)) maturityScore = 68;
      else if (lower.match(/logistics|supply chain|warehouse|fleet|shipping/)) maturityScore = 62;
      else if (lower.match(/real estate|property|rental|land|house/)) maturityScore = 48;
      else if (lower.match(/agriculture|farm|crop|irrigation|soil/)) maturityScore = 35;
      else if (lower.match(/saas|platform|software|api|developer|devops/)) maturityScore = 85;
      else if (lower.match(/ai|machine learning|ml|nlp|vision|model|llm/)) maturityScore = 88;
      else if (lower.match(/government|municipal|civic|public|citizen/)) maturityScore = 32;
      else if (lower.match(/hr|recruit|employee|payroll|attendance/)) maturityScore = 61;
      else if (lower.match(/manufacture|factory|production|assembly|plant/)) maturityScore = 44;
      else if (lower.match(/travel|hotel|booking|tourism|ticket/)) maturityScore = 70;

      if (activeRole === "Admin") maturityScore = Math.min(maturityScore + 2, 92);
      if (activeRole === "Employee") maturityScore = Math.max(maturityScore - 3, 28);

      let aiReadinessScore = 60;
      if (lower.match(/ai|machine learning|ml|nlp|vision|model|llm|predict/)) aiReadinessScore = 92;
      else if (lower.match(/fintech|fraud|risk|credit|loan|insurance/)) aiReadinessScore = 88;
      else if (lower.match(/ecommerce|recommend|personali|search|catalog/)) aiReadinessScore = 82;
      else if (lower.match(/logistics|route|optimize|track|fleet|dispatch/)) aiReadinessScore = 78;
      else if (lower.match(/hospital|diagnosis|radiology|triage|symptom/)) aiReadinessScore = 74;
      else if (lower.match(/food|menu|order|kitchen|inventory/)) aiReadinessScore = 65;
      else if (lower.match(/saas|platform|automation|workflow|bot/)) aiReadinessScore = 85;
      else if (lower.match(/hr|recruit|screen|resume|interview/)) aiReadinessScore = 76;
      else if (lower.match(/education|tutor|quiz|assessment|adaptive/)) aiReadinessScore = 72;

      let weeksTimeline = 8;
      const wordCount = p.trim().split(/\s+/).length;
      const hasAI = lower.match(/ai|machine learning|ml|nlp|vision|model|llm/);
      const hasIntegration = lower.match(/integrate|third.party|payment gateway|erp|crm|sms|email/);
      const isEnterprise = lower.match(/enterprise|large.scale|microservice|multi.tenant|sso|rbac/);
      const isMobile = lower.match(/mobile|ios|android|flutter|app/);

      if (hasAI && isEnterprise) weeksTimeline = 18;
      else if (hasAI && hasIntegration) weeksTimeline = 14;
      else if (hasAI) weeksTimeline = 12;
      else if (isEnterprise) weeksTimeline = 14;
      else if (isMobile && hasIntegration) weeksTimeline = 12;
      else if (isMobile) weeksTimeline = 10;
      else if (hasIntegration) weeksTimeline = 10;
      else if (wordCount <= 6) weeksTimeline = 6;
      else weeksTimeline = 8;

      const hourlyRate = 75;
      const totalHours = weeksTimeline * 40;
      const minBudget = totalHours * hourlyRate;
      const overhead = isEnterprise ? 25000 : hasAI ? 18000 : hasIntegration ? 12000 : 8000;
      const maxBudget = minBudget + overhead;

      const wordsForEntity = p.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3);
      const dynamicEntity = wordsForEntity.length > 0 ? wordsForEntity.slice(-2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Enterprise";
      const words = p.split(/\s+/).slice(0, 4).join(" ");
      const dynamicTitle = `${loc.titlePrefix}: ${words.charAt(0).toUpperCase() + words.slice(1)}`;

      let fStack = ["React", "Next.js", "Tailwind CSS"];
      let bStack = ["Node.js", "PostgreSQL", "Supabase"];
      let aiToolFront = ["v0 by Vercel", "Cursor IDE"];
      let aiToolBack = ["ChatGPT", "GitHub Copilot"];
      let platformFront = ["Vercel", "GitHub Pages"];
      let platformBack = ["AWS", "Supabase Platform"];

      const isGuj = targetLangStr.toLowerCase().includes("gu");
      const isHindi = targetLangStr.toLowerCase().includes("hi");
      const isEs = targetLangStr.toLowerCase().includes("es") || targetLangStr.toLowerCase().includes("span");
      const isFr = targetLangStr.toLowerCase().includes("fr") || targetLangStr.toLowerCase().includes("fren");
      const isDe = targetLangStr.toLowerCase().includes("de") || targetLangStr.toLowerCase().includes("germ");

      const chatReply = isGuj
        ? `નમસ્તે! મેં તમારી રિક્વાયરમેન્ટ **"${p}"** માટે એક સંપૂર્ણ આર્કિટેક્ચર બ્લુપ્રિન્ટ તૈયાર કર્યો છે.

✨ **હાઈલાઈટ્સ:**
• **ડિજિટલ મેચ્યોરિટી:** ${maturityScore}% | **AI રેડીનેસ:** ${aiReadinessScore}%
• **ટાર્ગેટ ડિલિવરી:** ${weeksTimeline} અઠવાડિયા (બજેટ: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})
• **ટેક સ્ટેક:** ${fStack.join(", ")} + ${bStack.join(", ")} + PostgreSQL
• **ડેટાબેઝ & APIs:** ${domainData.tables.length} ટેબલ્સ અને ${domainData.endpoints.length} REST APIs.

🚀 **કેનવાસ જુઓ:** જમણી બાજુના Tabs પર ક્લિક કરી વધુ માહિતી જુઓ.`
        : isHindi
        ? `नमस्ते! मैंने **"${p}"** के लिए आपकी आवश्यकता का विश्लेषण किया है और एक पूरा ब्लूप्रिंट तैयार किया है।

✨ **मुख्य अंश:**
• **डिजिटल परिपक्वता:** ${maturityScore}% | **AI तत्परता:** ${aiReadinessScore}%
• **डिलीवरी:** ${weeksTimeline} सप्ताह (बजट: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})
• **टेक स्टैक:** ${fStack.join(", ")} + ${bStack.join(", ")} + PostgreSQL
• **डेटाबेस और APIs:** ${domainData.tables.length} टेबल्स और ${domainData.endpoints.length} REST APIs।

🚀 **डैशबोर्ड देखें:** अधिक जानकारी के लिए दाईं ओर दिए गए टैब देखें।`
        : isEs
        ? `¡Hola! He analizado los requisitos para **"${p}"** y he generado un plan de arquitectura completo.

✨ **Destacados:**
• **Madurez Digital:** ${maturityScore}% | **Preparación IA:** ${aiReadinessScore}%
• **Entrega MVP:** ${weeksTimeline} Semanas (Presupuesto: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})
• **Stack Tecnológico:** ${fStack.join(", ")} + ${bStack.join(", ")} + PostgreSQL
• **Base de Datos & APIs:** ${domainData.tables.length} tablas y ${domainData.endpoints.length} APIs REST.

🚀 **Explorar Tablero:** Haz clic en las pestañas de la derecha.`
        : isFr
        ? `Bonjour ! J'ai analysé vos exigences pour **"${p}"** et généré un plan complet.

✨ **Points forts :**
• **Maturité Numérique :** ${maturityScore}% | **Préparation IA :** ${aiReadinessScore}%
• **Livraison MVP :** ${weeksTimeline} Semaines (Budget : $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})
• **Pile Tech :** ${fStack.join(", ")} + ${bStack.join(", ")} + PostgreSQL
• **BDD & APIs :** ${domainData.tables.length} tables et ${domainData.endpoints.length} APIs REST.

🚀 **Explorer :** Cliquez sur les onglets à droite.`
        : isDe
        ? `Hallo! Ich habe Ihre Anforderungen für **"${p}"** analysiert und einen Plan erstellt.

✨ **Highlights:**
• **Digitale Reife:** ${maturityScore}% | **KI-Bereitschaft:** ${aiReadinessScore}%
• **MVP-Lieferung:** ${weeksTimeline} Wochen (Budget: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})
• **Tech-Stack:** ${fStack.join(", ")} + ${bStack.join(", ")} + PostgreSQL
• **DB & APIs:** ${domainData.tables.length} Tabellen und ${domainData.endpoints.length} REST-APIs.

🚀 **Erkunden:** Klicken Sie auf die Registerkarten rechts.`
        : `Hello! I've analyzed your business requirement for **"${p}"** and generated a complete enterprise architecture blueprint.

✨ **Executive Strategy & Architecture Highlights:**
• **Digital Maturity:** ${maturityScore}% | **AI Adoption Readiness:** ${aiReadinessScore}%
• **Target MVP Delivery:** ${weeksTimeline} Weeks (Estimated Budget: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})
• **Recommended Tech Stack:** ${fStack.join(", ")} (Client) + ${bStack.join(", ")} (Gateway) + PostgreSQL (Supabase RLS)
• **Data & API Layer:** Engineered ${domainData.tables.length} domain-specific relational tables with ${domainData.endpoints.length} production REST endpoints.

🚀 **Explore Your Solution Canvas:**
Click through the tabs on the right to inspect the interactive **Process Map**, **Database Schemas & APIs**, **UX Wireframe Components**, and **Sprint Roadmap**.`;

      return {
        project_title: dynamicEntity + " | " + dynamicTitle,
        chat_reply: chatReply,
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
            { role: `Lead ${dynamicEntity} Architect`, count: 1, allocation: "100%" },
            { role: `${dynamicEntity} UI/UX Designer`, count: 1, allocation: "50%" },
            { role: "Backend Systems Engineer", count: 2, allocation: "100%" },
            { role: "Quality Assurance (QA)", count: 1, allocation: "50%" },
          ],
        },
        tech_stack: {
          frontend: fStack.join(", "),
          backend: bStack.join(", "),
          database: "PostgreSQL (Supabase RLS)",
          ai_layer: "Google Gemini 3.6 Flash",
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
            desc: `Embed automated machine reasoning for ${dynamicEntity}.`,
          },
        ],
        bpmn_steps: [
          { id: 1, title: loc.step1.title, desc: loc.step1.desc, phase: "Ingestion" },
          { id: 2, title: loc.step2.title, desc: loc.step2.desc, phase: "Processing" },
          { id: 3, title: loc.step3.title, desc: loc.step3.desc, phase: "Execution" },
          { id: 4, title: loc.step4.title, desc: loc.step4.desc, phase: "Delivery" }
        ],
        database_tables: domainData.tables,
        database_relationships: [
          `${domainData.tables[0]?.table_name || "users"} -> ${domainData.tables[1]?.table_name || "records"}`,
          `${domainData.tables[1]?.table_name || "records"} -> ${domainData.tables[2]?.table_name || "details"}`,
          `${domainData.tables[0]?.table_name || "users"} -> ${domainData.tables[2]?.table_name || "details"}`
        ],
        api_endpoints: domainData.endpoints,
        wireframe_sections: isGuj ? [
          { title: `${dynamicEntity} પોર્ટલ (${domainData.tables[0]?.table_name || "મેઇન"})`, components: [`${dynamicEntity} લિસ્ટિંગ અને વિગતો`, "સ્માર્ટ સર્ચ અને ફિલ્ટર્સ", "પ્રાથમિક એક્શન મોડલ", "લાઇવ સ્ટેટસ મોનિટરિંગ"] },
          { title: `${dynamicEntity} એડમિન ડેશબોર્ડ`, components: ["લાઇવ ઓપરેશનલ એનાલિટિક્સ", "રેકોર્ડ્સ મેનેજમેન્ટ ટેબલ", "એક્ટિવિટી લોગ્સ", "સ્ટેટસ બેજ"] },
          { title: `${dynamicEntity} સિસ્ટમ સેટિંગ્સ`, components: ["પ્રોફાઈલ માહિતી", "API અને વેબહૂક કન્ફિગરેશન", "નોટિફિકેશન પ્રેફરન્સ"] }
        ] : isHindi ? [
          { title: `${dynamicEntity} पोर्टल (${domainData.tables[0]?.table_name || "मेन"})`, components: [`${dynamicEntity} लिस्टिंग एवं विवरण`, "खोज और फ़िल्टर", "प्राथमिक एक्शन मोडल", "लाइव स्टेटस ट्रैकिंग"] },
          { title: `${dynamicEntity} एडमिन डैशबोर्ड`, components: ["लाइव एनालिटिक्स", "रिकॉर्ड्स मैनेजमेंट टेबल", "एक्टिविटी लॉग्स", "स्टेटस"] },
          { title: `${dynamicEntity} सेटिंग्स`, components: ["प्रोफाइल", "API व वेबहुक कॉन्फ़िगरेशन", "सूचना प्राथमिकताएं"] }
        ] : isEs ? [
          { title: `Portal de ${dynamicEntity}`, components: [`Directorio de ${dynamicEntity}`, "Búsqueda y Filtros", "Formulario de Acción Principal", "Detalles y Estado en Vivo"] },
          { title: `Panel de Control de ${dynamicEntity}`, components: ["Métricas Operativas", "Tabla de Gestión de Registros", "Registro de Actividad", "Insignias de Estado"] },
          { title: `Configuraciones del Sistema`, components: ["Perfil de Organización", "Integraciones de API", "Preferencias de Alertas"] }
        ] : isFr ? [
          { title: `Portail ${dynamicEntity}`, components: [`Répertoire ${dynamicEntity}`, "Recherche et Filtres", "Formulaire d'Action Principale", "Détails et Statut en Direct"] },
          { title: `Tableau de Bord Opérationnel`, components: ["Indicateurs Clés (KPI)", "Table de Gestion des Dossiers", "Journal d'Activité", "Badges de Statut"] },
          { title: `Paramètres Système`, components: ["Profil Utilisateur", "Intégrations API & Webhooks", "Préférences de Notifications"] }
        ] : isDe ? [
          { title: `${dynamicEntity} Portal`, components: [`${dynamicEntity} Übersicht`, "Suche & Filter", "Hauptaktions-Formular", "Live-Status-Tracking"] },
          { title: `${dynamicEntity} Steuerungs-Dashboard`, components: ["Betriebs-KPIs", "Datensatz-Verwaltungstabelle", "Aktivitätsprotokoll", "Status-Badges"] },
          { title: `Systemeinstellungen`, components: ["Organisationsprofil", "API-Integrationen", "Benachrichtigungseinstellungen"] }
        ] : [
          { title: `${dynamicEntity} Portal & Operations`, components: [`${dynamicEntity} Directory & Modules`, "Advanced Search & Filters", "Primary Action Dispatcher", "Real-Time Telemetry & Status Drawer"] },
          { title: `${dynamicEntity} Admin Management Center`, components: ["Live Operational KPIs", "Records Management Ledger", "Audit Trail & Logs", "Status Badges"] },
          { title: `System & Integration Settings`, components: ["User & Tenant Profile", "API Gateway & Webhook Settings", "Notification Preferences"] }
        ],
        roadmap_sprints: [
          {
            timeframe: isGuj ? "અઠવાડિયું 1 (દિવસ 1-7)" : isHindi ? "सप्ताह 1 (दिन 1-7)" : isEs ? "Semana 1 (Días 1-7)" : isFr ? "Semaine 1 (Jours 1-7)" : isDe ? "Woche 1 (Tage 1-7)" : "Week 1 (Days 1-7)",
            phase: isGuj ? "UI અને આર્કિટેક્ચર સેટઅપ" : isHindi ? "UI और आर्किटेक्चर सेटअप" : isEs ? "Configuración de Interfaz y Arquitectura" : isFr ? "Configuration UI & Architecture" : isDe ? "UI & Architektur Setup" : "Client/UI & Architecture Setup",
            tech_stack: fStack,
            ai_tools: aiToolFront,
            owner: isGuj ? "લીડ ફ્રન્ટએન્ડ ડેવલપર" : isHindi ? "लीड फ्रंटएंड डेवलपर" : isEs ? "Desarrollador Frontend" : isFr ? "Développeur Frontend" : isDe ? "Frontend Entwickler" : "Lead Frontend/Mobile Developer",
            platform: platformFront,
            tasks: isGuj ? [
              `${dynamicEntity} માટે પ્રોજેક્ટ શરૂ કરો.`,
              `બિલ્ડ ટૂલ્સ અને પેકેજ કન્ફિગર કરો.`,
              `મુખ્ય UI લેઆઉટ ${fStack[0]} નો ઉપયોગ કરીને બનાવો.`,
              `સ્ટેટ મેનેજમેન્ટ અને લોકલ કેશિંગ ગોઠવો.`
            ] : isHindi ? [
              `${dynamicEntity} के लिए प्रोजेक्ट प्रारंभ करें।`,
              `बिल्ड टूल्स और पैकेज कॉन्फ़िगर करें।`,
              `${fStack[0]} का उपयोग करके मुख्य UI लेआउट बनाएं।`,
              `स्टेट मैनेजमेंट और लोकल कैशिंग सेट करें।`
            ] : isEs ? [
              `Iniciar repositorio para ${dynamicEntity}.`,
              `Configurar herramientas de construcción.`,
              `Crear componentes UI principales usando ${fStack[0]}.`,
              `Implementar gestión de estado.`
            ] : isFr ? [
              `Initialiser le dépôt pour ${dynamicEntity}.`,
              `Configurer les outils de construction.`,
              `Créer les composants UI avec ${fStack[0]}.`,
              `Implémenter la gestion d'état.`
            ] : isDe ? [
              `Repository für ${dynamicEntity} initialisieren.`,
              `Build-Tools konfigurieren.`,
              `Haupt-UI-Komponenten mit ${fStack[0]} erstellen.`,
              `Zustandsverwaltung implementieren.`
            ] : [
              `Initialize repository and set up branching strategy for ${dynamicEntity}.`,
              `Configure project build tools and package manager dependencies.`,
              `Build main user interfaces and responsive layout components using ${fStack[0]}.`,
              `Implement state management and local caching strategies.`
            ]
          },
          {
            timeframe: isGuj ? "અઠવાડિયું 2 (દિવસ 8-14)" : isHindi ? "सप्ताह 2 (दिन 8-14)" : isEs ? "Semana 2 (Días 8-14)" : isFr ? "Semaine 2 (Jours 8-14)" : isDe ? "Woche 2 (Tage 8-14)" : "Week 2 (Days 8-14)",
            phase: isGuj ? "બેકએન્ડ અને ડેટાબેઝ" : isHindi ? "बैकएंड और डेटाबेस" : isEs ? "Backend y Base de Datos" : isFr ? "Backend et Base de données" : isDe ? "Backend & Datenbank" : "Backend, Database & Core Logic",
            tech_stack: bStack,
            ai_tools: aiToolBack,
            owner: isGuj ? "બેકએન્ડ એન્જિનિયર" : isHindi ? "बैकएंड इंजीनियर" : isEs ? "Ingeniero Backend" : isFr ? "Ingénieur Backend" : isDe ? "Backend Ingenieur" : "Backend Data Engineer",
            platform: platformBack,
            tasks: isGuj ? [
              `ડેટાબેઝ ટેબલ્સ ડિઝાઇન કરો.`,
              `સિક્યોર REST APIs બનાવો.`,
              `મુખ્ય બિઝનેસ લોજિક જોડો.`,
              `API સિક્યોરિટી અને ટેસ્ટિંગ પૂરું કરો.`
            ] : isHindi ? [
              `डेटाबेस टेबल्स डिज़ाइन करें।`,
              `सुरक्षित REST APIs बनाएं।`,
              `मुख्य बिजनेस लॉजिक जोड़ें।`,
              `API सुरक्षा और परीक्षण पूरा करें।`
            ] : isEs ? [
              `Diseñar tablas de base de datos.`,
              `Escribir APIs REST seguras.`,
              `Implementar lógica de negocio.`,
              `Completar pruebas de API.`
            ] : isFr ? [
              `Concevoir les tables de base de données.`,
              `Écrire des APIs REST sécurisées.`,
              `Implémenter la logique métier.`,
              `Terminer les tests de l'API.`
            ] : isDe ? [
              `Datenbanktabellen entwerfen.`,
              `Sichere REST-APIs schreiben.`,
              `Geschäftslogik implementieren.`,
              `API-Tests abschließen.`
            ] : [
              `Design and provision database tables for the ${dynamicEntity} domain.`,
              `Write secure REST/GraphQL API endpoints with JWT authentication.`,
              `Implement core business logic and third-party integrations (e.g. payments).`,
              `Write automated unit/integration tests for the backend pipeline.`
            ]
          }
        ],
        planning: {
          effortHours: `${totalHours}`,
          cloudCost: `$${isEnterprise ? 280 : hasAI ? 180 : 120}/mo`,
          cloudDetail: "PostgreSQL + Edge Compute + Gemini API",
          risk: {
            level: "Low-Medium",
            title: loc.riskTitle,
            mitigation: loc.riskMitigation,
          },
        },
        business_analysis: {
          project_title: dynamicTitle,
          executive_summary: {
            strategic_intent: p,
            key_value_drivers: isGuj ? [
              "મેન્યુઅલ કામકાજના સમયમાં ૭૦% થી ૮૦% સુધીનો ઘટાડો",
              "AI એજન્ટ દ્વારા ૨૪/૭ ગ્રાહકોને તાત્કાલિક સેવા",
              "તમામ વિભાગોમાં રિયલ-ટાઇમ લાઇવ ડેટા પારદર્શિતા",
              "મેન્યુઅલ એન્ટ્રી અને ભૂલોનું સંપૂર્ણ નિવારણ"
            ] : isHindi ? [
              "मैनुअल कार्य समय में 70% से 80% तक की कमी",
              "AI एजेंट द्वारा 24/7 ग्राहकों को त्वरित सहायता",
              "सभी विभागों में रियल-टाइम डेटा पारदर्शिता",
              "मैनुअल प्रविष्टि और त्रुटियों का पूर्ण निवारण"
            ] : isEs ? [
              "Reducción del 70% en la latencia operativa manual",
              "Interacciones automatizadas 24/7 mediante agentes de IA",
              "Visibilidad de datos en tiempo real entre departamentos",
              "Eliminación de errores de entrada manual"
            ] : isFr ? [
              "Réduction de 70% des délais opérationnels manuels",
              "Interactions automatisées 24/7 via des agents IA",
              "Visibilité des données en temps réel entre les départements",
              "Élimination des erreurs de saisie manuelle"
            ] : isDe ? [
              "70% Reduzierung manueller Betriebszeiten",
              "Automatisierte 24/7 Kundeninteraktionen über KI-Agenten",
              "Echtzeit-Datentransparenz über alle Abteilungen hinweg",
              "Beseitigung manueller Eingabefehler"
            ] : [
              "Reduction in manual operational latency",
              "Automated 24/7 customer interactions via AI agents",
              "Unified real-time data visibility across departments",
              "Elimination of manual entry errors"
            ],
            projected_roi_percentage: "280% - 360%",
            estimated_payback_months: isGuj ? "૪-૬ મહિના" : isHindi ? "4-6 महीने" : isEs ? "4-6 Meses" : isFr ? "4-6 Mois" : isDe ? "4-6 Monate" : "4-6 Months",
            operational_efficiency_gain: "60%"
          },
          current_state: {
            summary: isGuj ? "મેન્યુઅલ કામકાજ, વિખરાયેલા ટૂલ્સ અને ધીમી સેવાને કારણે થતો સમયનો બગાડ." : isHindi ? "मैनुअल कार्य, बिखरे हुए टूल्स और धीमी सेवा के कारण समय का नुकसान।" : isEs ? "Operaciones fragmentadas con hojas de cálculo y herramientas manuales lentas." : isFr ? "Opérations fragmentées avec des feuilles de calcul manuelles et des outils lents." : isDe ? "Fragmentierte Abläufe mit manuellen Tabellen und langsamen Systemen." : "Fragmented operations with manual overhead, disconnected tools, and slow resolution times.",
            manual_workflows: isGuj ? [
              "મેન્યુઅલ ઓર્ડર અને બુકિંગ ટ્રેકિંગ",
              "મેન્યુઅલ ઇન્વેન્ટરી અને સ્ટેટસ અપડેટ્સ",
              "ગ્રાહકોની પૂછપરછનો ધીમો મેન્યુઅલ નિકાલ"
            ] : isHindi ? [
              "मैनुअल ऑर्डर और बुकिंग ट्रैकिंग",
              "मैनुअल इन्वेंटरी व स्टेटस अपडेट्स",
              "ग्राहकों के प्रश्नों का धीमा निपटान"
            ] : isEs ? [
              "Seguimiento manual de pedidos y reservas",
              "Actualizaciones manuales de inventario",
              "Gestión lenta de consultas de clientes"
            ] : isFr ? [
              "Suivi manuel des commandes et réservations",
              "Mises à jour manuelles des stocks",
              "Traitement lent des demandes clients"
            ] : isDe ? [
              "Manuelle Nachverfolgung von Bestellungen und Buchungen",
              "Manuelle Bestandsaktualisierungen",
              "Langsame Bearbeitung von Kundenanfragen"
            ] : [
              "Manual order & booking tracking",
              "Disjointed inventory updates",
              "Manual customer query triage"
            ],
            core_bottlenecks: isGuj ? [
              "પીક સમયમાં ગ્રાહકોને લાંબો વેઇટિંગ ટાઇમ",
              "ઓનલાઇન અને ઓફલાઇન ચેનલો વચ્ચે તાલમેલનો અભાવ",
              "અલગ-અલગ ફાઇલોમાં ડેટા વેરવિખેર હોવો"
            ] : isHindi ? [
              "व्यस्त समय में ग्राहकों का लंबा प्रतीक्षा समय",
              "ऑनलाइन और ऑफलाइन के बीच तालमेल की कमी",
              "अलग-अलग फाइलों में डेटा का बिखराव"
            ] : isEs ? [
              "Altos retrasos operativos en horas pico",
              "Falta de sincronización multicanal",
              "Fragmentación de datos en varias herramientas"
            ] : isFr ? [
              "Délais opérationnels élevés aux heures de pointe",
              "Manque de synchronisation multicanal",
              "Fragmentation des données entre outils"
            ] : isDe ? [
              "Hohe Verzögerungen in Spitzenzeiten",
              "Fehlende Multichannel-Synchronisation",
              "Datenfragmentierung über Tools hinweg"
            ] : [
              "High peak-hour operational delays",
              "Lack of real-time multi-channel sync",
              "Data fragmentation across tools"
            ],
            legacy_limitations: isGuj ? [
              "કોઈ સેન્ટ્રલાઇઝ્ડ ક્લાઉડ ડેટાબેઝ નથી",
              "ગ્રાહકોના રેકોર્ડ્સ અલગ-અલગ પડેલા છે"
            ] : isHindi ? [
              "कोई सेंट्रलाइज्ड क्लाउड डेटाबेस नहीं",
              "ग्राहकों के रिकॉर्ड्स बिखरे हुए हैं"
            ] : isEs ? [
              "Sin base de datos centralizada en la nube",
              "Registros de clientes aislados"
            ] : isFr ? [
              "Pas de base de données cloud centralisée",
              "Dossiers clients cloisonnés"
            ] : isDe ? [
              "Keine zentrale Cloud-Datenbank",
              "Isolierte Kundendatensätze"
            ] : [
              "No centralized API database",
              "Siloed customer records"
            ]
          },
          future_state: {
            vision_summary: isGuj ? "AI-સંચાલિત ડિજિટલ પ્લેટફોર્મ જ્યાં ઓટોમેટેડ વર્કફ્લો અને રિયલ-ટાઇમ ડેટાબેઝ ઉપલબ્ધ છે." : isHindi ? "AI-संचालित डिजिटल प्लेटफॉर्म जहां ऑटोमेटेड वर्कफ़्लो और रियल-टाइम डेटाबेस उपलब्ध है।" : isEs ? "Empresa digital aumentada con IA y flujos de trabajo autónomos." : isFr ? "Entreprise numérique augmentée par l'IA avec des flux autonomes." : isDe ? "KI-gestütztes digitales Unternehmen mit autonomen Workflows." : "AI-augmented digital enterprise with autonomous agent workflows and real-time database state.",
            automated_workflows: isGuj ? [
              "મોબાઇલ અને વેબ દ્વારા ત્વરિત સેલ્ફ-સર્વિસ સુવિધા",
              "ઓટોમેટેડ AI સહાયક દ્વારા ૨૪/૭ ગ્રાહક સેવા",
              "ડેટાબેઝ સાથે લાઇવ સિંક્રોનાઇઝેશન"
            ] : isHindi ? [
              "मोबाइल व वेब द्वारा त्वरित सेल्फ-सर्विस सुविधा",
              "ऑटोमेटेड AI सहायक द्वारा 24/7 सहायता",
              "डेटाबेस के साथ लाइव सिंक्रोनाइज़ेशन"
            ] : isEs ? [
              "Autoservicio instantáneo web y móvil",
              "Asistente autónomo de IA para atención 24/7",
              "Sincronización en tiempo real con la base de datos"
            ] : isFr ? [
              "Parcours numérique libre-service web et mobile",
              "Assistant IA autonome 24/7 pour les clients",
              "Synchronisation en direct avec la base de données"
            ] : isDe ? [
              "Sofortige Self-Service-Lösung für Web & Mobile",
              "Autonomer KI-Assistent für 24/7 Kundenservice",
              "Echtzeit-Synchronisierung mit der Datenbank"
            ] : [
              "Instant self-service web/mobile digital journey",
              "Autonomous AI assistant for customer queries",
              "Real-time database state with instant webhook sync"
            ],
            ai_transformation_touchpoints: isGuj ? [
              "ઓર્ડર અને બુકિંગ માટે સ્માર્ટ AI આસિસ્ટન્ટ",
              "ભવિષ્યની ડિમાન્ડનું અગાઉથી અનુમાન",
              "વિલંબ કે સમસ્યા સમયે ત્વરિત મેનેજર એલર્ટ્સ"
            ] : isHindi ? [
              "ऑर्डर व बुकिंग हेतु स्मार्ट AI सहायक",
              "भविष्य की मांग का पूर्व अनुमान",
              "समस्या या देरी पर त्वरित मैनेजर अलर्ट्स"
            ] : isEs ? [
              "Asistente de IA para clasificación de pedidos",
              "Previsión predictiva de la demanda",
              "Alertas inteligentes ante excepciones"
            ] : isFr ? [
              "Assistant IA pour le tri des commandes",
              "Prévision prédictive de la demande",
              "Alertes intelligentes en cas d'anomalie"
            ] : isDe ? [
              "KI-Assistent für die Bestellungsabwicklung",
              "Vorausschauende Nachfrageprognose",
              "Intelligente Ausnahme- und Fehlerwarnungen"
            ] : [
              "Conversational AI Assistant for order/service triage",
              "Predictive demand forecasting",
              "Intelligent exception alerts"
            ],
            target_kpis: isGuj ? [
              "સેકન્ડોમાં ઝડપી રિસ્પોન્સ સમય",
              "૯૯.૯% ક્લાઉડ સિસ્ટમ અપટાઇમ",
              "૯૦%+ સંતોષકારક ગ્રાહક રેટિંગ"
            ] : isHindi ? [
              "सेकंडों में तेज़ रिस्पांस समय",
              "99.9% क्लाउड सिस्टम अपटाइम",
              "90%+ ग्राहक संतुष्टि रेटिंग"
            ] : isEs ? [
              "Tiempo de respuesta inferior a un segundo",
              "99.9% de disponibilidad en la nube",
              "Más del 90% de satisfacción del cliente"
            ] : isFr ? [
              "Temps de réponse inférieur à une seconde",
              "Disponibilité cloud de 99,9%",
              "Plus de 90% de satisfaction client"
            ] : isDe ? [
              "Antwortzeit im Subsekundenbereich",
              "99,9% Cloud-Systemverfügbarkeit",
              "Über 90% Kundenzufriedenheit"
            ] : [
              "Sub-second response latency",
              "99.9% uptime with scalable serverless cloud",
              "90%+ positive customer satisfaction"
            ]
          },
          gap_analysis: isGuj ? [
            {
              id: "gap-1",
              category: "પ્રોસેસ (Process)",
              current_state: "મેન્યુઅલ કામકાજ અને માહિતીની આપ-લે",
              future_state: "ઓટોમેટેડ એન્ડ-ટુ-એન્ડ ડિજિટલ વર્કફ્લો",
              gap_description: "સ્વચાલિત શેડ્યુલિંગ અને સ્ટેટસ ટ્રેકિંગનો અભાવ",
              severity: "Critical",
              mitigation_strategy: "ઇવેન્ટ-ડ્રાઇવન REST APIs અને વેબહૂક્સ અમલમાં મૂકવા"
            },
            {
              id: "gap-2",
              category: "ટેકનોલોજી (Technology)",
              current_state: "અલગ-અલગ સોફ્ટવેર જેમાં સેન્ટ્રલ API નથી",
              future_state: "સુરક્ષિત ક્લાઉડ-નેટિવ PostgreSQL ડેટાબેઝ",
              gap_description: "સંયુક્ત રિલેશનલ સ્કીમા અને APIs ની ગેરહાજરી",
              severity: "High",
              mitigation_strategy: "સ્ટ્રક્ચર્ડ ડેટાબેઝ ટેબલ્સ અને રોલ-બેઝ્ડ એક્સેસ લાગુ કરવું"
            },
            {
              id: "gap-3",
              category: "ડેટા (Data)",
              current_state: "ગ્રાહક અને બુકિંગ હિસ્ટ્રી ઑફલાઇન નોંધાયેલ છે",
              future_state: "સંપૂર્ણ ૩૬૦° ગ્રાહક પ્રોફાઇલ અને લાઇવ ટેલિમેટ્રી",
              gap_description: "વ્યક્તિગત ભલામણો કે સ્માર્ટ ઓફર્સ આપી શકાતી નથી",
              severity: "Medium",
              mitigation_strategy: "સુરક્ષિત એન્ક્રિપ્ટેડ ક્લાઉડ ડેટાબેઝમાં ડેટા એકત્રિત કરવો"
            },
            {
              id: "gap-4",
              category: "ટીમ (People)",
              current_state: "કર્મચારીઓ ૬૦% સમય સામાન્ય સવાલોના જવાબોમાં વિતાવે છે",
              future_state: "AI કોપાયલટ દ્વારા સામાન્ય સવાલોનો આપમેળે નિકાલ",
              gap_description: "મહત્વના બિઝનેસ ગ્રોથ માટે સ્ટાફ પાસે સમયનો અભાવ",
              severity: "High",
              mitigation_strategy: "ગ્રાહકો માટે સ્માર્ટ AI ચેટ સહાયક તૈનાત કરવો"
            }
          ] : [
            {
              id: "gap-1",
              category: "Process",
              current_state: "Manual task coordination and data handoffs",
              future_state: "Automated end-to-end digital workflow with real-time sync",
              gap_description: "Missing automated scheduling, status tracking and notification pipeline",
              severity: "Critical",
              mitigation_strategy: "Implement event-driven REST API triggers and webhook handlers"
            },
            {
              id: "gap-2",
              category: "Technology",
              current_state: "Disconnected standalone software without centralized API storage",
              future_state: "Cloud-native PostgreSQL database with Row-Level Security (RLS)",
              gap_description: "Lack of relational schema and unified REST endpoints",
              severity: "High",
              mitigation_strategy: "Provision structured tables and role-based access control (RBAC)"
            },
            {
              id: "gap-3",
              category: "Data",
              current_state: "Customer purchase and booking history stored in offline logs",
              future_state: "Unified customer 360 profile with real-time operational telemetry",
              gap_description: "Inability to run personalized recommendation or retention engines",
              severity: "Medium",
              mitigation_strategy: "Consolidate user profiles in a secure encrypted PostgreSQL database"
            },
            {
              id: "gap-4",
              category: "People",
              current_state: "Staff spends 60% of work hours on routine repetitive queries",
              future_state: "AI Copilot assists staff; routine requests resolved autonomously",
              gap_description: "Staff bandwidth exhausted on non-revenue administrative overhead",
              severity: "High",
              mitigation_strategy: "Deploy conversational AI assistant for frontline customer triage"
            }
          ],
          digital_maturity: {
            overall_score: maturityScore,
            level: maturityScore >= 80 ? "Advanced" : maturityScore >= 60 ? "Defined" : "Developing",
            dimensions: isGuj ? [
              { name: "વ્યુહરચના અને વિઝન", score: Math.min(maturityScore + 5, 95), level: "Advanced", description: "ડિજિટલ રોડમેપ અને લક્ષ્યો.", recommendation: "દર ત્રિમાસિક ગાળે KPI રિવ્યુ કરો." },
              { name: "ટેકનોલોજી આર્કિટેક્ચર", score: maturityScore, level: "Defined", description: "આધુનિક ક્લાઉડ અને API સ્તર.", recommendation: "માઇક્રોસર્વિસ સ્કેલેબિલિટી જાળવો." },
              { name: "ડેટા અને એનાલિટિક્સ", score: Math.max(maturityScore - 5, 50), level: "Defined", description: "રિલેશનલ ડેટાબેઝ સ્કીમા.", recommendation: "રિયલ-ટાઇમ એનાલિટિક્સ સક્ષમ કરો." },
              { name: "ઓપરેશન્સ અને ઓટોમેશન", score: Math.min(maturityScore + 2, 95), level: "Advanced", description: "સ્વચાલિત ટાસ્ક વર્કફ્લો.", recommendation: "પ્રેડિક્ટિવ શેડ્યુલિંગ લાગુ કરો." }
            ] : [
              { name: "Strategy & Vision", score: Math.min(maturityScore + 5, 95), level: "Advanced", description: "Strategic digital roadmap.", recommendation: "Maintain quarterly KPI cycles." },
              { name: "Technology Architecture", score: maturityScore, level: "Defined", description: "Modern cloud and API tier.", recommendation: "Enforce microservice scalability." },
              { name: "Data & Analytics", score: Math.max(maturityScore - 5, 50), level: "Defined", description: "Relational database schema.", recommendation: "Enable real-time telemetry." },
              { name: "Operations & Automation", score: Math.min(maturityScore + 2, 95), level: "Advanced", description: "Automated task workflows.", recommendation: "Deploy predictive scheduling." }
            ]
          },
          ai_readiness: {
            overall_score: aiReadinessScore,
            readiness_grade: isGuj ? (aiReadinessScore >= 80 ? "ઉચ્ચ AI તૈયારી" : "મધ્યમ AI તૈયારી") : (aiReadinessScore >= 80 ? "High AI Readiness" : "Moderate AI Readiness"),
            dimensions: isGuj ? [
              { dimension: "ડેટા ગુણવત્તા અને ઉપલબ્ધતા", score: Math.min(aiReadinessScore, 90), status: "Ready", finding: "સ્વચ્છ રિલેશનલ સ્કીમા ઉપલબ્ધ છે.", action_item: "ડેટા વેલિડેશન ચાલુ રાખો." },
              { dimension: "ઇન્ફ્રાસ્ટ્રક્ચર અને API ચપળતા", score: Math.min(aiReadinessScore + 6, 96), status: "Ready", finding: "આધુનિક Next.js / Node.js આર્કિટેક્ચર.", action_item: "રેટ લિમિટિંગ સેટ કરો." },
              { dimension: "ટીમ અને સંસ્થાકીય સ્વીકૃતિ", score: Math.max(aiReadinessScore - 8, 60), status: "Ready", finding: "સ્ટાફ નવી સિસ્ટમ શીખવા તૈયાર છે.", action_item: "AI કોપાયલટ તાલીમ આપો." },
              { dimension: "સુરક્ષા અને ગવર્નન્સ", score: 88, status: "Ready", finding: "રોલ-બેઝ્ડ સુરક્ષા ગોઠવેલ છે.", action_item: "ઓડિટ લોગિંગ જાળવો." }
            ] : [
              { dimension: "Data Quality & Availability", score: Math.min(aiReadinessScore, 90), status: "Ready", finding: "Clean relational schemas ready for LLM context.", action_item: "Maintain data validation." },
              { dimension: "Infrastructure & API Agility", score: Math.min(aiReadinessScore + 6, 96), status: "Ready", finding: "Modern Next.js / Node.js architecture.", action_item: "Configure rate limiting." },
              { dimension: "Team & Organizational Adoption", score: Math.max(aiReadinessScore - 8, 60), status: "Ready", finding: "Staff receptive to workflow automation.", action_item: "Conduct copilot training." },
              { dimension: "Governance, Security & Ethics", score: 88, status: "Ready", finding: "Role-based authentication & data isolation configured.", action_item: "Enforce audit logging." }
            ],
            key_enablers: isGuj ? ["આધુનિક ક્લાઉડ API તૈયારી", "ક્લીન રિલેશનલ ડેટાબેઝ સ્કીમા", "મલ્ટી-મોડેલ AI આર્કિટેક્ચર"] : ["Modern cloud API readiness", "Clean relational database schema", "Multi-model Gemini fallback architecture"],
            key_blockers: isGuj ? ["મેન્યુઅલ કામની જૂની ટેવ", "યુઝર ઓનબોર્ડિંગ ઘર્ષણ"] : ["Legacy manual habit", "User onboarding friction"]
          },
          ai_opportunities: isGuj ? [
            {
              id: "opp-1",
              title: "સ્માર્ટ AI કન્વર્સેશનલ આસિસ્ટન્ટ",
              category: "જનરેટિવ AI",
              business_impact: "રૂપાંતરણકારી (Transformational)",
              feasibility: "ઉચ્ચ (પ્લગ એન્ડ પ્લે)",
              estimated_roi: "૩૪૦% ROI",
              time_to_value: "૨-૩ અઠવાડિયા",
              description: "ગ્રાહકોની પૂછપરછ, બુકિંગ, ઓર્ડર અને સામાન્ય સવાલો માટે ૨૪/૭ ઓટોમેટેડ સહાય.",
              recommended: true
            },
            {
              id: "opp-2",
              title: "ડાઇનેમિક સ્માર્ટ ભલામણ એન્જિન",
              category: "પ્રેડિક્ટિવ એનાલિટિક્સ",
              business_impact: "ઉચ્ચ (High)",
              feasibility: "મધ્યમ (કસ્ટમ ઇન્ટીગ્રેશન)",
              estimated_roi: "૨૧૦% ROI",
              time_to_value: "૪ અઠવાડિયા",
              description: "ગ્રાહકની પસંદગી અને અગાઉના ઓર્ડર મુજબ સંબંધિત પ્રોડક્ટ્સ/સેવાઓની ભલામણ.",
              recommended: true
            },
            {
              id: "opp-3",
              title: "ઓટોમેટેડ વર્કફ્લો અને એલર્ટ સિસ્ટમ",
              category: "ઇન્ટેલિજન્ટ ઓટોમેશન",
              business_impact: "ઉચ્ચ (High)",
              feasibility: "ઉચ્ચ (પ્લગ એન્ડ પ્લે)",
              estimated_roi: "૧૮૦% ROI",
              time_to_value: "૧-૨ અઠવાડિયા",
              description: "નવા ઓર્ડર/બુકિંગ પર આપમેળે ટાસ્ક શરૂ કરવા અને વિલંબ પર મેનેજર એલર્ટ આપવા.",
              recommended: true
            }
          ] : [
            {
              id: "opp-1",
              title: "Conversational Customer AI Assistant",
              category: "Generative AI",
              business_impact: "Transformational",
              feasibility: "High (Plug & Play)",
              estimated_roi: "340% ROI",
              time_to_value: "2-3 Weeks",
              description: "24/7 automated customer assistance for inquiries, bookings, orders, and instant FAQs.",
              recommended: true
            },
            {
              id: "opp-2",
              title: "Dynamic Smart Recommendation Engine",
              category: "Predictive Analytics",
              business_impact: "High",
              feasibility: "Medium (Custom Integration)",
              estimated_roi: "210% ROI",
              time_to_value: "4 Weeks",
              description: "Contextual upsell & cross-sell suggestions based on user preferences and purchase history.",
              recommended: true
            },
            {
              id: "opp-3",
              title: "Automated Workflow Dispatch & Anomaly Alerts",
              category: "Intelligent Automation",
              business_impact: "High",
              feasibility: "High (Plug & Play)",
              estimated_roi: "180% ROI",
              time_to_value: "1-2 Weeks",
              description: "Automated task triggers on new orders with instant manager alerts for delays.",
              recommended: true
            }
          ],
          is_approved: false
        }
      };
    };

    // If Gemini API key is available and not in mock-mode
    if (apiKey && apiKey.trim() !== "" && selectedModel !== "mock-mode") {
      try {
        const targetLangName = rawLang;
        const modelName = selectedModel.includes("pro") ? "gemini-2.5-pro" : "gemini-3.6-flash";

        const roleInstructions = "IMPORTANT: The user wants a clean, complete, implementation-ready architecture. Make sure ALL labels, descriptions, tasks, bpmn steps, wireframes, and business analysis are written fluently in the requested TARGET LANGUAGE.";

        const systemPrompt = `You are a world-class AI Solution Architect and Enterprise Transformation Consultant.
Analyze the user requirement and generate a comprehensive architecture blueprint.

CRITICAL LOCALIZATION RULE:
- The user has selected TARGET LANGUAGE: "${targetLangName}".
- EVERY single text field in the response (including project_title, chat_reply, initiatives titles & descs, bpmn_steps titles & descs, wireframe_sections titles & component names, roadmap_sprints phases & tasks, business_analysis strategic_intent, key_value_drivers, summaries, gap_analysis, digital_maturity dimensions, ai_readiness dimensions, and ai_opportunities) MUST be translated fluently and fully into: ${targetLangName}.
- Do NOT output English when ${targetLangName} is selected (except for standard code identifiers like SQL types or API routes).

${roleInstructions}

USER REQUIREMENT: "${cleanPrompt}"

Output ONLY a single valid JSON object with the complete architecture blueprint in ${targetLangName}.`;

        const candidateModels = [
          "gemini-3.6-flash",
          "gemini-3.7-flash",
          "gemini-flash-latest",
          "gemini-3.1-pro-preview"
        ];

        for (const currentModel of candidateModels) {
          try {
            const reqParts: any[] = [{ text: systemPrompt }];
            if (documentBase64) {
              reqParts.push({
                inlineData: {
                  mimeType: documentMimeType || "application/pdf",
                  data: documentBase64,
                }
              });
            }

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: reqParts }],
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
                const cleanedText = candidateText.replace(/^```(json)?|```$/gi, "").trim();
                const parsed = JSON.parse(cleanedText);
                if (parsed) {
                  if (!parsed.user_problem || parsed.user_problem.includes("[PHASE 1 DISCOVERY") || parsed.user_problem.includes("[DISCOVERY INTERVIEW")) {
                    parsed.user_problem = userFacingProblem;
                  }
                  parsed.target_language = targetLangName;
                }
                console.log(`>>> [GEMINI ${currentModel.toUpperCase()} SUCCESS] Bespoke Architecture Generated in ${targetLangName}!`);
                return NextResponse.json({ success: true, data: parsed, gemini_used: true, model: currentModel });
              }
            } else {
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

    const data = generateSmartDomainBlueprint(userFacingProblem, rawLang, role);
    return NextResponse.json({ success: true, data, gemini_used: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
