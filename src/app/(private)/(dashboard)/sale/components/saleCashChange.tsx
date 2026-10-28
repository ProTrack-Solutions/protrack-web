"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { HandCoins } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { brl } from "@/components/DashCard";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { PaymentMethod } from "@/enum/methodPayments";
import { Product } from "@/interfaces/products.interface";
import { MoneyInput } from "../../cash-register/components/MoneyInput";
import { POSITIVE_TEXT } from "../../cash-register/components/format";
import { useSaleTotal } from "./useSaleTotal";

/**
 * Quanto o cliente pagou em dinheiro no balcão: o total na venda em dinheiro
 * ou a entrada na venda a prazo. Zero quando não há nada a receber em espécie.
 */
function useCashDue(products: Product[]) {
  const { control } = useFormContext<CreateSaleParams>();
  const { total } = useSaleTotal(products);
  const paymentMethod = useWatch({ control, name: "payment_method" });
  const downPayment = useWatch({ control, name: "prohibited" });
  const credit = useWatch({ control, name: "credit_amount" }) || 0;

  // A parte paga com vale-troca não passa pela gaveta
  if (paymentMethod === PaymentMethod.Cash) return Math.max(total - credit, 0);
  if (paymentMethod === PaymentMethod.Installments) return downPayment || 0;
  return 0;
}

export function SaleCashChange({ products }: { products: Product[] }) {
  const { control } = useFormContext<CreateSaleParams>();
  const paymentMethod = useWatch({ control, name: "payment_method" });
  const received = useWatch({ control, name: "amount_received" }) || 0;
  const due = useCashDue(products);

  if (due <= 0) return null;

  const change = received - due;
  const isDownPayment = paymentMethod === PaymentMethod.Installments;

  return (
    <>
      <Separator />
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="amount_received"
          rules={{
            validate: (value) =>
              !value ||
              value >= due ||
              `O valor recebido é menor que ${brl(due)}`,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="amount_received"
                className="flex items-center gap-1"
              >
                <HandCoins className="h-4 w-4" />
                {isDownPayment
                  ? "Valor recebido na entrada"
                  : "Valor recebido em dinheiro"}
              </FormLabel>
              <MoneyInput
                id="amount_received"
                value={field.value ?? 0}
                onChange={(v) => field.onChange(v || undefined)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-xl border bg-muted/30 p-4 md:mt-[1.375rem]">
          {received === 0 ? (
            <p className="text-sm text-muted-foreground">
              Informe quanto o cliente entregou para calcular o troco. Deixe em
              branco se ele pagou o valor exato de {brl(due)}.
            </p>
          ) : change >= 0 ? (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Troco
              </span>
              <span
                className={`text-2xl font-bold tabular-nums ${
                  change > 0 ? POSITIVE_TEXT : "text-foreground"
                }`}
              >
                {brl(change)}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Faltam
              </span>
              <span className="text-2xl font-bold tabular-nums text-destructive">
                {brl(-change)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
