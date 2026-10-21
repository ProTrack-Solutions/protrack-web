import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const RING = 2 * Math.PI * 22;

/**
 * Navegação em SVG:
 * - linha de progresso de leitura no topo da página
 * - botão "voltar ao topo" com anel que se completa conforme o scroll
 */
export function ScrollProgress() {
  const lineRef = useRef<SVGLineElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      lineRef.current?.style.setProperty("stroke-dashoffset", `${1 - p}`);
      ringRef.current?.style.setProperty("stroke-dashoffset", `${RING * (1 - p)}`);
      setShowTop(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 3"
      >
        <defs>
          <linearGradient id="progress-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(211 90% 65%)" />
            <stop offset="60%" stopColor="hsl(155 65% 55%)" />
            <stop offset="100%" stopColor="hsl(21 95% 68%)" />
          </linearGradient>
        </defs>
        <line
          ref={lineRef}
          x1="0"
          y1="1.5"
          x2="100"
          y2="1.5"
          stroke="url(#progress-gradient)"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </svg>

      <button
        type="button"
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`group fixed bottom-6 right-6 z-50 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[hsl(var(--night))] text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] transition-all duration-500 hover:-translate-y-1 ${
          showTop
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-50 opacity-0"
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 50 50"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="rgb(255 255 255 / 0.12)"
            strokeWidth="3"
          />
          <circle
            ref={ringRef}
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING}
          />
        </svg>
        <ArrowUp className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
    </>
  );
}
