import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { meetingTypeColor } from "@/lib/badge-colors";
import type { Database } from "@/lib/supabase/types";

type Meeting = Database["public"]["Tables"]["meetings"]["Row"];

export function MeetingCard({ nearestMeeting }: { nearestMeeting: Meeting | null }) {
  return (
    <Card className="h-full rounded-lg">
      <Link href="/meetings">
        <CardHeader className="flex-row items-center gap-3 space-y-0 transition-colors hover:bg-accent/50">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-block-mint">
            <Users className="size-4" />
          </span>
          <CardTitle>Client & Team Meeting</CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        {nearestMeeting ? (
          <Link
            href={`/meetings/${nearestMeeting.id}`}
            className="block rounded-md bg-muted/50 p-3 text-sm hover:bg-accent"
          >
            <div className="mb-1 flex items-center gap-2">
              <Badge className={meetingTypeColor[nearestMeeting.meeting_type]}>
                {nearestMeeting.meeting_type}
              </Badge>
              <span className="text-muted-foreground">
                {nearestMeeting.date} {nearestMeeting.time ?? ""}
              </span>
            </div>
            <p className="text-foreground/80">{nearestMeeting.title}</p>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">예정된 미팅이 없습니다</p>
        )}
      </CardContent>
    </Card>
  );
}
