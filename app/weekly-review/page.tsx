import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { weeklyStats, topicFrequency } from "@/lib/weekly-review";
import { saveReflection } from "./actions";

export const dynamic = "force-dynamic";

export default async function WeeklyReviewPage() {
  const stats = await weeklyStats();
  const supabase = createServerClient();

  const [{ data: weekNotes }, { data: existingReview }] = await Promise.all([
    supabase
      .from("quick_notes")
      .select("*")
      .gte("created_at", `${stats.weekStart}T00:00:00`)
      .lte("created_at", `${stats.weekEnd}T23:59:59`),
    supabase.from("weekly_reviews").select("*").eq("week_start", stats.weekStart).maybeSingle(),
  ]);

  const topics = topicFrequency({
    tasks: stats.completedTasks,
    meetings: stats.meetings,
    quickNotes: weekNotes ?? [],
    playbook: stats.newPlaybook,
  });

  const mainTasks = [
    ...stats.completedTasks.map((t) => ({ label: t.title, date: t.completed_at ?? "" })),
    ...stats.meetings.map((m) => ({ label: m.title, date: m.date })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  const saveAction = saveReflection.bind(null, stats.weekStart, stats.weekEnd);

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 홈
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-semibold">Weekly Review</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {stats.weekStart} ~ {stats.weekEnd}
      </p>

      <div className="mb-6 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "완료 Task", value: stats.completedTasks.length },
          { label: "진행중 Task", value: stats.ongoingTasks.length },
          { label: "Meeting 수", value: stats.meetings.length },
          { label: "고객 관련 업무", value: stats.clientActivityCount },
          { label: "신규 Playbook", value: stats.newPlaybook.length },
          { label: "다음주 예정 Task", value: stats.upcomingTasks.length },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3">
            <div className="text-xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">이번 주 주요 업무</h2>
        {mainTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">기록 없음</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {mainTasks.map((t, i) => (
              <li key={i} className="text-sm">
                • {t.label}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">이번 주 자주 다룬 주제</h2>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">기록 없음</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <Badge key={t.topic} variant="outline" className="rounded-full">
                {t.topic} ({t.count})
              </Badge>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">직접 기록</h2>
        <form action={saveAction} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="learnings">이번 주 새롭게 배운 것</Label>
            <Textarea id="learnings" name="learnings" defaultValue={existingReview?.learnings ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="difficulties">이번 주 어려웠던 것</Label>
            <Textarea id="difficulties" name="difficulties" defaultValue={existingReview?.difficulties ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="further_study">다음 주 더 알아볼 것</Label>
            <Textarea id="further_study" name="further_study" defaultValue={existingReview?.further_study ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="improvements">다음 주 개선할 것</Label>
            <Textarea id="improvements" name="improvements" defaultValue={existingReview?.improvements ?? ""} />
          </div>
          <Button type="submit" className="w-fit rounded-full">
            회고 저장
          </Button>
        </form>
      </section>
    </div>
  );
}
