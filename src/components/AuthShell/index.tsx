import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowLeft, Check } from "lucide-react";
import logo from "@/assets/logo-gerencial-dark.svg";
import { Starfield } from "@/app/(public)/(landingpage)/components/Starfield";
import "@/app/(public)/(landingpage)/landing-theme.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

/** Classes do wrapper que ativa o tema da landing (cores + fonte display) */
export const authThemeClass = `landing-light ${display.variable}`;

/* Estilos compartilhados pelos formulários de autenticação */
export const authFieldClass =
  "h-12 rounded-2xl border-border bg-secondary/60 px-3.5 text-base transition-colors focus-visible:border-[hsl(var(--primary))] focus-visible:bg-card focus-visible:ring-[hsl(var(--primary)/0.25)]";

/** Campo com ícone à esquerda */
export const authInputClass = `${authFieldClass} pl-10`;

export const authSelectTriggerClass = `${authFieldClass} w-full data-[size=default]:h-12`;

export const authLabelClass = "text-sm font-semibold text-foreground";

export const authIconClass =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";

export const authToggleClass =
  "absolute right-2 top-1/2 grid h-8 w-8 cursor-pointer -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export const authPrimaryButtonClass =
  "btn-pill btn-shine inline-flex h-12 w-full cursor-pointer items-center justify-center bg-[hsl(var(--night))] text-base font-bold text-white shadow-[0_12px_30px_-12px_hsl(var(--night))] hover:shadow-[0_18px_40px_-12px_hsl(211_79%_55%/0.8)] disabled:pointer-events-none disabled:opacity-70";

export const authSecondaryButtonClass =
  "btn-pill inline-flex h-12 w-full cursor-pointer items-center justify-center border border-border bg-card text-base font-semibold text-foreground hover:bg-secondary disabled:pointer-events-none disabled:opacity-60";

export const authLinkClass = "link-grow font-semibold text-[hsl(211_65%_45%)]";

export const authBackLinkClass =
  "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground";

/** Blobs de cor em movimento + estrelas — mesmos do hero da landing */
export function NightBackdrop() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute -left-[10%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-[hsl(211_90%_55%/0.28)] blur-[120px]" />
        <div
          className="animate-drift absolute -right-[12%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-[hsl(155_70%_45%/0.22)] blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-drift absolute bottom-[-10%] left-1/3 h-[26rem] w-[26rem] rounded-full bg-[hsl(255_70%_65%/0.2)] blur-[120px]"
          style={{ animationDelay: "-12s" }}
        />
      </div>
      <Starfield stars={60} sparkles={7} />
    </>
  );
}

export function AuthLogo() {
  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label="ProTrack Gerencial"
    >
      <Image
        src={logo}
        alt="ProTrack Gerencial"
        width={174}
        height={40}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}

interface AuthShellProps {
  /** Título grande à esquerda (telas grandes) */
  heading: ReactNode;
  /** Texto de apoio abaixo do título */
  tagline: string;
  highlights: string[];
  children: ReactNode;
}

export function AuthShell({
  heading,
  tagline,
  highlights,
  children,
}: AuthShellProps) {
  return (
    // landing-light fica num wrapper próprio: a regra de cor dele não é
    // de camada e venceria o text-white se estivesse no mesmo elemento
    <div className={`${authThemeClass} min-h-screen`}>
      <div className="bg-night relative flex min-h-screen flex-col overflow-hidden text-white">
        <NightBackdrop />

        <header className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5">
          <AuthLogo />
          <Link
            href="/"
            className="link-grow inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
        </header>

        <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 py-10 lg:grid-cols-2 lg:gap-20">
          {/* mensagem de marca */}
          <div className="hidden lg:block">
            <h1
              className="hero-in font-display text-[clamp(2.6rem,5vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight"
              style={{ animationDelay: "0ms" }}
            >
              {heading}
            </h1>
            <p
              className="hero-in mt-6 max-w-md text-lg leading-relaxed text-white/70"
              style={{ animationDelay: "120ms" }}
            >
              {tagline}
            </p>
            <ul
              className="hero-in mt-8 space-y-3 text-sm text-white/70"
              style={{ animationDelay: "240ms" }}
            >
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(155_70%_55%)]" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* card do formulário */}
          <div
            className="hero-in mx-auto w-full max-w-md"
            style={{ animationDelay: "180ms" }}
          >
            <div className="rounded-3xl border border-white/60 bg-card p-8 text-foreground shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] sm:p-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface AuthCardHeaderProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function AuthCardHeader({
  icon,
  title,
  description,
}: AuthCardHeaderProps) {
  return (
    <div className="mb-8">
      {icon && (
        <span className="chip-blue mb-5 grid h-12 w-12 place-items-center rounded-2xl">
          {icon}
        </span>
      )}
      <h2 className="font-display text-3xl font-extrabold tracking-tight">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default AuthShell;
