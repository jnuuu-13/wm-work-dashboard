import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { taskTypeColor, eventTypeColor } from "@/lib/badge-colors";
import type { Task } from "@/lib/types";
import type { Database } from "@/lib/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export function TodayCard({ tasks, events }: { tasks: Task[]; events: Event[] }) {
  const today = new Date();

  return (
    <Card className="h-full rounded-lg">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-block-lime">
          <CalendarCheck2 className="size-4" />
        </span>
        <div>
          <CardTitle>Today</CardTitle>
          <p className="text-sm text-muted-foreground">
            {today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            오늘 일정
          </h3>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">오늘 등록된 일정이 없습니다</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {events.map((ev) => (
                <li key={ev.id}>
                  <Link
                    href={`/calendar/${ev.id}`}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={eventTypeColor[ev.event_type]}>{ev.event_type}</Badge>
                      <span className="text-sm">{ev.title}</span>
                    </div>
                    {ev.time && <span className="text-xs text-muted-foreground">{ev.time}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            오늘 처리해야 할 Task
          </h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">오늘 처리할 업무가 없습니다</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={taskTypeColor[task.task_type]}>{task.task_type}</Badge>
                      <span className="text-sm">{task.title}</span>
                    </div>
                    {task.due_date && (
                      <span className="text-xs text-muted-foreground">{task.due_date}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
