"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentMethodDetails } from "@/interfaces/subscription-manager.interface";
import { CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethodCardProps {
  paymentMethod?: PaymentMethodDetails | null;
}

export function PaymentMethodCard({ paymentMethod }: PaymentMethodCardProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="w-4 h-4 text-blue-600" />
          Forma de pagamento
        </CardTitle>
        <CardDescription>Cartão usado nas cobranças.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-md">
          <div className="flex justify-between items-start">
            <CreditCard className="w-7 h-7 opacity-80" />
            <span className="text-sm font-semibold uppercase">
              {paymentMethod?.card_brand ?? "Sem cartão"}
            </span>
          </div>
          <p className="mt-6 text-lg tracking-widest">
            •••• •••• •••• {paymentMethod?.card_last4 ?? "----"}
          </p>
          <p className="mt-2 text-xs text-blue-100">
            {paymentMethod
              ? `Validade ${String(paymentMethod.card_exp_month).padStart(2, "0")}/${paymentMethod.card_exp_year}`
              : "Nenhum método de pagamento cadastrado"}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast("Funcionalidade para atualizar cartão.")}
        >
          Atualizar cartão
        </Button>
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          Pagamentos processados em ambiente seguro e criptografado.
        </div>
      </CardContent>
    </Card>
  );
}
