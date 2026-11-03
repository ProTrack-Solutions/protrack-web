"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ChipInputProps {
  id: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxLength?: number;
  /** Atalhos que substituem a lista inteira (ex.: P-M-G-GG) */
  presets?: { label: string; values: string[] }[];
}

/** Lista de valores curtos: Enter, vírgula ou Tab adiciona; Backspace remove o último */
export function ChipInput({
  id,
  values,
  onChange,
  placeholder,
  maxLength = 20,
  presets,
}: ChipInputProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const next = [...values];
    for (const part of parts) {
      if (!next.some((v) => v.toLowerCase() === part.toLowerCase())) {
        next.push(part.slice(0, maxLength));
      }
    }
    onChange(next);
    setDraft("");
  };

  return (
    <div className="space-y-1.5">
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-200"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== value))}
              aria-label={`Remover ${value}`}
              className="cursor-pointer rounded hover:bg-blue-200 dark:hover:bg-blue-500/30"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          maxLength={maxLength}
          onChange={(e) => {
            if (e.target.value.includes(",")) add(e.target.value);
            else setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === "Tab") && draft.trim()) {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={values.length ? "" : placeholder}
          className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {presets && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.values)}
              className="cursor-pointer rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
