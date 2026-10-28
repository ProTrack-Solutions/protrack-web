"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CreditCard,
  HandCoins,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Receipt,
  Repeat,
  Shirt,
  ShoppingBag,
  Sparkles,
  Ticket,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kpi, Skeleton } from "@/components/DashCard";
import { DialogEditClients } from "@/components/DialogAlterClients";
import { useCustomerProfile, useCustomersChanged } from "@/hooks/useCustomerProfile";
import { CustomerInsights, CustomerProfile } from "@/interfaces/customer-profile.interface";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatDocument } from "@/utils/documentFormat";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { formatPhoneNational } from "@/utils/phoneFormat";
import { ActiveToggleDialog, ActiveToggleTarget } from "../components/ActiveToggleDialog";
import { CustomerAvatar } from "../components/CustomerAvatar";
import {
  PERIODS,
  RHYTHM,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  formatDateTime,
  formatDay,
  formatYmd,
  money,
  relativeDays,
  whatsappLink,
} from "../components/format";
import { profileToClient } from "../components/profileToClient";

const CREDIT_TYPES: Record<string, string> = {
  return: "Vale gerado na devolução",
  sale: "Usado em compra",
  sale_cancel: "Devolvido (venda cancelada)",
};

function Card({ title, icon, children, action }: { title: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="dash-in rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Fact({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
        {icon}
      </span>
      <span className="text-sm leading-relaxed text-foreground">{children}</span>
    </li>
  );
}

/** Mensagem de WhatsApp com o que o cliente costuma comprar */
function suggestionMessage(p: CustomerProfile) {
  const first = p.full_name.split(" ")[0];
  const product = p.insights.top_products[0]?.name;
  const size = p.insights.favorite_size?.value;
  if (!product) return `Oi ${first}! Temos novidades na loja, passa aqui para conferir.`;
  return `Oi ${first}! Chegaram novidades de ${product}${size ? ` no tamanho ${size}` : ""}. Quer que eu separe para você?`;
}

