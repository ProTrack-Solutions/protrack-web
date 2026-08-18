"use client";

import { useEffect, useState } from "react";
import { EstoqueSearch } from "./components/EstoqueSearch";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueTable } from "./components/EstoqueTable";
import { Header } from "@/components/Header";
import { useProducts } from "@/hooks/useProducts";
import { Loading } from "@/components/Loading";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { GenerateLabel } from "@/service/label.service";
import { toast } from "sonner";
import { FiltrosReceber } from "@/components/FilterPopOver";
import { format } from "date-fns";
import { GetProducts } from "@/service/products.service";

export default function Stock() {
  const { currentPage, displayPage, goToPage, pageRange, setTotalPages } =
    usePagination({
      totalPages: 1,
    });

  const [searchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<FiltrosReceber>({
    typeDate: "criacao",
  });

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
    Search: searchTerm,
    EndDate: (filter?.endDate && format(filter.endDate, "yyyy-MM-dd")) ?? "",
    OrderBy: "asc",
    StartDate:
      (filter?.startDate && format(filter.startDate, "yyyy-MM-dd")) ?? "",
  });

  useEffect(() => {
    refetch();
  }, [searchTerm, filter, refetch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    goToPage(1);
  };

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectingAll, setSelectingAll] = useState(false);

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
        EndDate:
          (filter?.endDate && format(filter.endDate, "yyyy-MM-dd")) ?? "",
        StartDate:
          (filter?.startDate && format(filter.startDate, "yyyy-MM-dd")) ?? "",
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
      await GenerateLabel(payload);
      toast.success("Etiquetas geradas com suscesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao gerar etiquetas!");
    }
  };

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

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
        <EstoqueSearch
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearchChange={handleSearch}
          handleGenerateLabel={handleGenerateLabel}
          onApplyFilter={setFilter}
          filter={filter}
        />
        <EstoqueTable
          products={products}
          productsCount={productsCount}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onSelectAll={handleSelectAll}
          selectingAll={selectingAll}
        />
        <DataPagination
          currentPage={displayPage}
          totalPages={totalPages || 1}
          pageRange={pageRange}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
}
