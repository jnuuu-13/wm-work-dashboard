"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

function parseEventFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? "") || null,
    location: String(formData.get("location") ?? "").trim() || null,
    event_type: String(formData.get("event_type") ?? "기타"),
    description: String(formData.get("description") ?? "").trim() || null,
  };
}

export async function createEvent(formData: FormData) {
  const fields = parseEventFields(formData);
  if (!fields.title || !fields.date) throw new Error("일정명과 날짜를 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("events").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/calendar");
  revalidatePath("/");
}

export async function updateEvent(id: string, formData: FormData) {
  const fields = parseEventFields(formData);
  if (!fields.title || !fields.date) throw new Error("일정명과 날짜를 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("events").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/calendar");
  revalidatePath("/");
}

export async function deleteEvent(id: string) {
  const supabase = createServerClient();
  const { data: existing } = await supabase.from("events").select("date").eq("id", id).single();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/calendar");
  revalidatePath("/");
  redirect(existing ? `/calendar?date=${existing.date}` : "/calendar");
}
