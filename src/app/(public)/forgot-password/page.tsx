"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgotPassword } from "@/service/auth.service";

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
    <div className="flex justify-center gap-10">
      <div
        className="bg-no-repeat bg-cover bg-center h-screen w-133 flex items-center justify-center"
        style={{ backgroundImage: `url('/mesh-gradient.svg')` }}
      >
        <div className="flex w-100 h-90 bg-zinc-400/30 rounded-2xl justify-center items-center">
          <div className="flex flex-col w-87 h-48 space-y-2">
            <strong className="text-3xl text-blue-800">
              Sistema de gestão empresarial
            </strong>
            <strong className="text-3xl bg-linear-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent">
              Pro Track
            </strong>
            <span className="text-zinc-500 font-semibold">
              Otimize sua empresa com nosso sistema de gestão: eficiência,
              controle e crescimento garantidos!
            </span>
          </div>
        </div>
      </div>
      <div className="bg-transparent w-110 flex justify-center items-center">
        <div className="flex-1 flex-col gap-2 p-10">
          {sent ? (
            <div className="space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <MailCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col space-y-1">
                <strong className="text-3xl text-blue-800">
                  Verifique seu e-mail
                </strong>
                <span className="text-sm text-zinc-500">
                  Se o e-mail existir em nossa base, você receberá um link de
                  recuperação em instantes.
                </span>
                <span className="text-sm text-zinc-500">
                  Não recebeu? Verifique a caixa de spam ou tente novamente em
                  alguns minutos.
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-1/1 h-10 bg-blue-500">
                  <Link href="/login">Voltar para o login</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/1 h-10"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                >
                  Usar outro e-mail
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <strong className="text-3xl text-blue-800">
                  Esqueceu a senha?
                </strong>
                <span className="text-sm text-zinc-500">
                  Informe seu e-mail para receber o link de recuperação.
                </span>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-1/1 h-10 bg-blue-500 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
