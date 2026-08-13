"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addChecklistItem, toggleChecklistItem, removeChecklistItem } from "@/app/tasks/actions";
import type { ChecklistItem } from "@/lib/types";

export function Checklist({ taskId, items }: { taskId: string; items: ChecklistItem[] }) {
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 && <p className="text-sm text-muted-foreground">체크리스트 없음</p>}
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 group">
          <Checkbox
            checked={item.done}
            onCheckedChange={() => startTransition(() => toggleChecklistItem(taskId, item.id))}
          />
          <span className={item.done ? "flex-1 line-through text-muted-foreground" : "flex-1"}>
            {item.label}
          </span>
          <button
            type="button"
            className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
            onClick={() => startTransition(() => removeChecklistItem(taskId, item.id))}
          >
            삭제
          </button>
        </div>
      ))}
      <form
        action={() => {
          if (!label.trim()) return;
          startTransition(() => addChecklistItem(taskId, label));
          setLabel("");
        }}
        className="mt-2 flex gap-2"
      >
        <Input
          placeholder="체크리스트 항목 추가"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={isPending}
        />
        <Button type="submit" variant="secondary" className="rounded-full" disabled={isPending}>
          추가
        </Button>
      </form>
    </div>
  );
}
