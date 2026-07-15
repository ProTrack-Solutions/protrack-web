import { ListAccountsReceivableResponse } from "@/interfaces/accounts-receivable.interface";
import { api } from "./api";

export const ListAccountsReceivable =
  async (): Promise<ListAccountsReceivableResponse> => {
    const response = await api.get<ListAccountsReceivableResponse>(
      "/accounts-receivable/complete/list",
      {
        headers: {
          Page: 1,
          PerPage: 10,
        },
      },
    );
    return response.data;
  };
