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

  const tablesCount = data.database_schema?.tables?.length || 0
  const apisCount = data.database_schema?.api_endpoints?.length || 0
  const wireframesCount = data.wireframe_specs?.pages?.length || 0

  container.innerHTML = `
    <!-- Header -->
    <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; page-break-inside: avoid;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div style="width: 14px; height: 14px; background: #4f46e5; border-radius: 4px;"></div>
          <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: #4f46e5; text-transform: uppercase;">Futurrizon Business Transformation AI</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${data.project_title || "Enterprise Architecture Blueprint"}</h1>
        <p style="font-size: 13px; color: #64748b; margin: 0;">${data.project_subtitle || "Complete Modernization & Transformation Report"}</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #64748b; border-left: 1px solid #e2e8f0; padding-left: 12px;">
        <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
        <div><strong>Language:</strong> ${language}</div>
        <div><strong>Status:</strong> Approved / Active</div>
      </div>
    </div>

    <!-- Executive Metrics -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; page-break-inside: avoid;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Digital Maturity</div>
        <div style="font-size: 20px; font-weight: 800; color: #4f46e5; margin-top: 4px;">${data.scores?.digital_maturity || 78}/100</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">AI Readiness</div>
        <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">${data.scores?.ai_readiness || 84}%</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Target Delivery</div>
        <div style="font-size: 20px; font-weight: 800; color: #0284c7; margin-top: 4px;">${data.scores?.target_mvp || "12 Weeks"}</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Est. Budget</div>
        <div style="font-size: 20px; font-weight: 800; color: #f59e0b; margin-top: 4px;">${data.scores?.financial_budget || "$145,000"}</div>
      </div>
    </div>

    <!-- Executive Summary & Scope -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.05em;">1. Executive Summary & Strategic Scope</h3>
      <p style="font-size: 12px; line-height: 1.6; color: #334155; margin: 0 0 10px 0;">${data.executive_summary || "Strategic enterprise roadmap outlining system architecture, automated BPMN workflows, relational database entities, and API specifications."}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 4px;">Key Objectives:</strong>
          <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #475569; line-height: 1.5;">
            ${(Array.isArray(data?.strategic_objectives)
              ? data.strategic_objectives
              : typeof data?.strategic_objectives === "object" && data?.strategic_objectives !== null
              ? Object.values(data.strategic_objectives)
              : [
                  "End-to-end workflow automation",
                  "AI-enabled predictive analytics",
                  "Microservices API architecture",
                ]
            )
              .map((obj: any) => `<li>${typeof obj === "string" ? obj : JSON.stringify(obj)}</li>`)
              .join("")}
          </ul>
        </div>
        <div>
          <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 4px;">Recommended Tech Stack:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(Array.isArray(data?.tech_stack)
              ? data.tech_stack
              : typeof data?.tech_stack === "object" && data?.tech_stack !== null
              ? Object.values(data.tech_stack)
              : ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase PostgreSQL", "Gemini 2.5 Pro"]
            )
              .map(
                (tech: any) => `
              <span style="font-size: 10px; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${typeof tech === "string" ? tech : JSON.stringify(tech)}</span>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- BPMN Process Map -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">2. Core Business Process Architecture (BPMN)</h3>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #ffffff;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(data.process_map?.steps || [
            { step: 1, name: "Data Ingestion & Event Trigger", role: "Integration Layer", duration: "Real-time" },
            { step: 2, name: "Automated Rules & Validation", role: "Business Logic Engine", duration: "< 200ms" },
            { step: 3, name: "AI Decisioning & Optimization", role: "Gemini Model", duration: "1.2s" },
            { step: 4, name: "Execution & Record Persistence", role: "PostgreSQL Database", duration: "Transactional" },
          ])
            .map(
              (s: any) => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #4f46e5; font-size: 11px;">
              <div>
                <strong style="color: #0f172a;">Step ${s.step || s.order || 1}: ${s.name || s.title}</strong>
                <div style="color: #64748b; font-size: 10px;">Assigned Role: ${s.role || "System"}</div>
              </div>
              <span style="background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${s.duration || "Automated"}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>

    <!-- Database Entities & Schema -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">3. Relational Schema & Data Model (${tablesCount} Entities)</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${(data.database_schema?.tables || [
          { name: "organizations", description: "Core multi-tenant organization entity", columns: ["id UUID PK", "name TEXT", "created_at TIMESTAMP"] },
          { name: "users", description: "System user profiles and role assignments", columns: ["id UUID PK", "org_id UUID FK", "email TEXT", "role TEXT"] },
          { name: "blueprints", description: "Transformation plans and execution state", columns: ["id UUID PK", "title TEXT", "spec JSONB", "updated_at TIMESTAMP"] },
          { name: "audit_logs", description: "Immutable governance and action logging", columns: ["id UUID PK", "user_id UUID FK", "action TEXT", "timestamp TIMESTAMP"] },
        ])
          .slice(0, 6)
          .map(
            (tbl: any) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; background: #ffffff; page-break-inside: avoid;">
            <div style="font-weight: 700; color: #4f46e5; font-size: 12px; margin-bottom: 2px;">📁 ${tbl.name}</div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">${tbl.description || "Database table definition"}</div>
            <div style="font-family: monospace; font-size: 9px; color: #334155; background: #f8fafc; padding: 4px; border-radius: 4px;">
              ${(tbl.columns || []).slice(0, 4).join(" | ")}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <!-- `${getTranslation(language, "apiEndpoints")} -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">4. Secure Microservices & REST Endpoints (${apisCount} Endpoints)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background: #f1f5f9; color: #475569; font-size: 10px; text-transform: uppercase;">
            <th style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0;">Method</th>
            <th style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0;">Endpoint Route</th>
            <th style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0;">Description & Auth</th>
          </tr>
        </thead>
        <tbody>
          ${(data.database_schema?.api_endpoints || [
            { `${getTranslation(language, "method")}: "GET", path: "/api/v1/blueprint", description: "Fetch transformation specifications", auth: "Bearer JWT" },
            { `${getTranslation(language, "method")}: "POST", path: "/api/v1/blueprint/generate", description: "Trigger Gemini AI synthesis pipeline", auth: "Bearer JWT" },
            { `${getTranslation(language, "method")}: "POST", path: "/api/v1/export/pdf", description: "Stream high-fidelity printable artifacts", auth: "Bearer JWT" },
            { `${getTranslation(language, "method")}: "GET", path: "/api/v1/audit/logs", description: "Retrieve compliance security logs", auth: "Admin Only" },
          ])
            .slice(0, 5)
            .map(
              (api: any) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 10px;"><span style="background: ${api.method === "GET" ? "#dcfce7; color: #15803d" : "#dbeafe; color: #1d4ed8"}; font-weight: 700; font-size: 9px; padding: 2px 6px; border-radius: 4px;">${api.method}</span></td>
              <td style="padding: 6px 10px; font-family: monospace; font-size: 10px; color: #0f172a;">${api.path}</td>
              <td style="padding: 6px 10px; color: #64748b; font-size: 10px;">${api.description}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- `${getTranslation(language, "projectRoadmap")} -->
    <div style="margin-bottom: 20px; page-break-inside: avoid;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">5. Phased Delivery Roadmap</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 10px;">
        ${(data.roadmap?.sprints || [
          { sprint: "Sprint 1-2", focus: "Foundation & Ingestion", deliverable: "Setup DB schema, auth & baseline APIs" },
          { sprint: "Sprint 3-4", focus: "AI Pipeline & BPMN Engine", deliverable: "Connect Gemini AI engine & automations" },
          { sprint: "Sprint 5-6", focus: "Production Hardening", deliverable: "Enterprise verification & launch" },
        ])
          .map(
            (sp: any) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; background: #f8fafc; page-break-inside: avoid;">
            <div style="font-weight: 800; color: #4f46e5; margin-bottom: 2px;">${sp.sprint}</div>
            <strong style="color: #0f172a;">${sp.focus}</strong>
            <p style="margin: 2px 0 0 0; color: #64748b;">${sp.deliverable}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8; page-break-inside: avoid;">
      <span>Futurrizon Business Transformation AI</span>
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
  if (!data) return;
  const container = document.createElement("div");
  container.style.position = "fixed"; container.style.top = "-99999px";
  container.style.width = "794px"; container.style.padding = "28px"; container.style.backgroundColor = "#fff";
  container.style.fontFamily = "sans-serif"; container.style.color = "#0f172a";
  
  container.innerHTML = `
    <h1 style="font-size: 24px; color: #4f46e5; margin-bottom: 20px;">`${getTranslation(language, "tabGuide")} & `${getTranslation(language, "tabRoadmap")} - ${data.project_title || "Project"}</h1>
    
    <h2 style="font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">`${getTranslation(language, "stepByStepGuide")}</h2>
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
      ${(data.bpmn_steps || []).map((s: any, i: number) => `
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid #4f46e5;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px;">Step ${i + 1}: ${s.title}</h3>
          <p style="margin: 0; font-size: 12px; color: #475569;">${s.desc}</p>
        </div>
      `).join("")}
    </div>

    <h2 style="font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">`${getTranslation(language, "projectRoadmap")}</h2>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${(data.roadmap_sprints || []).map((r: any) => `
        <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #22c55e;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px;">${r.timeframe} - ${r.phase}</h3>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">`${getTranslation(language, "owner")}: ${r.owner}</p>
          <ul style="margin: 0; padding-left: 16px; font-size: 11px;">
            ${(r.tasks || []).map((t: string) => `<li>${t}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `;
  document.body.appendChild(container);
  await renderElementToPdf(container, `Guide_Roadmap_${Date.now()}.pdf`);
  document.body.removeChild(container);
}

export async function exportDatabaseApiPDF(data: any, language: string = "English") {
  if (!data) return;
  const container = document.createElement("div");
  container.style.position = "fixed"; container.style.top = "-99999px";
  container.style.width = "794px"; container.style.padding = "28px"; container.style.backgroundColor = "#fff";
  container.style.fontFamily = "sans-serif"; container.style.color = "#0f172a";
  
  container.innerHTML = `
    <h1 style="font-size: 24px; color: #4f46e5; margin-bottom: 20px;">`${getTranslation(language, "tabDatabase")} - ${data.project_title || "Project"}</h1>
    
    <h2 style="font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">`${getTranslation(language, "dbSchema")}</h2>
    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
      ${(data.database_tables || []).map((t: any) => `
        <div style="background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
          <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #0284c7;">`${getTranslation(language, "tablesCount")}: ${t.table_name}</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr style="background: #e2e8f0;"><th style="padding: 4px; text-align: left;">Column</th><th style="padding: 4px; text-align: left;">Type</th><th style="padding: 4px; text-align: left;">Description</th></tr>
            ${(t.columns || []).map((c: any) => `<tr><td style="padding: 4px; border-bottom: 1px solid #f1f5f9; font-family: monospace;">${c.name}</td><td style="padding: 4px; border-bottom: 1px solid #f1f5f9;">${c.type}</td><td style="padding: 4px; border-bottom: 1px solid #f1f5f9;">${c.description || ""}</td></tr>`).join("")}
          </table>
        </div>
      `).join("")}
    </div>

    <h2 style="font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">REST APIs</h2>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${(data.api_endpoints || []).map((a: any) => `
        <div style="background: #fffbeb; padding: 12px; border: 1px solid #fde68a; border-radius: 6px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="background: #fbbf24; color: #78350f; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${a.method}</span>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold;">${a.endpoint}</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #475569;">${a.description}</p>
        </div>
      `).join("")}
    </div>
  `;
  document.body.appendChild(container);
  await renderElementToPdf(container, `Database_APIs_${Date.now()}.pdf`);
  document.body.removeChild(container);
}

export async function exportWireframePDF(data: any, language: string = "English") {
  if (!data) return;
  const container = document.createElement("div");
  container.style.position = "fixed"; container.style.top = "-99999px";
  container.style.width = "794px"; container.style.padding = "28px"; container.style.backgroundColor = "#fff";
  container.style.fontFamily = "sans-serif"; container.style.color = "#0f172a";
  
  container.innerHTML = `
    <h1 style="font-size: 24px; color: #4f46e5; margin-bottom: 20px;">UI Wireframes - ${data.project_title || "Project"}</h1>
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${(data.wireframe_sections || []).map((w: any) => `
        <div style="border: 2px solid #cbd5e1; border-radius: 12px; overflow: hidden; page-break-inside: avoid;">
          <div style="background: #f1f5f9; padding: 12px; border-bottom: 2px solid #cbd5e1;">
            <h3 style="margin: 0; font-size: 16px; color: #334155;">${w.title}</h3>
          </div>
          <div style="padding: 24px; background: #fff; min-height: 200px; display: flex; flex-direction: column; gap: 16px;">
            ${(w.components || []).map((c: string) => `
              <div style="border: 2px dashed #94a3b8; padding: 16px; border-radius: 8px; text-align: center; color: #64748b; font-weight: bold;">
                ${c}
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
  document.body.appendChild(container);
  await renderElementToPdf(container, `Wireframe_${Date.now()}.pdf`);
  document.body.removeChild(container);
}
