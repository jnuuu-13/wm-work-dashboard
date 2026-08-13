import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/calendar/event-form";
import { updateEvent, deleteEvent } from "../actions";
import { eventTypeColor } from "@/lib/badge-colors";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <Link href={`/calendar?date=${event.date}`} className="text-sm text-muted-foreground hover:underline">
        ← Calendar
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={eventTypeColor[event.event_type]}>{event.event_type}</Badge>
            <span className="text-sm text-muted-foreground">
              {event.date} {event.time ?? ""}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          {event.location && <p className="mt-1 text-sm text-muted-foreground">@{event.location}</p>}
        </div>
        <EventForm
          action={updateEvent.bind(null, event.id)}
          event={event}
          trigger={<Button variant="secondary" className="rounded-full">수정</Button>}
        />
      </div>

      {event.description && (
        <div className="mt-6">
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">메모</h2>
          <p className="whitespace-pre-wrap text-sm">{event.description}</p>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <form action={deleteEvent.bind(null, event.id)}>
          <Button type="submit" variant="ghost" className="rounded-full text-destructive hover:text-destructive">
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}
