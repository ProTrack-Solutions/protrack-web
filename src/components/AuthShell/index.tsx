import { ReactNode } from "react";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Recuperação segura",
    desc: "Links de uso único com expiração automática",
  },
  {
    icon: BarChart3,
    title: "Sua conta protegida",
    desc: "Nunca compartilhamos seus dados de acesso",
  },
  {
    icon: Zap,
    title: "Rápido e simples",
    desc: "Volte a usar o sistema em poucos minutos",
  },
];

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Painel visual */}
      <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center bg-gradient-to-br from-blue-300 via-blue-400 to-purple-300">
        <div className="max-w-md w-full rounded-3xl bg-white/20 backdrop-blur-md p-10 border border-white/30 shadow-xl">
          <h1 className="text-4xl font-bold text-blue-950 leading-tight">
            Sistema de gestão empresarial
          </h1>
          <h2 className="text-3xl font-bold text-blue-700 mt-3">Pro Track</h2>
          <p className="text-blue-950/80 mt-6 font-medium leading-relaxed">
            Recupere o acesso à sua conta com segurança e continue gerenciando
            seu negócio sem interrupções.
          </p>

          <div className="mt-10 space-y-3">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className="flex items-center gap-3 rounded-xl p-3 bg-white/20 border border-white/30"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-600 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-950">
                      {h.title}
                    </div>
                    <div className="text-xs text-blue-950/70 font-medium">
                      {h.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h2 className="text-3xl font-bold text-primary">Pro Track</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Sistema de gestão empresarial
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
