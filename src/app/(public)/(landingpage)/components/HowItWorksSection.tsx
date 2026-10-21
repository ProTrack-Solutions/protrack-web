import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  PackagePlus,
  ShoppingBag,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { steps } from "../landing-data";

const stepIcons = [Building2, PackagePlus, ShoppingBag, BarChart3];

// Curva em "S" que desce pela lateral dos passos (viewBox 40 x 1000)
const TRACK = "M20 0 C 36 125, 4 250, 20 375 S 36 625, 20 750 S 4 900, 20 1000";

export function HowItWorksSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);

  // A linha SVG se desenha conforme a lista atravessa a tela
  useEffect(() => {
    const list = listRef.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!list || !path || !dot) return;

    const total = path.getTotalLength();
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const progress = Math.max(0, Math.min(1, (anchor - rect.top) / rect.height));

      path.style.strokeDashoffset = `${1 - progress}`;
      const pt = path.getPointAtLength(total * progress);
      dot.style.left = `${(pt.x / 40) * 100}%`;
      dot.style.top = `${(pt.y / 1000) * 100}%`;
      dot.style.opacity = progress > 0 && progress < 1 ? "1" : "0";

      setActive(Math.floor(progress * steps.length - 0.15));
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
    <section
      id="como-funciona"
      className="mx-auto max-w-7xl px-5 py-24 sm:py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Como funciona
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-foreground">
              Do zero à operação em{" "}
              <span className="text-gradient">quatro passos</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Sem consultoria, sem implantação de meses. Você cria a conta e já
              começa a registrar.
            </p>
            <Link
              href="/register"
              className="btn-pill btn-shine bg-gradient-primary mt-8 inline-flex h-14 items-center px-8 font-bold text-white shadow-[0_12px_30px_-10px_hsl(211_79%_55%/0.7)]"
            >
              Testar grátis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="relative pl-14 sm:pl-20">
          {/* trilha SVG */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-0 top-6 w-10 sm:left-3"
          >
            <svg
              viewBox="0 0 40 1000"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="track-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(211 79% 60%)" />
                  <stop offset="55%" stopColor="hsl(155 55% 48%)" />
                  <stop offset="100%" stopColor="hsl(21 90% 65%)" />
                </linearGradient>
              </defs>
              <path
                d={TRACK}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
              <path
                ref={pathRef}
                d={TRACK}
                fill="none"
                stroke="url(#track-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </svg>
            <span
              ref={dotRef}
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_0_4px_hsl(211_79%_60%/0.35),0_0_20px_hsl(211_79%_60%)] transition-opacity duration-300"
            />
          </div>

          <ol className="space-y-5" ref={listRef}>
            {steps.map((s, i) => {
              const Icon = stepIcons[i];
              const on = i <= active;
              return (
                <Reveal key={s.n} delay={i * 90} as="li" variant="right">
                  <div
                    className={`group relative flex gap-6 rounded-3xl border bg-card p-7 transition-all duration-700 ${
                      on
                        ? "border-primary/40 shadow-[0_20px_50px_-24px_hsl(211_79%_50%/0.5)]"
                        : "border-border shadow-sm"
                    }`}
                  >
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-colors duration-700 ${
                        on ? "bg-gradient-primary text-white" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Icon
                        className={`svg-draw h-7 w-7 ${on ? "is-drawn" : ""}`}
                        strokeWidth={1.8}
                      />
                    </span>
                    <div>
                      <span
                        className={`font-display text-sm font-extrabold tracking-widest transition-colors duration-700 ${
                          on ? "text-primary" : "text-muted-foreground/60"
                        }`}
                      >
                        PASSO {s.n}
                      </span>
                      <h3 className="font-display mt-1 text-2xl font-bold text-card-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                        {s.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
