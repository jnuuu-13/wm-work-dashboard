import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaybookForm } from "@/components/playbook/playbook-form";
import { createPlaybook } from "./actions";
import { playbookCategoryColor } from "@/lib/badge-colors";
import { searchAll } from "@/lib/search";

const CATEGORIES = ["금융상품", "계좌·세금", "시장", "상담", "업무프로세스"] as const;

export const dynamic = "force-dynamic";

export default async function PlaybookPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const supabase = createServerClient();

  let playbookResults: Awaited<ReturnType<typeof searchAll>>["playbook"] = [];
  let meetingResults: Awaited<ReturnType<typeof searchAll>>["meetings"] = [];
  let quickNoteResults: Awaited<ReturnType<typeof searchAll>>["quickNotes"] = [];

  if (q) {
    const results = await searchAll(q);
    playbookResults = results.playbook;
    meetingResults = results.meetings;
    quickNoteResults = results.quickNotes;
  } else {
    let query = supabase.from("playbook").select("*").order("created_at", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    playbookResults = data ?? [];
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 홈
      </Link>
      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Playbook</h1>
        <PlaybookForm
          action={createPlaybook}
          trigger={<Button className="rounded-full">+ 새 Playbook</Button>}
        />
      </div>

      <form className="mb-4">
        <Input name="q" defaultValue={q} placeholder="🔎 ISA 계좌이전" className="rounded-full" />
      </form>

      {!q && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/playbook">
            <Badge variant={!category ? "default" : "outline"} className="rounded-full">
              전체
            </Badge>
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/playbook?category=${encodeURIComponent(c)}`}>
              <Badge variant={category === c ? "default" : "outline"} className="rounded-full">
                {c}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Playbook {q && `(${playbookResults.length})`}
        </h2>
        {playbookResults.length === 0 ? (
          <p className="text-sm text-muted-foreground">결과 없음</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {playbookResults.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/playbook/${p.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={playbookCategoryColor[p.category]}>{p.category}</Badge>
                    {p.subcategory && <span className="text-xs text-muted-foreground">{p.subcategory}</span>}
                    <span className="font-medium">{p.title}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{p.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {q && (
        <>
          <section className="mt-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              Client & Team Meeting ({meetingResults.length})
            </h2>
            {meetingResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">결과 없음</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {meetingResults.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/meetings/${m.id}`}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 hover:bg-accent"
                    >
                      <Badge variant="outline">{m.meeting_type}</Badge>
                      <span className="text-sm">
                        {m.date} {m.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              Quick Note ({quickNoteResults.length})
            </h2>
            {quickNoteResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">결과 없음</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {quickNoteResults.map((n) => (
                  <li key={n.id} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-2">
                      {n.tag && <Badge variant="outline">#{n.tag}</Badge>}
                      <span className="text-sm">{n.content}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
