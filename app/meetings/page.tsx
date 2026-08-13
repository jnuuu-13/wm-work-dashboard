import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MeetingForm } from "@/components/meetings/meeting-form";
import { createMeeting } from "./actions";
import { meetingTypeColor } from "@/lib/badge-colors";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const supabase = createServerClient();
  const { data: meetings } = await supabase
    .from("meetings")
    .select("*")
    .order("date", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 홈
      </Link>
      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client & Team Meeting</h1>
        <MeetingForm action={createMeeting} trigger={<Button className="rounded-full">+ 새 미팅</Button>} />
      </div>

      {(meetings ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">등록된 미팅이 없습니다</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {meetings!.map((m) => (
            <li key={m.id}>
              <Link
                href={`/meetings/${m.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Badge className={meetingTypeColor[m.meeting_type]}>{m.meeting_type}</Badge>
                  <span className="font-medium">{m.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {m.date} {m.time ?? ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
