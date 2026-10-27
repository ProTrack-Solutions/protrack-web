import { brl } from "@/components/DashCard";
import { POSITIVE_TEXT } from "./format";

/** Resultado da conferência: sobra, falta ou confere */
export function DifferenceBadge({ value }: { value: number }) {
  if (Math.abs(value) < 0.005) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold ${POSITIVE_TEXT}`}
      >
        Confere
      </span>
    );
  }
  const over = value > 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
        over
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {over ? "Sobra" : "Falta"} {brl(Math.abs(value))}
    </span>
  );
}
