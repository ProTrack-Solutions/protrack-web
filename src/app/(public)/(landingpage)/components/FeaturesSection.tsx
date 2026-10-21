import { Reveal } from "./Reveal";
import { capabilities, toneClasses } from "../landing-data";

/** Atualiza a posição do brilho que segue o cursor dentro do card */
const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

export function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="ambient-glow pointer-events-none absolute left-1/2 top-0 z-0 h-96 w-2xl -translate-x-1/2 animate-glow rounded-full blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Recursos
          </p>
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-extrabold leading-[0.95] tracking-tight text-foreground">
            Detalhe por detalhe
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Construído para o dia a dia real de quem vende, cobra, compra e
            precisa fechar o mês sem surpresas.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => {
            const tone = toneClasses[c.tone];
            return (
              <Reveal key={c.title} delay={(i % 3) * 110} variant="zoom">
                <article
                  onPointerMove={trackPointer}
                  className="spotlight group h-full rounded-3xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_hsl(211_79%_50%/0.45)]"
                >
                  <span
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${tone.chip}`}
                  >
                    <c.icon className="svg-draw h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-display text-2xl font-bold text-card-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
