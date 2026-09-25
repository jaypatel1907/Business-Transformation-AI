"use client"

import html2canvasPro from "html2canvas-pro"
import { jsPDF } from "jspdf"
import { getTranslation } from "@/lib/i18n"

interface ExportPdfOptions {
  elementId: string
  filename: string
}

/**
 * Cleanly renders an HTML element to a multi-page PDF using html2canvas-pro & jsPDF
 * Fully supports modern CSS colors (lab, oklch, color-mix) from Tailwind v4.
 */
async function renderElementToPdf(element: HTMLElement, filename: string) {
  // A4 dimensions in mm
  const a4WidthMm = 210
  const a4HeightMm = 297
  const marginMm = 8
  const contentWidthMm = a4WidthMm - marginMm * 2
  const contentHeightMm = a4HeightMm - marginMm * 2

  // Render high-res canvas using html2canvas-pro (handles lab/oklch without crashing)
  const canvas = await html2canvasPro(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    scrollY: 0,
    scrollX: 0,
    windowWidth: 794,
    backgroundColor: "#ffffff",
  })

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error("Rendered canvas is empty")
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  })

  const pxPerMm = canvas.width / contentWidthMm
  const pageHeightPx = contentHeightMm * pxPerMm
  const totalHeightPx = canvas.height

  let yOffsetPx = 0
  let pageNum = 0

  while (yOffsetPx < totalHeightPx) {
    if (pageNum > 0) {
      pdf.addPage()
    }

    const currentSliceHeightPx = Math.min(pageHeightPx, totalHeightPx - yOffsetPx)
    const sliceCanvas = document.createElement("canvas")
    sliceCanvas.width = canvas.width
    sliceCanvas.height = currentSliceHeightPx

    const sliceCtx = sliceCanvas.getContext("2d")
    if (sliceCtx) {
      sliceCtx.fillStyle = "#ffffff"
      sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
      sliceCtx.drawImage(
        canvas,
        0,
        yOffsetPx,
        canvas.width,
        currentSliceHeightPx,
        0,
        0,
        canvas.width,
        currentSliceHeightPx
      )

      const sliceImgData = sliceCanvas.toDataURL("image/jpeg", 0.98)
      const sliceHeightMm = currentSliceHeightPx / pxPerMm
      pdf.addImage(sliceImgData, "JPEG", marginMm, marginMm, contentWidthMm, sliceHeightMm)
    }

    yOffsetPx += pageHeightPx
    pageNum++
  }

  const finalName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`
  pdf.save(finalName)
}

/**
 * Exports a clean, printable PDF from a DOM element ID without blank pages, color errors, or overflow clipping
 */
export async function exportCleanPDF({ elementId, filename }: ExportPdfOptions) {
  const targetElement = document.getElementById(elementId)
  if (!targetElement) {
    console.error(`Element with id "${elementId}" not found for PDF export.`)
    alert(`Cannot find content container (#${elementId}) to export.`)
    return
  }

  // Clone the element to safely modify styles for printing without breaking UI
  const clonedElement = targetElement.cloneNode(true) as HTMLElement

  // Remove elements that should not be printed
  clonedElement.querySelectorAll(".no-print, button, input, textarea, select").forEach((el) => el.remove())

  // Fix styles that cause blank pages: reset fixed heights, overflow-hidden, and negative margins
  clonedElement.style.width = "794px"
  clonedElement.style.minHeight = "auto"
  clonedElement.style.height = "auto"
  clonedElement.style.maxHeight = "none"
  clonedElement.style.overflow = "visible"
  clonedElement.style.position = "static"
  clonedElement.style.backgroundColor = "#ffffff"
  clonedElement.style.color = "#0f172a"
  clonedElement.style.padding = "24px"
  clonedElement.style.margin = "0"
  clonedElement.style.pageBreakBefore = "avoid"

  // Force all child cards/containers to avoid breaking awkwardly inside themselves
  clonedElement.querySelectorAll("div, section, table, p, ul, ol").forEach((child) => {
    const el = child as HTMLElement
    el.style.pageBreakInside = "avoid"
    el.style.overflow = "visible"
    el.style.height = "auto"
    el.style.maxHeight = "none"
  })

  // Temporarily attach clone to body inside a hidden wrapper
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "-99999px"
  container.style.left = "0"
  container.style.width = "794px"
  container.style.zIndex = "-1000"
  container.appendChild(clonedElement)
  document.body.appendChild(container)

  try {
    await renderElementToPdf(clonedElement, filename)
  } catch (err) {
    console.error("Failed to export clean PDF:", err)
    alert("An error occurred while generating PDF.")
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
  }
}

