import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BellRing, Check, Loader2, MessageCircleWarning } from "lucide-react";

import { StatusBadge } from "./StatusBadge";
import { AccountsReceivable } from "@/interfaces/accounts-receivable.interface";
import {
  ReminderCapability,
  formatDateTime,
  formatISODate,
  receivableActions,
} from "./receivableActions";

interface ContasReceberTableProps {
  contas: AccountsReceivable[];
  reminderCapability: ReminderCapability;
  /** Parcela com lembrete sendo enviado agora */
  sendingReminderId?: string | null;
  onBaixarPagamento: (conta: AccountsReceivable) => void;
  onEnviarLembrete: (conta: AccountsReceivable) => void;
}

const brl = (value: number) =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function AccountsReceivableTable({
  contas,
  reminderCapability,
  sendingReminderId,
  onBaixarPagamento,
  onEnviarLembrete,
}: ContasReceberTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Contas a Receber</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Valor Restante</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dias em Atraso</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contas.map((conta) => {
              const actions = receivableActions(conta, reminderCapability);
              const sending = sendingReminderId === conta.id;
              return (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">
                    {conta.customer_name}
                    {conta.total_installments > 1 && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        Parcela {conta.installment_number}/{conta.total_installments}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{brl(conta.total_amount)}</TableCell>
                  <TableCell>{brl(conta.balance)}</TableCell>
                  <TableCell>{formatISODate(conta.due_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={conta.status} />
                  </TableCell>
                  <TableCell>
                    {conta.days_overdue > 0 ? (
                      <span className="text-destructive font-medium">
                        {conta.days_overdue} {conta.days_overdue === 1 ? "dia" : "dias"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {actions.settled ? (
                      <span className="text-sm text-muted-foreground">
                        {conta.status === "canceled" ? "Cancelada" : "Quitada"}
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onBaixarPagamento(conta)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                          {/* span segura o tooltip mesmo com o botão desabilitado */}
                          <span title={actions.reminderBlockedReason}>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`cursor-pointer ${
                                actions.overdue
                                  ? "border-destructive/40 text-destructive hover:text-destructive"
                                  : ""
                              }`}
                              disabled={!actions.canRemind || sending}
                              onClick={() => onEnviarLembrete(conta)}
                            >
                              {sending ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : actions.overdue ? (
                                <MessageCircleWarning className="h-4 w-4 mr-1" />
                              ) : (
                                <BellRing className="h-4 w-4 mr-1" />
                              )}
                              {actions.overdue ? "Cobrar" : "Lembrete"}
                            </Button>
                          </span>
                        </div>
                        {conta.last_reminder_at && (
                          <span className="text-xs text-muted-foreground">
                            Último lembrete {formatDateTime(new Date(conta.last_reminder_at))}
                          </span>
                        )}
                      </div>
                    )}
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
