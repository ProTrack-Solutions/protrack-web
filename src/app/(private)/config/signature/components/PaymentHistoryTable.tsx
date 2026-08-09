"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { brl } from "./types";
import { InvoiceHistory } from "@/interfaces/invoice-history.interface";
import { PaymentMethodDetails } from "@/interfaces/subscription-manager.interface";

// Status "de exibição" agrupados a partir do que a API persiste em
// invoice_history.status ('approved', 'rejected', 'refunded', 'in_process').
type DisplayStatus = "paga" | "pendente" | "falhou";

const toDisplayStatus = (status: string): DisplayStatus => {
  if (status === "approved") return "paga";
  if (status === "rejected") return "falhou";
  return "pendente"; // in_process, refunded, ou qualquer status inesperado
};

const statusStyle: Record<DisplayStatus, string> = {
  paga: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
  pendente:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
  falhou:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
};

const statusLabel: Record<DisplayStatus, string> = {
  paga: "Paga",
  pendente: "Pendente",
  falhou: "Falhou",
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
};

interface PaymentHistoryTableProps {
  invoices: InvoiceHistory[];
  loading?: boolean;
  paymentMethod?: PaymentMethodDetails | null;
}

export function PaymentHistoryTable({
  invoices,
  loading,
  paymentMethod,
}: PaymentHistoryTableProps) {
  // O histórico não guarda o método usado em cada fatura individualmente,
  // então mostramos o método atual da assinatura como melhor aproximação.
  const metodoLabel = paymentMethod
    ? `${paymentMethod.card_brand.toUpperCase()} •••• ${paymentMethod.card_last4}`
    : "—";

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Histórico de pagamentos</CardTitle>
        <CardDescription>
          Todas as faturas emitidas para sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Recibo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  Carregando faturas...
                </TableCell>
              </TableRow>
            )}

            {!loading && invoices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhuma fatura encontrada.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              invoices.map((invoice) => {
                const status = toDisplayStatus(invoice.status);
                return (
                  <TableRow key={invoice.id}>
                    <TableCell
                      className="font-medium max-w-[180px] truncate"
                      title={invoice.external_payment_id}
                    >
                      {invoice.external_payment_id}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.created_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {metodoLabel}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusStyle[status]}
                      >
                        {statusLabel[status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {brl(invoice.amount_cents / 100)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast("Download iniciado")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
