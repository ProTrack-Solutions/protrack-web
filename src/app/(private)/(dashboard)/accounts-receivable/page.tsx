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
import {
  AccountsReceivable as AccountReceivable,
  AccountsReceivablePaginationParams,
} from "@/interfaces/accounts-receivable.interface";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { CompanySettings } from "@/enum/company-settings.enum";
import { SendReceivableReminder } from "@/service/accounts-receivable.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { ReminderDialog } from "./components/ReminderDialog";
import { receivableActions } from "./components/receivableActions";

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

  const queryClient = useQueryClient();
  const { companySettings } = useCompanySettings();

  // Lembrete depende do WhatsApp ligado e, para parcela a vencer, de um
  // template de lembrete configurado (vencida usa o de venda vencida)
  const reminderCapability = {
    whatsappActive:
      companySettings?.find((cs) => cs.key === CompanySettings.IsWhatsappActive)
        ?.value !== false,
    dueTemplateConfigured: !!companySettings?.find(
      (cs) => cs.key === CompanySettings.DueReminderTemplate,
    )?.value,
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  // Baixa aberta pela linha: cliente e valor da parcela já preenchidos
  const [settling, setSettling] = useState<AccountReceivable | null>(null);
  const [reminderTarget, setReminderTarget] =
    useState<AccountReceivable | null>(null);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(
    null,
  );

  const refreshAll = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const handleBaixarPagamento = (conta: AccountReceivable) => {
    setSettling(conta);
  };

  const handleEnviarLembrete = async (conta: AccountReceivable) => {
    setReminderTarget(null);
    setSendingReminderId(conta.id);
    try {
      const result = await SendReceivableReminder(conta.id);
      toast.success(
        `${result.kind === "overdue" ? "Cobrança" : "Lembrete"} enviado para ${conta.customer_name} (${result.recipient_phone}).`,
      );
      refetch();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Não foi possível enviar o lembrete."),
      );
      refetch();
    } finally {
      setSendingReminderId(null);
    }
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
        reminderCapability={reminderCapability}
        sendingReminderId={sendingReminderId}
        onBaixarPagamento={handleBaixarPagamento}
        onEnviarLembrete={setReminderTarget}
      />

      <DataPagination
        currentPage={displayPage}
        totalPages={totalPages || 1}
        pageRange={pageRange}
        goToPage={goToPage}
      />

      <DialogReceipt
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refreshAll}
      />

      {settling && (
        <DialogReceipt
          key={settling.id}
          open
          onOpenChange={(open) => !open && setSettling(null)}
          prefill={{
            customerId: settling.customer_id,
            customerName: settling.customer_name,
            amount: settling.balance,
            dueDate: settling.due_date,
          }}
          onSuccess={refreshAll}
        />
      )}

      <ReminderDialog
        account={reminderTarget}
        kind={
          reminderTarget
            ? receivableActions(reminderTarget, reminderCapability).reminderKind
            : "due"
        }
        onCancel={() => setReminderTarget(null)}
        onConfirm={handleEnviarLembrete}
      />
    </div>
  );
}
