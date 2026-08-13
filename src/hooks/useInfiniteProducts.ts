import { useInfiniteQuery } from "@tanstack/react-query";
import { GetProducts } from "@/service/products.service";

const PER_PAGE = 20;

export const useInfiniteProducts = (search?: string) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products-select", search],
      queryFn: ({ pageParam }) =>
        GetProducts({ Page: pageParam, PerPage: PER_PAGE, Search: search }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  return {
    products: data?.pages.flatMap((page) => page.data) ?? [],
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
};
