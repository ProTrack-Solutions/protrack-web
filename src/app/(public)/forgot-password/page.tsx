"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCardHeader,
  AuthShell,
  authBackLinkClass,
  authIconClass,
  authInputClass,
  authPrimaryButtonClass,
  authSecondaryButtonClass,
} from "@/components/AuthShell";
import { ForgotPassword } from "@/service/auth.service";

const highlights = [
  "Link de uso único com expiração automática",
  "Nunca compartilhamos seus dados de acesso",
  "Volte a usar o sistema em poucos minutos",
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }

    try {
      setIsLoading(true);
      await ForgotPassword({ email: email.trim() });
      setSent(true);
    } catch (error) {
      console.error(error);
      toast.error(
        "Não foi possível enviar o link agora. Tente novamente em instantes.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      heading={
        <>
          Esqueceu a senha?
          <br />
          <span className="text-gradient-live">A gente resolve.</span>
        </>
      }
      tagline="Recupere o acesso à sua conta com segurança e continue gerenciando seu negócio sem interrupções."
      highlights={highlights}
    >
      {sent ? (
        <>
          <AuthCardHeader
            icon={<MailCheck className="h-6 w-6" />}
            title="Verifique seu e-mail"
            description="Se o e-mail existir em nossa base, você receberá um link de recuperação em instantes."
          />
          <p className="-mt-4 mb-8 text-sm text-muted-foreground">
            Não recebeu? Verifique a caixa de spam ou tente novamente em alguns
            minutos.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className={authPrimaryButtonClass}>
              Voltar para o login
            </Link>
            <button
              type="button"
              className={authSecondaryButtonClass}
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Usar outro e-mail
            </button>
          </div>
        </>
      ) : (
        <>
          <AuthCardHeader
            title="Recuperar senha"
            description="Informe seu e-mail para receber o link de recuperação."
          />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">
                E-mail
              </Label>
              <div className="relative">
                <Mail className={authIconClass} />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputClass}
                />
              </div>
            </div>
            <button
              type="submit"
              className={authPrimaryButtonClass}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  Enviar link de recuperação{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link href="/login" className={authBackLinkClass}>
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}
