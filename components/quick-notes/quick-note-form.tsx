"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TAGS = ["고객질문", "상품", "시장", "상담", "확인필요", "기타"] as const;

export function QuickNoteForm({
  action,
  defaultContent,
  defaultTag,
  submitLabel = "저장",
}: {
  action: (formData: FormData) => Promise<void>;
  defaultContent?: string;
  defaultTag?: string;
  submitLabel?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await action(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2">
      <Textarea name="content" defaultValue={defaultContent} placeholder="업무 중 메모를 남겨보세요" required />
      <div className="flex items-center justify-between gap-2">
        <Select name="tag" defaultValue={defaultTag ?? "기타"}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAGS.map((t) => (
              <SelectItem key={t} value={t}>
                #{t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="rounded-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
