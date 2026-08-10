"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ResetPassword } from "@/service/auth.service";

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível redefinir sua senha agora. Tente novamente em instantes.";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (!password) return { level: 0, label: "", color: "bg-muted" };
  if (score <= 2) return { level: 1, label: "Fraca", color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "Média", color: "bg-amber-500" };
  return { level: 3, label: "Forte", color: "bg-emerald-500" };
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = getStrength(password);

  if (!token) {
    return (
      <div className="mt-4 space-y-4">
        <p className="text-sm text-red-600">
          Link inválido ou expirado. Solicite um novo link de redefinição.
        </p>
        <Button asChild className="w-1/1 h-10 bg-blue-500">
          <Link href="/forgot-password">Solicitar novo link</Link>
        </Button>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Inclua pelo menos 1 letra maiúscula e 1 minúscula.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Inclua pelo menos 1 número.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      await ResetPassword({ token, new_password: password });
      toast.success("Senha alterada com sucesso, faça login.");
      router.replace("/login");
    } catch (error) {
      console.error(error);
      const message = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;
      toast.error(message || DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {password && (
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= strength.level ? strength.color : "bg-muted",
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              Força da senha:{" "}
              <span className="font-medium text-foreground">
                {strength.label}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <ul className="space-y-1 rounded-md border border-border bg-muted/40 p-3 text-xs text-zinc-500">
        <li>Mínimo de 8 caracteres</li>
        <li>Pelo menos 1 letra maiúscula e 1 minúscula</li>
        <li>Pelo menos 1 número</li>
      </ul>

      <Button
        type="submit"
        className="w-1/1 h-10 bg-blue-500 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Redefinindo..." : "Redefinir senha"}
      </Button>

      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o login
      </Link>
    </form>
  );
}

export default ResetPasswordForm;
