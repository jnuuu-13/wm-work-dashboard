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

const CATEGORIES = ["금융상품", "계좌·세금", "시장", "상담", "업무프로세스"] as const;

type Playbook = Database["public"]["Tables"]["playbook"]["Row"];

export function PlaybookForm({
  action,
  entry,
  defaults,
  trigger,
}: {
  action: (formData: FormData) => Promise<void>;
  entry?: Playbook;
  defaults?: { title?: string; content?: string; category?: string };
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
          <DialogTitle>{entry ? "Playbook 수정" : "새 Playbook"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" name="title" defaultValue={entry?.title ?? defaults?.title} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">카테고리</Label>
              <Select name="category" defaultValue={entry?.category ?? defaults?.category ?? "업무프로세스"}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory">서브카테고리</Label>
              <Input id="subcategory" name="subcategory" defaultValue={entry?.subcategory ?? ""} placeholder="ISA, 연금저축 등" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={entry?.content ?? defaults?.content}
              required
              rows={5}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="keywords">키워드 (쉼표로 구분)</Label>
            <Input id="keywords" name="keywords" defaultValue={entry?.keywords?.join(", ") ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source">출처</Label>
            <Input id="source" name="source" defaultValue={entry?.source ?? ""} />
          </div>
          <Button type="submit" className="rounded-full">
            {entry ? "수정 완료" : "저장"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
