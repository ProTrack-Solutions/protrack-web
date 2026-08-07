import { getPageRange } from "@/utils/pagination";
import { useCallback, useMemo, useState } from "react";

interface UsePaginationProps {
  totalPages: number;
  initialPage?: number;
}

export function usePagination({
  totalPages,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // `totalPages` só é conhecido de verdade depois que a requisição responde,
  // então guardamos em estado (atualizado via `setTotalPages`) em vez de usar
  // direto o parâmetro recebido — do contrário `goToPage`/`pageRange` ficam
  // presos no valor inicial (geralmente 1) passado na primeira renderização.
  const [total, setTotal] = useState(Math.max(totalPages, 1));

  const setTotalPages = useCallback(
    (value: number) => setTotal(Math.max(value, 1)),
    [],
  );

  // Se o total de páginas encolher (ex.: filtro/busca reduziu o resultado) e
  // a página atual ficar fora do intervalo, exibe a última página válida sem
  // perder o "currentPage" real — ele volta a valer assim que o total crescer
  // de novo (ex.: o filtro for removido).
  const safeCurrentPage = Math.min(currentPage, total);

  const pageRange = useMemo(
    () => getPageRange(safeCurrentPage, total),
    [safeCurrentPage, total],
  );

  function goToPage(page: number) {
    if (page < 1 || page > total) return;
    setCurrentPage(page);
  }

  return {
    currentPage: safeCurrentPage,
    setCurrentPage,
    totalPages: total,
    setTotalPages,
    pageRange,
    goToPage,
  };
}
