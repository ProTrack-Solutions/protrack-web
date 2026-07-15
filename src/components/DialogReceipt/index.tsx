"use client";

import { useState } from "react";
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
  User,
  Wallet,
  X,
  HandCoins,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { Textarea } from "../ui/textarea";
import { Payment } from "@/service/payments.service";

interface DialogBaixaReceberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export const DialogReceipt = ({
  open,
  onOpenChange,
}: DialogBaixaReceberProps) => {
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(todayISO());
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [note, setNote] = useState("");
  const [clientId, setClientId] = useState("");

  const { clients } = useClients();

  const selectedClient = clients?.find((c) => c.id === clientId);
  const diferenca = selectedClient
    ? selectedClient.balance_due - amountPaid
    : 0;

  const { paymentMethods } = usePaymentMethods();

  const handleSubmit = async () => {
    if (amountPaid <= 0) {
      toast("Informe um valor maior que zero.");
      return;
    }
    if (!paymentDate) {
      toast("Selecione a data do recebimento.");
      return;
    }
    if (!paymentMethodId) {
      toast("Selecione a forma de pagamento.");
      return;
    }

    try {
      await Payment({
        amount_paid: amountPaid,
        customer_id: clientId,
        notes: note,
        payment_method_id: paymentMethodId,
      });
      toast.success(
        `Recebimento de R$ ${amountPaid.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })} confirmado.`,
      );
    } catch (error) {
      console.log(error);
      toast.error("Erro ao registrar o pagamento");
    } finally {
      onOpenChange(false);
      setClientId("");
      setNote("");
      setPaymentMethodId("");
      setAmountPaid(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl px-0 pt-0 pb-4  overflow-hidden">
        <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-5 text-primary-foreground">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-foreground/15 p-2">
                <HandCoins className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-primary-foreground text-xl">
                  Dar Baixa em Recebimento
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Selecione o cliente e informe o valor recebido.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Cliente / Conta
              </h3>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="conta_id">
                Selecionar Cliente <span className="text-destructive">*</span>
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="conta_id">
                  <SelectValue placeholder="Escolha o cliente/conta a receber" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name} — R$ {c.balance_due}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Dados do Recebimento
              </h3>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_paid">
                  Valor recebido <span className="text-destructive">*</span>
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
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">
                  Data do recebimento
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="payment_date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="pl-9"
                    disabled
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Observação
              </h3>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  id="payment_date"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="p-2"
                  placeholder="Observação..."
                />
              </div>
            </div>
          </div>
          {clientId && amountPaid > 0 && selectedClient && (
            <div className="rounded-lg border p-4 flex items-center justify-between border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <div>
                  <p className="text-sm font-medium text-foreground">
                    {diferenca === 0
                      ? "Baixa completa"
                      : `Baixa parcial (Falta R$ ${diferenca.toFixed(2)})`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {diferenca === 0
                      ? "Valor exato do saldo devedor"
                      : diferenca > 0
                        ? `Excedente de R$ ${Math.abs(diferenca).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}`
                        : `Restam R$ ${Math.abs(diferenca).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total recebido</p>
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

        <DialogFooter className="px-6 py-4 bg-transparent border-t  gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirmar Baixa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
