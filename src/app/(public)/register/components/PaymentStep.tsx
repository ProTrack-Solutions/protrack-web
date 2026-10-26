import { CreditCard, Lock } from "lucide-react";
import { CardElement } from "@stripe/react-stripe-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { inputClass, labelClass } from "../constants";
import { PaymentData } from "@/interfaces/auth.interface";
import { PlansResponse } from "@/interfaces/plans.interface";
import { getFirstChargeDate, getOriginalPriceCents } from "@/utils/planPricing";

interface PaymentStepProps {
  payment: PaymentData;
  setPayment: (payment: PaymentData) => void;
  plan: PlansResponse;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: "14px",
      color: "#0f172a",
      fontFamily: "inherit",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
  hidePostalCode: true,
};

export default function PaymentStep({
  payment,
  setPayment,
  plan,
}: PaymentStepProps) {
  const originalPriceCents = getOriginalPriceCents(plan);
  const hasTrial = plan.trial_days > 0;

  return (
    <div className="space-y-5">
      <RadioGroup
        value={payment.type}
        onValueChange={(v) => setPayment({ ...payment, type: v })}
        className="grid gap-3 grid-cols-1"
      >
        <label
          htmlFor="credit_card"
          className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)] p-4"
        >
          <RadioGroupItem
            value="credit_card"
            id="credit_card"
            className="sr-only"
          />
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[hsl(var(--night))] text-white">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <span className="font-semibold text-sm block">
              Cartão de crédito
            </span>
            <span className="text-xs text-muted-foreground">
              Cobrança mensal recorrente
            </span>
          </div>
        </label>
      </RadioGroup>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className={labelClass}>Nome impresso</Label>
          <Input
            placeholder="NOME COMO NO CARTÃO"
            value={payment.card_holder}
            onChange={(e) =>
              setPayment({
                ...payment,
                card_holder: e.target.value.toUpperCase(),
              })
            }
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>Dados do cartão</Label>
          <div className="flex h-12 items-center rounded-2xl border border-border bg-secondary/60 px-3.5 transition-colors focus-within:border-[hsl(var(--primary))] focus-within:bg-card focus-within:ring-3 focus-within:ring-[hsl(var(--primary)/0.25)]">
            <CardElement options={cardElementOptions} className="w-full" />
          </div>
        </div>
      </div>

      <div className="bg-night flex items-center justify-between rounded-2xl p-5 text-white">
        <div>
          <p className="text-xs text-white/60">Plano selecionado</p>
          <p className="font-display text-lg font-extrabold">{plan.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">
            {hasTrial ? "Total hoje" : "Total mensal"}
          </p>
          {!hasTrial && originalPriceCents && (
            <p className="text-xs text-white/50 line-through">
              R${originalPriceCents / 100}
            </p>
          )}
          <p className="font-display text-2xl font-extrabold text-[hsl(155_70%_60%)]">
            {hasTrial ? "R$0" : `R$${plan.price_cents / 100}`}
          </p>
        </div>
      </div>

      {hasTrial && (
        <div className="rounded-2xl border border-[hsl(155_55%_45%/0.3)] bg-[hsl(155_55%_48%/0.08)] p-4 text-sm text-[hsl(155_55%_22%)]">
          <p className="font-semibold">
            {plan.trial_days} dias grátis para testar
          </p>
          <p className="mt-1 text-xs">
            Nada será cobrado agora. A primeira cobrança de R$
            {plan.price_cents / 100} será feita em{" "}
            {getFirstChargeDate(plan.trial_days)}, caso você não cancele antes.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" /> Os dados do cartão são processados
        diretamente pelo Stripe e não passam pelo seu servidor
      </div>
    </div>
  );
}
