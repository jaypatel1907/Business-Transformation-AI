import { NextRequest, NextResponse } from "next/server"
import { getUXGenerationContext, normalizeToUXBlueprint } from "@/lib/ux-wireframe-adapter"
import { UXBlueprint } from "@/lib/ux-wireframe-types"

export async function POST(req: NextRequest) {
  try {
    const { prompt, blueprintData, language = "English" } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY
    const context = getUXGenerationContext(blueprintData)
    const activePrompt = (prompt || context.problem || context.title || "Enterprise Web Application").trim()

    if (apiKey && apiKey.trim() !== "") {
      try {
        const candidateModels = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"]
        const sysPrompt = `You are a Principal Product Designer & Enterprise UX Architect.
Generate an interactive, multi-screen UX Wireframe Architecture for:
"${activePrompt}"

Business Context:
- Domain: ${context.domain}
- Target Audience: ${context.targetAudience}
- Strategic Goals: ${context.goals.join("; ")}
- Gaps Identified: ${context.gaps.slice(0, 3).join("; ")}
- AI Opportunities: ${context.aiOpportunities.slice(0, 3).join("; ")}

CRITICAL REQUIREMENTS:
1. Target Language: ALL user-facing labels, headings, descriptions MUST be in ${language}.
2. Generate between 4 to 6 connected screens forming a complete user journey (e.g. Discovery/Home, Main Workspace/Catalog/Booking, Detail/Checkout/Form, Confirmation/Status).
3. Populate each screen with 4-8 realistic, rich components from the component library:
   (heading, text, navbar, button, input, select, textarea, card, stat_card, alert, table, list, search, tabs).
4. Connect screens with realistic navigation actions on buttons (e.g., button action type="navigate", targetScreenId="screen-2").
5. Provide at least 1 detailed User Persona and 1 step-by-step User Journey.

Return ONLY a valid JSON matching this schema:
{
  "projectTitle": "${context.title}",
  "activeScreenId": "screen-1",
  "status": "draft",
  "updatedAt": "${new Date().toISOString()}",
  "personas": [
    {
      "id": "persona-1",
      "name": "Persona Name in ${language}",
      "role": "Role in ${language}",
      "avatar": "👤",
      "goals": ["Goal 1 in ${language}", "Goal 2 in ${language}"],
      "painPoints": ["Pain point in ${language}"],
      "keyScreens": ["screen-1", "screen-2"]
    }
  ],
  "journeys": [
    {
      "id": "journey-1",
      "personaId": "persona-1",
      "title": "Journey Title in ${language}",
      "goal": "Journey Goal in ${language}",
      "steps": [
        {
          "stepNumber": 1,
          "title": "Step 1 in ${language}",
          "description": "Description in ${language}",
          "screenId": "screen-1",
          "action": "Action in ${language}",
          "aiTouchpoint": "AI feature in ${language}"
        }
      ]
    }
  ],
  "screens": [
    {
      "id": "screen-1",
      "name": "Screen Title in ${language}",
      "route": "/",
      "description": "Screen summary in ${language}",
      "purpose": "Primary purpose in ${language}",
      "deviceType": "desktop",
      "isInitial": true,
      "components": [
        {
          "id": "cmp-1",
          "type": "heading",
          "label": "Heading text in ${language}",
          "content": "Subtitle in ${language}",
          "width": "full"
        },
        {
          "id": "cmp-2",
          "type": "button",
          "label": "Action Button in ${language}",
          "variant": "primary",
          "width": "1/2",
          "action": { "type": "navigate", "targetScreenId": "screen-2", "label": "Go to Screen 2" }
        }
      ]
    }
  ],
  "navigation": [
    {
      "id": "nav-1",
      "sourceScreenId": "screen-1",
      "targetScreenId": "screen-2",
      "trigger": "click",
      "label": "Proceed CTA in ${language}"
    }
  ]
}`

        for (const model of candidateModels) {
          try {
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: sysPrompt }] }],
                  generationConfig: {
                    temperature: 0.3,
                    responseMimeType: "application/json"
                  }
                })
              }
            )

            if (resp.ok) {
              const resData = await resp.json()
              const text = resData.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) {
                const cleaned = text.replace(/^```(json)?|```$/gi, "").trim()
                const uxBlueprint: UXBlueprint = JSON.parse(cleaned)
                if (uxBlueprint.screens?.length > 0) {
                  return NextResponse.json({ success: true, ux_blueprint: uxBlueprint, ai_used: true, model })
                }
              }
            }
          } catch (mErr) {
            console.warn(`Gemini UX Generation with ${model} failed, trying next`, mErr)
          }
        }
      } catch (err) {
        console.warn("Gemini UX generation failed, falling back to smart adapter", err)
      }
    }

    // Domain heuristic fallback
    const fallbackBlueprint = normalizeToUXBlueprint({
      ...blueprintData,
      project_title: activePrompt
    })

    return NextResponse.json({ success: true, ux_blueprint: fallbackBlueprint, ai_used: false })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate UX wireframe architecture" }, { status: 500 })
  }
}
