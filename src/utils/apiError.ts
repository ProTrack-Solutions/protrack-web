import { isAxiosError } from "axios";

/**
 * Extrai a mensagem de erro retornada pela API ({ error: string }).
 * Sem resposta do servidor (rede/timeout) ou sem mensagem, usa o fallback.
 */
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ error?: string }>(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
    return error.response.data?.error || fallback;
  }
  return fallback;
};
