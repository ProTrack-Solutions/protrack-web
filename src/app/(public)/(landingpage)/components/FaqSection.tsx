import { useState } from "react";
import { Reveal } from "./Reveal";
import { faqs } from "../landing-data";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-24 sm:py-32">
      <Reveal className="mb-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          FAQ
        </p>
        <h2 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-foreground">
          Perguntas frequentes
        </h2>
      </Reveal>

      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 70}>
              <div
                className={`overflow-hidden rounded-2xl border bg-card transition-all duration-500 ${
                  isOpen
                    ? "border-primary/40 shadow-[0_16px_40px_-20px_hsl(211_79%_50%/0.45)]"
                    : "border-border shadow-sm hover:border-primary/30"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`text-base font-semibold transition-colors sm:text-lg ${
                      isOpen ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {f.q}
                  </span>
                  {/* "+" em SVG que vira "−" */}
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                      isOpen ? "rotate-180 bg-gradient-primary text-white" : "bg-secondary text-foreground"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path
                        d="M12 5v14"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="origin-center transition-transform duration-500"
                        style={{ transform: isOpen ? "scaleY(0)" : "scaleY(1)" }}
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-${i}`}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
