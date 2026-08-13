"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

function parsePlaybookFields(formData: FormData) {
  const keywordsRaw = String(formData.get("keywords") ?? "");
  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "업무프로세스"),
    subcategory: String(formData.get("subcategory") ?? "").trim() || null,
    keywords: keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    content: String(formData.get("content") ?? "").trim(),
    source: String(formData.get("source") ?? "").trim() || null,
  };
}

export async function createPlaybook(formData: FormData) {
  const fields = parsePlaybookFields(formData);
  if (!fields.title || !fields.content) throw new Error("제목과 내용을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("playbook").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/playbook");
  revalidatePath("/");
}

export async function updatePlaybook(id: string, formData: FormData) {
  const fields = parsePlaybookFields(formData);
  if (!fields.title || !fields.content) throw new Error("제목과 내용을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("playbook").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/playbook");
  revalidatePath(`/playbook/${id}`);
  revalidatePath("/");
}

export async function deletePlaybook(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from("playbook").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/playbook");
  revalidatePath("/");
  redirect("/playbook");
}

export async function createPlaybookFrom(
  prefill: { title: string; content: string; source_meeting_id?: string; source_quick_note_id?: string },
  formData: FormData
) {
  const fields = parsePlaybookFields(formData);
  if (!fields.title || !fields.content) throw new Error("제목과 내용을 입력해주세요");

  const supabase = createServerClient();
  const { error } = await supabase.from("playbook").insert({
    ...fields,
    source_meeting_id: prefill.source_meeting_id ?? null,
    source_quick_note_id: prefill.source_quick_note_id ?? null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/playbook");
  revalidatePath("/");
}
