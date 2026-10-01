"use client";

import { signOut } from "next-auth/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useIsDemo } from "@/hooks/useIsDemo";

export function DemoBanner() {
  const isDemo = useIsDemo();

  if (!isDemo) return null;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-center text-sm text-white">
      <span className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>
          <strong>Modo demonstração:</strong> dados fictícios que voltam ao
          estado original todos os dias.
        </span>
      </span>
      <span className="flex items-center gap-3">
        <button
          onClick={() => signOut({ callbackUrl: "/register" })}
          className="flex cursor-pointer items-center gap-1 rounded-md bg-white px-3 py-1 font-semibold text-blue-700 transition-opacity hover:opacity-90"
        >
          Criar minha conta <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer text-white/80 underline-offset-2 hover:text-white hover:underline"
        >
          Sair da demo
        </button>
      </span>
    </div>
  );
}
