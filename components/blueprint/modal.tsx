"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="bp-fade-up relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 text-balance">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
