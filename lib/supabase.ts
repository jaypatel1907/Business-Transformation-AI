import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SavedBlueprint {
  id: string;
  project_title: string;
  user_problem: string;
  blueprint_data: any;
  created_at: string;
}

// LocalStorage Fallback helper for saving/sharing blueprints offline
export function saveBlueprintLocally(data: any): SavedBlueprint {
  const id = `bp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: SavedBlueprint = {
    id,
    project_title: data.project_title || "Untitled Blueprint",
    user_problem: data.user_problem || "",
    blueprint_data: data,
    created_at: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem("saved_blueprints") || "[]");
    existing.unshift(record);
    localStorage.setItem("saved_blueprints", JSON.stringify(existing.slice(0, 20)));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }

  return record;
}

export function getLocalBlueprints(): SavedBlueprint[] {
  try {
    return JSON.parse(localStorage.getItem("saved_blueprints") || "[]");
  } catch (e) {
    return [];
  }
}