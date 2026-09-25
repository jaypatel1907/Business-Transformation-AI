"use client"

import { useState } from "react"
import { UXBlueprint, UXScreen } from "@/lib/ux-wireframe-types"
import {
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Copy,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
  Layout,
  Globe,
  Home,
  Check,
  X,
  Layers
} from "lucide-react"

export interface ScreenManagerProps {
  blueprint?: UXBlueprint
  screens?: UXScreen[]
  selectedScreenId?: string
  activeScreenId?: string
  onSelectScreen: (screenId: string) => void
  onUpdateBlueprint?: (updater: (prev: UXBlueprint) => UXBlueprint) => void
  onCreateScreen?: (name: string, route: string, category?: string) => void
  onRenameScreen?: (screenId: string, newName: string, newRoute: string) => void
  onDuplicateScreen?: (screenId: string) => void
  onDeleteScreen?: (screenId: string) => void
  onReorderScreen?: (screenId: string, direction: "up" | "down") => void
  targetLanguage?: string
}

export function ScreenManager({
  blueprint,
  screens: propScreens,
  selectedScreenId,
  activeScreenId: propActiveScreenId,
  onSelectScreen,
  onUpdateBlueprint,
  onCreateScreen: propOnCreateScreen,
  onRenameScreen: propOnRenameScreen,
  onDuplicateScreen: propOnDuplicateScreen,
  onDeleteScreen: propOnDeleteScreen,
  onReorderScreen: propOnReorderScreen,
  targetLanguage = "English"
}: ScreenManagerProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const screens = (blueprint?.screens || propScreens || []) as UXScreen[]
  const activeScreenId =
    selectedScreenId || propActiveScreenId || blueprint?.activeScreenId || screens[0]?.id || ""

  const [showAddModal, setShowAddModal] = useState(false)
  const [newScreenName, setNewScreenName] = useState("")
  const [newScreenRoute, setNewScreenRoute] = useState("")
  const [editingScreenId, setEditingScreenId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editRoute, setEditRoute] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Internal CRUD handlers when onUpdateBlueprint is provided
  const handleCreateScreen = (name: string, route: string, category?: string) => {
    if (propOnCreateScreen) {
      propOnCreateScreen(name, route, category)
      return
    }
    if (onUpdateBlueprint) {
      const newId = `screen-${Date.now()}`
      const newScreen: UXScreen = {
        id: newId,
        name,
        route: route.startsWith("/") ? route : `/${route}`,
        description: `Custom interactive page for ${name}`,
        purpose: `Allow users to interact with ${name} features.`,
        deviceType: "desktop",
        components: [
          {
            id: `cmp-${newId}-header`,
            type: "heading",
            label: name,
            content: `Welcome to the ${name} view.`,
            width: "full"
          },
          {
            id: `cmp-${newId}-card`,
            type: "card",
            label: "Main Content Area",
            content: "Add components from the palette to build this screen.",
            width: "full"
          }
        ]
      }
      onUpdateBlueprint((prev) => ({
        ...prev,
        screens: [...prev.screens, newScreen],
        updatedAt: new Date().toISOString()
      }))
      onSelectScreen(newId)
    }
  }

  const handleRenameScreen = (screenId: string, newName: string, newRoute: string) => {
    if (propOnRenameScreen) {
      propOnRenameScreen(screenId, newName, newRoute)
      return
    }
    if (onUpdateBlueprint) {
      onUpdateBlueprint((prev) => ({
        ...prev,
        screens: prev.screens.map((s) =>
          s.id === screenId ? { ...s, name: newName, route: newRoute } : s
        ),
        updatedAt: new Date().toISOString()
      }))
    }
  }

  const handleDuplicateScreen = (screenId: string) => {
    if (propOnDuplicateScreen) {
      propOnDuplicateScreen(screenId)
      return
    }
    if (onUpdateBlueprint) {
      const target = screens.find((s) => s.id === screenId)
      if (!target) return
      const newId = `screen-${Date.now()}`
      const duplicated: UXScreen = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        route: `${target.route}-copy`,
        isInitial: false,
        components: target.components.map((c) => ({
          ...c,
          id: `cmp-${newId}-${Math.random().toString(36).substring(2, 6)}`
        }))
      }
      onUpdateBlueprint((prev) => ({
        ...prev,
        screens: [...prev.screens, duplicated],
        updatedAt: new Date().toISOString()
      }))
      onSelectScreen(newId)
    }
  }

  const handleDeleteScreen = (screenId: string) => {
    if (propOnDeleteScreen) {
      propOnDeleteScreen(screenId)
      return
    }
    if (onUpdateBlueprint) {
      onUpdateBlueprint((prev) => {
        const remaining = prev.screens.filter((s) => s.id !== screenId)
        return {
          ...prev,
          screens: remaining,
          navigation: prev.navigation.filter(
            (n) => n.sourceScreenId !== screenId && n.targetScreenId !== screenId
          ),
          updatedAt: new Date().toISOString()
        }
      })
      const remaining = screens.filter((s) => s.id !== screenId)
      if (remaining.length > 0) {
        onSelectScreen(remaining[0].id)
      }
    }
  }

  const handleReorderScreen = (screenId: string, direction: "up" | "down") => {
    if (propOnReorderScreen) {
      propOnReorderScreen(screenId, direction)
      return
    }
    if (onUpdateBlueprint) {
      onUpdateBlueprint((prev) => {
        const idx = prev.screens.findIndex((s) => s.id === screenId)
        if (idx === -1) return prev
        const targetIdx = direction === "up" ? idx - 1 : idx + 1
        if (targetIdx < 0 || targetIdx >= prev.screens.length) return prev
        const newScreens = [...prev.screens]
        const temp = newScreens[idx]
        newScreens[idx] = newScreens[targetIdx]
        newScreens[targetIdx] = temp
        return {
          ...prev,
          screens: newScreens,
          updatedAt: new Date().toISOString()
        }
      })
    }
  }

  const handleStartEdit = (screen: UXScreen) => {
    setEditingScreenId(screen.id)
    setEditName(screen.name)
    setEditRoute(screen.route)
  }

  const handleSaveEdit = (screenId: string) => {
    if (!editName.trim()) return
    handleRenameScreen(
      screenId,
      editName.trim(),
      editRoute.trim() || `/${editName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    )
    setEditingScreenId(null)
  }

  const handleCreate = () => {
    if (!newScreenName.trim()) return
    const route =
      newScreenRoute.trim() ||
      `/${newScreenName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    handleCreateScreen(newScreenName.trim(), route)
    setNewScreenName("")
    setNewScreenRoute("")
    setShowAddModal(false)
  }

  return (
    <div className="flex h-full flex-col bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/90">
        <div>
          <h4 className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>{isGuj ? "સ્ક્રીન મેનેજર" : "Screens & Pages"}</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            {screens.length} {isGuj ? "સ્ક્રીન ઉપલબ્ધ" : "Screens defined"}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-indigo-500 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isGuj ? "નવી સ્ક્રીન" : "New Screen"}</span>
        </button>
      </div>

      {/* Screens List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 thin-scrollbar">
        {screens.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
            No screens available.
          </div>
        ) : (
          screens.map((screen, idx) => {
            const isActive = screen.id === activeScreenId
            const isEditing = editingScreenId === screen.id

            return (
              <div
                key={screen.id}
                className={`group relative rounded-xl border p-2.5 transition-all ${
                  isActive
                    ? "border-indigo-500/60 bg-indigo-500/10 shadow-xs ring-1 ring-indigo-500/30"
                    : "border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/60"
                }`}
              >
                {isEditing ? (
                  <div className="space-y-2 p-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Screen Name"
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={editRoute}
                      onChange={(e) => setEditRoute(e.target.value)}
                      placeholder="/route"
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-mono text-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setEditingScreenId(null)}
                        className="rounded-md border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(screen.id)}
                        className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div
                      onClick={() => onSelectScreen(screen.id)}
                      className="flex-1 cursor-pointer overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[9px] font-bold text-slate-300 border border-slate-700">
                          {idx + 1}
                        </span>
                        <p
                          className={`text-xs font-bold truncate ${
                            isActive ? "text-indigo-300" : "text-slate-200"
                          }`}
                        >
                          {screen.name}
                        </p>
                        {screen.isInitial && (
                          <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                            Home
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[10px] font-mono text-slate-400 truncate pl-5.5">
                        {screen.route} • {screen.components?.length || 0} items
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleStartEdit(screen)}
                        title="Rename Screen"
                        className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-750"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDuplicateScreen(screen.id)}
                        title="Duplicate Screen"
                        className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-750"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {screens.length > 1 && (
                        <button
                          onClick={() => setDeleteConfirmId(screen.id)}
                          title="Delete Screen"
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-750"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Reorder Buttons */}
                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800/80 pt-1">
                  <span>{screen.metadata?.category || "Standard Page"}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleReorderScreen(screen.id, "up")}
                      className="p-0.5 text-slate-400 hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      disabled={idx === screens.length - 1}
                      onClick={() => handleReorderScreen(screen.id, "down")}
                      className="p-0.5 text-slate-400 hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
            <h4 className="font-bold text-sm text-slate-100">Delete this screen?</h4>
            <p className="text-xs text-slate-400">
              All UI components and direct navigation links originating from this screen will be permanently removed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteScreen(deleteConfirmId)
                  setDeleteConfirmId(null)
                }}
                className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Screen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-sm text-slate-100">
                {isGuj ? "નવી સ્ક્રીન ઉમેરો" : "Create New Wireframe Screen"}
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Screen Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shopping Cart & Checkout"
                  value={newScreenName}
                  onChange={(e) => {
                    setNewScreenName(e.target.value)
                    if (!newScreenRoute) {
                      setNewScreenRoute(`/${e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)
                    }
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300">App Route</label>
                <input
                  type="text"
                  placeholder="/cart"
                  value={newScreenRoute}
                  onChange={(e) => setNewScreenRoute(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newScreenName.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                Create Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
