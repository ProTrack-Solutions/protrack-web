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
import { Fatura, faturas, brl } from "./types";

const statusStyle = (status: Fatura["status"]) => {
  const map: Record<Fatura["status"], string> = {
    paga: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
    pendente:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
    falhou:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
  };
  return map[status];
};

const statusLabel: Record<Fatura["status"], string> = {
  paga: "Paga",
  pendente: "Pendente",
  falhou: "Falhou",
};

export function PaymentHistoryTable() {
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
              <TableHead>Vencimento</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Recibo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faturas.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.numero}</TableCell>
                <TableCell className="text-muted-foreground">
                  {f.data}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {f.vencimento}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {f.metodo}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyle(f.status)}>
                    {statusLabel[f.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {brl(f.valor)}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
