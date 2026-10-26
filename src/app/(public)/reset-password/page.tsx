import { Suspense } from "react";

import { AuthCardHeader, AuthShell } from "@/components/AuthShell";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

const highlights = [
  "Senha forte, conta protegida",
  "Link de uso único com expiração automática",
  "Acesso liberado assim que você salvar",
];

export default function ResetPasswordPage() {
  return (
    <AuthShell
      heading={
        <>
          Nova senha,
          <br />
          <span className="text-gradient-live">mesmo controle.</span>
        </>
      }
      tagline="Escolha uma senha segura e volte a acompanhar estoque, vendas e financeiro em tempo real."
      highlights={highlights}
    >
      <AuthCardHeader
        title="Redefinir senha"
        description="Escolha uma nova senha para acessar sua conta."
      />
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Carregando...</p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
