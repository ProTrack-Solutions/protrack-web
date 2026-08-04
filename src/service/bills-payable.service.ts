import {
  CreateBillsPayableParams,
  GetBillsPayableSummaryResponse,
  ListBillsPayableResponse,
  PaymentBillParams,
  SheduleBillParams,
} from "@/interfaces/bills-payable.interface";
import { Pagination } from "@/interfaces/pagination.interface";
import { api } from "./api";

export const GetBillsPayableSummary =
  async (): Promise<GetBillsPayableSummaryResponse> => {
    const response = await api.get<GetBillsPayableSummaryResponse>(
      "/bills-payable/summary",
    );
    return response.data;
  };

export const ListBillsPayable = async (
  pagination: Pagination,
): Promise<ListBillsPayableResponse> => {
  const response = await api.get<ListBillsPayableResponse>(
    "/bills-payable/list",
    {
      headers: {
        Page: pagination.Page,
        PerPage: pagination.PerPage,
      },
    },
  );
  return response.data;
};

export const CreateBillsPayable = async (
  params: CreateBillsPayableParams,
): Promise<void> => {
  await api.post("/bills-payable", params);
};

export const PaymentBill = async (
  billPayableId: string,
  params: PaymentBillParams,
) => {
  await api.put(`/bills-payable/pay/${billPayableId}`, params);
};

export const SheduleBill = async (
  billPayableId: string,
  params: SheduleBillParams,
) => {
  await api.put(`/bills-payable/schedule/${billPayableId}`, params);
};
