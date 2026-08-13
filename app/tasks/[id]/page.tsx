import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/task-form";
import { Checklist } from "@/components/tasks/checklist";
import { TaskActionsBar } from "@/components/tasks/task-actions-bar";
import { updateTask } from "../actions";
import { taskTypeColor, priorityColor, statusColor } from "@/lib/badge-colors";
import type { ChecklistItem, TaskStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: task } = await supabase.from("tasks").select("*").eq("id", id).single();

  if (!task) notFound();

  const checklist = (task.checklist as ChecklistItem[] | null) ?? [];

  return (
    <div className="mx-auto max-w-5xl p-8">
      <Link href="/tasks" className="text-sm text-muted-foreground hover:underline">
        ← Tasks
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={taskTypeColor[task.task_type]}>{task.task_type}</Badge>
            {task.priority && <Badge className={priorityColor[task.priority]}>{task.priority}</Badge>}
            <Badge className={statusColor[task.status]}>{task.status}</Badge>
          </div>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
        </div>
        <TaskForm
          action={updateTask.bind(null, task.id)}
          task={task}
          trigger={<Button variant="secondary" className="rounded-full">수정</Button>}
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">요청자</dt>
          <dd>{task.requester || "-"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">마감일</dt>
          <dd>{task.due_date || "-"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">등록일</dt>
          <dd>{new Date(task.created_at).toLocaleDateString("ko-KR")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">완료일</dt>
          <dd>{task.completed_at ? new Date(task.completed_at).toLocaleDateString("ko-KR") : "-"}</dd>
        </div>
      </dl>

      {task.description && (
        <div className="mt-6">
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">업무 내용</h2>
          <p className="whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">체크리스트</h2>
        <Checklist taskId={task.id} items={checklist} />
      </div>

      {task.memo && (
        <div className="mt-6">
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">관련 메모</h2>
          <p className="whitespace-pre-wrap">{task.memo}</p>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <TaskActionsBar taskId={task.id} status={task.status as TaskStatus} />
      </div>
    </div>
  );
}
