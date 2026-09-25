"use client"

import { useState } from "react"
import { UXScreen } from "@/lib/ux-wireframe-types"
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

interface ScreenManagerProps {
  screens: UXScreen[]
  activeScreenId: string
  onSelectScreen: (screenId: string) => void
  onCreateScreen: (name: string, route: string, category?: string) => void
  onRenameScreen: (screenId: string, newName: string, newRoute: string) => void
  onDuplicateScreen: (screenId: string) => void
  onDeleteScreen: (screenId: string) => void
  onReorderScreen: (screenId: string, direction: "up" | "down") => void
  targetLanguage?: string
}

export function ScreenManager({
  screens,
  activeScreenId,
  onSelectScreen,
  onCreateScreen,
  onRenameScreen,
  onDuplicateScreen,
  onDeleteScreen,
  onReorderScreen,
  targetLanguage = "English"
}: ScreenManagerProps) {
  const isGuj = targetLanguage.toLowerCase().includes("gu")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newScreenName, setNewScreenName] = useState("")
  const [newScreenRoute, setNewScreenRoute] = useState("")
  const [editingScreenId, setEditingScreenId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editRoute, setEditRoute] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleStartEdit = (screen: UXScreen) => {
    setEditingScreenId(screen.id)
    setEditName(screen.name)
    setEditRoute(screen.route)
  }

  const handleSaveEdit = (screenId: string) => {
    if (!editName.trim()) return
    onRenameScreen(screenId, editName.trim(), editRoute.trim() || `/${editName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)
    setEditingScreenId(null)
  }

  const handleCreate = () => {
    if (!newScreenName.trim()) return
    const route = newScreenRoute.trim() || `/${newScreenName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    onCreateScreen(newScreenName.trim(), route)
    setNewScreenName("")
    setNewScreenRoute("")
    setShowAddModal(false)
  }

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/60">
        <div>
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-600" />
            <span>{isGuj ? "સ્ક્રીન મેનેજર" : "Screens & Pages"}</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            {screens.length} {isGuj ? "સ્ક્રીન ઉપલબ્ધ" : "Screens defined"}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isGuj ? "નવી સ્ક્રીન" : "New Screen"}</span>
        </button>
      </div>

      {/* Screens List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 thin-scrollbar">
        {screens.map((screen, idx) => {
          const isActive = screen.id === activeScreenId
          const isEditing = editingScreenId === screen.id

          return (
            <div
              key={screen.id}
              className={`group relative rounded-xl border p-2.5 transition-all ${
                isActive
                  ? "border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500/20"
                  : "border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {isEditing ? (
                <div className="space-y-2 p-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Screen Name"
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editRoute}
                    onChange={(e) => setEditRoute(e.target.value)}
                    placeholder="/route"
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-mono text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setEditingScreenId(null)}
                      className="rounded-md border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(screen.id)}
                      className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-indigo-700"
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
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-700">
                        {idx + 1}
                      </span>
                      <p className={`text-xs font-bold truncate ${isActive ? "text-indigo-950" : "text-slate-800"}`}>
                        {screen.name}
                      </p>
                      {screen.isInitial && (
                        <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700">
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
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDuplicateScreen(screen.id)}
                      title="Duplicate Screen"
                      className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-white"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {screens.length > 1 && (
                      <button
                        onClick={() => setDeleteConfirmId(screen.id)}
                        title="Delete Screen"
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Reorder Buttons */}
              <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100/80 pt-1">
                <span>{screen.metadata?.category || "Standard Page"}</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => onReorderScreen(screen.id, "up")}
                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    disabled={idx === screens.length - 1}
                    onClick={() => onReorderScreen(screen.id, "down")}
                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Delete this screen?</h4>
            <p className="text-xs text-slate-500">
              All UI components and direct navigation links originating from this screen will be permanently removed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteScreen(deleteConfirmId)
                  setDeleteConfirmId(null)
                }}
                className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Screen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">
                {isGuj ? "નવી સ્ક્રીન ઉમેરો" : "Create New Wireframe Screen"}
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Screen Name</label>
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
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">App Route</label>
                <input
                  type="text"
                  placeholder="/cart"
                  value={newScreenRoute}
                  onChange={(e) => setNewScreenRoute(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newScreenName.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
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
