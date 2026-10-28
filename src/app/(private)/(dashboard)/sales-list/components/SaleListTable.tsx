import { Fragment, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import Link from "next/link";
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Printer,
  Trash2,
} from "lucide-react";
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

import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { getSaleStatusLabel, getSaleStatusVariant } from "@/utils/salesStatus";
import { DialogAlterSale } from "@/components/DialogAlterSale";
import { DialogConfirm } from "@/components/DialogConfirm";
import { DeleteSale, GetSaleReceipt } from "@/service/sale.service";
import { ListSalesWithInstallmentsResponse } from "@/interfaces/sale.interface";

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
  const [openDialog, setOpenDialog] = useState(false);

  const [selectSale, setSelectSale] = useState<
    ListSalesWithInstallmentsResponse | undefined
  >(undefined);

  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);

  const [printingSaleId, setPrintingSaleId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handlePrintSale = async (saleId: string) => {
    setPrintingSaleId(saleId);
    try {
      const blob = await GetSaleReceipt(saleId);
      const url = window.URL.createObjectURL(blob);

      // Carrega o PDF num iframe invisível e abre a janela de impressão do navegador
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Limpeza depois que a janela de impressão já leu o arquivo
        setTimeout(() => {
          iframe.remove();
          window.URL.revokeObjectURL(url);
        }, 60_000);
      };
      document.body.appendChild(iframe);
    } catch (error) {
      console.log(error);
      toast.error(getApiErrorMessage(error, "Erro ao gerar recibo da venda"));
    } finally {
      setPrintingSaleId(null);
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    try {
      await DeleteSale(saleId);
      toast.success("Venda cancelada com sucesso");
      await queryClient.invalidateQueries({ queryKey: ["sales"] });
    } catch (error) {
      console.log(error);
      toast.error(getApiErrorMessage(error, "Erro ao cancelar venda"));
    }
  };

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
              <TableHead className="text-center w-40">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
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
                const isCanceled = venda.sale.sale_status === "canceled";
                const hasReturns = (venda.sale.returned_total ?? 0) > 0;
                // Venda com devolução ou gerada por troca não pode ser editada nem cancelada
                const locked = hasReturns || venda.sale.is_exchange_sale;
                const lockedTitle = venda.sale.is_exchange_sale
                  ? "Venda gerada por uma troca"
                  : "A venda tem trocas ou devoluções";

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
                          ? `- R$ ${formatCurrency(venda.sale.discount_amount)}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {formatCurrency(venda.sale.total_amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge
                            variant={getSaleStatusVariant(venda.sale.sale_status)}
                          >
                            {getSaleStatusLabel(venda.sale.sale_status)}
                          </Badge>
                          {hasReturns && (
                            <span
                              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30"
                              title={`R$ ${formatCurrency(venda.sale.returned_total)} devolvidos`}
                            >
                              {venda.sale.returned_total >= venda.sale.total_amount - 0.005
                                ? "Devolvida"
                                : "Devolução parcial"}
                            </span>
                          )}
                          {venda.sale.is_exchange_sale && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30">
                              Troca
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            title="Imprimir recibo"
                            disabled={printingSaleId === venda.sale.sale_id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintSale(venda.sale.sale_id);
                            }}
                          >
                            {printingSaleId === venda.sale.sale_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Printer className="h-4 w-4" />
                            )}
                          </Button>
                          {!isCanceled && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              title="Trocar ou devolver itens"
                              asChild
                            >
                              <Link
                                href={`/returns/new?sale=${venda.sale.sale_id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ArrowLeftRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            title={locked ? lockedTitle : "Editar venda"}
                            disabled={locked}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDialog(true);
                              setSelectSale(venda);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer text-destructive hover:text-destructive"
                            title={locked ? lockedTitle : "Cancelar venda"}
                            disabled={locked}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSaleToDelete(venda.sale.sale_id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Renderização condicional das parcelas aninhadas */}
                    {hasParcelas && isExpanded && (
                      <TableRow
                        key={`${venda.sale.sale_id}-parcelas`}
                        className="bg-muted/30 hover:bg-muted/30"
                      >
                        <TableCell colSpan={10} className="p-0">
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

      {saleToDelete && (
        <DialogConfirm
          id={saleToDelete}
          open={!!saleToDelete}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSaleToDelete(null);
          }}
          title="Cancelar venda?"
          description="Esta ação não pode ser desfeita. O estoque dos produtos será devolvido e as parcelas em aberto serão canceladas, abatendo o saldo devedor do cliente."
          onDelete={handleDeleteSale}
        />
      )}

      {selectSale && (
        <DialogAlterSale
          key={selectSale.sale.sale_id}
          setOpen={(isOpen) => {
            setOpenDialog(isOpen);
            if (!isOpen) setSelectSale(undefined);
          }}
          open={openDialog}
          sale={selectSale}
        />
      )}
    </Card>
  );
};