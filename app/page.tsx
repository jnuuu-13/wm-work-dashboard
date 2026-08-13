import { StickyNote, CalendarDays, Users, LineChart, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { createServerClient } from "@/lib/supabase/server";
import { TodayCard } from "@/components/home/today-card";
import { PlaceholderCard } from "@/components/home/placeholder-card";
import { todayStr, monthGrid, currentMonthStr } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerClient();
  const month = currentMonthStr();
  const days = monthGrid(month);
  const rangeStart = format(days[0].date, "yyyy-MM-dd");
  const rangeEnd = format(days[days.length - 1].date, "yyyy-MM-dd");

  const [{ data: tasks }, { data: todayEvents }, { data: monthEvents }] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .neq("status", "Done")
      .lte("due_date", todayStr())
      .order("due_date", { ascending: true }),
    supabase.from("events").select("*").eq("date", todayStr()).order("time", { ascending: true, nullsFirst: false }),
    supabase.from("events").select("date").gte("date", rangeStart).lte("date", rangeEnd),
  ]);

  const eventDates = new Set((monthEvents ?? []).map((e) => e.date));
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">WM 업무 대시보드</h1>
        <p className="text-sm text-muted-foreground">
          일정 확인 → 업무 수행 → 상담·미팅 기록 → 후속 업무 관리 → 업무 지식 축적 → 주간 회고
        </p>
      </header>

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
            <div className="flex flex-col gap-1.5 rounded-md bg-muted/50 p-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full text-xs">#고객질문</Badge>
                <span className="text-muted-foreground">09:41</span>
              </div>
              <p className="text-foreground/80">ISA 이전 시 세제 관련 추가 확인 필요</p>
            </div>
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
                      dateStr === todayStr() ? "bg-block-mint font-semibold text-black" : ""
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
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2">
                <Badge className="rounded-full bg-block-mint text-black">상품교육</Badge>
                <span className="text-muted-foreground">08/14 14:00</span>
              </div>
              <p className="text-foreground/80">ISA 계좌이전 프로세스 교육</p>
            </div>
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
                  { label: "완료 Task", value: "0" },
                  { label: "Meeting", value: "0" },
                  { label: "신규 Playbook", value: "0" },
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
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground">
              🔎 ISA 계좌이전
            </div>
          }
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        <a href="/tasks" className="underline">
          전체 Task 목록 보기 →
        </a>
      </p>
    </div>
  );
}
