"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Settings2, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FISCAL_KEY, useFiscalSettings, useInvalidateFiscal } from "@/hooks/useFiscal";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { FiscalDocument, FiscalModel } from "@/interfaces/fiscal.interface";
import { EmitManualDocument, PreviewManualDocument } from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/lib/utils";
import { EmitResult } from "../components/EmitResult";
import { ItemsCard } from "../components/ItemsCard";
import { OperationCard } from "../components/OperationCard";
import { PaymentsCard } from "../components/PaymentsCard";
import { RecipientCard } from "../components/RecipientCard";
import { Section } from "../components/Section";
import { SummaryCard } from "../components/SummaryCard";
import { TransportCard } from "../components/TransportCard";
import { emptyForm, FormState, isNfe, itemsTotal, newKey, toInput } from "../components/manual-form";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const MODELS: { value: FiscalModel; label: string; hint: string }[] = [
  { value: 55, label: "NF-e", hint: "Para empresas, outro estado, remessas e entregas" },
  { value: 65, label: "NFC-e", hint: "Cupom do consumidor, venda no balcão" },
];

/** Emissão manual de NF-e e NFC-e: nota avulsa, sem venda e sem baixa de estoque */
export default function NewFiscalDocumentPage() {
  const [form, setForm] = useState<FormState>(() => emptyForm(55));
  const [result, setResult] = useState<FiscalDocument | null>(null);
  const [emitting, setEmitting] = useState(false);
  const [emitFailure, setEmitFailure] = useState<{ key: string; problems: string[] } | null>(null);
  const { data: settings, isLoading: loadingSettings } = useFiscalSettings();
  const { canAccess } = useModuleAccess();
  const invalidate = useInvalidateFiscal();
  const nfe = isNfe(form);

  // Último total conhecido (na NF-e vem da conferência, com os impostos)
  const [lastTotal, setLastTotal] = useState<number | null>(null);
  const baseTotal = lastTotal ?? itemsTotal(form.items);

  // Um pagamento só, ainda não editado: acompanha o total
  const autoPayment =
    form.payment_auto && form.payments.length === 1 && form.payments[0].method !== "90";
  const effective: FormState = autoPayment
    ? {
        ...form,
        payments: [
          { ...form.payments[0], amount: baseTotal > 0 ? baseTotal.toFixed(2).replace(".", ",") : "" },
        ],
      }
    : form;

  // Prévia: confere a nota no servidor (na NF-e, a API fiscal calcula os impostos)
  const input = toInput(effective);
  // A chave de idempotência não muda o resultado da conferência
  const previewKey = JSON.stringify({ ...input, idempotency_key: undefined });
  const debouncedKey = useDebouncedValue(previewKey, 600);
  const preview = useQuery({
    queryKey: [FISCAL_KEY, "manual-preview", debouncedKey],
    queryFn: async () => {
      const out = await PreviewManualDocument({ ...JSON.parse(debouncedKey), idempotency_key: form.idempotency_key });
      setLastTotal(out.total);
      return out;
    },
    enabled: form.items.length > 0 && !!settings?.issuer_registered && !result,
    staleTime: 60_000,
    retry: false,
  });
  const checking = form.items.length > 0 && (previewKey !== debouncedKey || preview.isFetching);
  const total = preview.data?.total ?? baseTotal;

  // Problemas devolvidos na emissão valem só para a nota como foi enviada
  const emitProblems = emitFailure && emitFailure.key === previewKey ? emitFailure.problems : null;

  const switchModel = (model: FiscalModel) =>
    setForm((f) => ({
      ...f,
      model,
      // NFC-e não aceita "sem pagamento" nem "outros"
      payments:
        model === 65 && f.payments.some((p) => p.method === "90" || p.method === "99")
          ? [{ key: newKey(), method: "17", amount: "", description: "" }]
          : f.payments,
      payment_auto: true,
    }));

  const emit = async () => {
    setEmitting(true);
    setEmitFailure(null);
    try {
      const doc = await EmitManualDocument(input);
      setResult(doc);
      invalidate();
    } catch (error) {
      if (isAxiosError<{ problems?: string[] }>(error) && error.response?.data?.problems?.length) {
        setEmitFailure({ key: previewKey, problems: error.response.data.problems });
      } else {
        toast.error(getApiErrorMessage(error, "Erro ao emitir a nota"));
      }
    } finally {
      setEmitting(false);
    }
  };

  const previewError = emitProblems?.length
    ? emitProblems.join("; ")
    : preview.isError
      ? getApiErrorMessage(preview.error, "Erro ao conferir a nota")
      : null;

  const back = (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/nfce">
        <ArrowLeft className="h-4 w-4" /> Notas fiscais
      </Link>
    </Button>
  );

  if (result) {
    return (
      <div className="space-y-6 p-6">
        {back}
        <EmitResult
          document={result}
          onNew={() => {
            setResult(null);
            setLastTotal(null);
            setForm(emptyForm(form.model));
          }}
          onFix={() => {
            setResult(null);
            // Nova chave: a recusada fica registrada e a correção vira outra nota
            setForm((f) => ({ ...f, idempotency_key: newKey() }));
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        {back}
        <Header
          title="Emitir nota fiscal"
          text="Nota avulsa, sem venda e sem baixa de estoque. Os dados fiscais dos produtos vêm do cadastro"
        />
      </div>

      {!loadingSettings && settings && !settings.issuer_registered && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />A empresa ainda não está cadastrada como emitente.
            Configure a emissão fiscal antes de emitir notas.
          </span>
          {canAccess(undefined, "ADMIN") && (
            <Button asChild size="sm" variant="outline">
              <Link href="/config/fiscal">
                <Settings2 className="h-4 w-4" /> Configurar
              </Link>
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
        {MODELS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => switchModel(m.value)}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              form.model === m.value
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border/70 hover:bg-muted/50",
            )}
          >
            <p className="text-sm font-semibold">{m.label}</p>
            <p className="text-xs text-muted-foreground">{m.hint}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {nfe && <OperationCard form={form} setForm={setForm} preview={preview.data} />}
          <RecipientCard form={form} setForm={setForm} />
          <ItemsCard form={form} setForm={setForm} preview={preview.data} />
          {nfe && <TransportCard form={form} setForm={setForm} />}
          <PaymentsCard form={effective} setForm={setForm} total={total} />
          <Section icon={<StickyNote className="h-4 w-4" />} title="Informações complementares">
            <Textarea
              aria-label="Informações complementares"
              maxLength={nfe ? 4000 : 2000}
              placeholder="Sai impresso no campo de observações da nota"
              value={form.additional_info}
              onChange={(e) => setForm((f) => ({ ...f, additional_info: e.target.value }))}
            />
          </Section>
        </div>

        <SummaryCard
          model={form.model}
          environment={settings?.environment}
          itemsTotal={itemsTotal(form.items)}
          preview={form.items.length > 0 ? preview.data : undefined}
          checking={checking}
          previewError={previewError}
          emitting={emitting}
          onEmit={emit}
        />
      </div>
    </div>
  );
}
