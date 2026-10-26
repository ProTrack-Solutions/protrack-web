"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  authBackLinkClass,
  authIconClass,
  authInputClass,
  authPrimaryButtonClass,
  authToggleClass,
} from "@/components/AuthShell";
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
      <div className="space-y-5">
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Link inválido ou expirado. Solicite um novo link de redefinição.
        </p>
        <Link href="/forgot-password" className={authPrimaryButtonClass}>
          Solicitar novo link
        </Link>
        <div className="text-center">
          <Link href="/login" className={authBackLinkClass}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-semibold">
          Nova senha
        </Label>
        <div className="relative">
          <Lock className={authIconClass} />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${authInputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className={authToggleClass}
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
            <p className="text-xs text-muted-foreground">
              Força da senha:{" "}
              <span className="font-medium text-foreground">
                {strength.label}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold">
          Confirmar nova senha
        </Label>
        <div className="relative">
          <Lock className={authIconClass} />
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${authInputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
            className={authToggleClass}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <ul className="space-y-1 rounded-2xl border border-border bg-secondary/60 p-4 text-xs text-muted-foreground">
        <li>Mínimo de 8 caracteres</li>
        <li>Pelo menos 1 letra maiúscula e 1 minúscula</li>
        <li>Pelo menos 1 número</li>
      </ul>

      <button
        type="submit"
        className={authPrimaryButtonClass}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redefinindo...
          </>
        ) : (
          <>
            Redefinir senha <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </button>

      <div className="pt-3 text-center">
        <Link href="/login" className={authBackLinkClass}>
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
