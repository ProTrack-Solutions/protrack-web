"use client";

import { useEffect, useState } from "react";
import { useInView } from "./Reveal";

type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

/** Conta de 0 até `to` com easing assim que aparece na tela */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
}: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Com movimento reduzido o valor final aparece já no primeiro frame
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 0 : duration;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = total ? Math.min((now - start) / total, 1) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
