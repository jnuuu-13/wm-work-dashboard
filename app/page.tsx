import { createServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createServerClient();
  const { error } = await supabase.from("tasks").select("id").limit(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">WM 업무 대시보드</h1>
        <p className="mt-2 text-muted-foreground">
          {error ? `DB 연결 실패: ${error.message}` : "DB 연결 OK"}
        </p>
      </div>
    </div>
  );
}