/**
 * Helper to robustly parse column definitions (strings or objects) into a clean name, type, desc
 */
export function parseTableColumn(col: any): { name: string; type: string; desc: string } {
  if (!col) return { name: "field", type: "VARCHAR", desc: "" }
  if (typeof col === "string") {
    const match = col.match(/^([a-zA-Z0-9_]+)\s*\((.*?)\)(.*)$/)
    if (match) {
      return {
        name: match[1].trim(),
        type: match[2].trim(),
        desc: match[3]?.replace(/^[\s:-]+/, "").trim() || "Entity attribute"
      }
    }
    const simpleMatch = col.match(/^([a-zA-Z0-9_]+)\s+(VARCHAR|TEXT|UUID|BOOLEAN|INTEGER|INT|BIGINT|NUMERIC|DECIMAL|TIMESTAMP|TIMESTAMPTZ|JSONB|DATE|FLOAT|DOUBLE)(.*)$/i)
    if (simpleMatch) {
      return {
        name: simpleMatch[1].trim(),
        type: simpleMatch[2].trim().toUpperCase(),
        desc: simpleMatch[3]?.trim() || "Entity attribute"
      }
    }
    const parts = col.trim().split(/\s+/)
    if (parts.length >= 2) {
      return {
        name: parts[0],
        type: parts.slice(1).join(" "),
        desc: "Entity attribute"
      }
    }
    return { name: col, type: "VARCHAR", desc: "Entity attribute" }
  } else if (typeof col === "object") {
    const name = col.name || col.column || col.column_name || col.field || "id"
    const type = col.type || col.data_type || col.datatype || "VARCHAR"
    const desc = col.description || col.desc || col.constraint || "Entity attribute"
    return { name, type, desc }
  }
  return { name: String(col), type: "VARCHAR", desc: "" }
}

/**
 * Helper to robustly parse API endpoint definitions into method, path, desc, auth
 */
export function parseApiEndpoint(api: any): { method: string; path: string; desc: string; auth: string } {
  if (!api) return { method: "GET", path: "/api/v1/resource", desc: "API handler", auth: "Bearer JWT" }
  if (typeof api === "string") {
    const parts = api.trim().split(/\s+/)
    return {
      method: parts[0]?.toUpperCase() || "GET",
      path: parts[1] || api,
      desc: "Production REST endpoint handler",
      auth: "Bearer JWT"
    }
  }
  const method = (api.method || "GET").toUpperCase()
  const path = api.path || api.endpoint || api.url || "/api/v1/resource"
  const desc = api.desc || api.description || api.summary || "Production REST endpoint handler"
  const auth = api.auth || "Bearer JWT"
  return { method, path, desc, auth }
}

/**
 * Generates and exports a complete, professional Executive Blueprint Report PDF
 */
