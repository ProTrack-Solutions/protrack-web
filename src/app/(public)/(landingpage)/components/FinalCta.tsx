import Link from "next/link";
import { ArrowRight, Boxes, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Reveal } from "./Reveal";
import { Starfield } from "./Starfield";
import { Scribble } from "./Scribble";
import { WaveDivider } from "./WaveDivider";

const orbiters = [
  { icon: Boxes, tone: "chip-blue", dur: "26s", delay: "0s" },
  { icon: ShoppingCart, tone: "chip-peach", dur: "26s", delay: "-6.5s" },
  { icon: DollarSign, tone: "chip-green", dur: "26s", delay: "-13s" },
  { icon: Users, tone: "chip-blue", dur: "26s", delay: "-19.5s" },
];

export function FinalCta() {
  return (
    <>
      <WaveDivider
        from="text-background"
        to="text-[hsl(var(--night))]"
        accent="text-[hsl(211_79%_60%)]"
      />
      <section className="relative overflow-hidden bg-[hsl(var(--night))] pb-28 pt-16 text-white">
        <Starfield stars={50} sparkles={6} />

        {/* órbita de módulos ao redor do título */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <svg
            viewBox="0 0 720 720"
            className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 animate-[spin_80s_linear_infinite] opacity-25"
          >
            <circle cx="360" cy="360" r="340" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 10" />
            <circle cx="360" cy="360" r="250" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 14" />
          </svg>
          {orbiters.map((o, i) => (
            <span
              key={i}
              className="animate-orbit absolute left-0 top-0 -ml-6 -mt-6"
              style={
                { "--radius": "340px", "--dur": o.dur, animationDelay: o.delay } as React.CSSProperties
              }
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-lg ${o.tone}`}>
                <o.icon className="h-6 w-6" />
              </span>
            </span>
          ))}
        </div>

        <Reveal variant="zoom" className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight">
            Chega de planilha.
            <br />
            <Scribble color="hsl(155 65% 55%)">
              <span className="text-gradient-live">Bora crescer?</span>
            </Scribble>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-white/70">
            Crie sua conta, cadastre sua empresa e comece a operar hoje mesmo.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="btn-pill btn-shine inline-flex h-14 items-center bg-white px-9 text-base font-bold text-[hsl(var(--night))] shadow-[0_12px_40px_-10px_rgb(255_255_255/0.5)] hover:shadow-[0_18px_50px_-10px_hsl(155_70%_50%/0.9)]"
            >
              Testar grátis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="btn-pill inline-flex h-14 items-center border border-white/20 bg-white/10 px-9 text-base font-semibold text-white hover:bg-white/20"
            >
              Já sou cliente
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
