import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function PlaceholderCard({
  title,
  description,
  href,
  icon: Icon,
  accentClass,
  preview,
}: {
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  accentClass: string;
  preview?: React.ReactNode;
}) {
  const body = (
    <Card className="h-full rounded-lg transition-colors hover:bg-accent/50">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${accentClass}`}>
          <Icon className="size-4" />
        </span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        {preview && <div className="mt-3">{preview}</div>}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}
