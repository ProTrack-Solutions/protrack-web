import { Reveal } from "./Reveal";
import { faqs } from "../landing-data";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-24 sm:py-32">
      <Reveal className="mb-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          FAQ
        </p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
          Perguntas frequentes
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="w-full space-y-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm"
            >
              <summary className="cursor-pointer text-left text-base font-semibold text-foreground hover:text-primary">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