export async function exportExecutiveReportPDF(data: any, language: string = "English") {
  if (!data) {
    alert("No blueprint data available to export.")
    return
  }

  const container = document.createElement("div")
  container.id = "executive-report-print-container"
  container.style.position = "fixed"
  container.style.top = "-99999px"
  container.style.left = "0"
  container.style.width = "794px"
  container.style.backgroundColor = "#ffffff"
  container.style.color = "#0f172a"
  container.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  container.style.padding = "28px"
  container.style.boxSizing = "border-box"
  container.style.zIndex = "-1000"

  const tables = data.database_tables || data.database_schema?.tables || []
  const apis = data.api_endpoints || data.database_schema?.api_endpoints || []
  const bpmnSteps = data.bpmn_steps || data.process_map?.steps || []
  const sprints = data.roadmap_sprints || data.roadmap?.sprints || data.project_roadmap?.sprints || []
  const wireframes = data.wireframe_sections || data.wireframe_specs?.pages || []

  const digitalMaturity = data.digital_maturity || data.business_analysis?.digital_maturity?.overall_score || data.scores?.digital_maturity || 78
  const aiReadiness = data.ai_adoption || data.business_analysis?.ai_readiness?.overall_score || data.scores?.ai_readiness || 84
  const targetDelivery = data.timeline || data.scores?.target_mvp || "6-8 Weeks"
  const estBudget = data.financial_estimation ? `${data.financial_estimation.min_budget} – ${data.financial_estimation.max_budget}` : (data.scores?.financial_budget || "$18,000 – $34,000")

  const techStackList = Array.isArray(data.tech_stack)
    ? data.tech_stack
    : typeof data.tech_stack === "object" && data.tech_stack !== null
    ? Object.values(data.tech_stack).filter(Boolean)
    : ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase PostgreSQL", "Gemini 2.5 Pro"]

  container.innerHTML = `
    <!-- Header -->
    <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; page-break-inside: avoid;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 14px; height: 14px; background: #4f46e5; border-radius: 4px;"></div>
          <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: #4f46e5; text-transform: uppercase;">BlueprintAI Executive Architecture Report</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${data.project_title || "Enterprise Architecture Blueprint"}</h1>
        <p style="font-size: 13px; color: #64748b; margin: 0;">${data.user_problem || "End-to-End Business Transformation & Architecture Specifications"}</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #64748b; border-left: 1px solid #e2e8f0; padding-left: 12px;">
        <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
        <div><strong>Language:</strong> ${language}</div>
        <div><strong>Status:</strong> Approved / Production Ready</div>
      </div>
    </div>

    <!-- Executive Metrics -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; page-break-inside: avoid;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Digital Maturity</div>
        <div style="font-size: 20px; font-weight: 800; color: #4f46e5; margin-top: 4px;">${digitalMaturity}/100</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">AI Readiness</div>
        <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">${aiReadiness}%</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Target Delivery</div>
        <div style="font-size: 16px; font-weight: 800; color: #0284c7; margin-top: 6px;">${targetDelivery}</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Est. Budget</div>
        <div style="font-size: 16px; font-weight: 800; color: #f59e0b; margin-top: 6px;">${estBudget}</div>
      </div>
    </div>

    <!-- Executive Summary & Scope -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 13px; font-weight: 800; color: #1e293b; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.05em;">1. Executive Summary & Recommended Stack</h3>
      <p style="font-size: 12px; line-height: 1.6; color: #334155; margin: 0 0 10px 0;">${data.user_problem || "Enterprise solution architecture transforming manual operations into an automated AI-powered platform."}</p>
      
      <div>
        <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 4px;">Recommended Technology Stack:</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${techStackList.map((tech: any) => `
            <span style="font-size: 10px; background: #e0e7ff; color: #4338ca; padding: 3px 8px; border-radius: 6px; font-weight: 700;">${typeof tech === "string" ? tech : JSON.stringify(tech)}</span>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- BPMN Process Steps -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 13px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">2. Step-by-Step Action Guide & BPMN Workflow</h3>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #ffffff;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(bpmnSteps.length > 0 ? bpmnSteps : [
            { id: 1, title: "1. Data Ingestion & Registration", desc: "User triggers initial request or registration." },
            { id: 2, title: "2. Business Logic & Validation", desc: "System validates constraints and updates state." },
            { id: 3, title: "3. Execution & Telemetry", desc: "Database persists transaction with live audit logs." }
          ]).map((s: any, idx: number) => `
            <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #4f46e5; font-size: 11px;">
              <strong style="color: #0f172a;">${s.title || `Step ${idx + 1}`}</strong>
              <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${s.desc || "Automated processing step."}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Database Schema & Tables -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 13px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">3. Relational Schema & Data Model (${tables.length} Tables)</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${tables.slice(0, 6).map((tbl: any) => {
          const tableName = tbl.table_name || tbl.name || "table";
          const cols = (tbl.columns || []).map(parseTableColumn);
          return `
            <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; background: #ffffff; page-break-inside: avoid;">
              <div style="font-weight: 800; color: #0284c7; font-size: 11px; margin-bottom: 4px; font-family: monospace;">📁 ${tableName}</div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                ${cols.slice(0, 5).map(c => `
                  <div style="display: flex; justify-content: space-between; font-size: 9px; font-family: monospace; background: #f8fafc; padding: 2px 4px; border-radius: 3px;">
                    <span style="font-weight: 700; color: #0f172a;">${c.name}</span>
                    <span style="color: #4338ca;">${c.type}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `
        }).join("")}
      </div>
    </div>

    <!-- REST API Endpoints -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 13px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">4. Production REST API Endpoints (${apis.length} Endpoints)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: left; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
        <thead>
          <tr style="background: #f1f5f9; color: #475569; font-size: 9px; text-transform: uppercase;">
            <th style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; width: 15%;">Method</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; width: 45%;">Endpoint Route</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; width: 40%;">Description</th>
          </tr>
        </thead>
        <tbody>
          ${apis.slice(0, 6).map((rawApi: any) => {
            const a = parseApiEndpoint(rawApi)
            const badgeBg = a.method === "GET" ? "#dcfce7; color: #15803d" : a.method === "POST" ? "#dbeafe; color: #1d4ed8" : a.method === "PUT" ? "#fef3c7; color: #b45309" : "#fee2e2; color: #b91c1c"
            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 5px 8px;"><span style="background: ${badgeBg}; font-weight: 800; font-size: 8px; padding: 2px 5px; border-radius: 3px;">${a.method}</span></td>
                <td style="padding: 5px 8px; font-family: monospace; font-size: 9px; font-weight: 700; color: #0f172a;">${a.path}</td>
                <td style="padding: 5px 8px; color: #64748b; font-size: 9px;">${a.desc}</td>
              </tr>
            `
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- Implementation Roadmap -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 13px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">5. Phased Delivery Roadmap</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 10px;">
        ${(sprints.length > 0 ? sprints : [
          { timeframe: "Week 1", phase: "UI & Architecture Setup", owner: "Lead Frontend", tasks: ["Setup project structure", "Configure UI layouts"] },
          { timeframe: "Week 2", phase: "Backend & Database", owner: "Backend Engineer", tasks: ["Provision database tables", "Implement REST APIs"] }
        ]).slice(0, 4).map((sp: any) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; background: #f8fafc; page-break-inside: avoid;">
            <div style="font-weight: 800; color: #4f46e5; margin-bottom: 2px;">${sp.timeframe || "Sprint 1"} — ${sp.phase || "Delivery"}</div>
            <div style="font-size: 9px; color: #64748b;">Owner: ${sp.owner || "Tech Lead"}</div>
            <ul style="margin: 4px 0 0 0; padding-left: 14px; font-size: 9px; color: #334155;">
              ${(sp.tasks || []).slice(0, 3).map((t: string) => `<li>${t}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8; page-break-inside: avoid;">
      <span>BlueprintAI Enterprise Transformation Engine</span>
      <span>Confidential • Implementation Blueprint</span>
    </div>
  `

  document.body.appendChild(container)

  const sanitizedTitle = (data.project_title || "Executive_Report").replace(/[^a-zA-Z0-9_-]/g, "_")
  const filename = `Executive_Blueprint_${sanitizedTitle}_${Date.now()}.pdf`

  try {
    await renderElementToPdf(container, filename)
  } catch (err) {
    console.error("Failed to generate executive report PDF:", err)
    alert("An error occurred while exporting Executive Report PDF.")
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
  }
}

// Re-exports for backward compatibility
export const exportElementToPDF = (elementId: string, customFilename?: string) =>
  exportCleanPDF({ elementId, filename: customFilename || `Blueprint-${elementId}-${Date.now()}` })

export const exportExecutiveReportToPDF = exportExecutiveReportPDF

export async function exportGuideRoadmapPDF(data: any, language: string = "English") {
  if (!data) return
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "-99999px"
  container.style.width = "794px"
  container.style.padding = "28px"
  container.style.backgroundColor = "#fff"
  container.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  container.style.color = "#0f172a"
  
  const steps = data.bpmn_steps || data.process_map?.steps || []
  const sprints = data.roadmap_sprints || data.roadmap?.sprints || []

  container.innerHTML = `
    <h1 style="font-size: 24px; color: #4f46e5; margin-bottom: 20px;">${getTranslation(language, "tabGuide")} & ${getTranslation(language, "tabRoadmap")} - ${data.project_title || "Project"}</h1>
    
    <h2 style="font-size: 16px; font-weight: 800; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">${getTranslation(language, "stepByStepGuide")}</h2>
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
      ${steps.map((s: any, i: number) => `
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid #4f46e5; page-break-inside: avoid;">
          <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a;">Step ${i + 1}: ${s.title}</h3>
          <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.5;">${s.desc}</p>
        </div>
      `).join("")}
    </div>

    <h2 style="font-size: 16px; font-weight: 800; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">${getTranslation(language, "projectRoadmap")}</h2>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${sprints.map((r: any) => `
        <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #22c55e; page-break-inside: avoid;">
          <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #166534;">${r.timeframe} — ${r.phase}</h3>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;"><strong>${getTranslation(language, "owner")}:</strong> ${r.owner}</p>
          <ul style="margin: 0; padding-left: 16px; font-size: 10px; color: #334155; line-height: 1.5;">
            ${(r.tasks || []).map((t: string) => `<li>${t}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `
  document.body.appendChild(container)
  await renderElementToPdf(container, `Guide_Roadmap_${Date.now()}.pdf`)
  document.body.removeChild(container)
}

export async function exportDatabaseApiPDF(data: any, language: string = "English") {
  if (!data) return
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "-99999px"
  container.style.width = "794px"
  container.style.padding = "28px"
  container.style.backgroundColor = "#fff"
  container.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  container.style.color = "#0f172a"
  
  const tables = data.database_tables || data.database_schema?.tables || []
  const apis = data.api_endpoints || data.database_schema?.api_endpoints || []

  container.innerHTML = `
    <!-- Header -->
    <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; page-break-inside: avoid;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 14px; height: 14px; background: #4f46e5; border-radius: 4px;"></div>
          <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: #4f46e5; text-transform: uppercase;">Database & REST API Specifications</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${data.project_title || "Project Specification"}</h1>
        <p style="font-size: 13px; color: #64748b; margin: 0;">PostgreSQL Relational Schemas (${tables.length} Tables) & REST API Gateway (${apis.length} Endpoints)</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #64748b; border-left: 1px solid #e2e8f0; padding-left: 12px;">
        <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
        <div><strong>Language:</strong> ${language}</div>
        <div><strong>Engine:</strong> PostgreSQL / RLS</div>
      </div>
    </div>
    
    <h2 style="font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">${getTranslation(language, "dbSchema")} (${tables.length} Tables)</h2>
    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 30px;">
      ${tables.map((t: any) => {
        const tableName = t.table_name || t.name || "tbl_records"
        const cols = (t.columns || []).map(parseTableColumn)
        return `
        <div style="background: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="margin: 0; font-size: 13px; font-weight: 800; color: #0284c7; font-family: monospace;">📁 ${tableName}</h3>
            <span style="font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${cols.length} Columns</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569; font-size: 10px; text-transform: uppercase;">
                <th style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; width: 30%;">Column</th>
                <th style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; width: 25%;">Data Type</th>
                <th style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; width: 45%;">Description / Constraint</th>
              </tr>
            </thead>
            <tbody>
              ${cols.map((c) => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 6px 8px; font-family: monospace; font-weight: 700; color: #0f172a;">${c.name}</td>
                  <td style="padding: 6px 8px; color: #4338ca;"><span style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; font-family: monospace;">${c.type}</span></td>
                  <td style="padding: 6px 8px; color: #64748b; font-size: 10px;">${c.desc}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}).join("")}
    </div>

    <h2 style="font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">REST API Gateway (${apis.length} Endpoints)</h2>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${apis.map((rawApi: any) => {
        const a = parseApiEndpoint(rawApi)
        const badgeBg = a.method === "GET" ? "#dcfce7; color: #15803d" : a.method === "POST" ? "#dbeafe; color: #1d4ed8" : a.method === "PUT" ? "#fef3c7; color: #b45309" : "#fee2e2; color: #b91c1c"
        return `
        <div style="background: #ffffff; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: ${badgeBg}; font-weight: 800; padding: 3px 8px; border-radius: 4px; font-size: 10px;">${a.method}</span>
              <span style="font-family: monospace; font-size: 12px; font-weight: 800; color: #0f172a;">${a.path}</span>
            </div>
            <span style="font-size: 10px; color: #64748b; font-family: monospace;">${a.auth}</span>
          </div>
          <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.4;">${a.desc}</p>
        </div>
      `}).join("")}
    </div>
  `
  document.body.appendChild(container)
  await renderElementToPdf(container, `Database_APIs_${Date.now()}.pdf`)
  document.body.removeChild(container)
}

export async function exportWireframePDF(data: any, language: string = "English") {
  if (!data) return
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "-99999px"
  container.style.width = "794px"
  container.style.padding = "28px"
  container.style.backgroundColor = "#fff"
  container.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  container.style.color = "#0f172a"
  
  const sections = data.wireframe_sections || data.wireframe_specs?.pages || []

  container.innerHTML = `
    <h1 style="font-size: 24px; color: #4f46e5; margin-bottom: 20px;">UI Wireframes - ${data.project_title || "Project"}</h1>
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${sections.map((w: any) => `
        <div style="border: 2px solid #cbd5e1; border-radius: 12px; overflow: hidden; page-break-inside: avoid;">
          <div style="background: #f1f5f9; padding: 12px; border-bottom: 2px solid #cbd5e1;">
            <h3 style="margin: 0; font-size: 15px; font-weight: 800; color: #334155;">${w.title}</h3>
          </div>
          <div style="padding: 20px; background: #fff; min-height: 160px; display: flex; flex-direction: column; gap: 12px;">
            ${(w.components || []).map((c: string) => `
              <div style="border: 1px dashed #94a3b8; background: #f8fafc; padding: 12px; border-radius: 8px; text-align: center; color: #475569; font-weight: 700; font-size: 11px;">
                ${c}
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `
  document.body.appendChild(container)
  await renderElementToPdf(container, `Wireframe_${Date.now()}.pdf`)
  document.body.removeChild(container)
}


