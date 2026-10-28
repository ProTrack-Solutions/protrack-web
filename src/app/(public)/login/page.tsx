"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCardHeader,
  AuthShell,
  authIconClass,
  authInputClass,
  authLinkClass,
  authPrimaryButtonClass,
  authToggleClass,
} from "@/components/AuthShell";
import { LoginParams } from "@/interfaces/auth.interface";
import { getInitialRoute } from "@/const/moduleAccess.const";

const highlights = [
  "Acesso seguro de qualquer lugar",
  "Seus dados sincronizados em tempo real",
  "Suporte quando você precisar",
];

// Mensagens por código de erro do backend (POST /auth/login).
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
  TOO_MANY_ATTEMPTS:
    "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.",
  SUBSCRIPTION_NOT_FOUND:
    "Não encontramos uma assinatura para a sua empresa. Entre em contato com o suporte.",
  SUBSCRIPTION_CANCELED:
    "A assinatura da sua empresa foi cancelada. Entre em contato com o suporte para reativar.",
  SUBSCRIPTION_PAUSED:
    "A assinatura da sua empresa está pausada por falta de pagamento. Verifique o cartão cadastrado ou entre em contato com o suporte.",
  SUBSCRIPTION_EXPIRED:
    "A assinatura da sua empresa expirou. Entre em contato com o suporte para renovar.",
  SUBSCRIPTION_INCOMPLETE:
    "O pagamento da assinatura ainda não foi confirmado. Se você acabou de se cadastrar, aguarde alguns instantes e tente novamente.",
};

// Avisos de quando o usuário foi mandado de volta para o login
const LOGOUT_REASONS: Record<string, string> = {
  session_replaced:
    "Sua conta foi acessada em outro navegador e esta sessão foi encerrada. Só é permitido um acesso por vez no sistema web.",
};

const DEFAULT_LOGIN_ERROR =
  "Credenciais inválidas ou erro ao conectar com o servidor.";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { reason } = use(searchParams);
  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: "",
    password: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    (typeof reason === "string" && LOGOUT_REASONS[reason]) || "",
  );
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMostrarSenha(!mostrarSenha);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: loginParams.email,
        password: loginParams.password,
        redirect: false,
      });

      if (!result || result.error) {
        setError(
          (result?.code && LOGIN_ERROR_MESSAGES[result.code]) ||
            DEFAULT_LOGIN_ERROR,
        );
        console.log("Login", result?.error, result?.code);
      } else {
        // Manda pra tela inicial do departamento do usuário (financeiro,
        // vendas, estoque...), não sempre /dashboard.
        const session = await getSession();
        router.push(
          getInitialRoute({ role: session?.role, modules: session?.modules }),
        );
        router.refresh();
      }
    } catch (error) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      heading={
        <>
          Que bom ter
          <br />
          você <span className="text-gradient-live">de volta.</span>
        </>
      }
      tagline="Estoque, vendas, clientes e financeiro esperando por você — tudo visível, tudo rastreável, tudo em tempo real."
      highlights={highlights}
    >
      <AuthCardHeader
        title="Bem-vindo!"
        description="Insira suas credenciais para acessar sua conta."
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
              placeholder="voce@empresa.com"
              required
              className={authInputClass}
              value={loginParams.email}
              onChange={(e) =>
                setLoginParams({ ...loginParams, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold">
              Senha
            </Label>
            <Link
              href="/forgot-password"
              className={`${authLinkClass} text-sm`}
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className={authIconClass} />
            <Input
              id="password"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className={`${authInputClass} pr-11`}
              value={loginParams.password}
              onChange={(e) =>
                setLoginParams({ ...loginParams, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={handleCheckboxChange}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              className={authToggleClass}
            >
              {mostrarSenha ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={authPrimaryButtonClass}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Entrar <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/register" className={authLinkClass}>
          Teste grátis
        </Link>
      </p>
    </AuthShell>
  );
}
