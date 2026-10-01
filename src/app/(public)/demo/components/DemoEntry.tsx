"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { getInitialRoute } from "@/const/moduleAccess.const";

export function DemoEntry() {
  const router = useRouter();
  const [error, setError] = useState(false);
  // Evita abrir duas sessões quando o effect roda duas vezes (StrictMode).
  const started = useRef(false);

  const enterDemo = useCallback(async () => {
    setError(false);

    const result = await signIn("demo", { redirect: false });
    if (!result || result.error) {
      setError(true);
      return;
    }

    const session = await getSession();
    router.replace(
      getInitialRoute({ role: session?.role, modules: session?.modules }),
    );
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void enterDemo();
  }, [enterDemo]);

  if (!error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading message="Preparando a demonstração..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            Não foi possível abrir a demonstração
          </h1>
          <p className="text-sm text-muted-foreground">
            Tente novamente em alguns instantes.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => void enterDemo()} className="cursor-pointer">
            <RotateCcw className="mr-2 h-4 w-4" /> Tentar novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Voltar ao site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
