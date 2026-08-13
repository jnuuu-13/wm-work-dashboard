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
import { QuickNoteForm } from "@/components/quick-notes/quick-note-form";

export function QuickNoteDialogButton({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="rounded-full">+ 새 메모</Button>} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새 메모</DialogTitle>
        </DialogHeader>
        <QuickNoteForm action={action} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
