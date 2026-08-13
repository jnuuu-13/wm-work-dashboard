import Link from "next/link";
import { StickyNote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/supabase/types";

type QuickNote = Database["public"]["Tables"]["quick_notes"]["Row"];

export function QuickNoteCard({ latestNote }: { latestNote: QuickNote | null }) {
  return (
    <Card className="h-full rounded-lg">
      <Link href="/quick-notes">
        <CardHeader className="flex-row items-center gap-3 space-y-0 transition-colors hover:bg-accent/50">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-block-lilac">
            <StickyNote className="size-4" />
          </span>
          <CardTitle>Quick Note</CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        {latestNote ? (
          <Link
            href={`/quick-notes/${latestNote.id}`}
            className="flex flex-col gap-1.5 rounded-md bg-muted/50 p-3 text-sm hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              {latestNote.tag && (
                <Badge variant="outline" className="rounded-full text-xs">#{latestNote.tag}</Badge>
              )}
              <span className="text-muted-foreground">
                {new Date(latestNote.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="line-clamp-2 text-foreground/80">{latestNote.content}</p>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">최근 메모가 없습니다</p>
        )}
      </CardContent>
    </Card>
  );
}
