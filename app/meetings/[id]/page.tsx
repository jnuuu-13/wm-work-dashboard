import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MeetingForm } from "@/components/meetings/meeting-form";
import { TaskForm } from "@/components/tasks/task-form";
import { PlaybookForm } from "@/components/playbook/playbook-form";
import { updateMeeting, deleteMeeting, convertFollowUpToTask, saveMeetingLearningsToPlaybook } from "../actions";
import { meetingTypeColor } from "@/lib/badge-colors";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-3">
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</h3>
      <p className="whitespace-pre-wrap text-sm">{value}</p>
    </div>
  );
}

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: meeting } = await supabase.from("meetings").select("*").eq("id", id).single();

  if (!meeting) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/meetings" className="text-sm text-muted-foreground hover:underline">
        ← Client & Team Meeting
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={meetingTypeColor[meeting.meeting_type]}>{meeting.meeting_type}</Badge>
            <span className="text-sm text-muted-foreground">
              {meeting.date} {meeting.time ?? ""}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">{meeting.title}</h1>
          {meeting.participants && (
            <p className="mt-1 text-sm text-muted-foreground">참석자: {meeting.participants}</p>
          )}
        </div>
        <MeetingForm
          action={updateMeeting.bind(null, meeting.id)}
          meeting={meeting}
          trigger={<Button variant="secondary" className="rounded-full">수정</Button>}
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">Before</h2>
        <Field label="미팅 목적" value={meeting.purpose} />
        <Field label="준비자료" value={meeting.preparation} />
        <Field label="질문할 내용" value={meeting.questions} />
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">After</h2>
        <Field label="핵심 내용" value={meeting.key_points} />
        <Field label="결정사항" value={meeting.decisions} />
        <Field label="추가 확인사항" value={meeting.notes} />

        <div className="mb-3">
          <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Follow-up</h3>
          {meeting.follow_up ? (
            <div className="flex items-start justify-between gap-2 rounded-md bg-muted/50 p-2">
              <p className="whitespace-pre-wrap text-sm">{meeting.follow_up}</p>
              <TaskForm
                action={convertFollowUpToTask.bind(null, meeting.id)}
                defaults={{
                  title: meeting.follow_up.slice(0, 60),
                  description: meeting.follow_up,
                  task_type: "Follow-up",
                }}
                trigger={
                  <Button variant="outline" size="sm" className="shrink-0 rounded-full">
                    Task로 전환
                  </Button>
                }
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">없음</p>
          )}
        </div>

        <div className="mb-3">
          <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            새롭게 배운 내용
          </h3>
          {meeting.learnings ? (
            <div className="flex items-start justify-between gap-2 rounded-md bg-muted/50 p-2">
              <p className="whitespace-pre-wrap text-sm">{meeting.learnings}</p>
              <PlaybookForm
                action={saveMeetingLearningsToPlaybook.bind(null, meeting.id)}
                defaults={{ title: meeting.learnings.slice(0, 60), content: meeting.learnings }}
                trigger={
                  <Button variant="outline" size="sm" className="shrink-0 rounded-full">
                    Playbook에 저장
                  </Button>
                }
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">없음</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <form action={deleteMeeting.bind(null, meeting.id)}>
          <Button type="submit" variant="ghost" className="rounded-full text-destructive hover:text-destructive">
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}
