import { useMemo, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  CreditCard,
  Package,
  Receipt,
  Banknote,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ListSalesWithInstallmentsResponse } from "@/interfaces/sales-list.interface";
import { PaymentMethod } from "@/enum/methodPayments";
import { getPaymentMethodLabel } from "@/app/utils/paymentMethodFormat";
import { formatCurrency } from "@/app/utils/currencyFormat";
import { SaleStatus } from "@/app/utils/statusSales";
import { getSaleStatusLabel } from "@/app/utils/salesStatus";

interface DialogAlterVendaProps {
  sale: ListSalesWithInstallmentsResponse;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function DialogAlterSale({
  sale,
  open,
  setOpen,
}: DialogAlterVendaProps) {
  const dataFormatada = useMemo(() => {
    try {
      return new Date(sale.sale.sale_at).toLocaleDateString("pt-BR");
    } catch {
      return "—";
    }
  }, [sale.sale.sale_at]);

  const onSalvar = () => {
    toast.success("Venda atualizada com sucesso!");
    setOpen(false);
  };

  const paymentMethodOptions = Object.entries(PaymentMethod).map(
    ([key, value]) => ({
      id: key,
      name: value,
    }),
  );

  const saleStatusOptions = Object.entries(SaleStatus).map(([key, value]) => ({
    id: key,
    name: value,
  }));

  const [paymentMethod, setPaymentMethod] = useState(sale.sale.payment_method);

  const [saleStatus, setSaleStatus] = useState(sale.sale.sale_status);

  const [downPayment, setDownPayment] = useState<number>(0);
  const [installmentsQty, setInstallmentsQty] = useState<number>(
    sale.sale.installments_count ?? 1,
  );
  const [dueDay, setDueDay] = useState<number>(10);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Editar Venda #{sale.sale.sale_id}
          </DialogTitle>
          <DialogDescription>
            Altere as informações da venda abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Informações gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-3.5 w-3.5" /> Cliente
              </Label>
              <Input
                value={sale.sale.customer_name}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Data da Venda
              </Label>
              <Input value={dataFormatada} readOnly className="bg-muted" />
            </div>
          </div>

          <Separator />

          {/* Valores */}
          <div>
            <h4 className="text-sm font-medium mb-3">Resumo Financeiro</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xs text-muted-foreground">Subtotal</p>
                <p className="text-sm font-semibold">
                  R$ {formatCurrency(Number(sale.sale.subtotal ?? 0))}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xs text-muted-foreground">Desconto</p>
                <p className="text-sm font-semibold text-destructive">
                  - {Number(sale.sale.discount_amount ?? 0)}%
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-semibold">
                  R$ {formatCurrency(Number(sale.sale.total_amount ?? 0))}
                </p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Total c/ Desconto
                </p>
                <p className="text-sm font-bold text-primary">
                  R$ {formatCurrency(sale.sale.total_amount)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Editáveis: Status e Pagamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status da Venda</Label>
              <Select
                value={saleStatus}
                onValueChange={(value) => setSaleStatus(value as SaleStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {saleStatusOptions.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {getSaleStatusLabel(m.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Forma de Pagamento
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {getPaymentMethodLabel(m.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sale.sale.payment_method && (
                <p className="text-xs text-muted-foreground">
                  Atual: {getPaymentMethodLabel(sale.sale.payment_method)}
                </p>
              )}
            </div>
          </div>

          {paymentMethod === PaymentMethod.Installments && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Entrada</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={downPayment}
                    onChange={(e) =>
                      setDownPayment(parseFloat(e.target.value) || 0)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quantidade de Parcelas</Label>

                <Select
                  onValueChange={(value) =>
                    setInstallmentsQty(parseInt(value) || 1)
                  }
                  value={String(installmentsQty)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dia de Vencimento</Label>

                <Select
                  onValueChange={(value) => setDueDay(parseInt(value) || 1)}
                  value={String(dueDay)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>

                  <SelectContent>
                    {[1, 5, 10, 15, 20, 25, 30].map((dia) => (
                      <SelectItem key={dia} value={String(dia)}>
                        Dia {dia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {paymentMethod === PaymentMethod.CreditCard && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantidade de Parcelas</Label>
                <Input
                  type="number"
                  min="1"
                  value={installmentsQty}
                  onChange={(e) =>
                    setInstallmentsQty(parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>
          )}

          {/* Parcelas */}
          {sale.sale.installments_count && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Qtd. Parcelas
                  </Label>
                  <p className="text-sm font-medium">
                    {sale.sale.installments_count ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Total Parcelado
                  </Label>
                  <p className="text-sm font-medium">
                    {sale.sale.installment_total_amount != null
                      ? `R$ ${formatCurrency(Number(sale.sale.installment_total_amount))}`
                      : "—"}
                  </p>
                </div>
              </div>

              {sale.sale.installments_count &&
                sale.sale.installments_count > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                      <Banknote className="h-3.5 w-3.5" /> Detalhes das Parcelas
                    </h4>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-20">Nº</TableHead>
                            <TableHead>Vencimento</TableHead>
                            <TableHead className="text-right w-28">
                              Valor
                            </TableHead>
                            <TableHead className="text-center w-28">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sale.installment.map((parcela) => {
                            const parcelaStatusConfig: Record<
                              string,
                              {
                                label: string;
                                variant: "default" | "outline" | "destructive";
                                icon: React.ReactNode;
                              }
                            > = {
                              pago: {
                                label: "Pago",
                                variant: "default",
                                icon: <CheckCircle2 className="h-3 w-3" />,
                              },
                              pendente: {
                                label: "Pendente",
                                variant: "outline",
                                icon: <Clock className="h-3 w-3" />,
                              },
                              atrasado: {
                                label: "Atrasado",
                                variant: "destructive",
                                icon: <AlertTriangle className="h-3 w-3" />,
                              },
                            };
                            const pStatus =
                              parcelaStatusConfig[parcela.installment_status] ??
                              parcelaStatusConfig.pendente;
                            return (
                              <TableRow key={parcela.installment_number}>
                                <TableCell className="font-mono text-xs">
                                  {parcela.installment_number}/
                                  {sale.sale.installments_count}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {new Date(
                                    parcela.due_date,
                                  ).toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  R${" "}
                                  {formatCurrency(parcela.installment_balance)}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    variant={pStatus.variant}
                                    className="gap-1 text-xs"
                                  >
                                    {pStatus.icon}
                                    {pStatus.label}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
            </>
          )}

          <Separator />

          {/* Itens da venda */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> Itens da Venda
            </h4>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center w-20">Qtd</TableHead>
                    <TableHead className="text-right w-28">
                      Preço Unit.
                    </TableHead>
                    <TableHead className="text-center w-24">
                      Desc. (%)
                    </TableHead>
                    <TableHead className="text-right w-28">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.products.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.product_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {formatCurrency(Number(item.unit_price ?? 0))}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.item_discount}%
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R${" "}
                        {formatCurrency(
                          Number(item.quantity ?? 0) *
                            Number(item.unit_price ?? 0),
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onSalvar}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
