import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { getDeviceCashRegisterId } from "@/utils/cashRegisterDevice";

// Cada getSession() é um GET /api/auth/session; sem cache o dashboard dispara
// dezenas deles. O jwt callback renova o token 30s antes de expirar, então
// reaproveitar a sessão por alguns segundos é seguro.
const SESSION_CACHE_MS = 10_000;
let sessionCache: { promise: Promise<Session | null>; at: number } | null =
  null;
let signingOut = false;

function getCachedSession() {
  if (!sessionCache || Date.now() - sessionCache.at > SESSION_CACHE_MS) {
    const promise = getSession();
    sessionCache = { promise, at: Date.now() };
    promise.catch(() => (sessionCache = null));
  }
  return sessionCache.promise;
}

/**
 * Logout da aplicação. Espera a busca de sessão pendente terminar antes do
 * signOut: se ela respondesse depois, regravaria o cookie de sessão antigo e
 * o usuário continuaria logado.
 */
export async function logout(callbackUrl = "/login") {
  if (signingOut) return;
  signingOut = true;
  try {
    await sessionCache?.promise.catch(() => null);
    sessionCache = null;
    await signOut({ callbackUrl });
  } catch (error) {
    signingOut = false;
    throw error;
  }
}

// Login com o aviso de que outra sessão assumiu a conta
const SESSION_REPLACED_URL = "/login?reason=session_replaced";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (signingOut) return Promise.reject(new Error("Saindo da aplicação"));

    const session = await getCachedSession();

    if (session?.error === "SessionReplaced") {
      await logout(SESSION_REPLACED_URL);
      return Promise.reject(new Error("Sessão encerrada por outro login"));
    }

    if (session?.error === "RefreshAccessTokenError") {
      await logout();
      return Promise.reject(new Error("Sessão expirada"));
    }

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session?.accessToken}`;
    }

    // Caixa em que este computador trabalha: a API liga vendas e recebimentos ao turno dele
    const cashRegisterId = getDeviceCashRegisterId();
    if (cashRegisterId) {
      config.headers.CashRegisterId = cashRegisterId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Ações bloqueadas para a empresa demo (assinatura, senha, usuários...).
    if (
      error.response?.status === 403 &&
      error.response.data?.code === "DEMO_READONLY"
    ) {
      toast.info("Esta ação não está disponível no modo demonstração.", {
        id: "demo-readonly",
        description: "Crie sua conta para usar todos os recursos.",
      });
    }

    if (error.response && error.response.status === 401) {
      // A conta entrou em outro navegador: só vale uma sessão no web por usuário
      await logout(
        error.response.data?.code === "SESSION_REPLACED"
          ? SESSION_REPLACED_URL
          : undefined,
      );
    }
    return Promise.reject(error);
  },
);
