"use client"

import { useState } from "react"
import { Database, Network, Download, Copy, Check, ArrowRight } from "lucide-react"

export function DbTab({ generated, data }: { generated: boolean; data?: any }) {
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null)
  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate Database schema and REST APIs.
      </div>
    )
  }

  const tables = data?.database_tables || [
    {
      table_name: "core_entities",
      columns: ["id (PK, UUID)", "name (VARCHAR)", "status (VARCHAR)", "created_at (TIMESTAMP)"],
    },
    {
      table_name: "entity_relations",
      columns: ["id (PK, UUID)", "entity_id (FK)", "metadata (JSONB)", "updated_at (TIMESTAMP)"],
    }
  ]

  const relationships = data?.database_relationships || [
    "core_entities -> entity_relations"
  ]

  const endpoints = data?.api_endpoints || [
    { method: "GET", path: "/api/v1/core", desc: "List core entities" },
    { method: "POST", path: "/api/v1/core", desc: "Create new entity" },
    { method: "PUT", path: "/api/v1/core/:id", desc: "Update entity" }
  ]

  // Group endpoints by base resource (e.g. "/api/products")
  const groupedEndpoints = endpoints.reduce((acc: any, ep: any) => {
    const parts = ep.path.split('/').filter(Boolean);
    let resource = "Core";
    if (parts.length > 0) {
      if (parts[0] === "api" && parts.length > 1) {
        resource = parts[1];
      } else {
        resource = parts[0];
      }
    }
    const capResource = resource.charAt(0).toUpperCase() + resource.slice(1);
    if (!acc[capResource]) acc[capResource] = [];
    acc[capResource].push(ep);
    return acc;
  }, {});

  const dbEngine = data?.tech_stack?.database || "PostgreSQL (Supabase RLS)"

  const downloadSQL = () => {
    let sql = "-- Auto-generated Database Schema\n\n";
    tables.forEach((t: any) => {
        sql += `CREATE TABLE ${t.table_name} (\n`;
        (t.columns || []).forEach((c: string, i: number) => {
            const parts = c.split(' ');
            const name = parts[0];
            const type = parts.slice(1).join(' ').replace(/[()]/g, '') || "VARCHAR";
            sql += `  ${name} ${type}${i === (t.columns || []).length - 1 ? '' : ','}\n`;
        });
        sql += `);\n\n`;
    });
    
    const blob = new Blob([sql], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schema.sql'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyGroup = (groupName: string, eps: any) => {
    let text = `## ${groupName} Module APIs\n`
    eps.forEach((ep: any) => {
      text += `[${ep.method || "GET"}] ${ep.path} - ${ep.desc}\n`
    })
    navigator.clipboard.writeText(text)
    setCopiedGroup(groupName)
    setTimeout(() => setCopiedGroup(null), 2000)
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm text-slate-800">
      
      {/* Conversational Intro */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Here is the Database and API Architecture</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Based on your requirements, I have designed a robust data model and RESTful API layer. We will use <strong>{dbEngine}</strong> for scalable storage. Below is the step-by-step breakdown of how your application's data will be structured and accessed.
          </p>
        </div>
        <button 
          onClick={downloadSQL}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" /> Export .SQL Schema
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* DATABASE COLUMN */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Database className="w-5 h-5 text-emerald-600" /> 
            1. Database Schema
          </h3>
          <p className="text-xs text-slate-500 mb-6">The core tables required for the system to function correctly:</p>

          <div className="space-y-6">
            {tables.map((t: any, i: number) => (
              <div key={i}>
                <h4 className="font-bold text-sm text-emerald-700 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" /> {t.table_name}
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-2.5 font-semibold border-r border-slate-200">Column Name</th>
                        <th className="p-2.5 font-semibold">Data Type & Rules</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(t.columns || []).map((col: string, cIdx: number) => {
                        const parts = col.split(' ');
                        const colName = parts[0];
                        const colDesc = parts.slice(1).join(' ').replace(/[()]/g, '');
                        return (
                          <tr key={cIdx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-mono text-slate-900 border-r border-slate-100">{colName}</td>
                            <td className="p-2.5 text-slate-600">{colDesc || "VARCHAR"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 mb-4">Entity Relationships</h4>
            <div className="flex flex-wrap gap-3">
              {relationships.map((rel: string, i: number) => {
                const parts = rel.split('->').map(p => p.trim());
                if (parts.length === 2) {
                  return (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-mono font-bold">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">{parts[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">{parts[1]}</span>
                    </div>
                  )
                }
                return (
                  <div key={i} className="text-xs font-mono text-slate-600 flex items-center gap-2 w-full">
                    <span className="text-slate-400">↳</span> {rel}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* API COLUMN */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Network className="w-5 h-5 text-indigo-600" /> 
            2. REST API Endpoints
          </h3>
          <p className="text-xs text-slate-500 mb-6">These endpoints will allow the frontend to communicate with your database:</p>

          <div className="space-y-6">
            {Object.entries(groupedEndpoints).map(([groupName, eps]: [string, any], gIdx: number) => (
              <div key={gIdx} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-indigo-700">{groupName} Module</h4>
                  <button 
                    onClick={() => copyGroup(groupName, eps)}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    {copiedGroup === groupName ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedGroup === groupName ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="bg-[#0d1117] rounded-xl p-4 overflow-x-auto shadow-inner">
                  <div className="space-y-2.5 font-mono text-[11px] sm:text-xs">
                    {eps.map((ep: any, idx: number) => {
                      const method = ep.method || "GET"
                      const methodColor = 
                        method === "GET" ? "text-blue-400" :
                        method === "POST" ? "text-emerald-400" :
                        method === "PUT" ? "text-amber-400" :
                        "text-red-400"

                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                          <div className="flex items-center gap-3">
                            <span className={`w-10 font-bold ${methodColor}`}>{method}</span>
                            <span className="text-slate-200">{ep.path}</span>
                          </div>
                          <span className="text-slate-500 hidden sm:inline-block"># {ep.desc}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
