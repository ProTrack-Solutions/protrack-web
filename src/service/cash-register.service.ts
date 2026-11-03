import {
  CashRegister,
  CashSessionDetail,
  CashTransferAction,
  CreateCashTransferParams,
  CloseCashSessionParams,
  CreateCashMovementParams,
  CurrentCashSessionResponse,
  ListCashSessionsResponse,
  OpenCashSessionParams,
  SaveCashRegisterParams,
} from "@/interfaces/cash-register.interface";
import { api } from "./api";

export const GetCurrentCashSession = async () => {
  const response = await api.get<CurrentCashSessionResponse>(
    "/cash-register/current",
  );
  return response.data;
};

export const OpenCashSession = async (params: OpenCashSessionParams) => {
  const response = await api.post<CashSessionDetail>(
    "/cash-register/open",
    params,
  );
  return response.data;
};

export const CreateCashMovement = async (params: CreateCashMovementParams) => {
  const response = await api.post<CashSessionDetail>(
    "/cash-register/movements",
    params,
  );
  return response.data;
};

export const CloseCashSession = async (params: CloseCashSessionParams) => {
  const response = await api.post<CashSessionDetail>(
    "/cash-register/close",
    params,
  );
  return response.data;
};

export const ListCashSessions = async (
  page: number,
  perPage = 10,
  registerId?: string,
) => {
  const response = await api.get<ListCashSessionsResponse>(
    "/cash-register/sessions",
    { params: { page, per_page: perPage, register_id: registerId } },
  );
  return response.data;
};

export const GetCashSession = async (id: string) => {
  const response = await api.get<CashSessionDetail>(
    `/cash-register/sessions/${id}`,
  );
  return response.data;
};

export const ListCashRegisters = async () => {
  const response = await api.get<CashRegister[]>("/cash-register/registers");
  return response.data;
};

export const CreateCashRegister = async (params: SaveCashRegisterParams) => {
  const response = await api.post<CashRegister>(
    "/cash-register/registers",
    params,
  );
  return response.data;
};

export const UpdateCashRegister = async (
  id: string,
  params: SaveCashRegisterParams,
) => {
  const response = await api.put<CashRegister>(
    `/cash-register/registers/${id}`,
    params,
  );
  return response.data;
};

export const CreateCashTransfer = async (params: CreateCashTransferParams) => {
  const response = await api.post<CashSessionDetail>(
    "/cash-register/transfers",
    params,
  );
  return response.data;
};

export const ResolveCashTransfer = async (
  id: string,
  action: CashTransferAction,
) => {
  const response = await api.post<CashSessionDetail>(
    `/cash-register/transfers/${id}/${action}`,
  );
  return response.data;
};
