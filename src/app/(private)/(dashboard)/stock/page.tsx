"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { EstoqueSearch } from "./components/EstoqueSearch";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueTable, SelectedProduct } from "./components/EstoqueTable";
import { useStockEntries } from "@/hooks/useProductGrid";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { GenerateLabel } from "@/service/label.service";
import { FiltrosReceber } from "@/components/FilterPopOver";
import { GetProducts } from "@/service/products.service";
import { DialogGroupProducts } from "@/components/ProductGrid/DialogGroupProducts";
import { getApiErrorMessage } from "@/utils/apiError";

const PER_PAGE = 10;
const MAX_GROUP = 200;

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

  // Modelos de grade vêm agrupados numa linha; a query refaz a busca sozinha
  const { data, isLoading, isError, isFetching, isPlaceholderData, refetch } =
    useStockEntries({
      Page: currentPage,
      PerPage: PER_PAGE,
      Search: searchTerm,
      OrderBy: "asc",
      ...dateParams,
    });

  const entries = data?.data ?? [];
  const rowsCount = data?.total_rows ?? 0;
  const productsCount = data?.products_count ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const error = isError
    ? "Erro ao carregar os produtos. Por favor, tente novamente."
    : null;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    goToPage(1);
  };

  const [selected, setSelected] = useState<Map<string, SelectedProduct>>(
    new Map(),
  );
  const [selectingAll, setSelectingAll] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  // Só produtos sem grade (e que controlam estoque) podem virar variação
  const groupable = Array.from(selected.values()).filter(
    (p) => !p.model_name && !p.sell_in_bulk,
  );

  const handleToggle = (product: SelectedProduct, checked: boolean) =>
    setSelected((prev) => {
      const next = new Map(prev);
      if (checked) next.set(product.id, product);
      else next.delete(product.id);
      return next;
    });

  const handleSelectAll = async (checked: boolean) => {
    if (!checked || !productsCount) {
      setSelected(new Map());
      return;
    }

    try {
      setSelectingAll(true);
      // Seleciona produto a produto (variações incluídas) em todas as páginas,
      // respeitando os filtros de data. A busca textual da grade é mais ampla
      // (cor/modelo), então aqui ela não entra para não selecionar a menos.
      const all = await GetProducts({
        Page: 1,
        PerPage: productsCount,
        Search: searchTerm,
        OrderBy: "asc",
        ...dateParams,
      });
      setSelected(
        new Map(
          all.data.map((p) => [
            p.id,
            {
              id: p.id,
              name: p.name,
              size: p.size ?? "",
              quantity: p.quantity,
              category_id: p.category_id,
              model_name: p.model_name ?? "",
              sell_in_bulk: p.sell_in_bulk,
            },
          ]),
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error("Erro ao selecionar todos os produtos!");
    } finally {
      setSelectingAll(false);
    }
  };

  const handleGenerateLabel = async () => {
    const payload = Array.from(selected.keys()).map((id) => ({
      product_id: id,
    }));
    try {
      setGeneratingLabel(true);
      await GenerateLabel(payload);
      toast.success("Etiquetas geradas com sucesso!");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao gerar etiquetas!"));
    } finally {
      setGeneratingLabel(false);
    }
  };

  const handleGroup = () => {
    if (groupable.length > MAX_GROUP) {
      toast.error(`Agrupe no máximo ${MAX_GROUP} produtos por vez.`);
      return;
    }
    setGroupOpen(true);
  };

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

  const firstItem = rowsCount ? (displayPage - 1) * PER_PAGE + 1 : 0;
  const lastItem = Math.min(displayPage * PER_PAGE, rowsCount);

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

      {error && !entries.length ? (
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
            loading={isLoading}
            itensInStock={data?.itens_in_stock ?? 0}
            lowItensInStock={data?.low_itens_in_stock ?? 0}
            productsCount={productsCount}
            totalValueInStock={data?.total_value_in_stock ?? 0}
          />

          <EstoqueSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            selectedCount={selected.size}
            onClearSelection={() => setSelected(new Map())}
            handleGenerateLabel={handleGenerateLabel}
            generatingLabel={generatingLabel}
            onApplyFilter={(next) => {
              setFilter(next);
              goToPage(1);
            }}
            filter={filter}
            groupableCount={groupable.length}
            onGroup={handleGroup}
          />

          <div
            aria-busy={isPlaceholderData}
            className={`transition-opacity duration-300 ${
              isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            <EstoqueTable
              entries={entries}
              productsCount={productsCount}
              loading={isLoading}
              searchTerm={searchTerm}
              selected={selected}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
              selectingAll={selectingAll}
              footer={
                rowsCount > 0 && (
                  <div className="flex flex-col items-center justify-between gap-2 border-t border-border/60 px-4 py-2 sm:flex-row">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Mostrando {firstItem}–{lastItem} de{" "}
                      {rowsCount.toLocaleString("pt-BR")}{" "}
                      {rowsCount === 1 ? "item" : "itens"} ·{" "}
                      {productsCount.toLocaleString("pt-BR")}{" "}
                      {productsCount === 1 ? "produto" : "produtos"} no total
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

      <DialogGroupProducts
        open={groupOpen}
        products={groupable}
        onOpenChange={setGroupOpen}
        onGrouped={() =>
          // Os agrupados viraram variações: saem da seleção
          setSelected((prev) => {
            const next = new Map(prev);
            groupable.forEach((p) => next.delete(p.id));
            return next;
          })
        }
      />
    </div>
  );
}
