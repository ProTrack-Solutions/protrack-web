import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

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
    const session = await getSession();

    if (session?.error === "RefreshAccessTokenError") {
      await signOut({ callbackUrl: "/login" });
      return Promise.reject(new Error("Sessão expirada"));
    }

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session?.accessToken}`;
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
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/login" });
    }
    return Promise.reject(error);
  },
);
