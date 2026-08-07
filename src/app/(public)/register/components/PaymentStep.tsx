import { CreditCard, Lock } from "lucide-react";
import { CardElement } from "@stripe/react-stripe-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { labelClass } from "../constants";
import { PaymentData } from "@/interfaces/auth.interface";
import { PlansResponse } from "@/interfaces/plans.interface";

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
  return (
    <div className="space-y-5">
      <RadioGroup
        value={payment.type}
        onValueChange={(v) => setPayment({ ...payment, type: v })}
        className="grid gap-3 grid-cols-1"
      >
        <label
          htmlFor="credit_card"
          className="flex items-center gap-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 p-4 cursor-pointer"
        >
          <RadioGroupItem
            value="credit_card"
            id="credit_card"
            className="sr-only"
          />
          <CreditCard className="h-6 w-6 text-blue-600" />
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
            placeholder="Digite aqui"
            value={payment.card_holder}
            onChange={(e) =>
              setPayment({
                ...payment,
                card_holder: e.target.value.toUpperCase(),
              })
            }
            className="h-11 bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>Dados do cartão</Label>
          <div className="h-11 flex items-center rounded-md border bg-muted/50 px-3">
            <CardElement options={cardElementOptions} className="w-full" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-linear-to-r from-blue-50 to-purple-50 border border-blue-100 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Plano selecionado</p>
          <p className="font-bold text-blue-950">{plan.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total mensal</p>
          <p className="text-2xl font-bold text-blue-700">
            R${plan.price_cents / 100}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" /> Os dados do cartão são processados
        diretamente pelo Stripe e não passam pelo seu servidor
      </div>
    </div>
  );
}
