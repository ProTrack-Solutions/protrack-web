"use client";

import { Skeleton } from "@/components/DashCard";
import { ReportSummaryItem } from "@/interfaces/reports.interface";
import { formatValue } from "./format";

interface ReportSummaryProps {
  items?: ReportSummaryItem[];
  loading: boolean;
}

export function ReportSummary({ items, loading }: ReportSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <div
      className={`grid grid-cols-2 gap-3 ${
        items.length >= 5 ? "md:grid-cols-3 xl:grid-cols-5" : "md:grid-cols-4"
      }`}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`dash-in rounded-2xl p-4 ${
            i === 0
              ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]"
              : "border border-border/70 bg-card shadow-[var(--shadow-soft)]"
          }`}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </p>
          <p
            className={`mt-1.5 text-xl font-bold tabular-nums ${
              i > 0 && item.type === "money" && item.value < 0
                ? "text-destructive"
                : ""
            }`}
          >
            {formatValue(item.value, item.type)}
          </p>
        </div>
      ))}
    </div>
  );
}
