import { Package } from "lucide-react";

interface PageLoadingProps {
  message?: string;
}

export function Loading({ message = "Carregando dados..." }: PageLoadingProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Package className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -inset-3 rounded-3xl border-2 border-blue-500/20 animate-[spin_3s_linear_infinite]" />
        <div className="absolute -inset-5 rounded-[2rem] border border-indigo-500/10 animate-[spin_5s_linear_infinite_reverse]" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">
          Por favor, aguarde um momento
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
