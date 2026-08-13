import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaybookForm } from "@/components/playbook/playbook-form";
import { updatePlaybook, deletePlaybook } from "../actions";
import { playbookCategoryColor } from "@/lib/badge-colors";

export const dynamic = "force-dynamic";

export default async function PlaybookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: entry } = await supabase.from("playbook").select("*").eq("id", id).single();

  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/playbook" className="text-sm text-muted-foreground hover:underline">
        ← Playbook
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={playbookCategoryColor[entry.category]}>{entry.category}</Badge>
            {entry.subcategory && <span className="text-sm text-muted-foreground">{entry.subcategory}</span>}
          </div>
          <h1 className="text-2xl font-semibold">{entry.title}</h1>
        </div>
        <PlaybookForm
          action={updatePlaybook.bind(null, entry.id)}
          entry={entry}
          trigger={<Button variant="secondary" className="rounded-full">수정</Button>}
        />
      </div>

      <p className="mt-6 whitespace-pre-wrap">{entry.content}</p>

      {entry.keywords && entry.keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {entry.keywords.map((k) => (
            <Badge key={k} variant="outline" className="rounded-full">
              #{k}
            </Badge>
          ))}
        </div>
      )}

      {entry.source && (
        <p className="mt-4 text-sm text-muted-foreground">출처: {entry.source}</p>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <form action={deletePlaybook.bind(null, entry.id)}>
          <Button
            type="submit"
            variant="ghost"
            className="rounded-full text-destructive hover:text-destructive"
          >
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}