function BuyingProfile({ p, now }: { p: CustomerProfile; now: number }) {
  const ins: CustomerInsights = p.insights;
  const rhythm = RHYTHM[ins.rhythm];
  const wa = p.whatsapp ? whatsappLink(p.whatsapp) : null;
  const maxDay = Math.max(...ins.weekdays.map((d) => d.count), 1);

  if (ins.rhythm === "none") {
    return (
      <Card title="Perfil de compra" icon={<Sparkles className="h-4 w-4" />}>
        <p className="text-sm text-muted-foreground">
          Assim que {p.full_name.split(" ")[0]} fizer compras, aqui aparece o que ele mais compra, em que dias e
          horários costuma vir e de quanto em quanto tempo volta.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Perfil de compra"
      icon={<Sparkles className="h-4 w-4" />}
      action={
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rhythm.className}`}>{rhythm.label}</span>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ul className="space-y-4">
          {(ins.best_weekday !== null || ins.best_period) && (
            <Fact icon={<CalendarClock className="h-4 w-4" />}>
              Costuma comprar
              {ins.best_weekday !== null && (
                <>
                  {" "}
                  <strong>{ins.best_weekday === 0 || ins.best_weekday === 6 ? "aos" : "às"} {WEEKDAYS[ins.best_weekday]}s</strong>
                </>
              )}
              {ins.best_period && (
                <>
                  {ins.best_weekday !== null ? ", " : " "}
                  <strong>{ins.best_period === "night" ? "de madrugada" : `à ${PERIODS[ins.best_period]}`}</strong>
                </>
              )}
              .
            </Fact>
          )}
          <Fact icon={<Repeat className="h-4 w-4" />}>
            {ins.average_interval_days !== null ? (
              <>
                Volta a cada <strong>{Math.round(ins.average_interval_days)} dias</strong> em média. Última compra{" "}
                {relativeDays(p.last_purchase_at, now)}
                {ins.next_expected_at && ins.rhythm === "regular" && <>; a próxima deve ser por volta de {formatYmd(ins.next_expected_at)}</>}
                {ins.rhythm === "late" && <>, já passou do costume</>}
                {ins.rhythm === "away" && <>, faz bem mais tempo que o normal</>}.
              </>
            ) : (
              <>Fez a primeira compra {relativeDays(p.last_purchase_at, now)}. O ritmo aparece a partir da segunda compra.</>
            )}
          </Fact>
          {ins.favorite_payment && (
            <Fact icon={<CreditCard className="h-4 w-4" />}>
              Prefere pagar com <strong>{getPaymentMethodLabel(ins.favorite_payment.method).toLowerCase()}</strong> (
              {ins.favorite_payment.share.toLocaleString("pt-BR")}% das compras).
            </Fact>
          )}
          {(ins.favorite_size || ins.favorite_color) && (
            <Fact icon={<Shirt className="h-4 w-4" />}>
              {ins.favorite_size && (
                <>
                  Mais comprado no tamanho <strong>{ins.favorite_size.value}</strong>
                </>
              )}
              {ins.favorite_size && ins.favorite_color && "; "}
              {ins.favorite_color && (
                <>
                  {ins.favorite_size ? "cor" : "Cor"} preferida <strong>{ins.favorite_color.value.toLowerCase()}</strong>
                </>
              )}
              .
            </Fact>
          )}

          <li>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Compras por dia da semana</p>
            <ul className="grid grid-cols-7 gap-1.5" aria-label="Compras por dia da semana">
              {ins.weekdays.map((d) => {
                const best = d.weekday === ins.best_weekday;
                return (
                  <li
                    key={d.weekday}
                    title={`${WEEKDAYS[d.weekday]}: ${d.count} ${d.count === 1 ? "compra" : "compras"} (${money(d.total)})`}
                    className={`rounded-lg border px-1 py-2 text-center ${
                      best
                        ? "border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200"
                        : d.count > 0
                          ? "border-border bg-slate-50 text-foreground dark:bg-muted/40"
                          : "border-border text-muted-foreground"
                    }`}
                    style={d.count > 0 && !best ? { opacity: 0.55 + (0.45 * d.count) / maxDay } : undefined}
                  >
                    <span className="block text-[11px] font-medium">{WEEKDAYS_SHORT[d.weekday]}</span>
                    <span className="block text-sm font-bold tabular-nums">{d.count}</span>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">O que mais compra</p>
            {ins.top_products.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem itens (as compras foram devolvidas).</p>
            ) : (
              <ol className="space-y-2">
                {ins.top_products.map((prod, i) => (
                  <li key={prod.name} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-muted dark:text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">{prod.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        Última vez {relativeDays(prod.last_bought_at, now)}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-semibold tabular-nums">{prod.quantity} un.</span>
                      <span className="block text-xs text-muted-foreground tabular-nums">{money(prod.total)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {ins.top_categories.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Categorias</p>
              <ul className="space-y-2">
                {ins.top_categories.map((cat) => (
                  <li key={cat.name} className="text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {money(cat.total)} · {cat.share.toLocaleString("pt-BR")}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-muted">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${cat.share}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {wa && (ins.rhythm === "late" || ins.rhythm === "away") && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {p.full_name.split(" ")[0]} está demorando para voltar. Que tal chamar com uma novidade do que ele gosta?
          </p>
          <Button asChild variant="outline" className="bg-background">
            <a href={`${wa}?text=${encodeURIComponent(suggestionMessage(p))}`} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: p, isLoading, isError, error, refetch } = useCustomerProfile(id);
  const changed = useCustomersChanged();
  const [now] = useState(() => Date.now());
  const [editing, setEditing] = useState(false);
  const [toggle, setToggle] = useState<ActiveToggleTarget | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-16 w-96" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (isError || !p) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium">{getApiErrorMessage(error, "Não foi possível carregar o cliente.")}</p>
          <Button onClick={() => refetch()} className="cursor-pointer">Tentar novamente</Button>
        </div>
      </div>
    );
  }

  const wa = p.whatsapp ? whatsappLink(p.whatsapp) : null;
  const address = [
    [p.address_street, p.address_number].filter(Boolean).join(", "),
    p.address_complement,
    p.address_neighborhood,
    [p.address_city, p.address_state].filter(Boolean).join("/"),
    p.address_zipcode && `CEP ${p.address_zipcode}`,
  ].filter(Boolean);

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in">
        <Link
          href="/clients"
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Clientes
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CustomerAvatar name={p.full_name} size="lg" />
            <div>
              <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
                {p.full_name}
                {!p.active && (
                  <span className="rounded-full bg-slate-600 px-2.5 py-0.5 text-xs font-semibold text-white">Inativo</span>
                )}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Cliente desde {formatDay(p.created_at)}
                {p.cpf && ` · CPF ${formatDocument(p.cpf)}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {wa && (
              <Button asChild variant="outline">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            )}
            <Button variant="outline" className="cursor-pointer" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              className={`cursor-pointer ${p.active ? "text-red-700 hover:text-red-700 dark:text-red-400" : ""}`}
              onClick={() => setToggle({ id: p.id, name: p.full_name, active: p.active, balanceDue: p.balance_due })}
            >
              {p.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              {p.active ? "Inativar" : "Reativar"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          tone="primary"
          label="Total comprado"
          icon={<ShoppingBag className="h-4 w-4" />}
          loading={false}
          value={p.purchases_total}
          footer={`${p.purchases_count} ${p.purchases_count === 1 ? "compra" : "compras"}${p.returned_total > 0 ? ` · ${money(p.returned_total)} devolvidos` : ""}`}
          delay={0}
        />
        <Kpi
          tone="plain"
          label="Ticket médio"
          icon={<Receipt className="h-4 w-4" />}
          loading={false}
          value={p.average_ticket}
          footer={p.first_purchase_at ? `Primeira compra em ${formatDay(p.first_purchase_at)}` : "Ainda não comprou"}
          delay={60}
        />
        <Kpi
          tone="plain"
          label="Saldo devedor"
          icon={<HandCoins className="h-4 w-4" />}
          loading={false}
          value={p.balance_due}
          accent={p.overdue_total > 0 ? "text-red-700 dark:text-red-400" : "text-foreground"}
          footer={p.overdue_total > 0 ? `${money(p.overdue_total)} vencido` : p.balance_due > 0 ? "Nada vencido" : "Nada a receber"}
          delay={120}
        />
        <Kpi
          tone="plain"
          label="Vale-troca"
          icon={<Ticket className="h-4 w-4" />}
          loading={false}
          value={p.store_credit}
          accent={p.store_credit > 0 ? "text-pink-700 dark:text-pink-300" : "text-foreground"}
          footer={p.store_credit > 0 ? "Pode usar em qualquer compra" : "Sem crédito"}
          delay={180}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <BuyingProfile p={p} now={now} />

          <Card title="Últimas compras" icon={<ShoppingBag className="h-4 w-4" />}>
            {p.recent_sales.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma compra ainda.</p>
            ) : (
              <ul className="-my-3 divide-y divide-border">
                {p.recent_sales.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{s.products || "—"}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatDateTime(s.created_at)} · {getPaymentMethodLabel(s.payment_method)} · {s.items_count}{" "}
                        {s.items_count === 1 ? "item" : "itens"}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-semibold tabular-nums">{money(s.total_amount)}</span>
                      {s.returned_total > 0 && (
                        <span className="block text-xs text-amber-800 dark:text-amber-300">{money(s.returned_total)} devolvido</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Contato" icon={<Phone className="h-4 w-4" />}>
            <ul className="space-y-2.5 text-sm">
              {p.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  {formatPhoneNational(p.whatsapp)}
                </li>
              )}
              {p.mobile_phone && p.mobile_phone !== p.whatsapp && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {formatPhoneNational(p.mobile_phone)}
                </li>
              )}
              {p.email && (
                <li className="flex items-center gap-2 break-all">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {p.email}
                </li>
              )}
              {address.length > 0 && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{address.join(" · ")}</span>
                </li>
              )}
              {p.birth_date && (
                <li className="text-muted-foreground">Nascimento: {formatYmd(p.birth_date)}</li>
              )}
            </ul>
          </Card>

          <Card
            title="Parcelas em aberto"
            icon={<HandCoins className="h-4 w-4" />}
            action={
              p.open_installments.length > 0 && (
                <Link href="/accounts-receivable" className="text-xs font-medium text-blue-700 hover:underline dark:text-blue-300">
                  Receber
                </Link>
              )
            }
          >
            {p.open_installments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma parcela em aberto.</p>
            ) : (
              <ul className="-my-2 divide-y divide-border">
                {p.open_installments.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span>
                      <span className="block font-medium">
                        Parcela {i.installment_number}/{i.total_installments}
                      </span>
                      <span className={`block text-xs ${i.overdue ? "font-medium text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                        {i.overdue ? "Venceu" : "Vence"} em {formatYmd(i.due_date)}
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums">{money(i.balance)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Vale-troca" icon={<Ticket className="h-4 w-4" />}>
            {p.credit_movements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma movimentação de vale-troca.</p>
            ) : (
              <ul className="-my-2 divide-y divide-border">
                {p.credit_movements.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span>
                      <span className="block font-medium">
                        {CREDIT_TYPES[m.type] ?? m.type}
                        {m.return_number && (
                          <Link href={`/returns/${m.sale_return_id}`} className="ml-1 text-blue-700 hover:underline dark:text-blue-300">
                            nº {m.return_number}
                          </Link>
                        )}
                      </span>
                      <span className="block text-xs text-muted-foreground">{formatDateTime(m.created_at)}</span>
                    </span>
                    <span
                      className={`font-semibold tabular-nums ${
                        m.amount > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
                      }`}
                    >
                      {m.amount > 0 ? "+" : "−"} {money(Math.abs(m.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>

      <ActiveToggleDialog target={toggle} onClose={() => setToggle(null)} />

      {editing && (
        <DialogEditClients
          key={p.id}
          clients={profileToClient(p)}
          open
          onOpenChange={(open) => !open && setEditing(false)}
          onSaved={changed}
        />
      )}
    </div>
  );
}
