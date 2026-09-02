// components/salePaymentCard.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, CalendarDays,  CircleDollarSign } from "lucide-react";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { PaymentMethod } from "@/enum/methodPayments";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";

const metodosAPrazo: PaymentMethod[] = [
  PaymentMethod.CreditCard,
  PaymentMethod.Other,
];

export function SaleFormPaymentMethod() {
  const { control, setValue } = useFormContext<CreateSaleParams>();

  const paymentMethod = useWatch({ control, name: "payment_method" });
  const installments = useWatch({ control, name: "installments_count" });
  const dueDays = useWatch({ control, name: "due_days" });

  console.log("paymentMethod", paymentMethod);

  const isCreditCard = paymentMethod === PaymentMethod.CreditCard;
  const isAPrazo = paymentMethod === PaymentMethod.Installments;

  const parcelasPreview = (() => {
    if (!isAPrazo || !installments || installments < 1 || !dueDays) return [];

    return Array.from({ length: installments }, (_, i) => {
      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + dueDays * (i + 1));
      return {
        numero: i + 1,
        vencimento: vencimento.toISOString().split("T")[0],
      };
    });
  })();

  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setValue("payment_method", value);

    if (!metodosAPrazo.includes(value)) {
      setValue("installments_count", 0);
      setValue("due_days", 0);
    } else {
      setValue("installments_count", 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Método de pagamento */}
          <FormField
            control={control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pagamento</FormLabel>
                <Select
                  onValueChange={(v) => {
                    field.onChange(v);
                    handlePaymentMethodChange(v as PaymentMethod);
                  }}
                  value={field.value ? field.value : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(PaymentMethod).map(([k, v]) => {
                      console.log("PaymentMethod", v);
                      return (
                        <SelectItem key={k} value={v}>
                          {getPaymentMethodLabel(v)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="discount_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <CircleDollarSign className="h-4 w-4" /> Desconto (R$)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parcelas — só exibe se for a prazo */}
          {(isAPrazo || isCreditCard) && (
            <FormField
              control={control}
              name="installments_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº de Parcelas</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value ?? 1)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Seção de parcelamento */}
        {isAPrazo && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="due_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Dia de Vencimento
                    </FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia de vencimento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 5, 10, 15, 20, 25, 30].map((dia) => (
                          <SelectItem key={dia} value={String(dia)}>
                            Dia {dia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="prohibited"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Wallet className="h-4 w-4" />
                      Entrada (R$)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pré-visualização das parcelas */}
            {parcelasPreview.length > 0 && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold">
                    Pré-visualização das parcelas
                  </h4>
                  <Badge variant="secondary">{installments}x</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {parcelasPreview.map((p) => (
                    <div
                      key={p.numero}
                      className="rounded-md border bg-background p-2 text-center"
                    >
                      <div className="text-xs text-muted-foreground">
                        Parcela {p.numero}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(
                          p.vencimento + "T00:00:00",
                        ).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
