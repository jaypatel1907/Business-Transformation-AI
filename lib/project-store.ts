import { supabase } from "./supabase";

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  description: string;
}

export interface BuildValidationResult {
  syntax_check: boolean;
  type_check: boolean;
  route_check: boolean;
  schema_integrity: boolean;
  build_passed: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProjectRecord {
  id: string;
  version: number;
  version_tag: string;
  project_name: string;
  original_prompt: string;
  user_role: string;
  approved_blueprint: any;
  files: GeneratedFile[];
  app_code: string; // Compiled standalone executable React/HTML application code
  generation_status: "pending" | "generating" | "built" | "deployed" | "failed";
  validation: BuildValidationResult;
  deployment_status: "pending" | "deploying" | "live" | "failed";
  live_url: string;
  deployment_platform: "Built-in Live Engine" | "Vercel";
  build_logs: string[];
  change_summary: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "blueprint_ai_projects";

export function getLocalProjects(): ProjectRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading local projects:", e);
    return [];
  }
}

export function getProjectById(id: string): ProjectRecord | null {
  const list = getLocalProjects();
  return list.find((p) => p.id === id) || null;
}

export function saveProjectRecord(project: ProjectRecord): ProjectRecord {
  if (typeof window === "undefined") return project;
  try {
    const list = getLocalProjects();
    const existingIndex = list.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      list[existingIndex] = project;
    } else {
      list.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 30)));

    // Also persist in Supabase if available
    if (supabase) {
      supabase
        .from("projects")
        .upsert({
          id: project.id,
          name: project.project_name,
          prompt: project.original_prompt,
          blueprint: project.approved_blueprint,
          live_url: project.live_url,
          status: project.deployment_status,
          version: project.version,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase project sync notice:", error.message);
        });
    }
  } catch (e) {
    console.warn("Error saving project record:", e);
  }
  return project;
}

export function createNewProjectVersion(
  baseProject: ProjectRecord,
  updatedBlueprint: any,
  changeNote: string
): ProjectRecord {
  const newVersion = baseProject.version + 1;
  const updatedRecord: ProjectRecord = {
    ...baseProject,
    version: newVersion,
    version_tag: `v${newVersion}`,
    approved_blueprint: updatedBlueprint,
    change_summary: changeNote || `Updated to version ${newVersion}`,
    updated_at: new Date().toISOString(),
  };
  return saveProjectRecord(updatedRecord);
}
