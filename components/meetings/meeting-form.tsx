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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/lib/supabase/types";

const MEETING_TYPES = ["고객상담", "내부미팅", "상품교육", "세미나"] as const;

type Meeting = Database["public"]["Tables"]["meetings"]["Row"];

export function MeetingForm({
  action,
  meeting,
  trigger,
}: {
  action: (formData: FormData) => Promise<void>;
  meeting?: Meeting;
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{meeting ? "미팅 수정" : "새 미팅"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">미팅명</Label>
            <Input id="title" name="title" defaultValue={meeting?.title} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="meeting_type">유형</Label>
              <Select name="meeting_type" defaultValue={meeting?.meeting_type ?? "내부미팅"}>
                <SelectTrigger id="meeting_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEETING_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">날짜</Label>
              <Input id="date" name="date" type="date" defaultValue={meeting?.date} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">시간</Label>
              <Input id="time" name="time" type="time" defaultValue={meeting?.time ?? ""} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="participants">참석자</Label>
            <Input id="participants" name="participants" defaultValue={meeting?.participants ?? ""} />
          </div>

          <Tabs defaultValue="before">
            <TabsList className="w-full">
              <TabsTrigger value="before" className="flex-1">Before</TabsTrigger>
              <TabsTrigger value="after" className="flex-1">After</TabsTrigger>
            </TabsList>
            <TabsContent value="before" className="flex flex-col gap-3 pt-3">
              <div className="grid gap-2">
                <Label htmlFor="purpose">미팅 목적</Label>
                <Textarea id="purpose" name="purpose" defaultValue={meeting?.purpose ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preparation">준비자료</Label>
                <Textarea id="preparation" name="preparation" defaultValue={meeting?.preparation ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="questions">질문할 내용</Label>
                <Textarea id="questions" name="questions" defaultValue={meeting?.questions ?? ""} />
              </div>
            </TabsContent>
            <TabsContent value="after" className="flex flex-col gap-3 pt-3">
              <div className="grid gap-2">
                <Label htmlFor="key_points">핵심 내용</Label>
                <Textarea id="key_points" name="key_points" defaultValue={meeting?.key_points ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="decisions">결정사항</Label>
                <Textarea id="decisions" name="decisions" defaultValue={meeting?.decisions ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">추가 확인사항</Label>
                <Textarea id="notes" name="notes" defaultValue={meeting?.notes ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="follow_up">Follow-up</Label>
                <Textarea id="follow_up" name="follow_up" defaultValue={meeting?.follow_up ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="learnings">새롭게 배운 내용</Label>
                <Textarea id="learnings" name="learnings" defaultValue={meeting?.learnings ?? ""} />
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="rounded-full">
            {meeting ? "수정 완료" : "등록"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
