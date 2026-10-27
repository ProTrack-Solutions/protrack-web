import {
  CashSessionDetail,
  CloseCashSessionParams,
  CreateCashMovementParams,
  CurrentCashSessionResponse,
  ListCashSessionsResponse,
  OpenCashSessionParams,
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

export const ListCashSessions = async (page: number, perPage = 10) => {
  const response = await api.get<ListCashSessionsResponse>(
    "/cash-register/sessions",
    { params: { page, per_page: perPage } },
  );
  return response.data;
};

export const GetCashSession = async (id: string) => {
  const response = await api.get<CashSessionDetail>(
    `/cash-register/sessions/${id}`,
  );
  return response.data;
};
