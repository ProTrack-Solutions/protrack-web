"use client";

import { Dispatch, SetStateAction } from "react";
import { ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManualPreview } from "@/interfaces/fiscal.interface";
import { Field, Section } from "./Section";
import { digits, FormState, NATURES, newKey, PRESENCES } from "./manual-form";

const CUSTOM = "__custom__";

/** Natureza da operação, CFOP padrão, presença, consumidor final e DIFAL (NF-e) */
export function OperationCard({
  form,
  setForm,
  preview,
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  preview?: ManualPreview;
}) {
  const preset = NATURES.find((n) => n.label === form.nature);
  const autoFinal = form.recipient.ie_indicator === "9";
  const finalConsumer = form.final_consumer ?? autoFinal;
  const showDifal = (preview?.interstate ?? false) && finalConsumer && form.recipient.ie_indicator === "9";

  const choose = (value: string) => {
    if (value === CUSTOM) {
      setForm((f) => ({ ...f, nature: "", default_cfop: "" }));
      return;
    }
    const n = NATURES.find((x) => x.label === value)!;
    setForm((f) => ({
      ...f,
      nature: n.label,
      default_cfop: n.cfop,
      // Remessa sem cobrança: "sem pagamento"
      payments: n.noPayment
        ? [{ key: newKey(), method: "90", amount: "0", description: "" }]
        : f.payments.length === 1 && f.payments[0].method === "90"
          ? [{ key: newKey(), method: "17", amount: "", description: "" }]
          : f.payments,
      payment_auto: true,
    }));
  };

  return (
    <Section
      icon={<ClipboardList className="h-4 w-4" />}
      title="Operação"
      description="O que a nota representa"
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
        <Field label="Natureza da operação" id="op-nature">
          <Select value={preset ? preset.label : CUSTOM} onValueChange={choose}>
            <SelectTrigger id="op-nature" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NATURES.map((n) => (
                <SelectItem key={n.label} value={n.label}>
                  {n.label}
                  {n.cfop && <span className="text-muted-foreground"> · {n.cfop}</span>}
                </SelectItem>
              ))}
              <SelectItem value={CUSTOM}>Outra (digitar)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="CFOP padrão" id="op-cfop" hint={!form.default_cfop ? "Do perfil" : undefined}>
          <Input
            id="op-cfop"
            inputMode="numeric"
            placeholder="perfil"
            value={form.default_cfop}
            onChange={(e) => setForm((f) => ({ ...f, default_cfop: digits(e.target.value).slice(0, 4) }))}
          />
        </Field>
      </div>

      {!preset && (
        <Field label="Descrição da natureza" id="op-nature-text">
          <Input
            id="op-nature-text"
            maxLength={60}
            placeholder="Ex.: Remessa para industrialização"
            value={form.nature}
            onChange={(e) => setForm((f) => ({ ...f, nature: e.target.value }))}
          />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Presença do comprador" id="op-presence">
          <Select value={form.presence} onValueChange={(v) => setForm((f) => ({ ...f, presence: v }))}>
            <SelectTrigger id="op-presence" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESENCES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2">
          <div>
            <p className="text-sm font-medium">Consumidor final</p>
            <p className="text-xs text-muted-foreground">
              {autoFinal
                ? "Não contribuinte é sempre consumidor final"
                : "Ligue se a mercadoria é para uso e consumo do destinatário"}
            </p>
          </div>
          <Switch
            checked={finalConsumer}
            disabled={autoFinal}
            onCheckedChange={(v) => setForm((f) => ({ ...f, final_consumer: v }))}
          />
        </div>
      </div>

      {showDifal && (
        <div className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">DIFAL</p>
              <p className="text-xs text-muted-foreground">
                Venda para consumidor final de outro estado: a diferença de alíquota vai
                para o estado de destino
              </p>
            </div>
            <Switch
              checked={form.difal.enabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, difal: { ...f.difal, enabled: v } }))}
            />
          </div>
          {form.difal.enabled && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Alíquota interna do destino (%)" id="difal-dest">
                <Input
                  id="difal-dest"
                  inputMode="decimal"
                  placeholder="Ex.: 18"
                  value={form.difal.destination_rate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, difal: { ...f.difal, destination_rate: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Alíquota interestadual" id="difal-inter">
                <Select
                  value={form.difal.interstate_rate}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, difal: { ...f.difal, interstate_rate: v as "4" | "7" | "12" } }))
                  }
                >
                  <SelectTrigger id="difal-inter" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="7">7% (Sul/Sudeste → N/NE/CO/ES)</SelectItem>
                    <SelectItem value="4">4% (importado)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="FCP do destino (%)" id="difal-fcp">
                <Input
                  id="difal-fcp"
                  inputMode="decimal"
                  placeholder="opcional"
                  value={form.difal.fcp_rate}
                  onChange={(e) => setForm((f) => ({ ...f, difal: { ...f.difal, fcp_rate: e.target.value } }))}
                />
              </Field>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
