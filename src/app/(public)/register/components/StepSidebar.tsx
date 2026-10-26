import { Check } from "lucide-react";
import { AuthLogo, NightBackdrop } from "@/components/AuthShell";
import { steps } from "../constants";

interface StepSidebarProps {
  currentStep: number;
}

export default function StepSidebar({ currentStep }: StepSidebarProps) {
  // Fração das etapas já concluídas — alimenta a linha de progresso
  const progress = (currentStep - 1) / (steps.length - 1);

  return (
    <aside className="bg-night sticky top-0 hidden h-screen shrink-0 overflow-hidden text-white lg:flex lg:w-[42%] xl:w-[38%]">
      <NightBackdrop />

      <div className="relative z-10 flex w-full flex-col overflow-y-auto px-10 py-8 xl:px-14">
        <AuthLogo />

        <div className="my-auto max-w-md pt-8">
          <h1
            className="hero-in font-display text-[clamp(2rem,min(3.4vw,6.5vh),3.5rem)] font-extrabold leading-[0.95] tracking-tight"
            style={{ animationDelay: "0ms" }}
          >
            Chega de planilha.
            <br />
            <span className="text-gradient-live">Bora crescer?</span>
          </h1>
          <p
            className="hero-in mt-4 text-base leading-relaxed text-white/70"
            style={{ animationDelay: "120ms" }}
          >
            Cadastre-se agora e comece a otimizar sua empresa com controle,
            eficiência e crescimento garantidos.
          </p>

          <ol
            className="hero-in relative mt-8 space-y-1"
            style={{ animationDelay: "240ms" }}
          >
            {/* trilho e progresso entre os ícones */}
            <span
              aria-hidden="true"
              className="absolute bottom-7 left-7 top-7 w-px bg-white/15"
            />
            <span
              aria-hidden="true"
              className="absolute left-7 top-7 w-px bg-[hsl(155_70%_55%)] transition-[height] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ height: `calc((100% - 3.5rem) * ${progress})` }}
            />

            {steps.map((s) => {
              const isDone = s.id < currentStep;
              const isActive = s.id === currentStep;
              const Icon = s.icon;
              return (
                <li
                  key={s.id}
                  aria-current={isActive ? "step" : undefined}
                  className={`relative flex items-center gap-4 rounded-2xl border p-2.5 transition-all duration-500 ${
                    isActive
                      ? "border-white/20 bg-white/10 backdrop-blur"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${
                      isDone
                        ? "bg-[hsl(155_70%_55%)] text-[hsl(var(--night))]"
                        : isActive
                          ? "bg-white text-[hsl(var(--night))] shadow-[0_8px_24px_-8px_rgb(255_255_255/0.6)]"
                          : "bg-[hsl(var(--night-3))] text-white/60 ring-1 ring-white/15"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-widest text-white/50">
                      Etapa {s.id}
                    </span>
                    <span
                      className={`block text-sm font-bold ${
                        isActive || isDone ? "text-white" : "text-white/60"
                      }`}
                    >
                      {s.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </aside>
  );
}
