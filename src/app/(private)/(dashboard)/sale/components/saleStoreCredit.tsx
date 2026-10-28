"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Ticket } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { brl } from "@/components/DashCard";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { PaymentMethod } from "@/enum/methodPayments";
import { Product } from "@/interfaces/products.interface";
import { useCustomerCredit } from "@/hooks/useReturns";
import { MoneyInput } from "../../cash-register/components/MoneyInput";
import { useSaleTotal } from "./useSaleTotal";

/**
 * Vale-troca do cliente escolhido: aparece só quando ele tem saldo. O que for
 * usado sai do total e o restante vai na forma de pagamento da venda.
 */
export function SaleStoreCredit({ products }: { products: Product[] }) {
  const { control, setValue } = useFormContext<CreateSaleParams>();
  const customerId = useWatch({ control, name: "customer_id" });
  const paymentMethod = useWatch({ control, name: "payment_method" });
  const used = useWatch({ control, name: "credit_amount" }) || 0;
  const { total } = useSaleTotal(products);
  const { data } = useCustomerCredit(customerId || undefined);

  // Trocou de cliente: o vale usado era do anterior
  useEffect(() => {
    setValue("credit_amount", 0);
  }, [customerId, setValue]);

  const available = data?.store_credit ?? 0;
  if (!customerId || available <= 0) return null;

  if (paymentMethod === PaymentMethod.Installments) {
    return (
      <>
        <Separator />
        <p className="flex items-center gap-2 rounded-lg bg-pink-50 p-3 text-sm text-pink-900 dark:bg-pink-500/10 dark:text-pink-200">
          <Ticket className="h-4 w-4 shrink-0" />
          O cliente tem {brl(available)} de vale-troca, mas ele não pode ser
          usado em venda a prazo.
        </p>
      </>
    );
  }

  const max = Math.round(Math.max(Math.min(available, total), 0) * 100) / 100;
  const remaining = Math.max(total - used, 0);

  return (
    <>
      <Separator />
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="credit_amount"
          rules={{
            validate: (value) =>
              !value ||
              value <= max + 0.001 ||
              `Use no máximo ${brl(max)} do vale-troca`,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="credit_amount" className="flex items-center gap-1">
                <Ticket className="h-4 w-4 text-pink-700 dark:text-pink-300" />
                Usar vale-troca (disponível {brl(available)})
              </FormLabel>
              <div className="flex gap-2">
                <div className="flex-1">
                  <MoneyInput
                    id="credit_amount"
                    value={field.value ?? 0}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue("amount_received", undefined);
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto cursor-pointer"
                  disabled={max <= 0}
                  onClick={() => {
                    field.onChange(max);
                    setValue("amount_received", undefined);
                  }}
                >
                  Usar {brl(max)}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-xl border border-border bg-slate-50 p-4 md:mt-[1.375rem] dark:bg-muted/40">
          {used > 0 && remaining <= 0.001 ? (
            <p className="text-sm font-medium text-foreground">
              Venda paga inteira com vale-troca. Sobra {brl(available - used)} para
              o cliente.
            </p>
          ) : (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {used > 0 ? "Restante na forma de pagamento" : "Total a pagar"}
              </span>
              <span className="text-2xl font-bold tabular-nums text-foreground">
                {brl(remaining)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
