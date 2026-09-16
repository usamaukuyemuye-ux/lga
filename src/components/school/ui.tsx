import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "destructive" | "warning" | "info" | "muted";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/20 text-warning-foreground",
    info: "bg-info/15 text-info",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const norm = (status || "").toLowerCase();

  if (norm === "present") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="text-sm font-bold leading-none">✓</span>
        <span>Present</span>
      </span>
    );
  }

  if (norm === "absent") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
        <span className="text-sm font-bold leading-none">✕</span>
        <span>Absent</span>
      </span>
    );
  }

  if (norm === "sick") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
        <span>Sick / Excused</span>
      </span>
    );
  }

  if (norm === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="text-sm font-bold leading-none">✓</span>
        <span>Approved</span>
      </span>
    );
  }

  if (norm === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
        <span>Pending</span>
      </span>
    );
  }

  if (norm === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
        <span className="text-sm font-bold leading-none">✕</span>
        <span>Rejected</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      <span className="size-1.5 rounded-full bg-muted-foreground shrink-0" />
      <span className="capitalize">{status}</span>
    </span>
  );
}

export function ParentStatusBadge({ status }: { status: string }) {
  // In Parent portal: only Present (✓) and Absent (✕), with no background stickers
  const isPresent = status === "present" || status === "late";
  return isPresent ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
      <span className="text-sm font-bold leading-none">✓</span>
      <span>Present</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
      <span className="text-sm font-bold leading-none">✕</span>
      <span>Absent</span>
    </span>
  );
}
