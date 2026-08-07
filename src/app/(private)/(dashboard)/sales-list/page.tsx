"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { SaleListStats } from "./components/SaleListStats";
import { SaleListSearch } from "./components/SaleListSearch";
import { SaleListTable } from "./components/SaleListTable";
import { useSales } from "@/hooks/useSales";
import { Loading } from "@/components/Loading";
import { Header } from "@/components/Header";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { FiltrosReceber } from "@/components/FilterPopOver";
import { SalePaginationParams } from "@/interfaces/sale.interface";

export default function SalesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { currentPage, displayPage, pageRange, goToPage, setTotalPages } =
    usePagination({
      totalPages: 1,
    });

  const [filter, setFilter] = useState<FiltrosReceber>({
    typeDate: "criacao",
  });

  const {
    sales,
    salesCanceled,
    salesCount,
    totalInvoiced,
    totalPending,
    loading,
    totalPages,
    refetch,
  } = useSales({
    Page: currentPage,
    PerPage: 10,
    Search: search,
    sortBy: "sale_at",
    OrderBy: "desc",
    saleStatus:
      statusFilter === "todos"
        ? undefined
        : (statusFilter as SalePaginationParams["saleStatus"]),
    paymentMethod:
      paymentMethodFilter === "todos"
        ? undefined
        : (paymentMethodFilter as SalePaginationParams["paymentMethod"]),
    saleEndDate:
      (filter?.endDate && format(filter.endDate, "yyyy-MM-dd")) ?? "",
    saleStartDate:
      (filter?.startDate && format(filter.startDate, "yyyy-MM-dd")) ?? "",
  });

  useEffect(() => {
    refetch();
  }, [
    currentPage,
    search,
    filter,
    statusFilter,
    paymentMethodFilter,
    refetch,
  ]);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Header title="Vendas" text="Gerencie todas as vendas realizadas" />
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <SaleListStats
        salesCanceled={salesCanceled || 0}
        salesCount={salesCount}
        totalInvoiced={totalInvoiced || 0}
        totalPending={totalPending || 0}
      />

      <SaleListSearch
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentMethodFilter={paymentMethodFilter}
        setPaymentMethodFilter={setPaymentMethodFilter}
        filter={filter}
        onApplyFilter={setFilter}
      />

      <SaleListTable
        filteredVendas={sales}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
      <DataPagination
        currentPage={displayPage}
        totalPages={totalPages || 1}
        pageRange={pageRange}
        goToPage={goToPage}
      />
    </div>
  );
}
