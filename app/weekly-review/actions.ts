"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export async function saveReflection(weekStart: string, weekEnd: string, formData: FormData) {
  const fields = {
    week_start: weekStart,
    week_end: weekEnd,
    learnings: String(formData.get("learnings") ?? "").trim() || null,
    difficulties: String(formData.get("difficulties") ?? "").trim() || null,
    further_study: String(formData.get("further_study") ?? "").trim() || null,
    improvements: String(formData.get("improvements") ?? "").trim() || null,
  };

  const supabase = createServerClient();
  const { error } = await supabase.from("weekly_reviews").upsert(fields, { onConflict: "week_start" });
  if (error) throw new Error(error.message);

  revalidatePath("/weekly-review");
}
