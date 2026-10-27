"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { EstoqueSearch } from "./components/EstoqueSearch";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueTable } from "./components/EstoqueTable";
import { useProducts } from "@/hooks/useProducts";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { GenerateLabel } from "@/service/label.service";
import { FiltrosReceber } from "@/components/FilterPopOver";
import { GetProducts } from "@/service/products.service";

const PER_PAGE = 10;

export default function Stock() {
  const { currentPage, displayPage, goToPage, pageRange, setTotalPages } =
    usePagination({
      totalPages: 1,
    });

  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<FiltrosReceber>({
    typeDate: "criacao",
  });

  const dateParams = {
    EndDate: (filter?.endDate && format(filter.endDate, "yyyy-MM-dd")) ?? "",
    StartDate:
      (filter?.startDate && format(filter.startDate, "yyyy-MM-dd")) ?? "",
  };

  // A query refaz a busca sozinha quando página, busca ou filtro mudam
  const {
    products,
    error,
    loading,
    isFetching,
    isPlaceholderData,
    itensInStock,
    lowItensInStock,
    productsCount,
    totalValueInStock,
    totalPages,
    refetch,
  } = useProducts({
    Page: currentPage,
    PerPage: PER_PAGE,
    Search: searchTerm,
    OrderBy: "asc",
    ...dateParams,
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    goToPage(1);
  };

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectingAll, setSelectingAll] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState(false);

  const handleSelectAll = async (checked: boolean) => {
    if (!checked) {
      setSelectedRows(new Set());
      return;
    }

    if (!productsCount) {
      setSelectedRows(new Set());
      return;
    }

    try {
      setSelectingAll(true);
      // Os produtos vêm paginados, então para selecionar todos é preciso
      // buscar todas as páginas de uma vez respeitando os filtros atuais.
      const allProducts = await GetProducts({
        Page: 1,
        PerPage: productsCount,
        Search: searchTerm,
        OrderBy: "asc",
        ...dateParams,
      });
      setSelectedRows(new Set(allProducts.data.map((product) => product.id)));
    } catch (error) {
      console.log(error);
      toast.error("Erro ao selecionar todos os produtos!");
    } finally {
      setSelectingAll(false);
    }
  };

  const handleGenerateLabel = async () => {
    const payload = Array.from(selectedRows).map((id) => ({
      product_id: id,
    }));
    try {
      setGeneratingLabel(true);
      await GenerateLabel(payload);
      toast.success("Etiquetas geradas com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao gerar etiquetas!");
    } finally {
      setGeneratingLabel(false);
    }
  };

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

  const firstItem = productsCount ? (displayPage - 1) * PER_PAGE + 1 : 0;
  const lastItem = Math.min(displayPage * PER_PAGE, productsCount);

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Produtos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Catálogo e estoque de tudo que está cadastrado na loja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Atualizar dados"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <Link
            href="/product-registration"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Novo produto
          </Link>
        </div>
      </div>

      {error && !products.length ? (
        <div className="dash-in flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium text-foreground">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <EstoqueStats
            loading={loading}
            itensInStock={itensInStock}
            lowItensInStock={lowItensInStock}
            productsCount={productsCount}
            totalValueInStock={totalValueInStock}
          />

          <EstoqueSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            selectedCount={selectedRows.size}
            onClearSelection={() => setSelectedRows(new Set())}
            handleGenerateLabel={handleGenerateLabel}
            generatingLabel={generatingLabel}
            onApplyFilter={(next) => {
              setFilter(next);
              goToPage(1);
            }}
            filter={filter}
          />

          <div
            aria-busy={isPlaceholderData}
            className={`transition-opacity duration-300 ${
              isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            <EstoqueTable
              products={products}
              productsCount={productsCount}
              loading={loading}
              searchTerm={searchTerm}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              onSelectAll={handleSelectAll}
              selectingAll={selectingAll}
              footer={
                productsCount > 0 && (
                  <div className="flex flex-col items-center justify-between gap-2 border-t border-border/60 px-4 py-2 sm:flex-row">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Mostrando {firstItem}–{lastItem} de{" "}
                      {productsCount.toLocaleString("pt-BR")} produtos
                    </p>
                    <DataPagination
                      className="mx-0 w-auto py-1"
                      currentPage={displayPage}
                      totalPages={totalPages || 1}
                      pageRange={pageRange}
                      goToPage={goToPage}
                    />
                  </div>
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
