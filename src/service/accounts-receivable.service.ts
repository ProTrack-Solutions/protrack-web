import { ListAccountsReceivableResponse } from "@/interfaces/accounts-receivable.interface";
import { Pagination } from "@/interfaces/pagination.interface";
import { api } from "./api";

export const ListAccountsReceivable = async (
  pagination: Pagination,
): Promise<ListAccountsReceivableResponse> => {
  const response = await api.get<ListAccountsReceivableResponse>(
    "/accounts-receivable/complete/list",
    {
      headers: {
        Page: pagination.Page,
        PerPage: pagination.PerPage,
      },
    },
  );
  return response.data;
};
