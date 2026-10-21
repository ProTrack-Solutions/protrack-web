import type { ReactNode } from "react";

/**
 * Sublinhado "feito à mão" em SVG que se desenha quando o
 * Reveal ao redor fica visível (ou imediatamente, com `drawn`).
 */
export function Scribble({
  children,
  color = "hsl(21 90% 65%)",
  drawn = false,
}: {
  children: ReactNode;
  color?: string;
  drawn?: boolean;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        className={`scribble absolute -bottom-2 left-0 h-[0.32em] w-full ${drawn ? "is-drawn" : ""}`}
      >
        <path
          d="M4 16 C 60 6, 120 4, 180 9 S 270 18, 296 8"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
    </span>
  );
}
