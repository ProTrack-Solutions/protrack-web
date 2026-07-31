import { Check } from "lucide-react";
import { steps } from "../constants";

interface StepSidebarProps {
  currentStep: number;
}

export default function StepSidebar({ currentStep }: StepSidebarProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center bg-linear-to-br from-blue-300 via-blue-400 to-purple-300">
      <div className="max-w-md w-full rounded-3xl bg-white/20 backdrop-blur-md p-10 border border-white/30 shadow-xl">
        <h1 className="text-4xl font-bold text-blue-950 leading-tight">
          Sistema de gestão empresarial
        </h1>
        <h2 className="text-3xl font-bold text-blue-700 mt-3">Pro Track</h2>
        <p className="text-blue-950/80 mt-6 font-medium leading-relaxed">
          Cadastre-se agora e comece a otimizar sua empresa com controle,
          eficiência e crescimento garantidos.
        </p>

        <div className="mt-10 space-y-3">
          {steps.map((s) => {
            const isDone = s.id < currentStep;
            const isActive = s.id === currentStep;
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                  isActive
                    ? "bg-white/40 border border-white/50"
                    : "bg-white/10 border border-transparent"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? "bg-blue-700 text-white"
                      : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-white/50 text-blue-900"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs text-blue-950/70 font-medium">
                    Etapa {s.id}
                  </div>
                  <div className="text-sm font-bold text-blue-950">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
