import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickNoteForm } from "@/components/quick-notes/quick-note-form";
import { TaskForm } from "@/components/tasks/task-form";
import { PlaybookForm } from "@/components/playbook/playbook-form";
import {
  updateQuickNote,
  deleteQuickNote,
  convertNoteToTask,
  saveNoteToPlaybook,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function QuickNoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: note } = await supabase.from("quick_notes").select("*").eq("id", id).single();

  if (!note) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <Link href="/quick-notes" className="text-sm text-muted-foreground hover:underline">
        ← Quick Note
      </Link>

      <div className="mt-4 mb-2 flex items-center gap-2">
        {note.tag && <Badge variant="outline" className="rounded-full">#{note.tag}</Badge>}
        <span className="text-xs text-muted-foreground">
          {new Date(note.created_at).toLocaleString("ko-KR")}
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <QuickNoteForm
          action={updateQuickNote.bind(null, note.id)}
          defaultContent={note.content}
          defaultTag={note.tag ?? "기타"}
          submitLabel="수정 완료"
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {note.linked_task_id ? (
          <Link href={`/tasks/${note.linked_task_id}`} className="text-xs text-muted-foreground underline">
            → Task로 전환됨
          </Link>
        ) : (
          <TaskForm
            action={convertNoteToTask.bind(null, note.id)}
            defaults={{ title: note.content.slice(0, 60), description: note.content, task_type: "Follow-up" }}
            trigger={
              <Button variant="outline" size="sm" className="rounded-full">
                Task로 전환
              </Button>
            }
          />
        )}
        {note.linked_playbook_id ? (
          <Link href={`/playbook/${note.linked_playbook_id}`} className="text-xs text-muted-foreground underline">
            → Playbook에 저장됨
          </Link>
        ) : (
          <PlaybookForm
            action={saveNoteToPlaybook.bind(null, note.id)}
            defaults={{ title: note.content.slice(0, 60), content: note.content }}
            trigger={
              <Button variant="outline" size="sm" className="rounded-full">
                Playbook에 저장
              </Button>
            }
          />
        )}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <form action={deleteQuickNote.bind(null, note.id)}>
          <Button type="submit" variant="ghost" className="rounded-full text-destructive hover:text-destructive">
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}
