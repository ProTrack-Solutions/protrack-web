"use client";

import { Banknote, CreditCard, ListOrdered, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton, brl } from "@/components/DashCard";
import { useCashSession } from "@/hooks/useCashRegister";
import { DifferenceBadge } from "./DifferenceBadge";
import {
  CashComposition,
  MethodBreakdown,
  MovementsList,
} from "./SummaryParts";
import { formatDateTime, formatDuration, formatTime } from "./format";

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Relatório de um caixa: aberto agora ou já fechado */
export function SessionDetailDialog({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useCashSession(id);
  const session = data?.session;
  const closed = session?.status === "closed";

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {closed ? "Fechamento de caixa" : "Caixa aberto"}
          </DialogTitle>
          <DialogDescription>
            {session ? (
              <>
                {session.user_name && `${session.user_name} · `}
                {formatDateTime(session.opened_at)}
                {session.closed_at && ` até ${formatTime(session.closed_at)}`}
                {" · "}
                {formatDuration(session.opened_at, session.closed_at)}
              </>
            ) : (
              "Carregando..."
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading || !data || !session ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {closed && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Esperado", value: brl(session.expected_cash ?? 0) },
                  { label: "Contado", value: brl(session.counted_cash ?? 0) },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-xl border border-border/70 bg-muted/30 p-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {tile.label}
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                      {tile.value}
                    </p>
                  </div>
                ))}
                <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-muted/30 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Conferência
                  </p>
                  <div className="mt-1">
                    <DifferenceBadge value={session.difference ?? 0} />
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Section
                title="Por forma de pagamento"
                icon={<CreditCard className="h-4 w-4" />}
              >
                <MethodBreakdown summary={data.summary} />
              </Section>
              <Section
                title="Dinheiro na gaveta"
                icon={<Banknote className="h-4 w-4" />}
              >
                <CashComposition
                  openingAmount={session.opening_amount}
                  summary={data.summary}
                />
              </Section>
            </div>

            <Section
              title="Sangrias e suprimentos"
              icon={<ListOrdered className="h-4 w-4" />}
            >
              <MovementsList movements={data.movements} />
            </Section>

            {(session.opening_notes || session.closing_notes) && (
              <Section
                title="Observações"
                icon={<MessageSquare className="h-4 w-4" />}
              >
                <dl className="space-y-2 text-sm">
                  {session.opening_notes && (
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Abertura
                      </dt>
                      <dd className="text-foreground">
                        {session.opening_notes}
                      </dd>
                    </div>
                  )}
                  {session.closing_notes && (
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Fechamento
                      </dt>
                      <dd className="text-foreground">
                        {session.closing_notes}
                      </dd>
                    </div>
                  )}
                </dl>
              </Section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
