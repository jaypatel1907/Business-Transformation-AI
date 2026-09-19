import type { LucideIcon } from "lucide-react"

export function Panel({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeTone,
  className = "",
  children,
}: {
  title: string
  subtitle?: string
  icon?: LucideIcon
  badge?: string
  badgeTone?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {Icon ? <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" /> : null}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {badge ? (
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-500">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <p className="max-w-xs text-sm text-slate-500">{message}</p>
    </div>
  )
}

