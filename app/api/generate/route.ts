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

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const cleanPrompt = prompt.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    const generateDeterministicBlueprint = (p: string) => {
      const lower = p.toLowerCase();
      const hash = stringHash(p);

      let title = "Custom Enterprise Solution";
      let maturityScore = 88 + (hash % 7);
      let aiReadinessScore = 90 + (hash % 6);
      let weeksTimeline = 4 + (hash % 5);

      let tables = [
        {
          table_name: "tbl_users",
          columns: ["id (PK, UUID)", "email (VARCHAR)", "full_name (VARCHAR)", "role (ENUM)", "created_at (TIMESTAMP)"]
        },
        {
          table_name: "tbl_app_data",
          columns: ["id (PK, UUID)", "user_id (FK -> tbl_users.id)", "payload (JSONB)", "status (VARCHAR)", "updated_at (TIMESTAMP)"]
        }
      ];

      let steps = [
        { id: 1, title: "1. User Input & Intake", desc: `Initial request captured from user input: "${p.slice(0, 40)}..."` },
        { id: 2, title: "2. AI Analysis & Processing", desc: "System evaluates business constraints and automated rules" },
        { id: 3, title: "3. Workflow Execution", desc: "Triggers backend job queues and database transactions" },
        { id: 4, title: "4. Status Sync & Notification", desc: "Updates real-time user dashboard and logs audit event" }
      ];

      let endpoints = [
        { method: "POST", path: "/api/v1/intake/submit", desc: "Submit user input & trigger processing" },
        { method: "GET", path: "/api/v1/status/{id}", desc: "Fetch real-time execution status" },
        { method: "PUT", path: "/api/v1/records/update", desc: "Update record attributes & state" }
      ];

      let wireframeSections = [
        { title: "Header & Navigation Bar", components: ["App Logo", "User Profile Avatar", "Notification Bell", "Global Search"] },
        { title: "Main Workspace Canvas", components: ["Requirement Input Box", "AI Status Badge", "Action Trigger Buttons"] },
        { title: "Analytics & Summary Drawer", components: ["Real-time Metrics Cards", "Activity Audit Stream", "Export Controls"] }
      ];

      let roadmapMilestones = [
        { phase: "Phase 1 (Week 1-2)", title: "Architecture & Data Model", task: "Setup Database schemas, auth providers, and API routing" },
        { phase: "Phase 2 (Week 3-4)", title: "Core Business Logic & AI", task: "Implement processing pipeline and external integrations" },
        { phase: "Phase 3 (Week 5+)", title: "Testing & Deployment", task: "End-to-end security audits, performance tuning, and launch" }
      ];

      if (lower.includes("hospital") || lower.includes("health") || lower.includes("doctor") || lower.includes("patient") || lower.includes("clinic")) {
        title = "Healthcare & Patient Management Platform";
        tables = [
          { table_name: "patients", columns: ["id (PK, UUID)", "full_name", "date_of_birth", "contact_number", "medical_history (JSONB)"] },
          { table_name: "doctors", columns: ["id (PK, UUID)", "full_name", "specialization", "consultation_fee", "available_slots"] },
          { table_name: "appointments", columns: ["id (PK, UUID)", "patient_id (FK)", "doctor_id (FK)", "appointment_date", "status (ENUM)"] },
          { table_name: "prescriptions", columns: ["id (PK, UUID)", "appointment_id (FK)", "medications (JSONB)", "dosage_notes", "issued_at"] }
        ];
        steps = [
          { id: 1, title: "Patient Booking", desc: "Patient selects specialty, doctor, and convenient time slot" },
          { id: 2, title: "AI Symptom Triage", desc: "AI evaluates reported symptoms and flags urgent cases" },
          { id: 3, title: "Consultation & Prescription", desc: "Doctor logs electronic health record (EHR) & digital prescription" },
          { id: 4, title: "Pharmacy Sync & Followup", desc: "Automated prescription dispatch & SMS reminder scheduling" }
        ];
        endpoints = [
          { method: "POST", path: "/api/v1/appointments/book", desc: "Schedule doctor appointment slot" },
          { method: "GET", path: "/api/v1/patients/{id}/records", desc: "Fetch complete EHR history" },
          { method: "POST", path: "/api/v1/prescriptions/generate", desc: "Issue AI-assisted electronic prescription" }
        ];
        wireframeSections = [
          { title: "Patient Dashboard", components: ["Upcoming Appointments Card", "Recent Prescriptions List", "Quick Symptom Checker"] },
          { title: "Doctor Portal", components: ["Daily Schedule Grid", "EHR Patient Record Viewer", "Digital Prescription Writer"] }
        ];
      } else if (lower.includes("food") || lower.includes("restaurant") || lower.includes("delivery") || lower.includes("order")) {
        title = "Smart Food Ordering & Delivery Network";
        tables = [
          { table_name: "restaurants", columns: ["id (PK, UUID)", "name", "address", "rating", "is_active"] },
          { table_name: "menu_items", columns: ["id (PK, UUID)", "restaurant_id (FK)", "title", "price", "category"] },
          { table_name: "orders", columns: ["id (PK, UUID)", "customer_id (FK)", "restaurant_id (FK)", "total_amount", "order_status"] },
          { table_name: "deliveries", columns: ["id (PK, UUID)", "order_id (FK)", "driver_id (FK)", "current_gps_location", "eta_minutes"] }
        ];
        steps = [
          { id: 1, title: "Cart & Checkout", desc: "Customer places order with delivery preferences" },
          { id: 2, title: "Kitchen AI Dispatch", desc: "Order routed to restaurant kitchen with prep time estimate" },
          { id: 3, title: "Driver Geo-Matching", desc: "Nearest delivery partner assigned via route optimization" },
          { id: 4, title: "Real-Time Tracking & Delivery", desc: "Live GPS mapping and order completion check" }
        ];
        endpoints = [
          { method: "POST", path: "/api/v1/orders/checkout", desc: "Place food order and process payment" },
          { method: "GET", path: "/api/v1/deliveries/track/{order_id}", desc: "Live GPS tracking coordinates" },
          { method: "GET", path: "/api/v1/restaurants/search", desc: "Filter restaurants by location and menu" }
        ];
      } else if (lower.includes("school") || lower.includes("education") || lower.includes("student") || lower.includes("course") || lower.includes("learn")) {
        title = "EdTech Learning Management System (LMS)";
        tables = [
          { table_name: "courses", columns: ["id (PK, UUID)", "title", "description", "instructor_id (FK)", "category"] },
          { table_name: "enrollments", columns: ["id (PK, UUID)", "student_id (FK)", "course_id (FK)", "progress_percent", "enrolled_at"] },
          { table_name: "assessments", columns: ["id (PK, UUID)", "course_id (FK)", "title", "total_marks", "due_date"] }
        ];
        steps = [
          { id: 1, title: "Course Enrollment", desc: "Student explores catalog and registers for courses" },
          { id: 2, title: "Interactive Learning", desc: "Student accesses video lectures, quizzes, and AI tutor support" },
          { id: 3, title: "Assignment Evaluation", desc: "AI grading engine checks submission & gives feedback" },
          { id: 4, title: "Certification & Analytics", desc: "Automated certificate generation & progress report" }
        ];
        endpoints = [
          { method: "POST", path: "/api/v1/courses/enroll", desc: "Register student into selected course" },
          { method: "POST", path: "/api/v1/assignments/submit", desc: "Submit assignment for AI grading" },
          { method: "GET", path: "/api/v1/students/{id}/analytics", desc: "Get student performance summary" }
        ];
      } else if (lower.includes("real estate") || lower.includes("property") || lower.includes("rent")) {
        title = "Real Estate Property Platform";
        tables = [
          { table_name: "properties", columns: ["id (PK, UUID)", "title", "price", "location", "property_type", "status"] },
          { table_name: "inquiries", columns: ["id (PK, UUID)", "property_id (FK)", "buyer_id (FK)", "tour_date", "message"] },
          { table_name: "transactions", columns: ["id (PK, UUID)", "property_id (FK)", "buyer_id (FK)", "agent_id (FK)", "amount"] }
        ];
        steps = [
          { id: 1, title: "Property Search & Filter", desc: "Buyer browses verified properties using location & budget filters" },
          { id: 2, title: "AI Valuation & Inspection", desc: "System evaluates market value index & legal document check" },
          { id: 3, title: "Tour Scheduling", desc: "Automated appointment sync between buyer and listing agent" },
          { id: 4, title: "Digital Agreement & Closing", desc: "Electronic signature processing and escrow payment" }
        ];
        endpoints = [
          { method: "GET", path: "/api/v1/properties/search", desc: "Query properties with geo-filters" },
          { method: "POST", path: "/api/v1/inquiries/create", desc: "Schedule property tour request" }
        ];
      }

      return {
        project_title: title,
        user_problem: p,
        digital_maturity: maturityScore,
        ai_adoption: aiReadinessScore,
        timeline: `${weeksTimeline} Weeks`,
        tech_stack: {
          frontend: "React / Next.js 16 + Tailwind CSS",
          backend: "Node.js / Express API Gateway",
          database: "PostgreSQL / Supabase",
          ai_layer: "Google Gemini 1.5 Flash"
        },
        initiatives: [
          { title: `${title} Core Automation`, impact: "High Impact", desc: `Automates key workflows and bottleneck processes for "${p.slice(0, 60)}".` },
          { title: "AI Predictive Analytics & Decision Support", impact: "High Impact", desc: "Provides real-time decision support, automated anomaly detection, and workload forecasting." }
        ],
        bpmn_steps: steps,
        database_tables: tables,
        api_endpoints: endpoints,
        wireframe_sections: wireframeSections,
        roadmap_milestones: roadmapMilestones,
        planning: {
          effortHours: `${weeksTimeline * 40}`,
          cloudCost: `$${80 + (hash % 70)}/mo`,
          cloudDetail: "PostgreSQL Database + Serverless Edge Functions + Gemini API",
          risk: {
            level: "Low-Medium",
            title: "Data Isolation & Scaling",
            mitigation: "Implement Row Level Security (RLS) policies and Redis caching for hot queries."
          }
        }
      };
    };

    if (apiKey && apiKey.trim() !== "") {
      try {
        const systemPrompt = `You are a Senior AI Solution Architect. The user wants to build a solution for this requirement: "${cleanPrompt}".
Analyze the requirement in detail and return a strictly valid JSON object representing a complete architectural blueprint with this structure:
{
  "project_title": "Descriptive Project Name",
  "user_problem": "${cleanPrompt.replace(/"/g, '\\"')}",
  "digital_maturity": 92,
  "ai_adoption": 95,
  "timeline": "6 Weeks",
  "tech_stack": {
    "frontend": "React / Next.js + Tailwind",
    "backend": "Node.js / FastAPI",
    "database": "PostgreSQL (Supabase)",
    "ai_layer": "Gemini 1.5 Flash"
  },
  "initiatives": [
    { "title": "Initiative 1", "impact": "High Impact", "desc": "Detailed description" },
    { "title": "Initiative 2", "impact": "High Impact", "desc": "Detailed description" }
  ],
  "bpmn_steps": [
    { "id": 1, "title": "Step 1 Title", "desc": "Description" },
    { "id": 2, "title": "Step 2 Title", "desc": "Description" },
    { "id": 3, "title": "Step 3 Title", "desc": "Description" },
    { "id": 4, "title": "Step 4 Title", "desc": "Description" }
  ],
  "database_tables": [
    { "table_name": "table1", "columns": ["id (PK, UUID)", "col1", "col2"] },
    { "table_name": "table2", "columns": ["id (PK, UUID)", "fk_id (FK)", "col1"] }
  ],
  "api_endpoints": [
    { "method": "POST", "path": "/api/v1/resource/create", "desc": "Description" },
    { "method": "GET", "path": "/api/v1/resource/{id}", "desc": "Description" }
  ],
  "wireframe_sections": [
    { "title": "Main Screen", "components": ["Component 1", "Component 2"] }
  ],
  "roadmap_milestones": [
    { "phase": "Phase 1 (Week 1-2)", "title": "Setup", "task": "Task details" }
  ],
  "planning": {
    "effortHours": "240",
    "cloudCost": "$120/mo",
    "cloudDetail": "PostgreSQL + Edge Compute",
    "risk": { "level": "Medium", "title": "Security & Latency", "mitigation": "RLS & Caching" }
  }
}
Output ONLY raw valid JSON, no markdown wrapper or extra prose.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
        console.warn("Gemini API call failed, falling back to deterministic generator:", err);
      }
    }

    const data = generateDeterministicBlueprint(cleanPrompt);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}