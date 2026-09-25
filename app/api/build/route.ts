import { NextRequest, NextResponse } from "next/server";
import { generateApplicationFromBlueprint } from "@/lib/app-generator";
import { ProjectRecord, saveProjectRecord, getProjectById } from "@/lib/project-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blueprint, projectId, version = 1, userRole = "Manager", changeSummary = "Initial Build" } = body;

    if (!blueprint) {
      return NextResponse.json({ error: "Missing approved blueprint specification" }, { status: 400 });
    }

    // Run application generation pipeline
    const result = generateApplicationFromBlueprint(blueprint, projectId);

    const existing = projectId ? getProjectById(projectId) : null;
    const currentVer = existing ? existing.version + 1 : version;

    const liveUrl = `/app/${result.project_id}`;

    const projectRecord: ProjectRecord = {
      id: result.project_id,
      version: currentVer,
      version_tag: `v${currentVer}`,
      project_name: result.project_name,
      original_prompt: blueprint.user_problem || "Business Solution",
      user_role: userRole,
      approved_blueprint: blueprint,
      files: result.files,
      app_code: result.standalone_html,
      generation_status: "built",
      validation: result.validation,
      deployment_status: "live",
      live_url: liveUrl,
      deployment_platform: "Built-in Live Engine",
      build_logs: result.logs,
      change_summary: changeSummary,
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      project: projectRecord,
      live_url: liveUrl,
      logs: result.logs,
      validation: result.validation,
    });
  } catch (error: any) {
    console.error("Build Pipeline Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate application" },
      { status: 500 }
    );
  }
}
