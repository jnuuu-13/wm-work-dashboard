"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

function parseMeetingFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    meeting_type: String(formData.get("meeting_type") ?? "내부미팅"),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? "") || null,
    participants: String(formData.get("participants") ?? "").trim() || null,
    purpose: String(formData.get("purpose") ?? "").trim() || null,
    preparation: String(formData.get("preparation") ?? "").trim() || null,
    questions: String(formData.get("questions") ?? "").trim() || null,
    key_points: String(formData.get("key_points") ?? "").trim() || null,
    decisions: String(formData.get("decisions") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    follow_up: String(formData.get("follow_up") ?? "").trim() || null,
    learnings: String(formData.get("learnings") ?? "").trim() || null,
  };
}

export async function createMeeting(formData: FormData) {
  const fields = parseMeetingFields(formData);
  if (!fields.title || !fields.date) throw new Error("미팅명과 날짜를 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("meetings").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/meetings");
  revalidatePath("/");
}

export async function updateMeeting(id: string, formData: FormData) {
  const fields = parseMeetingFields(formData);
  if (!fields.title || !fields.date) throw new Error("미팅명과 날짜를 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("meetings").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  revalidatePath("/");
}

export async function deleteMeeting(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from("meetings").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/meetings");
  revalidatePath("/");
  redirect("/meetings");
}

export async function convertFollowUpToTask(meetingId: string, formData: FormData) {
  const fields = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    requester: String(formData.get("requester") ?? "").trim() || null,
    task_type: String(formData.get("task_type") ?? "Follow-up"),
    due_date: String(formData.get("due_date") ?? "") || null,
    priority: String(formData.get("priority") ?? "") || null,
    memo: String(formData.get("memo") ?? "").trim() || null,
  };
  if (!fields.title) throw new Error("업무명을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("tasks").insert({ ...fields, source_meeting_id: meetingId });
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function saveMeetingLearningsToPlaybook(meetingId: string, formData: FormData) {
  const keywordsRaw = String(formData.get("keywords") ?? "");
  const fields = {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "업무프로세스"),
    subcategory: String(formData.get("subcategory") ?? "").trim() || null,
    keywords: keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean),
    content: String(formData.get("content") ?? "").trim(),
    source: String(formData.get("source") ?? "").trim() || null,
  };
  if (!fields.title || !fields.content) throw new Error("제목과 내용을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("playbook").insert({ ...fields, source_meeting_id: meetingId });
  if (error) throw new Error(error.message);

  revalidatePath("/playbook");
  revalidatePath("/");
}
