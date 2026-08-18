"use client";

import { toast } from "sonner";
import { AccountsReceivableTable } from "./components/AccountsReceivableTable";
import { BillsFilters } from "./components/BillsFilters";
import { SummaryCard } from "./components/SummaryCard";
import { useAccountsReceivable } from "@/hooks/useAccountsReceivable";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { DialogReceipt } from "@/components/DialogReceipt";
import { useEffect, useState } from "react";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { FiltrosReceber } from "@/components/FilterPopOver";
import { AccountsReceivablePaginationParams } from "@/interfaces/accounts-receivable.interface";
import { format } from "date-fns";

export default function AccountsReceivable() {
  const { currentPage, displayPage, pageRange, goToPage, setTotalPages } =
    usePagination({
      totalPages: 1,
    });

  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [filter, setFilter] = useState<FiltrosReceber>({
    typeDate: "vencimento",
  });

  const isDueDate = filter.typeDate === "vencimento";

  const { accountsReceivable, loading, totalPages, refetch } =
    useAccountsReceivable({
      Page: currentPage,
      PerPage: 10,
      Search: search,
      status:
        statusFilter === "todos"
          ? undefined
          : (statusFilter as AccountsReceivablePaginationParams["status"]),
      StartDate:
        !isDueDate && filter?.startDate
          ? format(filter.startDate, "yyyy-MM-dd")
          : "",
      EndDate:
        !isDueDate && filter?.endDate
          ? format(filter.endDate, "yyyy-MM-dd")
          : "",
      startDueDate:
        isDueDate && filter?.startDate
          ? format(filter.startDate, "yyyy-MM-dd")
          : "",
      endDueDate:
        isDueDate && filter?.endDate
          ? format(filter.endDate, "yyyy-MM-dd")
          : "",
    });

  useEffect(() => {
    refetch();
  }, [currentPage, search, statusFilter, filter, refetch]);

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

  const handleSearch = (value: string) => {
    setSearch(value);
    goToPage(1);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBaixarPagamento = () => {
    toast("O pagamento foi registrado com sucesso.");
  };

  const handleEnviarLembrete = () => {
    toast("Lembrete de pagamento enviado para o cliente.");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Contas a Receber
          </h1>
          <p className="text-muted-foreground">
            Gerencie os valores a receber de clientes
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-2 cursor-pointer"
        >
          <HandCoins className="h-4 w-4" />
          Dar Baixa em Recebimento
        </Button>
      </div>

      <SummaryCard
        totalPendente={accountsReceivable?.amount ?? 0}
        totalVencido={accountsReceivable?.amount_overdue ?? 0}
        totalContas={accountsReceivable?.total_rows ?? 0}
      />

      <BillsFilters
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filter={filter}
        onApplyFilter={setFilter}
      />

      <AccountsReceivableTable
        contas={accountsReceivable?.data ?? []}
        onBaixarPagamento={handleBaixarPagamento}
        onEnviarLembrete={handleEnviarLembrete}
      />

      <DataPagination
        currentPage={displayPage}
        totalPages={totalPages || 1}
        pageRange={pageRange}
        goToPage={goToPage}
      />

      <DialogReceipt open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
