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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Save, X } from "lucide-react";
import { toast } from "sonner";
import { PaymentMethod } from "@/enum/methodPayments";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { CreatePaymentMethodsParams } from "@/interfaces/payment-methods.interface";
import { CreatePaymentMethods } from "@/service/payment-methods.service";

const emptyMethod: CreatePaymentMethodsParams = {
  name: "",
  type: PaymentMethod.Cash,
};

interface DialogNewPaymentMethodProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogNewPaymentMethod({
  open,
  onOpenChange,
}: DialogNewPaymentMethodProps) {
  const [form, setForm] = useState<CreatePaymentMethodsParams>(emptyMethod);

  const update = <K extends keyof CreatePaymentMethodsParams>(
    key: K,
    value: CreatePaymentMethodsParams[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        toast.error("Informe o nome do método de pagamento.");
        return;
      }
      await CreatePaymentMethods(form);
      toast.success("Método de pagamento cadastrado.");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar metodo de pagamento!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Novo Método de Pagamento</DialogTitle>
              <DialogDescription>
                Configure os métodos de pagamento aceitos pela empresa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Dados principais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <CreditCard className="h-4 w-4" /> Dados principais
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pm-name">
                  Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pm-name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ex: PIX Instantâneo, Cartão Visa..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pm-type">Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => update("type", v as PaymentMethod)}
                >
                  <SelectTrigger id="pm-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PaymentMethod).map(([k, v]) => {
                      return (
                        <SelectItem key={k} value={v}>
                          {getPaymentMethodLabel(v)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />
        </div>

        <DialogFooter className="gap-2 bg-transparent">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            Cadastrar Método
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
