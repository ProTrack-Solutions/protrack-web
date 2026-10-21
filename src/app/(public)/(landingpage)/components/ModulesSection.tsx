import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { modules, toneClasses } from "../landing-data";
import { moduleArt } from "./ModuleArt";

export function ModulesSection() {
  return (
    <section id="modulos" className="relative py-20 sm:py-28">
      <Reveal className="mx-auto mb-16 max-w-3xl px-5 text-center sm:mb-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Os módulos
        </p>
        <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-extrabold leading-[0.95] tracking-tight text-foreground">
          Três frentes, <span className="text-gradient">uma operação só</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Cada módulo conversa com o outro. Uma venda baixa o estoque, gera as
          parcelas e movimenta o caixa no mesmo segundo.
        </p>
      </Reveal>

      <div className="space-y-6 sm:space-y-10">
        {modules.map((m, i) => {
          const tone = toneClasses[m.tone];
          const flipped = i % 2 === 1;
          const Art = moduleArt[m.art];

          return (
            <div
              key={m.title}
              id={m.id}
              className={flipped ? "bg-secondary/60 py-14 sm:py-20" : "py-14 sm:py-20"}
            >
              <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20">
                {/* ilustração */}
                <Reveal
                  variant={flipped ? "right" : "left"}
                  className={flipped ? "lg:order-2" : ""}
                >
                  <div className="group relative">
                    <div
                      aria-hidden="true"
                      className={`absolute -inset-4 -z-10 rounded-[2.5rem] opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100 ${tone.chip}`}
                    />
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border shadow-xl">
                      <div className="h-full w-full transition-transform duration-[1.4s] ease-out group-hover:scale-105">
                        <Art />
                      </div>
                    </div>

                  </div>
                </Reveal>

                {/* texto */}
                <Reveal
                  variant={flipped ? "left" : "right"}
                  delay={120}
                  className={flipped ? "lg:order-1" : ""}
                >
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${tone.chip}`}
                  >
                    <m.icon className="h-3.5 w-3.5" />
                    {m.kicker}
                  </span>
                  <h3 className="font-display mt-5 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-none tracking-tight text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-2.5">
                    {m.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-card-foreground shadow-sm"
                      >
                        <Check className={`h-4 w-4 ${tone.text}`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`group/link mt-8 inline-flex items-center gap-2 text-base font-bold ${tone.text}`}
                  >
                    <span className="link-grow pb-0.5">
                      Começar com {m.title.toLowerCase()}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  </Link>
                </Reveal>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
