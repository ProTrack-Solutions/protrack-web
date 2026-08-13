import { useInfiniteQuery } from "@tanstack/react-query";
import { GetClient } from "@/service/clients.service";

const PER_PAGE = 20;

export const useInfiniteClients = (search?: string) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["clients-select", search],
      queryFn: ({ pageParam }) =>
        GetClient({ Page: pageParam, PerPage: PER_PAGE, Search: search }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  return {
    clients: data?.pages.flatMap((page) => page.data) ?? [],
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os clientes. Por favor, tente novamente."
      : null,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
};
