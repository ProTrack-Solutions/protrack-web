import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import heroImage from "@/assets/hero-cinematic.png";
import Image from "next/image";

interface HeroProps {
  offset: number;
}

const stats = [
  { v: <Counter to={12} suffix="+" />, l: "Módulos integrados" },
  { v: <Counter to={98} suffix="%" />, l: "Menos retrabalho" },
  { v: <Counter to={2} suffix=" min" />, l: "Para começar" },
  { v: <span>24/7</span>, l: "Acesso em nuvem" },
];

export function Hero({ offset }: HeroProps) {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage.src}
          alt="Painel de gestão empresarial iluminado sobre uma cidade brasileira à noite"
          width={1920}
          height={1088}
          className="h-[115%] w-full object-cover object-center"
          style={{
            transform: `translate3d(0, ${offset * -0.18}px, 0) scale(1.06)`,
          }}
        />
        <div className="veil absolute inset-0" />
        <div className="absolute inset-0 bg-background/10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-36">
        <Reveal>
          <Badge className="mb-6 gap-1.5 border-primary/30 bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/15">
            <Sparkles className="h-3.5 w-3.5" />
            Sistema de gestão empresarial
          </Badge>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="max-w-5xl text-[clamp(2.6rem,8vw,6.5rem)] font-black uppercase leading-[0.9] tracking-tight text-foreground">
            Sua empresa
            <br />
            <span className="text-gradient">no controle</span> total
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-7 max-w-xl text-xl leading-relaxed bg-transparent text-black">
            Estoque, vendas, clientes e financeiro em uma única plataforma. Do
            primeiro cadastro à última parcela recebida — tudo visível, tudo
            rastreável, tudo em tempo real.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 bg-gradient-primary px-8 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-[0_10px_30px_-8px_hsl(211,79%,60%/0.55)] transition-transform hover:scale-[1.03]"
            >
              <Link href="/register">
                Criar minha conta <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-border bg-card/70 px-8 text-base font-semibold uppercase tracking-wide text-foreground backdrop-blur hover:bg-secondary"
            >
              {/* <Link href="/estoque">
                <Play className="mr-2 h-4 w-4" /> Ver o sistema
              </Link> */}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i}>
                <dt className="text-3xl font-black text-foreground sm:text-4xl">
                  {s.v}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <ChevronDown className="h-6 w-6 animate-scroll-hint text-muted-foreground" />
      </div>
    </section>
  );
}
