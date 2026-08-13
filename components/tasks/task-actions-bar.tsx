"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { completeTask, deleteTask, setTaskStatus } from "@/app/tasks/actions";
import { TASK_STATUSES, type TaskStatus } from "@/lib/types";

export function TaskActionsBar({ taskId, status }: { taskId: string; status: TaskStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={(value: string | null) => {
          if (!value) return;
          startTransition(() => setTaskStatus(taskId, value));
        }}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TASK_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {status !== "Done" && (
        <Button
          className="rounded-full"
          disabled={isPending}
          onClick={() => startTransition(() => completeTask(taskId))}
        >
          완료 처리
        </Button>
      )}
      <Button
        variant="ghost"
        className="rounded-full text-destructive hover:text-destructive"
        disabled={isPending}
        onClick={() => {
          if (confirm("이 업무를 삭제할까요?")) {
            startTransition(async () => {
              await deleteTask(taskId);
              router.push("/tasks");
            });
          }
        }}
      >
        삭제
      </Button>
    </div>
  );
}
