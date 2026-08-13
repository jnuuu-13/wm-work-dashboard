import Link from "next/link";
import { format } from "date-fns";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventForm } from "@/components/calendar/event-form";
import { createEvent, updateEvent, deleteEvent } from "./actions";
import { monthGrid, shiftMonth, currentMonthStr, todayStr } from "@/lib/dates";
import { eventTypeColor } from "@/lib/badge-colors";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; date?: string }>;
}) {
  const { month: monthParam, date: dateParam } = await searchParams;
  const month = monthParam ?? currentMonthStr();
  const selectedDate = dateParam ?? todayStr();

  const days = monthGrid(month);
  const rangeStart = format(days[0].date, "yyyy-MM-dd");
  const rangeEnd = format(days[days.length - 1].date, "yyyy-MM-dd");

  const supabase = createServerClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("date", rangeStart)
    .lte("date", rangeEnd)
    .order("time", { ascending: true, nullsFirst: false });

  const eventsByDate = new Map<string, typeof events>();
  for (const ev of events ?? []) {
    const list = eventsByDate.get(ev.date) ?? [];
    list.push(ev);
    eventsByDate.set(ev.date, list);
  }

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 홈
      </Link>
      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <EventForm
          action={createEvent}
          defaultDate={selectedDate}
          trigger={<Button className="rounded-full">+ 새 일정</Button>}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/calendar?month=${shiftMonth(month, -1)}&date=${selectedDate}`}
          className="rounded-full px-3 py-1 text-sm hover:bg-accent"
        >
          ← 이전 달
        </Link>
        <span className="font-medium">{month}</span>
        <Link
          href={`/calendar?month=${shiftMonth(month, 1)}&date=${selectedDate}`}
          className="rounded-full px-3 py-1 text-sm hover:bg-accent"
        >
          다음 달 →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ dateStr, date, inMonth }) => {
          const dayEvents = eventsByDate.get(dateStr) ?? [];
          const isSelected = dateStr === selectedDate;
          return (
            <Link
              key={dateStr}
              href={`/calendar?month=${month}&date=${dateStr}`}
              className={`flex h-16 flex-col items-center gap-1 rounded-md p-1 text-sm hover:bg-accent ${
                isSelected ? "bg-block-mint" : ""
              } ${inMonth ? "" : "text-muted-foreground/40"}`}
            >
              <span className={dateStr === todayStr() ? "font-semibold" : ""}>{date.getDate()}</span>
              <div className="flex gap-0.5">
                {dayEvents.slice(0, 4).map((ev) => (
                  <span key={ev.id} className="size-1.5 rounded-full bg-foreground/60" />
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">{selectedDate} 일정</h2>
        {selectedEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">일정 없음</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {selectedEvents.map((ev) => (
              <li
                key={ev.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-2">
                  <Badge className={eventTypeColor[ev.event_type]}>{ev.event_type}</Badge>
                  <span className="font-medium">{ev.title}</span>
                  {ev.time && <span className="text-sm text-muted-foreground">{ev.time}</span>}
                  {ev.location && <span className="text-sm text-muted-foreground">@{ev.location}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <EventForm
                    action={updateEvent.bind(null, ev.id)}
                    event={ev}
                    trigger={
                      <Button variant="ghost" size="sm" className="rounded-full">
                        수정
                      </Button>
                    }
                  />
                  <form action={deleteEvent.bind(null, ev.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-destructive hover:text-destructive"
                    >
                      삭제
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
