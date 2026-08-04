import { Reveal } from "./Reveal";
import { capabilities, toneClasses } from "../landing-data";

export function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="relative border-y border-border bg-secondary/40 py-24 sm:py-32"
    >
      <div className="ambient-glow pointer-events-none absolute left-1/2 top-0 z-0 h-96 w-2xl -translate-x-1/2 animate-glow rounded-full blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Recursos
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
            Detalhe por detalhe
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Construído para o dia a dia real de quem vende, cobra, compra e
            precisa fechar o mês sem surpresas.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => {
            const tone = toneClasses[c.tone];
            return (
              <Reveal key={c.title} delay={(i % 3) * 100}>
                <article className="group h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-md">
                  <span
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${tone.chip}`}
                  >
                    <c.icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
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
