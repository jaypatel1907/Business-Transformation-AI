export type UXComponentType =
  // Layout & Containers
  | "container"
  | "card"
  | "section"
  | "navbar"
  | "sidebar"
  | "tabs"
  | "footer"
  | "modal"
  | "divider"
  // Content & Typography
  | "heading"
  | "text"
  | "badge"
  | "stat_card"
  | "alert"
  // Form & Inputs
  | "button"
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "toggle"
  | "search"
  | "form"
  // Media & Data
  | "image"
  | "avatar"
  | "table"
  | "list"
  | "chart"

export type UXDeviceType = "desktop" | "tablet" | "mobile"

export type UXActionType = "navigate" | "open_modal" | "submit" | "back" | "custom"

export interface UXComponentAction {
  type: UXActionType
  targetScreenId?: string
  targetModalId?: string
  label?: string
  payload?: Record<string, any>
}

export interface UXComponent {
  id: string
  type: UXComponentType
  label: string
  content?: string
  placeholder?: string
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning"
  width?: "full" | "1/2" | "1/3" | "2/3" | "1/4" | "auto"
  action?: UXComponentAction
  properties?: {
    required?: boolean
    inputType?: string
    options?: string[]
    rows?: number
    icon?: string
    columns?: string[]
    dataRows?: string[][]
    items?: string[]
    badgeTone?: string
    statValue?: string
    statChange?: string
    chartType?: "bar" | "line" | "pie"
    imageUrl?: string
    aspectRatio?: string
    [key: string]: any
  }
  children?: UXComponent[]
}

export interface UXScreen {
  id: string
  name: string
  route: string
  description: string
  purpose: string
  deviceType: UXDeviceType
  personaId?: string
  isInitial?: boolean
  components: UXComponent[]
  position?: { x: number; y: number }
  metadata?: {
    category?: "Auth" | "Core" | "Catalog" | "Checkout" | "Admin" | "Settings" | "Analytics"
    tags?: string[]
    notes?: string
  }
}

export interface UXNavigation {
  id: string
  sourceScreenId: string
  targetScreenId: string
  trigger: "click" | "submit" | "select" | "automatic"
  sourceComponentId?: string
  label: string
  action?: string
}

export interface UXPersona {
  id: string
  name: string
  role: string
  avatar?: string
  goals: string[]
  painPoints: string[]
  keyScreens: string[]
}

export interface UXJourneyStep {
  stepNumber: number
  title: string
  description: string
  screenId: string
  action: string
  aiTouchpoint?: string
}

export interface UXJourney {
  id: string
  personaId: string
  title: string
  goal: string
  steps: UXJourneyStep[]
}

export interface UXQualityIssue {
  id: string
  type: "warning" | "info" | "error"
  title: string
  description: string
  screenId?: string
  componentId?: string
}

export interface UXBlueprint {
  projectId?: string
  projectTitle: string
  screens: UXScreen[]
  navigation: UXNavigation[]
  personas: UXPersona[]
  journeys: UXJourney[]
  activeScreenId: string
  status: "draft" | "under_review" | "approved"
  updatedAt: string
  metadata?: {
    designSystem?: "modern_enterprise" | "minimal_slate" | "fintech_vibrant"
    targetAudience?: string
    primaryColor?: string
    fontFamily?: string
  }
}
