import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, CreditCard } from "lucide-react";
import { ContaPagarStatusBadge } from "./StatusBadge";
import { BillsPayable } from "@/interfaces/bills-payable.interface";

interface ContasPagarTableProps {
  contas: BillsPayable[];
  onMarcarPago: (contaId: string) => void;
  onAgendarPagamento: (contaId: string) => void;
  onGerarPagamento: (contaId: string) => void;
}

export function ContasPagarTable({
  contas,
  onMarcarPago,
  onAgendarPagamento,
  onGerarPagamento,
}: ContasPagarTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Contas a Pagar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
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
                  {conta.vendor_name}
                </TableCell>
                <TableCell>{conta.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{conta.category_name}</Badge>
                </TableCell>
                <TableCell>
                  R${" "}
                  {conta.amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  {new Date(conta.due_date).toLocaleDateString("pt-BR")}
                  {conta.scheduled_date && (
                    <div className="text-xs text-muted-foreground">
                      Agendado:{" "}
                      {new Date(conta.scheduled_date).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <ContaPagarStatusBadge status={conta.status} />
                </TableCell>
                <TableCell>
                  {1 > 0 ? (
                    <span className="text-destructive font-medium">
                      {1} dias
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {conta.status !== "pago" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMarcarPago(conta.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Pagar
                        </Button>
                        {conta.status !== "agendado" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAgendarPagamento(conta.id)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Agendar
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGerarPagamento(conta.id)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Comprovante
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
