import "server-only";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { createServerClient } from "@/lib/supabase/server";

export function weekBounds(reference = new Date()) {
  const start = startOfWeek(reference, { weekStartsOn: 1 });
  const end = endOfWeek(reference, { weekStartsOn: 1 });
  return { start: format(start, "yyyy-MM-dd"), end: format(end, "yyyy-MM-dd") };
}

export async function weeklyStats(reference = new Date()) {
  const { start, end } = weekBounds(reference);
  const startIso = `${start}T00:00:00`;
  const endIso = `${end}T23:59:59`;
  const supabase = createServerClient();

  const [completedTasks, ongoingTasks, meetings, newPlaybook, clientTasks, upcomingTasks] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .gte("completed_at", startIso)
      .lte("completed_at", endIso),
    supabase.from("tasks").select("*").neq("status", "Done"),
    supabase.from("meetings").select("*").gte("date", start).lte("date", end),
    supabase.from("playbook").select("*").gte("created_at", startIso).lte("created_at", endIso),
    supabase
      .from("tasks")
      .select("*")
      .in("task_type", ["Client", "Follow-up"])
      .gte("created_at", startIso)
      .lte("created_at", endIso),
    supabase.from("tasks").select("*").neq("status", "Done").gt("due_date", end),
  ]);

  const clientMeetings = (meetings.data ?? []).filter((m) => m.meeting_type === "고객상담").length;

  return {
    weekStart: start,
    weekEnd: end,
    completedTasks: completedTasks.data ?? [],
    ongoingTasks: ongoingTasks.data ?? [],
    meetings: meetings.data ?? [],
    newPlaybook: newPlaybook.data ?? [],
    clientActivityCount: clientMeetings + (clientTasks.data ?? []).length,
    upcomingTasks: upcomingTasks.data ?? [],
  };
}

export function topicFrequency(input: {
  tasks: { task_type: string; topic_tags: string[] | null }[];
  meetings: { meeting_type: string; topic_tags: string[] | null }[];
  quickNotes: { tag: string | null }[];
  playbook: { category: string; keywords: string[] | null }[];
}) {
  const counts = new Map<string, number>();
  const bump = (k: string | null | undefined) => {
    if (!k) return;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  };

  for (const t of input.tasks) {
    bump(t.task_type);
    t.topic_tags?.forEach(bump);
  }
  for (const m of input.meetings) {
    bump(m.meeting_type);
    m.topic_tags?.forEach(bump);
  }
  for (const n of input.quickNotes) bump(n.tag);
  for (const p of input.playbook) {
    bump(p.category);
    p.keywords?.forEach(bump);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, count]) => ({ topic, count }));
}
