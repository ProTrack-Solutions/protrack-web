"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  HandCoins,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Search,
  Ticket,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Kpi, Skeleton, TrendBadge, percentChange } from "@/components/DashCard";
import { DataPagination } from "@/components/DataPagination";
import { DialogEditClients } from "@/components/DialogAlterClients";
import {
  useBrowseCustomers,
  useCustomerOverview,
  useCustomersChanged,
} from "@/hooks/useCustomerProfile";
import { Client } from "@/interfaces/client.interface";
import {
  CustomerRow,
  CustomerSegment,
  CustomerSort,
  CustomerStatus,
} from "@/interfaces/customer-profile.interface";
import { GetCustomerProfile } from "@/service/customer-profile.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatDocument } from "@/utils/documentFormat";
import { getPageRange } from "@/utils/pagination";
import { formatPhoneNational } from "@/utils/phoneFormat";
import { toast } from "sonner";
import { ActiveToggleDialog, ActiveToggleTarget } from "./components/ActiveToggleDialog";
import { CustomerAvatar } from "./components/CustomerAvatar";
import { formatDay, money, relativeDays, whatsappLink } from "./components/format";
import { profileToClient } from "./components/profileToClient";

const PER_PAGE = 20;

const SEGMENTS: { value: CustomerSegment | "inactive"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "debtors", label: "Com saldo devedor" },
  { value: "overdue", label: "Em atraso" },
  { value: "credit", label: "Com vale-troca" },
  { value: "no_purchases", label: "Nunca compraram" },
  { value: "inactive", label: "Inativos" },
];

const SORTS: { value: CustomerSort; label: string }[] = [
  { value: "recent", label: "Cadastro mais recente" },
  { value: "name", label: "Nome (A–Z)" },
  { value: "last_purchase", label: "Compra mais recente" },
  { value: "total_spent", label: "Quem mais compra" },
  { value: "balance", label: "Maior saldo devedor" },
];

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const integer = (v: number) => Math.round(v).toLocaleString("pt-BR");

