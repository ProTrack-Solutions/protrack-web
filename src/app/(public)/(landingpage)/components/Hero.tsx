import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleCheck,
  MessageCircle,
  Play,
  TrendingUp,
} from "lucide-react";
import { Counter } from "./Counter";
import { HeroMockup } from "./HeroMockup";
import { Starfield } from "./Starfield";
import { heroWords } from "../landing-data";

const stats = [
  { v: <Counter to={12} suffix="+" />, l: "Módulos integrados" },
  { v: <Counter to={98} suffix="%" />, l: "Menos retrabalho" },
  { v: <Counter to={2} suffix=" min" />, l: "Para começar" },
  { v: <span>24/7</span>, l: "Acesso em nuvem" },
];

const floatingCards = [
  {
    icon: CircleCheck,
    title: "Venda #1042 concluída",
    text: "+ R$ 389,90",
    tone: "chip-green",
    position: "-left-6 top-[12%] xl:-left-20",
    depth: 28,
    delay: "1.2s",
  },
  {
    icon: AlertTriangle,
    title: "Estoque baixo",
    text: "Camiseta Básica P — 3 un.",
    tone: "chip-peach",
    position: "-right-6 top-[6%] xl:-right-20",
    depth: -22,
    delay: "1.5s",
  },
  {
    icon: MessageCircle,
    title: "Cobrança enviada",
    text: "Parcela 3/6 • WhatsApp",
    tone: "chip-green",
    position: "-left-10 bottom-[22%] xl:-left-28",
    depth: -34,
    delay: "1.8s",
  },
  {
    icon: TrendingUp,
    title: "Faturamento",
    text: "+18% vs. mês passado",
    tone: "chip-blue",
    position: "-right-10 bottom-[28%] xl:-right-28",
    depth: 30,
    delay: "2.1s",
  },
];

