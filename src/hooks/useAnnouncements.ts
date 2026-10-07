import { useQuery } from "@tanstack/react-query";
import { ListAnnouncements } from "@/service/announcements.service";
import { Pagination } from "@/interfaces/pagination.interface";

export const useAnnouncements = (
  paginationParams?: Pagination,
  enabled: boolean = true,
) => {
  const pagination = paginationParams ?? { Page: 1, PerPage: 10 };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["announcements", pagination.Page, pagination.PerPage],
    queryFn: () => ListAnnouncements(pagination),
    enabled,
    refetchOnWindowFocus: true,
  });

  return {
    announcements: data?.data || [],
    announcementsCount: data?.total_rows || 0,
    totalPages: data?.total_pages || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os avisos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
