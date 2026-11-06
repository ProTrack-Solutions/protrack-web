"use client";

import { Dispatch, SetStateAction } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brl } from "@/components/DashCard";
import { Section } from "./Section";
import { FormState, isNfe, newKey, num, PAYMENT_METHODS, PaymentRow } from "./manual-form";

export function PaymentsCard({
  form,
  setForm,
  total,
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  /** Total a pagar (vNF na NF-e) */
  total: number;
}) {
  const nfe = isNfe(form);
  const methods = PAYMENT_METHODS.filter((m) => nfe || !m.nfe);
  const paid = form.payments.reduce((s, p) => s + Math.round((p.method === "90" ? 0 : num(p.amount)) * 100), 0) / 100;
  const noPayment = form.payments.some((p) => p.method === "90");
  const diff = Math.round((total - paid) * 100) / 100;

  // form.payments já traz o valor automático: editar fixa o que está na tela
  const setPayment = (key: string, patch: Partial<PaymentRow>) =>
    setForm((f) => ({
      ...f,
      payment_auto: false,
      payments: form.payments.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    }));

  return (
    <Section
      icon={<Wallet className="h-4 w-4" />}
      title="Pagamento"
      description={nfe ? "Remessa sem cobrança: use \"Sem pagamento\"" : "Os pagamentos precisam cobrir o total"}
      action={
        !noPayment && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((f) => ({
                ...f,
                payment_auto: false,
                payments: [
                  ...form.payments,
                  { key: newKey(), method: "01", amount: diff > 0 ? diff.toFixed(2).replace(".", ",") : "", description: "" },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4" /> Outra forma
          </Button>
        )
      }
    >
      <div className="space-y-2">
        {form.payments.map((p, i) => (
          <div key={p.key} className="flex flex-wrap items-center gap-2">
            <Select value={p.method} onValueChange={(v) => setPayment(p.key, { method: v, amount: v === "90" ? "0" : p.amount })}>
              <SelectTrigger className="w-44" aria-label={`Forma de pagamento ${i + 1}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {p.method !== "90" && (
              <Input
                className="w-32"
                inputMode="decimal"
                aria-label={`Valor do pagamento ${i + 1}`}
                value={p.amount}
                placeholder="0,00"
                onChange={(e) => setPayment(p.key, { amount: e.target.value })}
              />
            )}
            {p.method === "99" && (
              <Input
                className="min-w-40 flex-1"
                maxLength={60}
                placeholder="Descreva a forma"
                value={p.description}
                onChange={(e) => setPayment(p.key, { description: e.target.value })}
              />
            )}
            {form.payments.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={`Remover pagamento ${i + 1}`}
                onClick={() =>
                  setForm((f) => ({ ...f, payment_auto: false, payments: f.payments.filter((x) => x.key !== p.key) }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {!noPayment && total > 0 && diff !== 0 && (
        <p className={diff > 0 ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
          {diff > 0 ? `Faltam ${brl(diff)} para cobrir o total.` : `Troco de ${brl(-diff)}.`}
        </p>
      )}
    </Section>
  );
}
