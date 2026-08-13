"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HOURS = Array.from({ length: 13 }, (_, i) => String(i).padStart(2, "0")); // 00~12
const MINUTES = ["00", "10", "20", "30", "40", "50"];

function to24h(ampm: string, hour: string, minute: string) {
  const h24 = (parseInt(hour, 10) % 12) + (ampm === "오후" ? 12 : 0);
  return `${String(h24).padStart(2, "0")}:${minute}`;
}

function from24h(time?: string | null) {
  if (!time) return { ampm: "오전", hour: "09", minute: "00" };
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "오후" : "오전";
  const hour12 = h % 12 === 0 ? "12" : String(h % 12).padStart(2, "0");
  const minute = MINUTES.includes(mStr) ? mStr : MINUTES[Math.round(parseInt(mStr, 10) / 10) % 6];
  return { ampm, hour: hour12, minute };
}

export function TimeSelect({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const initial = from24h(defaultValue);
  const [ampm, setAmpm] = useState(initial.ampm);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  return (
    <div className="flex gap-2">
      <input type="hidden" name={name} value={to24h(ampm, hour, minute)} />
      <Select value={ampm} onValueChange={(v) => v && setAmpm(v)}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="오전">오전</SelectItem>
          <SelectItem value="오후">오후</SelectItem>
        </SelectContent>
      </Select>
      <Select value={hour} onValueChange={(v) => v && setHour(v)}>
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={minute} onValueChange={(v) => v && setMinute(v)}>
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
