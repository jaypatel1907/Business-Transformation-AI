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
    } = await req.json();

    const rawLang = targetLanguage || language || "English";
    const apiKey = process.env.GEMINI_API_KEY;

    let cleanPrompt = prompt ? prompt.trim() : "";
    if (documentText && documentText.trim().length > 0) {
      cleanPrompt += `\n\n[ATTACHED BUSINESS DOCUMENT / BRD]:\n${documentText.slice(0, 3000)}`;
    } else if (documentBase64) {
      cleanPrompt += `\n\n[NOTE: THE USER HAS ATTACHED A DOCUMENT (PDF/IMAGE) FOR YOU TO ANALYZE. EXTRACT THEIR REQUIREMENTS FROM IT AND INCORPORATE THEM INTO THE BLUEPRINT.]`;
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
          titlePrefix: "પ્રોજેક્ટ પ્લાન",
          step1: { title: "૧. ડિઝાઇન અને હોમપેજ (Design)", desc: "સૌથી પહેલા આપણે યુઝર્સ માટે એક સુંદર અને આકર્ષક હોમપેજ બનાવીશું." },
          step2: { title: "૨. પ્રોડક્ટ અને ફીચર્સ (Features)", desc: "ત્યારબાદ આપણે તેમાં જરૂરી ફીચર્સ અને પ્રોડક્ટ કેટેલોગ એડ કરીશું." },
          step3: { title: "૩. ડેટાબેઝ અને સિસ્ટમ (Database)", desc: "પછી આપણે બધો ડેટા સાચવવા માટે પાછળની સિસ્ટમ (બેકએન્ડ) સેટ કરીશું." },
          step4: { title: "૪. ટેસ્ટિંગ અને લાઈવ (Launch)", desc: "છેલ્લે આપણે બધું ચેક કરીને વેબસાઈટને ઈન્ટરનેટ પર લાઈવ કરીશું!" },
          initiative1: "મુખ્ય પ્રોસેસ ડિજિટાઈઝેશન",
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

      // ── 1. DIGITAL MATURITY SCORE ──────────────────────────────────────────
      // Reflects HOW digitally mature the target INDUSTRY is today in real world
      // Low = traditional/manual industries, High = already tech-native
      let maturityScore = 55; // default: medium-low
      if (lower.match(/fintech|bank|payment|wallet|upi|crypto|blockchain/))        maturityScore = 78;
      else if (lower.match(/hospital|clinic|health|patient|doctor|medical|pharma/)) maturityScore = 52;
      else if (lower.match(/school|college|education|lms|learning|course/))         maturityScore = 58;
      else if (lower.match(/ecommerce|shop|store|retail|product|cart|order/))       maturityScore = 74;
      else if (lower.match(/food|restaurant|delivery|kitchen|zomato|swiggy/))       maturityScore = 68;
      else if (lower.match(/logistics|supply chain|warehouse|fleet|shipping/))      maturityScore = 62;
      else if (lower.match(/real estate|property|rental|land|house/))              maturityScore = 48;
      else if (lower.match(/agriculture|farm|crop|irrigation|soil/))               maturityScore = 35;
      else if (lower.match(/saas|platform|software|api|developer|devops/))         maturityScore = 85;
      else if (lower.match(/ai|machine learning|ml|nlp|vision|model|llm/))         maturityScore = 88;
      else if (lower.match(/government|municipal|civic|public|citizen/))           maturityScore = 32;
      else if (lower.match(/hr|recruit|employee|payroll|attendance/))              maturityScore = 61;
      else if (lower.match(/manufacture|factory|production|assembly|plant/))       maturityScore = 44;
      else if (lower.match(/gym|fitness|sport|yoga|wellness/))                     maturityScore = 55;
      else if (lower.match(/travel|hotel|booking|tourism|ticket/))                 maturityScore = 70;
      // Add ±3 based on role for slight variation
      if (activeRole === "Admin") maturityScore = Math.min(maturityScore + 2, 92);
      if (activeRole === "Employee") maturityScore = Math.max(maturityScore - 3, 28);

      // ── 2. AI ADOPTION READINESS ────────────────────────────────────────────
      // Reflects HOW MUCH AI can practically help in this domain right now
      let aiReadinessScore = 60;
      if (lower.match(/ai|machine learning|ml|nlp|vision|model|llm|predict/))      aiReadinessScore = 92;
      else if (lower.match(/fintech|fraud|risk|credit|loan|insurance/))            aiReadinessScore = 88;
      else if (lower.match(/ecommerce|recommend|personali|search|catalog/))        aiReadinessScore = 82;
      else if (lower.match(/logistics|route|optimize|track|fleet|dispatch/))       aiReadinessScore = 78;
      else if (lower.match(/hospital|diagnosis|radiology|triage|symptom/))         aiReadinessScore = 74;
      else if (lower.match(/food|menu|order|kitchen|inventory/))                   aiReadinessScore = 65;
      else if (lower.match(/saas|platform|automation|workflow|bot/))               aiReadinessScore = 85;
      else if (lower.match(/hr|recruit|screen|resume|interview/))                  aiReadinessScore = 76;
      else if (lower.match(/education|tutor|quiz|assessment|adaptive/))            aiReadinessScore = 72;
      else if (lower.match(/real estate|valuation|price|property/))               aiReadinessScore = 62;
      else if (lower.match(/government|document|process|permit|compliance/))       aiReadinessScore = 55;
      else if (lower.match(/agriculture|pest|yield|weather|satellite/))            aiReadinessScore = 68;
      else if (lower.match(/manufacture|quality|defect|inspection|sensor/))        aiReadinessScore = 71;

      // ── 3. TIMELINE — based on real project complexity ──────────────────────
      // Simple CRUD app = 4-6w, Medium complexity = 8-12w, Complex AI/Enterprise = 14-20w
      let weeksTimeline = 8;
      const wordCount = p.trim().split(/\s+/).length;
      const hasAI = lower.match(/ai|machine learning|ml|nlp|vision|model|llm/);
      const hasIntegration = lower.match(/integrate|third.party|payment gateway|erp|crm|sms|email/);
      const isEnterprise = lower.match(/enterprise|large.scale|microservice|multi.tenant|sso|rbac/);
      const isMobile = lower.match(/mobile|ios|android|flutter|app/);

      if (hasAI && isEnterprise)         weeksTimeline = 18;
      else if (hasAI && hasIntegration)  weeksTimeline = 14;
      else if (hasAI)                    weeksTimeline = 12;
      else if (isEnterprise)             weeksTimeline = 14;
      else if (isMobile && hasIntegration) weeksTimeline = 12;
      else if (isMobile)                 weeksTimeline = 10;
      else if (hasIntegration)           weeksTimeline = 10;
      else if (wordCount <= 6)           weeksTimeline = 6;  // simple idea
      else                               weeksTimeline = 8;

      // ── 4. FINANCIAL BUDGET — real market rates ─────────────────────────────
      // India freelance/agency rates: $25-45/hr, US/Global: $65-120/hr
      // We target mid-range startup budget
      const hourlyRate = 75;
      const totalHours = weeksTimeline * 40;
      const minBudget = totalHours * hourlyRate;
      // Enterprise add-ons: security audit, cloud infra, QA = +$8k to +$25k
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
      
      const lowerPrompt = p.toLowerCase();
      if (lowerPrompt.includes("mobile") || lowerPrompt.includes("app") || lowerPrompt.includes("ios") || lowerPrompt.includes("android")) {
        fStack = ["Flutter", "Swift (iOS)", "Kotlin (Android)"];
        bStack = ["Firebase", "Node.js", "Express"];
        aiToolFront = ["GitHub Copilot for Mobile", "ChatGPT"];
        platformFront = ["Apple App Store", "Google Play Console"];
        platformBack = ["Firebase Hosting", "GCP"];
      } else if (lowerPrompt.includes("data") || lowerPrompt.includes("machine learning") || lowerPrompt.includes("ai ") || lowerPrompt.includes("model")) {
        fStack = ["Streamlit", "Python", "React"];
        bStack = ["Python", "FastAPI", "PyTorch"];
        aiToolFront = ["Cursor IDE", "Jupyter AI"];
        aiToolBack = ["ChatGPT (Data Models)", "Claude 3.5 Sonnet"];
        platformFront = ["Vercel", "HuggingFace Spaces"];
        platformBack = ["AWS EC2 (GPU)", "Google Cloud Run"];
      }

      const isGuj = targetLangStr.toLowerCase().includes("gu");
      const isHindi = targetLangStr.toLowerCase().includes("hi");

      const chatReply = isGuj
        ? `નમસ્તે! મેં તમારા **"${p}"** આઈડિયાનું ઊંડાણપૂર્વક વિશ્લેષણ કરીને સંપૂર્ણ સોલ્યુશન આર્કિટેક્ચર બ્લૂપ્રિન્ટ તૈયાર કરી છે.\n\n🎯 **મુખ્ય સિસ્ટમ હાઇલાઇટ્સ:**\n• **ઉદ્યોગ પરિપક્વતા:** ${maturityScore}% | **AI એડોપ્શન સંભાવના:** ${aiReadinessScore}%\n• **લક્ષિત ડિલિવરી:** ${weeksTimeline} અઠવાડિયા (અંદાજિત બજેટ: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})\n• **ટેક આર્કિટેક્ચર:** ${fStack.join(", ")} (ફ્રન્ટએન્ડ) + ${bStack.join(", ")} (બેકએન્ડ Gateway) + PostgreSQL (Supabase RLS)\n• **ડેટા મોડેલ & APIs:** ${domainData.tables.length} કસ્ટમ ટેબલ્સ અને ${domainData.endpoints.length} પ્રોડક્શન-રેડી REST APIs ડિઝાઈન કર્યા છે.\n\n👉 **કેનવાસ પ્લાન જુઓ:**\nજમણી બાજુના Tabs પર ક્લિક કરીને **Process Workflow**, **Live Database Schema**, **Interactive Wireframes**, અને **Sprint Roadmap** તપાસો. કોઈ સુધારો કરવો હોય તો મને જણાવો!`
        : isHindi
        ? `नमस्ते! मैंने आपके **"${p}"** विचार का संपूर्ण समाधान आर्किटेक्चर ब्लूप्रिंट तैयार किया है।\n\n🎯 **मुख्य सिस्टम हाइलाइट्स:**\n• **उद्योग परिपक्वता:** ${maturityScore}% | **AI अपनाने की तत्परता:** ${aiReadinessScore}%\n• **लक्षित डिलीवरी:** ${weeksTimeline} सप्ताह (अनुमानित बजट: $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()})\n• **अनुशंसित टेक स्टैक:** ${fStack.join(", ")} + ${bStack.join(", ")} + PostgreSQL (Supabase RLS)\n• **डेटाबेस और APIs:** ${domainData.tables.length} रिलेशनल टेबल और ${domainData.endpoints.length} REST endpoints तैयार किए हैं।\n\n👉 **दाईं ओर के Tabs देखें:**\nProcess Map, DB & APIs, UX Wireframe और Roadmap का निरीक्षण करें। यदि कोई परिवर्तन करना हो तो बताएं!`
        : `Hello! I've analyzed your business requirement for **"${p}"** and generated a complete enterprise architecture blueprint.\n\n🎯 **Executive Strategy & Architecture Highlights:**\n• **Digital Maturity:** ${maturityScore}% | **AI Adoption Readiness:** ${aiReadinessScore}%\n• **Target MVP Delivery:** ${weeksTimeline} Weeks (Estimated Budget: $${minBudget.toLocaleString()} – $${maxBudget.toLocaleString()})\n• **Recommended Tech Stack:** ${fStack.join(", ")} (Client) + ${bStack.join(", ")} (Gateway) + PostgreSQL (Supabase RLS)\n• **Data & API Layer:** Engineered ${domainData.tables.length} domain-specific relational tables with ${domainData.endpoints.length} production REST endpoints.\n\n👉 **Explore Your Solution Canvas:**\nClick through the tabs on the right to inspect the interactive **Process Map**, **Database Schemas & APIs**, **UX Wireframe Components**, and **Sprint Roadmap**. Feel free to ask any questions or refine specific requirements!`;

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
        wireframe_sections: [
          { title: `${dynamicEntity} Customer Storefront`, components: [`${dynamicEntity} Catalog Grid`, "Advanced Search & Filters", "Shopping Cart Drawer", "Secure Checkout Flow"] },
          { title: `${dynamicEntity} Admin Dashboard`, components: ["Live Sales Analytics", "Inventory Management Table", "Customer Order History", "Status Badges"] },
          { title: `User & ${dynamicEntity} Settings`, components: ["User Profile Details", "Payment Methods", "Order Tracking Module"] }
        ],
          roadmap_sprints: [
            {
              timeframe: "Week 1 (Days 1-7)",
              phase: "Client/UI & Architecture Setup",
              tech_stack: fStack,
              ai_tools: aiToolFront,
              owner: "Lead Frontend/Mobile Developer",
              platform: platformFront,
              tasks: [
                `Initialize repository and set up branching strategy for ${dynamicEntity}.`,
                `Configure project build tools and package manager dependencies.`,
                `Build main user interfaces and responsive layout components using ${fStack[0]}.`,
                `Implement state management and local caching strategies.`
              ]
            },
            {
              timeframe: "Week 2 (Days 8-14)",
              phase: "Backend, Database & Core Logic",
              tech_stack: bStack,
              ai_tools: aiToolBack,
              owner: "Backend Data Engineer",
              platform: platformBack,
              tasks: [
                `Design and provision database tables for the ${dynamicEntity} domain.`,
                `Write secure REST/GraphQL API endpoints with JWT authentication.`,
                `Implement core business logic and third-party integrations (e.g. payments).`,
                `Set up Row-Level Security (RLS) policies for data isolation.`
              ]
            },
            {
              timeframe: "Week 3 (Days 15-21)",
              phase: "Testing, QA & Production Deployment",
              tech_stack: ["GitHub Actions", "Docker", "Jest/Cypress"],
              ai_tools: ["Claude 3.5 Sonnet (for Tests)", "Gemini (Code Review)"],
              owner: "DevOps / Full-Stack Engineer",
              platform: ["Cloud Infrastructure (AWS EC2/Vercel)"],
              tasks: [
                `Write unit and integration tests for critical API paths.`,
                `Configure CI/CD pipelines in GitHub Actions for automated deployment.`,
                `Deploy to production environment and configure custom domains/SSL.`,
                `Conduct final QA, performance audits, and release to end-users.`
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
      };
    };

    // If Gemini API key is available and not in mock-mode
    if (apiKey && apiKey.trim() !== "" && selectedModel !== "mock-mode") {
      try {
        const targetLangName = rawLang;
        const modelName = selectedModel.includes("pro") ? "gemini-2.5-pro" : "gemini-3.6-flash";

        const roleInstructions = "IMPORTANT: The user is a normal, non-technical person! DO NOT use ANY tech jargon like 'microservices', 'API gateways', 'RLS', or 'architecture'. Explain everything in extremely simple, everyday words.";

        const systemPrompt = `You are a friendly, expert Website & App Development Guide talking to a NON-TECHNICAL person.
Your job is to analyze the user's idea (e.g. a shoe website) and generate a super simple, step-by-step beginner-friendly plan.
CRITICAL RULE: DO NOT use heavy enterprise or tech jargon in the descriptions! Use simple words so that a totally normal person can easily understand what to do and what features their website will have.

${roleInstructions}

CRITICAL INSTRUCTIONS (ABSOLUTE DOMAIN SPECIFICITY):
1. TARGET LANGUAGE: EVERY text field MUST be written perfectly in: ${targetLangName}. Make it conversational and easy to read.
2. DEEP WIREFRAMES: Describe the pages in normal words. E.g., if Shoe Shop, give me "Page 1: Shoe Catalog (Show shoe photos, size filters, price slider)", "Page 2: Cart & Checkout (Where people pay)".
3. DEEP DATABASE SCHEMA: Generate 8-12 tables tailored to the domain. Use real technical column names (VARCHAR, etc) but keep table names obvious (e.g., 'users', 'products', 'orders').
4. COMPREHENSIVE REST APIs: Give 10-15 standard REST APIs grouped by resource. (e.g., /api/shoes, /api/orders).
5. ROADMAP & ROLES: Define normal team roles (e.g., "Website Designer", "App Developer", "Tester").
6. HIGHLY DYNAMIC TECH STACK: Suggest the best tools for their specific idea (React for websites, Swift for iPhone apps, Python for AI).
7. ACTION PLAN GUIDE (bpmn_steps): You MUST write this exactly as a friendly Manager giving direct, step-by-step instructions to a normal person building the app. 
   - Rule: EXPLAIN EXACTLY WHAT THE STEP DOES FOR THE USER'S SPECIFIC IDEA!
   - BAD: "Step 1: Setup Architecture and configure APIs."
   - GOOD (If Shoes): "Step 1: Website Design - First, let's create a beautiful front page where customers can see photos of all your shoes."
   - GOOD (If Shoes): "Step 2: Shopping Cart - Next, we will add a cart so people can pick their shoe size and buy it easily."
   Write the title and description in a very simple, relatable tone. Explain the "WHY" in everyday language.
8. SPRINT TASKS: Keep tasks practical. Instead of "Configure CI/CD", say "Publish the website to the internet so customers can visit it."
   
USER REQUIREMENT: "${cleanPrompt}"

Output ONLY a single valid JSON object matching this schema:
{
  "project_title": "Descriptive Title in ${targetLangName}",
  "chat_reply": "A warm, natural, highly intelligent, conversational response (like ChatGPT/Claude) in ${targetLangName} analyzing the user's idea, highlighting key architectural decisions, explaining database/API strategy, and inviting questions.",
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
      { "role": "[Dynamic Role 1]", "count": 2, "allocation": "100%" },
      { "role": "[Dynamic Role 2]", "count": 1, "allocation": "50%" }
    ]
  },
  "tech_stack": {
    "frontend": "[Dynamic Client/Frontend Tech based on requirement]",
    "backend": "[Dynamic Backend Tech based on requirement]",
    "database": "[Dynamic Database Tech based on requirement]",
    "ai_layer": "[Dynamic AI/ML layer based on requirement]"
  },
  "initiatives": [
    { "title": "Initiative 1 in ${targetLangName}", "impact": "High Impact", "desc": "Description in ${targetLangName}" }
  ],
  "bpmn_steps": [
    { "id": 1, "title": "1. Step in ${targetLangName}", "desc": "Description in ${targetLangName}", "phase": "Phase" }
  ],
  "database_tables": [
    {
      "table_name": "tbl_custom_name",
      "columns": ["id (PK, UUID)", "name (VARCHAR)", "created_at (TIMESTAMP)"]
    }
  ],
  "database_relationships": [
    "users -> orders",
    "orders -> order_items",
    "order_items -> products"
  ],
  "api_endpoints": [
    { "method": "POST", "path": "/api/v1/resource/action", "desc": "Description in ${targetLangName}" }
  ],
  "wireframe_sections": [
    { "title": "Section Title in ${targetLangName}", "components": ["Component 1 in ${targetLangName}", "Component 2 in ${targetLangName}"] }
  ],
  "roadmap_sprints": [
    { 
      "timeframe": "Week 1", 
      "phase": "Project Setup", 
      "tech_stack": ["[Language 1]", "[Framework 2]"], 
      "ai_tools": ["[Tool 1]", "[Tool 2]"], 
      "owner": "[Dynamic Role]", 
      "platform": ["[Platform 1]", "[Platform 2]"],
      "tasks": [
        "Detailed step 1 in ${targetLangName}",
        "Detailed step 2 in ${targetLangName}"
      ]
    }
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