import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickNoteForm } from "@/components/quick-notes/quick-note-form";
import { TaskForm } from "@/components/tasks/task-form";
import { PlaybookForm } from "@/components/playbook/playbook-form";
import {
  createQuickNote,
  deleteQuickNote,
  convertNoteToTask,
  saveNoteToPlaybook,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function QuickNotesPage() {
  const supabase = createServerClient();
  const { data: notes } = await supabase
    .from("quick_notes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 홈
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-semibold">Quick Note</h1>

      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <QuickNoteForm action={createQuickNote} />
      </div>

      <ul className="flex flex-col gap-3">
        {(notes ?? []).map((note) => (
          <li key={note.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {note.tag && <Badge variant="outline" className="rounded-full">#{note.tag}</Badge>}
                <span className="text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <form action={deleteQuickNote.bind(null, note.id)}>
                <Button type="submit" variant="ghost" size="sm" className="rounded-full text-destructive hover:text-destructive">
                  삭제
                </Button>
              </form>
            </div>
            <Link href={`/quick-notes/${note.id}`} className="block whitespace-pre-wrap text-sm hover:underline">
              {note.content}
            </Link>
            <div className="mt-3 flex items-center gap-2">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
