"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarClock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Wallet,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BillsPayable } from "@/interfaces/bills-payable.interface";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { PaymentBill } from "@/service/bills-payable.service";

interface DialogPaymentBill {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta: BillsPayable | null;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export const DialogPaymentBill = ({
  open,
  onOpenChange,
  conta,
}: DialogPaymentBill) => {
  const [amountPaid, setAmountPaid] = useState<number>(conta?.amount || 0);
  const [paymentDate, setPaymentDate] = useState<string>(todayISO());
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const { paymentMethods } = usePaymentMethods();

  const diferenca = useMemo(() => {
    if (!conta) return 0;
    return amountPaid - conta.amount;
  }, [amountPaid, conta]);

  const statusPagamento = useMemo(() => {
    if (!conta) return null;
    if (amountPaid <= 0) return null;
    if (amountPaid < conta.amount_paid)
      return { label: "Pagamento parcial", variant: "warning" as const };
    if (amountPaid === conta.amount_paid)
      return { label: "Quitação total", variant: "success" as const };
    return { label: "Pagamento com troco", variant: "info" as const };
  }, [amountPaid, conta]);

  const handlePaymentBill = async () => {
    if (!conta) return;
    if (amountPaid <= 0) {
      toast("Informe um valor de pagamento maior que zero.");
      return;
    }
    if (!paymentDate) {
      toast("Selecione a data do pagamento.");
      return;
    }
    if (!paymentMethodId) {
      toast("Selecione a forma de pagamento.");
      return;
    }
    try {
      await PaymentBill(conta?.id || "", {
        amount_paid: amountPaid,
        payment_date: paymentDate,
        payment_method_id: paymentMethodId,
      });
      toast.success("Venda paga com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao pagar a conta!");
    } finally {
      onOpenChange(false);
      setAmountPaid(0);
      setPaymentMethodId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl pb-4 px-0 pt-0 overflow-hidden">
        <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-5 text-primary-foreground">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-foreground/15 p-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-primary-foreground text-xl">
                  Registrar Pagamento
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Confirme os dados para dar baixa nesta conta.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
          {conta && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {conta.vendor_name}
                </p>
                <Badge variant="outline" className="text-xs">
                  Conta #{conta.id}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {conta.description}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Valor da conta:
                </span>
                <span className="text-sm font-semibold text-foreground">
                  R${" "}
                  {conta.amount?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Dados do Pagamento
              </h3>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_paid">
                  Valor pago <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="amount_paid"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amountPaid || ""}
                    onChange={(e) =>
                      setAmountPaid(parseFloat(e.target.value) || 0)
                    }
                    className="pl-9"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">
                  Data do pagamento <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="payment_date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="payment_method_id">
                  Forma de pagamento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={paymentMethodId}
                  onValueChange={setPaymentMethodId}
                >
                  <SelectTrigger id="payment_method_id">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(paymentMethods) &&
                      paymentMethods?.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {conta && amountPaid > 0 && (
            <div
              className={`rounded-lg border p-4 flex items-center justify-between ${
                statusPagamento?.variant === "success"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : statusPagamento?.variant === "warning"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusPagamento?.variant === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle
                    className={`h-5 w-5 ${
                      statusPagamento?.variant === "warning"
                        ? "text-amber-600"
                        : "text-primary"
                    }`}
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {statusPagamento?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {diferenca === 0
                      ? "Valor exato da conta"
                      : diferenca > 0
                        ? `Excedente de R$ ${diferenca.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`
                        : `Faltam R$ ${Math.abs(diferenca).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 },
                          )}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total pago</p>
                <p className="text-lg font-bold text-foreground">
                  R${" "}
                  {amountPaid.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handlePaymentBill} className="cursor-pointer">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirmar Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
