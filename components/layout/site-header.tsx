import Link from "next/link";
import { Plus } from "lucide-react";
import { TaskForm } from "@/components/tasks/task-form";
import { createTask } from "@/app/tasks/actions";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-8 py-4">
        <Link href="/" className="text-lg font-semibold">
          Worklog
        </Link>
        <nav className="flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Today
          </Link>
          <Link href="/calendar" className="hover:text-foreground">
            Calendar
          </Link>
          <Link href="/playbook" className="hover:text-foreground">
            Playbook
          </Link>
        </nav>
        <TaskForm
          action={createTask}
          trigger={
            <button
              type="button"
              aria-label="새 업무 추가"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-black/80"
            >
              <Plus className="size-5" />
            </button>
          }
        />
      </div>
    </header>
  );
}