export default function ClientsPage() {
  const router = useRouter();
  const changed = useCustomersChanged();
  const [segment, setSegment] = useState<CustomerSegment | "inactive">("all");
  const [sort, setSort] = useState<CustomerSort>("recent");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [now] = useState(() => Date.now());
  const [toggleTarget, setToggleTarget] = useState<ActiveToggleTarget | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const status: CustomerStatus = segment === "inactive" ? "inactive" : "active";
  const overview = useCustomerOverview();
  const { data, isLoading, isError, error, isPlaceholderData, refetch } = useBrowseCustomers({
    status,
    segment: segment === "inactive" ? "all" : segment,
    sort,
    search: debouncedSearch || undefined,
    page,
    per_page: PER_PAGE,
  });
  const totalPages = data ? Math.max(Math.ceil(data.total / data.per_page), 1) : 1;
  const ov = overview.data;

  const pickSegment = (value: CustomerSegment | "inactive") => {
    setSegment(value);
    setPage(1);
  };

  // O diálogo de edição usa o cadastro completo: busca o perfil antes de abrir
  const openEdit = async (row: CustomerRow) => {
    try {
      setEditing(profileToClient(await GetCustomerProfile(row.id)));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Não foi possível abrir o cadastro."));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="mt-1 text-muted-foreground">
            Quem compra com você, quanto deve e o que tem de vale-troca.
          </p>
        </div>
        <Button asChild className="h-10">
          <Link href="/client-registration">
            <UserPlus className="h-4 w-4" />
            Novo cliente
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          tone="primary"
          label="Clientes ativos"
          icon={<Users className="h-4 w-4" />}
          loading={overview.isLoading}
          value={ov?.active_count ?? 0}
          format={integer}
          footer={
            <span className="flex flex-wrap items-center gap-2">
              {ov?.new_this_month ?? 0} novos este mês
              <TrendBadge value={percentChange(ov?.new_this_month ?? 0, ov?.new_last_month ?? 0)} />
            </span>
          }
          delay={0}
        />
        <Kpi
          tone="plain"
          label="A receber de clientes"
          icon={<HandCoins className="h-4 w-4" />}
          loading={overview.isLoading}
          value={ov?.debt_total ?? 0}
          footer={`${ov?.debtors_count ?? 0} ${ov?.debtors_count === 1 ? "cliente com saldo" : "clientes com saldo"}`}
          delay={60}
        />
        <Kpi
          tone="plain"
          label="Em atraso"
          icon={<AlertTriangle className="h-4 w-4" />}
          loading={overview.isLoading}
          value={ov?.overdue_total ?? 0}
          accent={(ov?.overdue_total ?? 0) > 0 ? "text-red-700 dark:text-red-400" : "text-foreground"}
          footer={`${ov?.overdue_count ?? 0} ${ov?.overdue_count === 1 ? "cliente com parcela vencida" : "clientes com parcela vencida"}`}
          delay={120}
        />
        <Kpi
          tone="plain"
          label="Vale-troca em aberto"
          icon={<Ticket className="h-4 w-4" />}
          loading={overview.isLoading}
          value={ov?.credit_total ?? 0}
          footer={`${ov?.credit_count ?? 0} ${ov?.credit_count === 1 ? "cliente com crédito" : "clientes com crédito"} · ${ov?.recent_buyers ?? 0} compraram em 30 dias`}
          delay={180}
        />
      </div>

      <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="radiogroup" aria-label="Filtro" className="flex flex-wrap gap-1.5">
            {SEGMENTS.map((option) => {
              const active = option.value === segment;
              const count =
                option.value === "debtors"
                  ? ov?.debtors_count
                  : option.value === "overdue"
                    ? ov?.overdue_count
                    : option.value === "credit"
                      ? ov?.credit_count
                      : option.value === "inactive"
                        ? ov?.inactive_count
                        : option.value === "all"
                          ? ov?.active_count
                          : undefined;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => pickSegment(option.value)}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {option.label}
                  {!!count && <span className="ml-1.5 tabular-nums opacity-90">{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={sort}
              onValueChange={(v) => {
                setSort(v as CustomerSort);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full sm:w-52" aria-label="Ordenar">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Nome, CPF, telefone ou e-mail"
                aria-label="Buscar clientes"
                className="h-9 pl-9"
              />
            </div>
          </div>
        </div>

        {isError && !data ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium">{getApiErrorMessage(error, "Não foi possível carregar os clientes.")}</p>
            <Button onClick={() => refetch()} className="cursor-pointer">Tentar novamente</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : data && data.data.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-foreground">
              {debouncedSearch || segment !== "all" ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
            </p>
            {!debouncedSearch && segment === "all" && (
              <Button asChild className="mt-2">
                <Link href="/client-registration"><UserPlus className="h-4 w-4" />Cadastrar o primeiro</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Cliente</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Contato</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Compras</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Saldo devedor</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Vale-troca</th>
                  <th className="w-12 px-3 py-2.5"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((c) => {
                  const phone = c.whatsapp || c.mobile_phone;
                  const wa = c.whatsapp ? whatsappLink(c.whatsapp) : null;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/clients/${c.id}`)}
                      className={`cursor-pointer border-t border-border transition-colors hover:bg-slate-50 dark:hover:bg-muted/50 ${
                        c.active ? "" : "text-muted-foreground"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <CustomerAvatar name={c.full_name} />
                          <div className="min-w-0">
                            <Link
                              href={`/clients/${c.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-foreground hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              {c.full_name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {formatDocument(c.cpf) || "Sem CPF"}
                              {c.city && ` · ${c.city}${c.state ? `/${c.state}` : ""}`}
                              {!c.active && " · inativo"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {phone ? (
                          <p className="flex items-center gap-1.5">
                            {formatPhoneNational(phone)}
                            {wa && (
                              <a
                                href={wa}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="Abrir conversa no WhatsApp"
                                className="rounded p-0.5 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </p>
                        ) : (
                          <p className="text-muted-foreground">—</p>
                        )}
                        {c.email && <p className="max-w-56 truncate text-xs text-muted-foreground">{c.email}</p>}
                      </td>
                      <td className="px-3 py-3">
                        {c.purchases_count > 0 ? (
                          <>
                            <p className="font-medium tabular-nums">
                              {money(c.purchases_total)}{" "}
                              <span className="text-xs font-normal text-muted-foreground">
                                em {c.purchases_count} {c.purchases_count === 1 ? "compra" : "compras"}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground" title={formatDay(c.last_purchase_at)}>
                              Última {relativeDays(c.last_purchase_at, now)}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">Nunca comprou</p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {c.balance_due > 0 ? (
                          <>
                            <p className="font-semibold tabular-nums text-foreground">{money(c.balance_due)}</p>
                            {c.overdue_total > 0 && (
                              <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                {money(c.overdue_total)} vencido
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {c.store_credit > 0 ? (
                          <span className="font-semibold text-pink-700 dark:text-pink-300">{money(c.store_credit)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" aria-label={`Ações de ${c.full_name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/clients/${c.id}`}>
                                <Users className="h-4 w-4" />
                                Ver perfil
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => openEdit(c)}>
                              <Pencil className="h-4 w-4" />
                              Editar cadastro
                            </DropdownMenuItem>
                            {wa && (
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <a href={wa} target="_blank" rel="noreferrer">
                                  <MessageCircle className="h-4 w-4" />
                                  Conversar no WhatsApp
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className={`cursor-pointer ${c.active ? "text-red-700 focus:text-red-700 dark:text-red-400" : ""}`}
                              onSelect={() =>
                                setToggleTarget({ id: c.id, name: c.full_name, active: c.active, balanceDue: c.balance_due })
                              }
                            >
                              {c.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              {c.active ? "Inativar" : "Reativar"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="border-t border-border p-3">
            <DataPagination
              currentPage={page}
              totalPages={totalPages}
              pageRange={getPageRange(page, totalPages)}
              goToPage={setPage}
            />
          </div>
        )}
      </section>

      <ActiveToggleDialog target={toggleTarget} onClose={() => setToggleTarget(null)} />

      {editing && (
        <DialogEditClients
          key={editing.id}
          clients={editing}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          onSaved={changed}
        />
      )}
    </div>
  );
}
