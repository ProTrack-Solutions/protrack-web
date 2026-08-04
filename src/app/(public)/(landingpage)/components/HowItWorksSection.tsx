import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { steps } from "../landing-data";

export function HowItWorksSection() {
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
            <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
              Do zero à operação em quatro passos
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Sem consultoria, sem implantação de meses. Você cria a conta e já
              começa a registrar.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-14 bg-gradient-primary px-7 font-bold uppercase tracking-wide text-primary-foreground shadow-sm hover:opacity-90"
            >
              <Link href="/cadastro">
                Começar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <ol className="space-y-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} as="li">
              <div className="group flex gap-6 rounded-2xl border border-border bg-card p-7 shadow-sm transition-colors duration-500 hover:border-primary/40">
                <span className="text-4xl font-black leading-none text-primary/25 transition-colors duration-500 group-hover:text-primary">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
