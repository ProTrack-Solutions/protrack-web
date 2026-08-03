"use client";

import { useEffect, useMemo, useState } from "react";
import { EstoqueSearch } from "./components/EstoqueSearch";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueTable } from "./components/EstoqueTable";
import { Header } from "@/components/Header";
import { useProducts } from "@/hooks/useProducts";
import { Loading } from "@/components/Loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { getPageRange } from "@/utils/pagination";

export default function Stock() {
  const [currentPage, setCurrentPage] = useState(1);
  console.log("currentPage", currentPage);

  const {
    products,
    error,
    loading,
    itensInStock,
    lowItensInStock,
    productsCount,
    totalValueInStock,
    totalPages,
    refetch,
  } = useProducts({
    Page: currentPage,
    PerPage: 10,
  });

  console.log("totalPages", totalPages);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const pageRange = useMemo(
    () => getPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcode.includes(searchTerm) ||
          p.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, products],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página estoque!"
        text="Aqui você pode visualizar todos os produtos cadastrados no sistema.."
      />
      <div className="p-6 space-y-6 mx-auto">
        <EstoqueStats
          itensInStock={itensInStock}
          lowItensInStock={lowItensInStock}
          productsCount={productsCount}
          totalValueInStock={totalValueInStock}
        />
        <EstoqueSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <EstoqueTable products={filteredProducts} />
        <Pagination className="py-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageRange.map((page, idx) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page);
                    }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
