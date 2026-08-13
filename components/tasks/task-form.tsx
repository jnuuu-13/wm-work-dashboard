"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_TYPES, TASK_PRIORITIES, type Task } from "@/lib/types";

export function TaskForm({
  action,
  task,
  trigger,
}: {
  action: (formData: FormData) => Promise<void>;
  task?: Task;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await action(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "업무 수정" : "새 업무"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">업무명</Label>
            <Input id="title" name="title" defaultValue={task?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">업무 내용</Label>
            <Textarea id="description" name="description" defaultValue={task?.description ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="requester">요청자</Label>
              <Input id="requester" name="requester" defaultValue={task?.requester ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_type">업무 유형</Label>
              <Select name="task_type" defaultValue={task?.task_type ?? "Internal"}>
                <SelectTrigger id="task_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="due_date">마감일</Label>
              <Input id="due_date" name="due_date" type="date" defaultValue={task?.due_date ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">중요도</Label>
              <Select name="priority" defaultValue={task?.priority ?? "Medium"}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="memo">관련 메모</Label>
            <Textarea id="memo" name="memo" defaultValue={task?.memo ?? ""} />
          </div>
          <Button type="submit" className="rounded-full">
            {task ? "수정 완료" : "등록"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
