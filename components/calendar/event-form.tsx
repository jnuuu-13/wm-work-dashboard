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
import type { Database } from "@/lib/supabase/types";

const EVENT_TYPES = ["고객상담", "고객Follow-up", "내부미팅", "상품교육", "세미나", "기타"] as const;

type Event = Database["public"]["Tables"]["events"]["Row"];

export function EventForm({
  action,
  event,
  defaultDate,
  trigger,
}: {
  action: (formData: FormData) => Promise<void>;
  event?: Event;
  defaultDate?: string;
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
          <DialogTitle>{event ? "일정 수정" : "새 일정"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">일정명</Label>
            <Input id="title" name="title" defaultValue={event?.title} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={event?.date ?? defaultDate}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">시간</Label>
              <Input id="time" name="time" type="time" defaultValue={event?.time ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">장소</Label>
              <Input id="location" name="location" defaultValue={event?.location ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event_type">일정 유형</Label>
              <Select name="event_type" defaultValue={event?.event_type ?? "기타"}>
                <SelectTrigger id="event_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">메모</Label>
            <Textarea id="description" name="description" defaultValue={event?.description ?? ""} />
          </div>
          <Button type="submit" className="rounded-full">
            {event ? "수정 완료" : "등록"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
