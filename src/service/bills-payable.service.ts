import {
  CreateBillsPayableParams,
  GetBillsPayableSummaryResponse,
  ListBillsPayableResponse,
  PaymentBillParams,
} from "@/interfaces/bills-payable.interface";
import { api } from "./api";

export const GetBillsPayableSummary =
  async (): Promise<GetBillsPayableSummaryResponse> => {
    const response = await api.get<GetBillsPayableSummaryResponse>(
      "/bills-payable/summary",
    );
    return response.data;
  };

export const ListBillsPayable = async (): Promise<ListBillsPayableResponse> => {
  const response = await api.get<ListBillsPayableResponse>(
    "/bills-payable/list",
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
