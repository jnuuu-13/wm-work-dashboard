"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export async function createQuickNote(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "기타");
  if (!content) throw new Error("내용을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("quick_notes").insert({ content, tag });
  if (error) throw new Error(error.message);

  revalidatePath("/quick-notes");
  revalidatePath("/");
}

export async function updateQuickNote(id: string, formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "기타");
  if (!content) throw new Error("내용을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("quick_notes").update({ content, tag }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/quick-notes");
  revalidatePath("/");
}

export async function deleteQuickNote(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from("quick_notes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/quick-notes");
  revalidatePath("/");
}

export async function convertNoteToTask(noteId: string, formData: FormData) {
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
  const { data: task, error } = await supabase
    .from("tasks")
    .insert({ ...fields, source_quick_note_id: noteId })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await supabase.from("quick_notes").update({ linked_task_id: task.id }).eq("id", noteId);

  revalidatePath("/quick-notes");
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function saveNoteToPlaybook(noteId: string, formData: FormData) {
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
  const { data: entry, error } = await supabase
    .from("playbook")
    .insert({ ...fields, source_quick_note_id: noteId })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await supabase.from("quick_notes").update({ linked_playbook_id: entry.id }).eq("id", noteId);

  revalidatePath("/quick-notes");
  revalidatePath("/playbook");
  revalidatePath("/");
}
