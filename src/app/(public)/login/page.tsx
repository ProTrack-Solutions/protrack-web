"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppInput } from "@/components/AppInput";
import { AppButton } from "@/components/AppButton";
import { signIn, getSession } from "next-auth/react";
import { LoginParams } from "@/interfaces/auth.interface";
import { getInitialRoute } from "@/const/moduleAccess.const";

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

const DEFAULT_LOGIN_ERROR =
  "Credenciais inválidas ou erro ao conectar com o servidor.";

export default function Login() {
  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: "",
    password: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
          <div className="flex flex-col">
            <strong className="text-3xl text-blue-800">Bem vindo!</strong>
            <span className="text-sm text-zinc-500">
              Insira suas credenciais para acessar sua conta.
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-1">
            <AppInput
              label="Email"
              type="text"
              value={loginParams.email}
              onChange={(e) =>
                setLoginParams({ ...loginParams, email: e.target.value })
              }
            />
            <AppInput
              label="Senha"
              type={mostrarSenha ? "text" : "password"}
              value={loginParams.password}
              onChange={(e) =>
                setLoginParams({ ...loginParams, password: e.target.value })
              }
            />
            <div className="flex justify-between">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  className="border-2 rounded-sm"
                  checked={mostrarSenha}
                  onCheckedChange={handleCheckboxChange}
                />
                <span className="text-[#16164D] font-semibold text-sm">
                  Mostrar senha
                </span>
              </label>

              <span
                className="text-blue-600 font-semibold cursor-pointer text-sm"
                onClick={() => router.push("/forgot-password")}
              >
                Esqueceu a senha?
              </span>
            </div>
            <AppButton
              text="Entrar"
              type="submit"
              isLoading={isLoading}
              className="w-1/1 h-10 bg-blue-500 cursor-pointer"
            />
            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded w-full">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
