import { getPageRange } from "@/utils/pagination";
import { useMemo, useState } from "react";

interface UsePaginationProps {
  totalPages: number;
  initialPage?: number;
}

export function usePagination({
  totalPages,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const pageRange = useMemo(
    () => getPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return { currentPage, setCurrentPage, pageRange, goToPage };
}
