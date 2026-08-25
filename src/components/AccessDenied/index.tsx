"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AccessDeniedProps {
  message?: string;
}

export function AccessDenied({
  message = "Você não tem permissão para acessar esta página.",
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <p className="text-lg font-semibold text-foreground">Acesso restrito</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      <Button variant="outline" onClick={() => router.back()}>
        Voltar
      </Button>
    </div>
  );
}
