"use client";

import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl } from "@/components/DashCard";
import { FiscalEnvironment, FiscalModel, ManualPreview, modelLabel } from "@/interfaces/fiscal.interface";

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between text-base font-semibold" : "flex justify-between text-sm"}>
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{brl(value)}</span>
    </div>
  );
}

/** Totais (calculados pela API fiscal na NF-e), problemas e o botão de emitir */
export function SummaryCard({
  model,
  environment,
  itemsTotal,
  preview,
  checking,
  previewError,
  emitting,
  onEmit,
}: {
  model: FiscalModel;
  environment?: FiscalEnvironment;
  itemsTotal: number;
  preview?: ManualPreview;
  checking: boolean;
  previewError: string | null;
  emitting: boolean;
  onEmit: () => void;
}) {
  const t = preview?.totals;
  const problems = preview?.problems ?? [];
  const ready = !!preview && problems.length === 0 && !checking && !previewError;
  const label = modelLabel(model);

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <section className="rounded-2xl border border-border/70 bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Resumo da {label}</h2>
          {environment === "test" && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-300">
              HOMOLOGAÇÃO
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {t ? (
            <>
              <Row label="Produtos" value={t.products} />
              {t.discount > 0 && <Row label="Descontos" value={-t.discount} />}
              {t.freight > 0 && <Row label="Frete" value={t.freight} />}
              {t.insurance > 0 && <Row label="Seguro" value={t.insurance} />}
              {t.otherExpenses > 0 && <Row label="Outras despesas" value={t.otherExpenses} />}
              {t.ipi > 0 && <Row label="IPI" value={t.ipi} />}
              {t.st > 0 && <Row label="ICMS-ST" value={t.st} />}
              <div className="my-2 border-t" />
              <Row label="Total da nota" value={t.total} strong />
              <div className="mt-3 space-y-1 rounded-lg bg-muted/50 p-2.5">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Impostos destacados
                </p>
                <Row label="ICMS" value={t.icms} />
                {t.difal && <Row label="DIFAL (destino)" value={t.difal.icms + t.difal.fcp} />}
                <Row label="PIS" value={t.pis} />
                <Row label="COFINS" value={t.cofins} />
                <Row label="IBS" value={t.ibsCbs.ibsState + t.ibsCbs.ibsCity} />
                <Row label="CBS" value={t.ibsCbs.cbs} />
              </div>
            </>
          ) : (
            <Row label="Total da nota" value={preview?.total ?? itemsTotal} strong />
          )}
        </div>
      </section>

      {(checking || previewError || problems.length > 0) && (
        <section
          className={
            previewError || problems.length > 0
              ? "rounded-2xl border border-destructive/40 bg-destructive/5 p-4"
              : "rounded-2xl border border-border/70 bg-card p-4"
          }
        >
          {checking ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Conferindo a nota...
            </p>
          ) : (
            <>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {previewError ? "Não foi possível conferir" : "Corrija antes de emitir"}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {previewError ? <li>{previewError}</li> : problems.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </>
          )}
        </section>
      )}

      {ready && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Nota conferida, pronta para emitir.
        </p>
      )}

      <Button className="w-full" size="lg" disabled={!ready || emitting} onClick={onEmit}>
        {emitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {emitting ? "Enviando à SEFAZ..." : `Emitir ${label}`}
      </Button>
      {environment === "test" && (
        <p className="text-center text-xs text-muted-foreground">
          Emitida em homologação: sem valor fiscal.
        </p>
      )}
    </aside>
  );
}
