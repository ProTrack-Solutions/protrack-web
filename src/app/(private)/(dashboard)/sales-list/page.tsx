"use client";

import { useState, useMemo, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SaleListStats } from "./components/SaleListStats";
import { SaleListSearch } from "./components/SaleListSearch";
import { SaleListTable } from "./components/SaleListTable";
import { useSales } from "@/hooks/useSales";
import { Loading } from "@/components/Loading";
import { Header } from "@/components/Header";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";

export default function SalesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { currentPage, pageRange, goToPage } = usePagination({
    totalPages: 1,
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
  });

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const filteredVendas = useMemo(() => {
    return sales.filter((v) => {
      const matchSearch =
        v.sale.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        v.sale.sale_id.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "todos" || v.sale.sale_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, sales]);

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
      />

      <SaleListTable
        filteredVendas={filteredVendas}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        pageRange={pageRange}
        goToPage={goToPage}
      />
    </div>
  );
}