const trust = [
  "Sem instalação",
  "Pronto em 2 minutos",
  "Acesso de qualquer lugar",
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [word, setWord] = useState(0);

  // Palavra rotativa do título
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setWord((w) => (w + 1) % heroWords.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, []);

  // Inclinação do mockup ao rolar — escrito direto em CSS vars para não re-renderizar
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const tilt = Math.max(0, Math.min(1, 1 - window.scrollY / 520));
      el.style.setProperty("--tilt", tilt.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Paralaxe dos cards flutuantes seguindo o mouse
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    el.style.setProperty("--mx", mx.toFixed(3));
    el.style.setProperty("--my", my.toFixed(3));
  };

  return (
    <>
      <section
        ref={sectionRef}
        onMouseMove={onMouseMove}
        className="bg-night relative overflow-hidden text-white"
      >
        {/* blobs de cor em movimento */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="animate-drift absolute -left-[10%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-[hsl(211_90%_55%/0.28)] blur-[120px]" />
          <div
            className="animate-drift absolute -right-[12%] top-[20%] h-[34rem] w-[34rem] rounded-full bg-[hsl(155_70%_45%/0.22)] blur-[120px]"
            style={{ animationDelay: "-6s" }}
          />
          <div
            className="animate-drift absolute left-1/3 top-[45%] h-[28rem] w-[28rem] rounded-full bg-[hsl(255_70%_65%/0.2)] blur-[120px]"
            style={{ animationDelay: "-12s" }}
          />
        </div>
        <Starfield />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pt-32 text-center sm:pt-40">
          <div className="hero-in" style={{ animationDelay: "0ms" }}>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-4 text-sm text-white/85 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <span className="relative flex h-2.5 w-2.5 ml-1.5">
                <span className="animate-ping-soft absolute inset-0 rounded-full bg-[hsl(155_70%_55%)]" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[hsl(155_70%_55%)]" />
              </span>
              Novo: comprovante de venda{" "}
              <span className="hidden sm:inline">para impressão</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <h1
            className="hero-in font-display mx-auto mt-8 max-w-5xl text-[clamp(2.6rem,7.5vw,6.25rem)] font-extrabold leading-[0.95] tracking-tight"
            style={{ animationDelay: "120ms" }}
          >
            <span className="sr-only">
              Controle seus produtos, vendas, clientes, carnês e pagamentos sem
              planilha
            </span>
            <span aria-hidden="true">
              Controle seus{" "}
              <span className="word-stack">
                {heroWords.map((w, i) => (
                  <span
                    key={w}
                    className="text-gradient-live px-[0.04em]"
                    data-state={
                      i === word
                        ? "active"
                        : i === (word - 1 + heroWords.length) % heroWords.length
                          ? "leaving"
                          : "idle"
                    }
                  >
                    {w}
                  </span>
                ))}
              </span>
              <br />
              sem planilha.
            </span>
          </h1>

          <p
            className="hero-in mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
            style={{ animationDelay: "240ms" }}
          >
            Estoque, vendas, clientes e financeiro em uma única plataforma. Do
            primeiro cadastro à última parcela recebida — tudo visível, tudo
            rastreável, tudo em tempo real.
          </p>

          <div
            className="hero-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href="/register"
              className="btn-pill btn-shine inline-flex h-14 items-center bg-white px-8 text-base font-bold text-[hsl(var(--night))] shadow-[0_12px_40px_-10px_rgb(255_255_255/0.5)] hover:text-[hsl(211_79%_45%)] hover:shadow-[0_18px_50px_-10px_hsl(211_79%_63%/0.9)]"
            >
              Testar grátis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="btn-pill inline-flex h-14 items-center border border-white/20 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur hover:bg-white/20 hover:shadow-[0_12px_40px_-12px_hsl(155_70%_50%/0.7)]"
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> Ver demonstração
            </Link>
          </div>

          <ul
            className="hero-in mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60"
            style={{ animationDelay: "480ms" }}
          >
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[hsl(155_70%_55%)]" />
                {t}
              </li>
            ))}
          </ul>

          {/* mockup + cards flutuantes */}
          <div
            className="hero-in relative z-10 mx-auto mt-16 max-w-5xl sm:mt-20"
            style={{ animationDelay: "600ms", perspective: "1600px" }}
          >
            <div
              className="will-change-transform"
              style={{
                transform:
                  "rotateX(calc(var(--tilt, 1) * 20deg)) scale(calc(1 - var(--tilt, 1) * 0.06))",
                transformOrigin: "center top",
              }}
            >
              <HeroMockup />
            </div>

            {floatingCards.map((c) => (
              <div
                key={c.title}
                aria-hidden="true"
                className={`absolute z-20 hidden lg:block ${c.position}`}
                style={{
                  transform: `translate3d(calc(var(--mx, 0) * ${c.depth}px), calc(var(--my, 0) * ${c.depth}px), 0)`,
                  transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                <div className="hero-in" style={{ animationDelay: c.delay }}>
                  <div
                    className="animate-float-slow flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 py-3 pl-3 pr-5 text-left text-foreground shadow-[0_20px_50px_-15px_rgb(0_0_0/0.45)] backdrop-blur"
                    style={{ animationDelay: `-${c.depth % 5}s` }}
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${c.tone}`}
                    >
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{c.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {c.text}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* transição curva para a parte clara */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 z-0 h-[22%] w-full text-background sm:h-[28%]"
        >
          <path
            fill="currentColor"
            d="M0 120C240 40 480 0 720 0s480 40 720 120v100H0z"
          />
        </svg>
        <div className="h-24 sm:h-36" />
      </section>

      {/* números */}
      <section className="relative mx-auto max-w-5xl px-5 py-14">
        <dl className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="group">
              <dt className="font-display text-4xl font-extrabold text-foreground transition-transform duration-300 group-hover:-translate-y-1 sm:text-5xl">
                {s.v}
              </dt>
              <dd className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
