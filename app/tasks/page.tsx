import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/task-form";
import { createTask } from "./actions";
import { taskTypeColor, priorityColor, statusColor } from "@/lib/badge-colors";
import { TASK_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const supabase = createServerClient();
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) {
    return <div className="p-8 text-destructive">업무를 불러오지 못했습니다: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← 홈
          </Link>
          <h1 className="text-2xl font-semibold">Tasks</h1>
        </div>
        <TaskForm
          action={createTask}
          trigger={<Button className="rounded-full">+ 새 업무</Button>}
        />
      </div>

      <div className="flex flex-col gap-8">
        {TASK_STATUSES.map((status) => {
          const group = (tasks ?? []).filter((t) => t.status === status);
          return (
            <section key={status}>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                {status} ({group.length})
              </h2>
              {group.length === 0 ? (
                <p className="text-sm text-muted-foreground">업무 없음</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {group.map((task) => (
                    <li key={task.id}>
                      <Link
                        href={`/tasks/${task.id}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={taskTypeColor[task.task_type]}>{task.task_type}</Badge>
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.priority && (
                            <Badge className={priorityColor[task.priority]}>{task.priority}</Badge>
                          )}
                          {task.due_date && (
                            <span className="text-sm text-muted-foreground">{task.due_date}</span>
                          )}
                          <Badge className={statusColor[task.status]}>{task.status}</Badge>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
