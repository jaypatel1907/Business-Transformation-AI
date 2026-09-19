export const projectName = "Smart On-Demand Delivery & Logistics Platform"

export const metrics = {
  readiness: 92,
  adoption: "High",
  timeline: "6 Weeks",
}

export type Initiative = {
  index: string
  title: string
  description: string
  tag: string
  tagTone: "indigo" | "blue"
}

export const initiatives: Initiative[] = [
  {
    index: "01",
    title: "Automated Route Optimization & Dispatch",
    description:
      "Real-time driver assignment and multi-stop route sequencing to cut idle miles and shrink delivery windows during peak demand.",
    tag: "High Impact",
    tagTone: "indigo",
  },
  {
    index: "02",
    title: "AI Voice Verification for Order Hand-off",
    description:
      "An AI voice agent confirms delivery with the recipient and captures proof-of-delivery signals automatically.",
    tag: "Automation",
    tagTone: "blue",
  },
]

export const techPills = ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Gemini 2.5 Pro"]

export type FlowNode = {
  id: string
  step: string
  title: string
  subtitle: string
  accent: boolean
  detail: string
}

export const processNodes: FlowNode[] = [
  {
    id: "received",
    step: "1",
    title: "Order Received",
    subtitle: "Mobile / Web app",
    accent: true,
    detail:
      "Customer places an order through the mobile or web client. Payload includes items, geo-coordinates, and delivery preferences.",
  },
  {
    id: "validation",
    step: "2",
    title: "AI Validation",
    subtitle: "Risk & fraud scoring",
    accent: false,
    detail:
      "AI-powered checks validate address quality, payment risk, and duplicate order patterns before dispatch.",
  },
  {
    id: "matched",
    step: "3",
    title: "Driver Matched",
    subtitle: "Route optimizer",
    accent: false,
    detail:
      "The optimizer scores nearby drivers by ETA, load, and zone, then assigns and sequences multi-stop routes.",
  },
  {
    id: "delivered",
    step: "4",
    title: "Delivered",
    subtitle: "Proof of delivery",
    accent: true,
    detail:
      "Driver captures proof-of-delivery; the system reconciles status, notifies the customer, and closes the order.",
  },
]

export type Column = { name: string; type: string; pk?: boolean; fk?: boolean }
export type Table = { name: string; columns: Column[] }

export const tables: Table[] = [
  {
    name: "tbl_customers",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "full_name", type: "varchar(120)" },
      { name: "phone_number", type: "varchar(20)" },
      { name: "created_at", type: "timestamptz" },
    ],
  },
  {
    name: "tbl_orders",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: true },
      { name: "delivery_address", type: "text" },
      { name: "status", type: "enum" },
      { name: "driver_id", type: "uuid", fk: true },
    ],
  },
]

export type Endpoint = {
  method: "POST" | "GET"
  path: string
  description: string
}

export const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/orders",
    description: "Create a new delivery order from the customer app.",
  },
  {
    method: "GET",
    path: "/api/v1/orders/{id}",
    description: "Return live status and driver location for a delivery.",
  },
  {
    method: "POST",
    path: "/api/v1/dispatch/assign",
    description: "Assign an optimized driver to a pending delivery.",
  },
]

export type Phase = {
  name: string
  window: string
  tone: "indigo" | "blue" | "slate"
  tasks: string[]
}

export const phases: Phase[] = [
  {
    name: "Architecture & Database",
    window: "Weeks 1–2",
    tone: "indigo",
    tasks: ["Provision PostgreSQL + Redis", "Schema & migrations", "API gateway scaffold"],
  },
  {
    name: "AI Voice & Dispatch Core",
    window: "Weeks 3–4",
    tone: "blue",
    tasks: ["Route optimizer service", "Voice agent", "Fraud scoring"],
  },
  {
    name: "Field Testing & Launch",
    window: "Weeks 5–6",
    tone: "slate",
    tasks: ["Driver pilot in 2 zones", "Load hardening", "Production launch"],
  },
]

export const planning = {
  effortHours: 200,
  cloudCost: "$90/mo",
  cloudDetail: "PostgreSQL + Cloud Run",
}

export const samplePrompt =
  "Design a smart on-demand delivery & logistics platform with automated dispatch and AI voice confirmation."

export const quickPrompts = ["Smart Delivery Platform", "SaaS Booking System"]
