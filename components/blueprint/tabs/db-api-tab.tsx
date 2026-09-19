"use client"

import { Database, Network } from "lucide-react"

export function DbTab({ generated, data }: { generated: boolean; data?: any }) {
  if (!generated) {
    return (
      <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
        Input requirements to generate Database schema and REST APIs.
      </div>
    )
  }

  const tables = data?.database_tables || [
    { table_name: "tbl_users", columns: ["id (PK, UUID)", "name", "email", "created_at"] }
  ]
  const endpoints = data?.api_endpoints || [
    { method: "POST", path: "/api/v1/create", desc: "Create record" },
    { method: "GET", path: "/api/v1/status/{id}", desc: "Get status" }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Database Schema */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          Database ER Schema (Supabase PostgreSQL)
        </h3>
        <div className="space-y-4">
          {tables.map((table: any, idx: number) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden text-xs">
              <div className="bg-slate-850 p-2.5 font-bold text-emerald-400 border-b border-slate-800 font-mono">
                {table.table_name}
              </div>
              <div className="p-3 space-y-1.5 font-mono text-slate-300">
                {table.columns.map((col: string, cIdx: number) => (
                  <div key={cIdx} className="flex justify-between py-0.5 border-b border-slate-900 last:border-0">
                    <span>{col}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REST APIs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
          <Network className="h-4 w-4 text-cyan-400" />
          Auto-Generated REST APIs
        </h3>
        <div className="space-y-3">
          {endpoints.map((ep: any, idx: number) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  ep.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                  ep.method === 'PUT' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                  'bg-blue-950 text-blue-400 border border-blue-900'
                }`}>
                  {ep.method}
                </span>
                <span className="font-mono text-slate-200">{ep.path}</span>
              </div>
              <span className="text-[10px] text-slate-400">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}