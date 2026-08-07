import {
  BillsPayablePaginationParams,
  CreateBillsPayableParams,
  GetBillsPayableSummaryResponse,
  ListBillsPayableResponse,
  PaymentBillParams,
  SheduleBillParams,
} from "@/interfaces/bills-payable.interface";
import { api } from "./api";

export const GetBillsPayableSummary =
  async (): Promise<GetBillsPayableSummaryResponse> => {
    const response = await api.get<GetBillsPayableSummaryResponse>(
      "/bills-payable/summary",
    );
    return response.data;
  };

export const ListBillsPayable = async (
  pagination: BillsPayablePaginationParams,
): Promise<ListBillsPayableResponse> => {
  const response = await api.get<ListBillsPayableResponse>(
    "/bills-payable/list",
    {
      params: {
        page: pagination.Page,
        perPage: pagination.PerPage,
        search: pagination.Search,
        orderBy: pagination.OrderBy,
        startDate: pagination.StartDate,
        endDate: pagination.EndDate,
        status: pagination.status,
        startDueDate: pagination.startDueDate,
        endDueDate: pagination.endDueDate,
        startScheduledDate: pagination.startScheduledDate,
        endScheduledDate: pagination.endScheduledDate,
        startPaymentDate: pagination.startPaymentDate,
        endPaymentDate: pagination.endPaymentDate,
        orderField: pagination.orderField,
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
