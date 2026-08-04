import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { modules, toneClasses } from "../landing-data";
import Image from "next/image";

export function ModulesSection() {
  return (
    <section id="modulos" className="mx-auto max-w-7xl px-5 py-24 sm:py-32">
      <Reveal className="mb-14 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Os módulos
        </p>
        <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
          Três frentes, uma operação só
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Cada módulo conversa com o outro. Uma venda baixa o estoque, gera as
          parcelas e movimenta o caixa no mesmo segundo.
        </p>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-3">
        {modules.map((m, i) => {
          const tone = toneClasses[m.tone];
          return (
            <Reveal key={m.title} delay={i * 120}>
              <Link
                href={m.to}
                className="group relative block h-130 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-lg"
              >
                <Image
                  src={m.image.src}
                  alt={`Módulo de ${m.title}`}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                />
                <div className="veil absolute inset-0" />

                <div className="relative flex h-full flex-col justify-end p-7">
                  <span
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${tone.chip}`}
                  >
                    <m.icon className="h-6 w-6" />
                  </span>
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.25em] ${tone.text}`}
                  >
                    {m.kicker}
                  </p>
                  <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-h-48 overflow-hidden text-sm leading-relaxed text-muted-foreground opacity-100 transition-all duration-500 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-48 lg:group-hover:opacity-100">
                    {m.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                    Explorar
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
