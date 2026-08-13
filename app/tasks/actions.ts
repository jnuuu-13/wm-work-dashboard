"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type { ChecklistItem } from "@/lib/types";

function parseTaskFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    requester: String(formData.get("requester") ?? "").trim() || null,
    task_type: String(formData.get("task_type") ?? "Internal"),
    due_date: String(formData.get("due_date") ?? "") || null,
    priority: String(formData.get("priority") ?? "") || null,
    memo: String(formData.get("memo") ?? "").trim() || null,
  };
}

export async function createTask(formData: FormData) {
  const fields = parseTaskFields(formData);
  if (!fields.title) throw new Error("업무명을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("tasks").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function updateTask(id: string, formData: FormData) {
  const fields = parseTaskFields(formData);
  if (!fields.title) throw new Error("업무명을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("tasks").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  revalidatePath("/");
}

export async function completeTask(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status: "Done", completed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  revalidatePath("/");
}

export async function setTaskStatus(id: string, status: string) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "Done" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function addChecklistItem(id: string, label: string) {
  if (!label.trim()) return;

  const supabase = createServerClient();
  const { data, error: fetchError } = await supabase
    .from("tasks")
    .select("checklist")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const checklist = (data?.checklist as ChecklistItem[] | null) ?? [];
  const next = [...checklist, { id: crypto.randomUUID(), label: label.trim(), done: false }];

  const { error } = await supabase.from("tasks").update({ checklist: next }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/tasks/${id}`);
}

export async function toggleChecklistItem(id: string, itemId: string) {
  const supabase = createServerClient();
  const { data, error: fetchError } = await supabase
    .from("tasks")
    .select("checklist")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const checklist = (data?.checklist as ChecklistItem[] | null) ?? [];
  const next = checklist.map((item) =>
    item.id === itemId ? { ...item, done: !item.done } : item
  );

  const { error } = await supabase.from("tasks").update({ checklist: next }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/tasks/${id}`);
}

export async function removeChecklistItem(id: string, itemId: string) {
  const supabase = createServerClient();
  const { data, error: fetchError } = await supabase
    .from("tasks")
    .select("checklist")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const checklist = (data?.checklist as ChecklistItem[] | null) ?? [];
  const next = checklist.filter((item) => item.id !== itemId);

  const { error } = await supabase.from("tasks").update({ checklist: next }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/tasks/${id}`);
}
