import { Fragment } from "react";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListSalesWithInstallmentsResponse } from "@/interfaces/sales-list.interface";
import { getPaymentMethodLabel } from "@/app/utils/paymentMethodFormat";
import {
  getSaleStatusLabel,
  getSaleStatusVariant,
} from "@/app/utils/salesStatus";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface SaleListTableProps {
  filteredVendas: ListSalesWithInstallmentsResponse[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

export const SaleListTable = ({
  filteredVendas,
  expandedId,
  setExpandedId,
}: SaleListTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Sub total</TableHead>
              <TableHead className="text-right">Desconto</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhuma venda encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredVendas.map((venda) => {
                const hasParcelas =
                  !!venda.sale.installments_count &&
                  venda.sale.installments_count > 0;
                const isExpanded = expandedId === venda.sale.sale_id;

                return (
                  <Fragment key={venda.sale.sale_id}>
                    <TableRow
                      className={`hover:bg-muted/50 ${hasParcelas ? "cursor-pointer" : ""}`}
                      onClick={() =>
                        hasParcelas &&
                        setExpandedId(isExpanded ? null : venda.sale.sale_id)
                      }
                    >
                      <TableCell>
                        {hasParcelas ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )
                        ) : null}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {venda.sale.sale_id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {venda.sale.customer_name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(venda.sale.sale_at).toLocaleDateString(
                          "pt-BR",
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getPaymentMethodLabel(venda.sale.payment_method)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {formatCurrency(venda.sale.subtotal)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-destructive">
                        {venda.sale.discount_amount > 0
                          ? `-${venda.sale.discount_amount}%`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {formatCurrency(venda.sale.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getSaleStatusVariant(venda.sale.sale_status)}
                        >
                          {getSaleStatusLabel(venda.sale.sale_status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Renderização condicional das parcelas aninhadas */}
                    {hasParcelas && isExpanded && (
                      <TableRow
                        key={`${venda.sale.sale_id}-parcelas`}
                        className="bg-muted/30 hover:bg-muted/30"
                      >
                        <TableCell colSpan={9} className="p-0">
                          <div className="px-6 py-4">
                            <p className="text-sm font-semibold mb-3">
                              Parcelas ({venda.sale.installments_count!}x)
                            </p>
                            <div className="rounded-md border bg-background overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-20">Nº</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead className="text-right">
                                      Valor
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {venda.installment!.map((p) => {
                                    return (
                                      <TableRow key={p.installment_number}>
                                        <TableCell className="font-medium">
                                          {p.installment_number}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          {new Date(
                                            p.due_date,
                                          ).toLocaleDateString("pt-BR")}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                          R${" "}
                                          {formatCurrency(
                                            p.installment_balance,
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={getSaleStatusVariant(
                                              p.installment_status,
                                            )}
                                          >
                                            {getSaleStatusLabel(
                                              p.installment_status,
                                            )}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
