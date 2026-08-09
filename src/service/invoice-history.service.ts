import { InvoiceHistoryPaginatedResponse } from "@/interfaces/invoice-history.interface";
import { Pagination } from "@/interfaces/pagination.interface";
import { api } from "./api";

// /invoice-history/company faz o bind da paginação via HEADER (Page, Perpage,
// ...), não via query string — por isso vai em `headers`, e não em `params`
// como a maioria das outras listagens.
export const ListInvoiceHistoryByCompany = async (
  pagination: Pagination,
): Promise<InvoiceHistoryPaginatedResponse> => {
  const response = await api.get<InvoiceHistoryPaginatedResponse>(
    "/invoice-history/company",
    {
      headers: {
        Page: pagination.Page,
        PerPage: pagination.PerPage,
        Search: pagination.Search,
        OrderBy: pagination.OrderBy,
        StartDate: pagination.StartDate,
        EndDate: pagination.EndDate,
      },
    },
  );
  return response.data;
};
