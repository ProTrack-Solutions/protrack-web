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
  //
  // Importante: isso é só para EXIBIÇÃO (destaque na paginação, texto
  // "página X de Y"). O `currentPage` "cru" continua sendo o que deve ser
  // enviado como parâmetro para a API. `total` só é atualizado depois que a
  // API responde (via `setTotalPages`, chamado num efeito no componente que
  // consome esse hook); se o valor clampado fosse usado como `Page` da
  // requisição, uma mudança em `total` alteraria esse `currentPage`, o que
  // dispararia uma nova busca — cuja resposta poderia alterar `total` de
  // novo, e assim por diante, um ciclo que estoura o limite de updates do
  // React ("Maximum update depth exceeded").
  const displayPage = Math.min(currentPage, total);

  const pageRange = useMemo(
    () => getPageRange(displayPage, total),
    [displayPage, total],
  );

  function goToPage(page: number) {
    if (page < 1 || page > total) return;
    setCurrentPage(page);
  }

  return {
    currentPage,
    displayPage,
    setCurrentPage,
    totalPages: total,
    setTotalPages,
    pageRange,
    goToPage,
  };
}
