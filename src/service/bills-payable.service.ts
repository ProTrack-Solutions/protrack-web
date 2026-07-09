import {
  GetBillsPayableSummaryResponse,
  ListBillsPayableResponse,
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
