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
import { Check, Mail } from "lucide-react";

import { StatusBadge } from "./StatusBadge";
import { AccountsReceivable } from "@/interfaces/accounts-receivable.interface";

interface ContasReceberTableProps {
  contas: AccountsReceivable[];
  onBaixarPagamento: (contaId: string) => void;
  onEnviarLembrete: (contaId: string) => void;
}

export function AccountsReceivableTable({
  contas,
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
            {contas.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell className="font-medium">
                  {conta.customer_name}
                </TableCell>
                <TableCell>
                  R${" "}
                  {conta.total_amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  R${" "}
                  {conta.balance.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  {new Date(conta.due_date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={conta.status} />
                </TableCell>
                <TableCell>
                  {conta.days_overdue > 0 ? (
                    <span className="text-destructive font-medium">
                      {conta.days_overdue} dias
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {conta.status !== "pago" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onBaixarPagamento(conta.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEnviarLembrete(conta.id)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Lembrete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
