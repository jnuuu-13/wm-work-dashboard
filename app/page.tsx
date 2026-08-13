import { StickyNote, CalendarDays, Users, LineChart, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { createServerClient } from "@/lib/supabase/server";
import { TodayCard } from "@/components/home/today-card";
import { PlaceholderCard } from "@/components/home/placeholder-card";
import { todayStr, monthGrid, currentMonthStr } from "@/lib/dates";
import { weeklyStats } from "@/lib/weekly-review";
import { Badge } from "@/components/ui/badge";
import { meetingTypeColor, playbookCategoryColor } from "@/lib/badge-colors";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerClient();
  const month = currentMonthStr();
  const days = monthGrid(month);
  const rangeStart = format(days[0].date, "yyyy-MM-dd");
  const rangeEnd = format(days[days.length - 1].date, "yyyy-MM-dd");
  const today = todayStr();

  const [
    { data: tasks },
    { data: todayEvents },
    { data: monthEvents },
    { data: latestNote },
    { data: todayMeeting },
    { data: upcomingMeeting },
    { data: latestPlaybook },
    stats,
  ] = await Promise.all([
    supabase.from("tasks").select("*").neq("status", "Done").lte("due_date", today).order("due_date", { ascending: true }),
    supabase.from("events").select("*").eq("date", today).order("time", { ascending: true, nullsFirst: false }),
    supabase.from("events").select("date").gte("date", rangeStart).lte("date", rangeEnd),
    supabase.from("quick_notes").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("meetings").select("*").eq("date", today).order("time", { ascending: true, nullsFirst: false }).limit(1).maybeSingle(),
    supabase.from("meetings").select("*").gt("date", today).order("date", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("playbook").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    weeklyStats(),
  ]);

  const nearestMeeting = todayMeeting ?? upcomingMeeting;
  const eventDates = new Set((monthEvents ?? []).map((e) => e.date));
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Worklog</h1>
      </header>

      <p className="mb-4 text-sm text-muted-foreground">
        <a href="/tasks" className="underline">
          전체 Task 목록 보기 →
        </a>
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 상단: Today(크게) | Quick Note */}
        <div className="sm:col-span-2">
          <TodayCard tasks={tasks ?? []} events={todayEvents ?? []} />
        </div>
        <PlaceholderCard
          title="Quick Note"
          description="업무 중 빠르게 메모 작성"
          icon={StickyNote}
          accentClass="bg-block-lilac"
          href="/quick-notes"
          preview={
            latestNote ? (
              <div className="flex flex-col gap-1.5 rounded-md bg-muted/50 p-3 text-sm">
                <div className="flex items-center gap-2">
                  {latestNote.tag && (
                    <Badge variant="outline" className="rounded-full text-xs">#{latestNote.tag}</Badge>
                  )}
                  <span className="text-muted-foreground">
                    {new Date(latestNote.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="line-clamp-2 text-foreground/80">{latestNote.content}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">최근 메모가 없습니다</p>
            )
          }
        />

        {/* 중단: Calendar(크게) | Client & Team Meeting */}
        <div className="sm:col-span-2">
          <PlaceholderCard
            title="Calendar"
            description="이번 달 일정 확인"
            icon={CalendarDays}
            accentClass="bg-block-cream"
            href="/calendar"
            preview={
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
                {weekdays.map((w) => (
                  <span key={w}>{w}</span>
                ))}
                {days.map(({ dateStr, date, inMonth }) => (
                  <span
                    key={dateStr}
                    className={`flex flex-col items-center rounded-full py-0.5 ${
                      dateStr === today ? "bg-block-mint font-semibold text-black" : ""
                    } ${inMonth ? "" : "opacity-30"}`}
                  >
                    {date.getDate()}
                    <span className={`size-1 rounded-full ${eventDates.has(dateStr) ? "bg-foreground/60" : ""}`} />
                  </span>
                ))}
              </div>
            }
          />
        </div>
        <PlaceholderCard
          title="Client & Team Meeting"
          description="오늘 또는 가장 가까운 미팅 요약"
          icon={Users}
          accentClass="bg-block-mint"
          href="/meetings"
          preview={
            nearestMeeting ? (
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Badge className={meetingTypeColor[nearestMeeting.meeting_type]}>
                    {nearestMeeting.meeting_type}
                  </Badge>
                  <span className="text-muted-foreground">
                    {nearestMeeting.date} {nearestMeeting.time ?? ""}
                  </span>
                </div>
                <p className="text-foreground/80">{nearestMeeting.title}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">예정된 미팅이 없습니다</p>
            )
          }
        />

        {/* 하단: Weekly Review(크게) | Playbook */}
        <div className="sm:col-span-2">
          <PlaceholderCard
            title="Weekly Review"
            description="이번 주 업무 및 학습 내용 요약"
            icon={LineChart}
            accentClass="bg-block-coral"
            href="/weekly-review"
            preview={
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "완료 Task", value: String(stats.completedTasks.length) },
                  { label: "Meeting", value: String(stats.meetings.length) },
                  { label: "신규 Playbook", value: String(stats.newPlaybook.length) },
                ].map((s) => (
                  <div key={s.label} className="rounded-md bg-muted/50 p-2">
                    <div className="text-lg font-semibold">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            }
          />
        </div>
        <PlaceholderCard
          title="Playbook"
          description="업무 지식 검색"
          icon={BookOpen}
          accentClass="bg-block-pink"
          href="/playbook"
          preview={
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground">
                🔎 검색
              </div>
              {latestPlaybook && (
                <div className="flex items-center gap-2 text-xs">
                  <Badge className={playbookCategoryColor[latestPlaybook.category]}>
                    {latestPlaybook.category}
                  </Badge>
                  <span className="text-muted-foreground">{latestPlaybook.title}</span>
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
