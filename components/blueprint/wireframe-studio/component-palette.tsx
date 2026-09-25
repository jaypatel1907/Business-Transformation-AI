"use client"

import { useState } from "react"
import { UXComponentType, UXComponent } from "@/lib/ux-wireframe-types"
import {
  Type,
  Heading,
  Square,
  FormInput,
  CheckSquare,
  CircleDot,
  ToggleLeft,
  Search,
  Image as ImageIcon,
  User,
  Table as TableIcon,
  List as ListIcon,
  Layout,
  Columns,
  CreditCard,
  AlertCircle,
  BarChart3,
  BadgePercent,
  Plus,
  Compass,
  FolderPlus,
  Sliders,
  AlignLeft,
  Menu
} from "lucide-react"

interface ComponentPaletteProps {
  onAddComponent: (component: UXComponent) => void
  targetLanguage?: string
}

interface PaletteItem {
  type: UXComponentType
  name: string
  nameGu: string
  category: "Layout" | "Form & Inputs" | "Content & Feedback" | "Data & Visuals"
  icon: React.ReactNode
  defaultComponent: Partial<UXComponent>
}

export function ComponentPalette({ onAddComponent, targetLanguage = "English" }: ComponentPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const isGuj = targetLanguage.toLowerCase().includes("gu")

  const paletteItems: PaletteItem[] = [
    // Layout
    {
      type: "card",
      name: "Card Container",
      nameGu: "કાર્ડ કન્ટેનર",
      category: "Layout",
      icon: <CreditCard className="h-4 w-4 text-indigo-600" />,
      defaultComponent: {
        type: "card",
        label: "Card Title",
        content: "Card descriptive text and secondary content details.",
        variant: "primary",
        width: "full"
      }
    },
    {
      type: "navbar",
      name: "Navigation Bar",
      nameGu: "નેવિગેશન બાર",
      category: "Layout",
      icon: <Menu className="h-4 w-4 text-indigo-600" />,
      defaultComponent: {
        type: "navbar",
        label: "Top App Header",
        width: "full",
        properties: { brandName: "App Brand", menuItems: ["Home", "Features", "Pricing", "Contact"] }
      }
    },
    {
      type: "tabs",
      name: "Tabs Header",
      nameGu: "ટેબ્સ હેડર",
      category: "Layout",
      icon: <Columns className="h-4 w-4 text-indigo-600" />,
      defaultComponent: {
        type: "tabs",
        label: "Category Tabs",
        width: "full",
        properties: { items: ["Overview", "Details", "Activity", "Settings"] }
      }
    },
    {
      type: "divider",
      name: "Section Divider",
      nameGu: "ડિવાઇડર લાઈન",
      category: "Layout",
      icon: <AlignLeft className="h-4 w-4 text-slate-500" />,
      defaultComponent: {
        type: "divider",
        label: "Divider",
        width: "full"
      }
    },

    // Form & Inputs
    {
      type: "button",
      name: "Action Button",
      nameGu: "બટન",
      category: "Form & Inputs",
      icon: <Square className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "button",
        label: "Primary Action",
        variant: "primary",
        width: "1/2",
        action: { type: "navigate", label: "Trigger Navigation" }
      }
    },
    {
      type: "input",
      name: "Text Input",
      nameGu: "ઇનપુટ ફિલ્ડ",
      category: "Form & Inputs",
      icon: <FormInput className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "input",
        label: "Input Label",
        placeholder: "Enter value...",
        width: "1/2",
        properties: { inputType: "text", required: true }
      }
    },
    {
      type: "textarea",
      name: "Multi-line Textarea",
      nameGu: "ટેક્સ્ટ એરિયા",
      category: "Form & Inputs",
      icon: <AlignLeft className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "textarea",
        label: "Description / Feedback",
        placeholder: "Type detailed information...",
        width: "full",
        properties: { rows: 3 }
      }
    },
    {
      type: "select",
      name: "Dropdown Select",
      nameGu: "ડ્રોપડાઉન સિલેક્ટ",
      category: "Form & Inputs",
      icon: <Sliders className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "select",
        label: "Choose Option",
        placeholder: "Select from options...",
        width: "1/2",
        properties: { options: ["Option A (Standard)", "Option B (Premium)", "Option C (Enterprise)"] }
      }
    },
    {
      type: "checkbox",
      name: "Checkbox Option",
      nameGu: "ચેકબોક્સ",
      category: "Form & Inputs",
      icon: <CheckSquare className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "checkbox",
        label: "I agree to the Terms & Operational Conditions",
        width: "full"
      }
    },
    {
      type: "toggle",
      name: "Switch Toggle",
      nameGu: "ટોગલ સ્વિચ",
      category: "Form & Inputs",
      icon: <ToggleLeft className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "toggle",
        label: "Enable Real-Time AI Automation",
        width: "full"
      }
    },
    {
      type: "search",
      name: "Search Bar",
      nameGu: "સર્ચ બાર",
      category: "Form & Inputs",
      icon: <Search className="h-4 w-4 text-emerald-600" />,
      defaultComponent: {
        type: "search",
        label: "Universal Search",
        placeholder: "Search items, customers, records...",
        width: "full"
      }
    },

    // Content & Feedback
    {
      type: "heading",
      name: "Title Heading",
      nameGu: "હેડિંગ ટાઈટલ",
      category: "Content & Feedback",
      icon: <Heading className="h-4 w-4 text-purple-600" />,
      defaultComponent: {
        type: "heading",
        label: "Section Heading Title",
        content: "Supporting subtitle explaining what this screen accomplishes.",
        width: "full"
      }
    },
    {
      type: "text",
      name: "Text Paragraph",
      nameGu: "ટેક્સ્ટ પેરાગ્રાફ",
      category: "Content & Feedback",
      icon: <Type className="h-4 w-4 text-purple-600" />,
      defaultComponent: {
        type: "text",
        label: "Informational paragraph text with clear guidance for users.",
        width: "full"
      }
    },
    {
      type: "stat_card",
      name: "KPI Stat Metric",
      nameGu: "KPI સ્ટેટ કાર્ડ",
      category: "Content & Feedback",
      icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
      defaultComponent: {
        type: "stat_card",
        label: "Key Performance Metric",
        width: "1/3",
        properties: { statValue: "98.4%", statChange: "+12% this week", badgeTone: "emerald" }
      }
    },
    {
      type: "alert",
      name: "Alert Notification",
      nameGu: "એલર્ટ બોક્સ",
      category: "Content & Feedback",
      icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
      defaultComponent: {
        type: "alert",
        label: "Important Notice",
        content: "System action completed successfully. Verification email dispatched.",
        variant: "success",
        width: "full"
      }
    },
    {
      type: "badge",
      name: "Status Badge",
      nameGu: "સ્ટેટસ બેજ",
      category: "Content & Feedback",
      icon: <BadgePercent className="h-4 w-4 text-purple-600" />,
      defaultComponent: {
        type: "badge",
        label: "Active Status",
        variant: "success",
        width: "auto"
      }
    },

    // Data & Visuals
    {
      type: "table",
      name: "Data Table Grid",
      nameGu: "ડેટા ટેબલ",
      category: "Data & Visuals",
      icon: <TableIcon className="h-4 w-4 text-sky-600" />,
      defaultComponent: {
        type: "table",
        label: "Operational Records Table",
        width: "full",
        properties: {
          columns: ["ID", "Name", "Category", "Status", "Actions"],
          dataRows: [
            ["#101", "Primary Sample Record", "General", "Active", "Edit"],
            ["#102", "Secondary Operational Task", "Urgent", "Pending", "Edit"]
          ]
        }
      }
    },
    {
      type: "list",
      name: "Item List Row",
      nameGu: "આઇટમ લિસ્ટ",
      category: "Data & Visuals",
      icon: <ListIcon className="h-4 w-4 text-sky-600" />,
      defaultComponent: {
        type: "list",
        label: "Recent Activity Stream",
        width: "full",
        properties: {
          items: ["User completed checkout flow", "New appointment booked for 4:00 PM", "Invoice #841 generated"]
        }
      }
    },
    {
      type: "image",
      name: "Image Placeholder",
      nameGu: "ઇમેજ પ્લેસહોલ્ડર",
      category: "Data & Visuals",
      icon: <ImageIcon className="h-4 w-4 text-sky-600" />,
      defaultComponent: {
        type: "image",
        label: "Product / Media Showcase",
        width: "full",
        properties: { aspectRatio: "16:9" }
      }
    },
    {
      type: "avatar",
      name: "User Avatar",
      nameGu: "યુઝર પ્રોફાઇલ",
      category: "Data & Visuals",
      icon: <User className="h-4 w-4 text-sky-600" />,
      defaultComponent: {
        type: "avatar",
        label: "Alex Morgan (Admin)",
        width: "auto"
      }
    }
  ]

  const categories = ["All", "Layout", "Form & Inputs", "Content & Feedback", "Data & Visuals"]

  const filteredItems =
    selectedCategory === "All"
      ? paletteItems
      : paletteItems.filter((item) => item.category === selectedCategory)

  const handleAdd = (item: PaletteItem) => {
    const newComponent: UXComponent = {
      id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: item.type,
      label: item.defaultComponent.label || item.name,
      content: item.defaultComponent.content,
      placeholder: item.defaultComponent.placeholder,
      variant: item.defaultComponent.variant,
      width: item.defaultComponent.width || "full",
      action: item.defaultComponent.action,
      properties: item.defaultComponent.properties
    }
    onAddComponent(newComponent)
  }

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/60">
        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
          <Layout className="h-4 w-4 text-indigo-600" />
          <span>{isGuj ? "UI કમ્પોનન્ટ લાઈબ્રેરી" : "UI Component Library"}</span>
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {isGuj ? "કમ્પોનન્ટ ઉમેરવા માટે ક્લિક કરો" : "Click to insert onto active wireframe screen"}
        </p>

        {/* Category Pills */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 thin-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 thin-scrollbar">
        {filteredItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleAdd(item)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-2 text-left hover:border-indigo-200 hover:bg-indigo-50/40 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs group-hover:border-indigo-300">
                {item.icon}
              </div>
              <div className="truncate">
                <p className="font-bold text-[11px] text-slate-800 group-hover:text-indigo-900 truncate">
                  {isGuj ? item.nameGu : item.name}
                </p>
                <p className="text-[9px] text-slate-400">{item.category}</p>
              </div>
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition">
              <Plus className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
