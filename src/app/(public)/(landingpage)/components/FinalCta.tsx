import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import heroImage from "@/assets/hero-cinematic.png";
import Image from "next/image";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={heroImage.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={1088}
          className="h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <Reveal className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <FileText className="mx-auto mb-6 h-10 w-10 animate-float text-primary" />
        <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground">
          Pronto para assumir o controle?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Crie sua conta, cadastre sua empresa e comece a operar hoje mesmo.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-14 bg-gradient-primary px-9 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-[0_10px_30px_-8px_hsl(211,79%,60%/0.55)] transition-transform hover:scale-[1.03]"
          >
            <Link href="/register">
              Criar conta grátis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 border-border bg-card/70 px-9 text-base font-semibold uppercase tracking-wide text-foreground backdrop-blur hover:bg-secondary"
          >
            <Link href="/login">Já sou cliente</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
