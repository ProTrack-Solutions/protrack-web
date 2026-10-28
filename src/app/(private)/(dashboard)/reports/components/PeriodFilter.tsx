"use client";

import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PERIOD_PRESETS, PeriodPreset } from "./format";

interface PeriodFilterProps {
  preset: PeriodPreset;
  start: string;
  end: string;
  error?: string;
  onPresetChange: (preset: PeriodPreset) => void;
  onCustomChange: (range: { start: string; end: string }) => void;
}

export function PeriodFilter({
  preset,
  start,
  end,
  error,
  onPresetChange,
  onCustomChange,
}: PeriodFilterProps) {
  return (
    <div className="space-y-3">
      <div
        role="radiogroup"
        aria-label="Período"
        className="flex flex-wrap gap-1.5"
      >
        {PERIOD_PRESETS.map((option) => {
          const active = option.value === preset;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onPresetChange(option.value)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-muted-foreground">
            De
            <Input
              type="date"
              value={start}
              max={end || undefined}
              onChange={(e) => onCustomChange({ start: e.target.value, end })}
              aria-invalid={!!error}
              className="mt-1 h-9 w-40 bg-card"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Até
            <Input
              type="date"
              value={end}
              min={start || undefined}
              onChange={(e) => onCustomChange({ start, end: e.target.value })}
              aria-invalid={!!error}
              className="mt-1 h-9 w-40 bg-card"
            />
          </label>
          <CalendarDays className="mb-2.5 hidden h-4 w-4 text-muted-foreground sm:block" />
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
