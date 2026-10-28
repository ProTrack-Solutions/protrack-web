import { ReturnKind } from "@/interfaces/returns.interface";
import { KIND } from "./format";

export function KindBadge({ kind }: { kind: ReturnKind }) {
  const { label, className } = KIND[kind];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
