import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CashSessionDetail,
  CloseCashSessionParams,
  CreateCashMovementParams,
  OpenCashSessionParams,
} from "@/interfaces/cash-register.interface";
import {
  CloseCashSession,
  CreateCashMovement,
  GetCashSession,
  GetCurrentCashSession,
  ListCashSessions,
  OpenCashSession,
} from "@/service/cash-register.service";
import { CompanySettings } from "@/enum/company-settings.enum";
import { useCompanySettings } from "./useCompanySettings";

export const CASH_REGISTER_KEY = "cash-register";

/** Caixa aberto do usuário logado; `null` quando está fechado */
export const useCurrentCashSession = () =>
  useQuery({
    queryKey: [CASH_REGISTER_KEY, "current"],
    queryFn: async () => {
      const data = await GetCurrentCashSession();
      return data.session ? (data as CashSessionDetail) : null;
    },
    // Vendas feitas em outra aba entram no resumo sem precisar recarregar
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

/**
 * A empresa exige caixa aberto para vender e receber parcelas. Sem a
 * configuração gravada, não exige (mesmo padrão da API).
 */
export const useRequireOpenCashRegister = () => {
  const { companySettings } = useCompanySettings();
  return (
    companySettings?.find(
      (cs) => cs.key === CompanySettings.RequireOpenCashRegister,
    )?.value === true
  );
};

/** Bloqueia a venda quando a empresa exige caixa e o do operador está fechado */
export const useCashRegisterBlocksSale = () => {
  const required = useRequireOpenCashRegister();
  const { data: current, isSuccess } = useCurrentCashSession();
  return required && isSuccess && !current;
};

export const useCashSessions = (page: number) =>
  useQuery({
    queryKey: [CASH_REGISTER_KEY, "sessions", page],
    queryFn: () => ListCashSessions(page),
    placeholderData: keepPreviousData,
  });

export const useCashSession = (id: string | null) =>
  useQuery({
    queryKey: [CASH_REGISTER_KEY, "session", id],
    queryFn: () => GetCashSession(id as string),
    enabled: !!id,
  });

/**
 * Abrir, movimentar e fechar devolvem o caixa já atualizado: grava direto no
 * cache do "current" e só invalida o histórico.
 */
export const useCashRegisterActions = () => {
  const queryClient = useQueryClient();

  const onSuccess = (detail: CashSessionDetail) => {
    queryClient.setQueryData(
      [CASH_REGISTER_KEY, "current"],
      detail.session.status === "open" ? detail : null,
    );
    queryClient.invalidateQueries({
      queryKey: [CASH_REGISTER_KEY, "sessions"],
    });
  };

  const open = useMutation({
    mutationFn: (params: OpenCashSessionParams) => OpenCashSession(params),
    onSuccess,
  });
  const move = useMutation({
    mutationFn: (params: CreateCashMovementParams) =>
      CreateCashMovement(params),
    onSuccess,
  });
  const close = useMutation({
    mutationFn: (params: CloseCashSessionParams) => CloseCashSession(params),
    onSuccess,
  });

  return { open, move, close };
};
