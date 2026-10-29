import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CashSessionDetail,
  CashTransferAction,
  CloseCashSessionParams,
  CreateCashMovementParams,
  CreateCashTransferParams,
  OpenCashSessionParams,
  SaveCashRegisterParams,
} from "@/interfaces/cash-register.interface";
import {
  CloseCashSession,
  CreateCashMovement,
  CreateCashRegister,
  CreateCashTransfer,
  GetCashSession,
  GetCurrentCashSession,
  ListCashRegisters,
  ListCashSessions,
  OpenCashSession,
  ResolveCashTransfer,
  UpdateCashRegister,
} from "@/service/cash-register.service";
import { CompanySettings } from "@/enum/company-settings.enum";
import {
  getDeviceCashRegisterId,
  setDeviceCashRegisterId,
  subscribeDeviceCashRegister,
} from "@/utils/cashRegisterDevice";
import { useCompanySettings } from "./useCompanySettings";

export const CASH_REGISTER_KEY = "cash-register";

/** Caixas da empresa com o turno aberto de cada um */
export const useCashRegisters = () =>
  useQuery({
    queryKey: [CASH_REGISTER_KEY, "registers"],
    queryFn: ListCashRegisters,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

/**
 * Caixa em que este computador trabalha. Com um único caixa ativo ele é
 * escolhido sozinho; com mais de um, a tela pede para escolher (needsChoice).
 */
export const useDeviceCashRegister = () => {
  const queryClient = useQueryClient();
  const storedId = useSyncExternalStore(
    subscribeDeviceCashRegister,
    getDeviceCashRegisterId,
    () => null,
  );
  const { data: registers, isLoading } = useCashRegisters();
  const active = registers?.filter((r) => r.active) ?? [];

  const register =
    active.find((r) => r.id === storedId) ??
    (active.length === 1 ? active[0] : undefined);
  const needsChoice = !!registers && !register && active.length > 1;

  // Guarda o caixa único (para continuar nele se outro for cadastrado depois)
  // e esquece o escolhido se ele foi desativado
  useEffect(() => {
    if (!registers) return;
    if (register && register.id !== storedId) {
      setDeviceCashRegisterId(register.id);
    } else if (!register && storedId) {
      setDeviceCashRegisterId(null);
    }
  }, [registers, register, storedId]);

  const choose = useCallback(
    (id: string) => {
      setDeviceCashRegisterId(id);
      queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_KEY] });
    },
    [queryClient],
  );

  return { registers: active, register, needsChoice, isLoading, choose };
};

/**
 * Turno aberto do caixa deste computador; `data` é `null` quando o caixa está
 * fechado. Enquanto o computador não escolheu o caixa, a consulta espera.
 */
export const useCurrentCashSession = () => {
  const device = useDeviceCashRegister();
  const query = useQuery({
    queryKey: [CASH_REGISTER_KEY, "current", device.register?.id],
    queryFn: async () => {
      const data = await GetCurrentCashSession();
      return data.session ? (data as CashSessionDetail) : null;
    },
    enabled: !!device.register,
    // Vendas feitas em outro computador entram no resumo sem precisar recarregar
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    ...query,
    isLoading: device.isLoading || query.isLoading,
    register: device.register,
    needsChoice: device.needsChoice,
  };
};

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

/** Bloqueia a venda quando a empresa exige caixa e o deste computador está fechado */
export const useCashRegisterBlocksSale = () => {
  const required = useRequireOpenCashRegister();
  const { data: current, isSuccess, needsChoice } = useCurrentCashSession();
  return required && (needsChoice || (isSuccess && !current));
};

/** Histórico de turnos; com `registerId`, só os daquele caixa */
export const useCashSessions = (page: number, registerId?: string) =>
  useQuery({
    queryKey: [CASH_REGISTER_KEY, "sessions", page, registerId],
    queryFn: () => ListCashSessions(page, 10, registerId),
    placeholderData: keepPreviousData,
  });


export const useCashSession = (id: string | null) =>
  useQuery({
    queryKey: [CASH_REGISTER_KEY, "session", id],
    queryFn: () => GetCashSession(id as string),
    enabled: !!id,
  });

/**
 * Abrir, movimentar e fechar devolvem o turno já atualizado: grava direto no
 * cache do "current" e invalida o histórico e a lista de caixas.
 */
export const useCashRegisterActions = () => {
  const queryClient = useQueryClient();

  const onSuccess = (detail: CashSessionDetail) => {
    queryClient.setQueriesData(
      { queryKey: [CASH_REGISTER_KEY, "current"] },
      detail.session.status === "open" ? detail : null,
    );
    queryClient.invalidateQueries({
      queryKey: [CASH_REGISTER_KEY, "sessions"],
    });
    queryClient.invalidateQueries({
      queryKey: [CASH_REGISTER_KEY, "registers"],
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
  const transfer = useMutation({
    mutationFn: (params: CreateCashTransferParams) =>
      CreateCashTransfer(params),
    onSuccess,
  });
  const resolveTransfer = useMutation({
    mutationFn: ({ id, action }: { id: string; action: CashTransferAction }) =>
      ResolveCashTransfer(id, action),
    onSuccess,
  });

  return { open, move, close, transfer, resolveTransfer };
};

/** Cadastro dos caixas (administrador) */
export const useCashRegisterAdmin = () => {
  const queryClient = useQueryClient();
  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_KEY] });

  const create = useMutation({
    mutationFn: (params: SaveCashRegisterParams) => CreateCashRegister(params),
    onSuccess,
  });
  const update = useMutation({
    mutationFn: ({ id, ...params }: SaveCashRegisterParams & { id: string }) =>
      UpdateCashRegister(id, params),
    onSuccess,
  });

  return { create, update };
};
