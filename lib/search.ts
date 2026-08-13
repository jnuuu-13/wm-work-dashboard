import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export async function searchAll(query: string) {
  const supabase = createServerClient();
  const term = `%${query}%`;

  const [playbookRes, meetingsRes, notesRes] = await Promise.all([
    supabase
      .from("playbook")
      .select("*")
      .or(`title.ilike.${term},content.ilike.${term}`)
      .order("created_at", { ascending: false }),
    supabase
      .from("meetings")
      .select("*")
      .or(
        `title.ilike.${term},notes.ilike.${term},key_points.ilike.${term},learnings.ilike.${term},follow_up.ilike.${term}`
      )
      .order("date", { ascending: false }),
    supabase
      .from("quick_notes")
      .select("*")
      .ilike("content", term)
      .order("created_at", { ascending: false }),
  ]);

  return {
    playbook: playbookRes.data ?? [],
    meetings: meetingsRes.data ?? [],
    quickNotes: notesRes.data ?? [],
  };
}
