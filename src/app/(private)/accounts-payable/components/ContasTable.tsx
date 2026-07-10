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
import { EllipsisVertical } from "lucide-react";
import { ContaPagarStatusBadge } from "./StatusBadge";
import { BillsPayable } from "@/interfaces/bills-payable.interface";
import { DialogPaymentBill } from "@/components/DialogPaymentBill";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContasPagarTableProps {
  contas: BillsPayable[];
  onAgendarPagamento: (contaId: string) => void;
  onGerarPagamento: (contaId: string) => void;
}

export function ContasPagarTable({ contas }: ContasPagarTableProps) {
  const [paymentBillModal, setPaymentBillModal] = useState(false);
  const [selectPaymentBill, setSelectPaymentBill] = useState<BillsPayable>(
    {} as BillsPayable,
  );

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="cursor-pointer">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectPaymentBill(conta);
                                setPaymentBillModal(true);
                              }}
                            >
                              Pagar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Agendar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Gerar comprovante
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <DialogPaymentBill
        open={paymentBillModal}
        onOpenChange={setPaymentBillModal}
        conta={selectPaymentBill}
      />
    </Card>
  );
}
