import {
  AccountsReceivablePaginationParams,
  ListAccountsReceivableResponse,
  ReceivableReminderResponse,
} from "@/interfaces/accounts-receivable.interface";
import { api } from "./api";

export const ListAccountsReceivable = async (
  pagination: AccountsReceivablePaginationParams,
): Promise<ListAccountsReceivableResponse> => {
  const response = await api.get<ListAccountsReceivableResponse>(
    "/accounts-receivable/complete/list",
    {
      params: {
        page: pagination.Page,
        perPage: pagination.PerPage,
        search: pagination.Search,
        orderBy: pagination.OrderBy,
        startDate: pagination.StartDate,
        endDate: pagination.EndDate,
        saleId: pagination.saleId,
        status: pagination.status,
        startDueDate: pagination.startDueDate,
        endDueDate: pagination.endDueDate,
        orderField: pagination.orderField,
      },
    },
  );
  return response.data;
};

/** Envia o lembrete de cobrança da parcela pelo WhatsApp */
export const SendReceivableReminder = async (
  accountId: string,
): Promise<ReceivableReminderResponse> => {
  const response = await api.post<ReceivableReminderResponse>(
    `/accounts-receivable/reminders/${accountId}`,
  );
  return response.data;
};
