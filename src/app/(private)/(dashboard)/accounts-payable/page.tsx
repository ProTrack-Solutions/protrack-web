"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContasPagarTable } from "./components/ContasTable";
import { ContasPagarFiltrosPesquisa } from "./components/FiltrosPesquisa";
import { ContasPagarResumoCards } from "./components/ResumoCards";
import { useBillsPayable } from "@/hooks/useBillsPayable";
import { useBillsCategories } from "@/hooks/useBillsCategories";
import { Loading } from "@/components/Loading";
import { DialogNewAccountsPayable } from "@/components/DialogAccountsPayable";
import { DataPagination } from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { FiltrosReceber } from "@/components/FilterPopOver";
import { BillsPayablePaginationParams } from "@/interfaces/bills-payable.interface";
import { format } from "date-fns";

export default function AccountsPayable() {
  const { currentPage, displayPage, pageRange, goToPage, setTotalPages } =
    usePagination({
      totalPages: 1,
    });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [filter, setFilter] = useState<FiltrosReceber>({
    typeDate: "vencimento",
  });

  const dateRange = {
    start: filter?.startDate ? format(filter.startDate, "yyyy-MM-dd") : "",
    end: filter?.endDate ? format(filter.endDate, "yyyy-MM-dd") : "",
  };

  const {
    billsPayable,
    billsPayableCount,
    loading,
    totalOverdue,
    totalPayable,
    totalScheduled,
    totalPages,
    refetch,
  } = useBillsPayable({
    Page: currentPage,
    PerPage: 10,
    Search: search,
    status:
      statusFilter === "todos"
        ? undefined
        : (statusFilter as BillsPayablePaginationParams["status"]),
    StartDate: filter.typeDate === "criacao" ? dateRange.start : "",
    EndDate: filter.typeDate === "criacao" ? dateRange.end : "",
    startDueDate: filter.typeDate === "vencimento" ? dateRange.start : "",
    endDueDate: filter.typeDate === "vencimento" ? dateRange.end : "",
    startScheduledDate:
      filter.typeDate === "agendamento" ? dateRange.start : "",
    endScheduledDate: filter.typeDate === "agendamento" ? dateRange.end : "",
    startPaymentDate: filter.typeDate === "pagamento" ? dateRange.start : "",
    endPaymentDate: filter.typeDate === "pagamento" ? dateRange.end : "",
  });

  const { billsCategories } = useBillsCategories();

  const categorias = useMemo(
    () => (billsCategories ?? []).map((categoria) => categoria.name),
    [billsCategories],
  );

  // A API não suporta filtro por categoria na listagem paginada, então o
  // recorte é feito no lado do cliente sobre a página atual de resultados.
  const contas = useMemo(() => {
    if (categoriaFilter === "todas") return billsPayable;
    return billsPayable.filter(
      (conta) => conta.category_name === categoriaFilter,
    );
  }, [billsPayable, categoriaFilter]);

  useEffect(() => {
    refetch();
  }, [currentPage, search, statusFilter, filter, refetch]);

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

  const [newOpenDialog, setNewOpenDialog] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Contas a Pagar
          </h1>
          <p className="text-muted-foreground">
            Gerencie as contas e pagamentos a fornecedores
          </p>
        </div>
        <Button
          onClick={() => setNewOpenDialog(true)}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <ContasPagarResumoCards
        totalPendente={totalPayable}
        totalVencido={totalOverdue}
        totalAgendado={totalScheduled}
        totalContas={billsPayableCount}
      />

      <ContasPagarFiltrosPesquisa
        searchTerm={search}
        onSearchTermChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoriaFilter={categoriaFilter}
        onCategoriaFilterChange={setCategoriaFilter}
        categorias={categorias}
        filter={filter}
        onApplyFilter={setFilter}
      />

      <ContasPagarTable
        contas={contas}
        onAgendarPagamento={() => {}}
        onGerarPagamento={() => {}}
      />

      <DataPagination
        currentPage={displayPage}
        totalPages={totalPages || 1}
        pageRange={pageRange}
        goToPage={goToPage}
      />

      <DialogNewAccountsPayable
        open={newOpenDialog}
        onOpenChange={setNewOpenDialog}
      />
    </div>
  );
}
