"use client"

import { Database, Network } from "lucide-react"

export function DbTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate Database schema and REST APIs.
      </div>
    )
  }

  const tables = data?.database_tables || [
    {
      table_name: "tbl_users",
      columns: ["id (PK, UUID)", "full_name (VARCHAR)", "email (UNIQUE)", "created_at (TIMESTAMP)"],
    },
    {
      table_name: "tbl_records",
      columns: ["id (PK, UUID)", "user_id (FK -> tbl_users.id)", "status (VARCHAR)", "updated_at (TIMESTAMP)"],
    },
  ]

  const endpoints = data?.api_endpoints || [
    { method: "POST", path: "/api/v1/resource/create", desc: "Create a new record" },
    { method: "GET", path: "/api/v1/resource/{id}", desc: "Fetch real-time status" },
    { method: "PUT", path: "/api/v1/resource/update", desc: "Update record state" },
  ]

  const dbEngine = data?.tech_stack?.database || "PostgreSQL (Supabase RLS)"

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Database Schema */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-600" />
            Database ER Schema ({tables.length} Tables)
          </h3>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono text-emerald-700 border border-emerald-200 font-semibold">
            {dbEngine}
          </span>
        </div>

        <div className="space-y-4">
          {tables.map((table: any, idx: number) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden text-xs shadow-2xs"
            >
              <div className="bg-slate-100 px-3.5 py-2.5 font-bold text-emerald-700 border-b border-slate-200 font-mono flex items-center justify-between">
                <span>{table.table_name}</span>
                <span className="text-[10px] text-slate-500 font-normal">Primary & Foreign Keys</span>
              </div>
              <div className="p-3.5 space-y-2 font-mono text-slate-700 bg-white">
                {(table.columns || []).map((col: string, cIdx: number) => (
                  <div key={cIdx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-800 font-medium">{col}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REST APIs */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Network className="h-4 w-4 text-indigo-600" />
            Auto-Generated REST API Endpoints ({endpoints.length} Endpoints)
          </h3>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200">
            OpenAPI / Swagger Ready
          </span>
        </div>

        <div className="space-y-3">
          {endpoints.map((ep: any, idx: number) => {
            const method = ep.method || "GET"
            const methodBadge =
              method === "POST"
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : method === "PUT"
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : method === "DELETE"
                ? "bg-red-100 text-red-800 border-red-300"
                : "bg-blue-100 text-blue-800 border-blue-300"

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] border ${methodBadge}`}
                  >
                    {method}
                  </span>
                  <span className="font-mono text-slate-900 font-semibold">{ep.path}</span>
                </div>
                <span className="text-[11px] text-slate-500 sm:text-right">{ep.desc}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
