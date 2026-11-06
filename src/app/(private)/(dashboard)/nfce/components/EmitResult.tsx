"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Loader2, Pencil, Plus, Printer, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FiscalDocument,
  isPrintable,
  modelLabel,
  printoutLabel,
} from "@/interfaces/fiscal.interface";
import { PrintDanfce } from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";

/** Resultado da emissão: autorizada, aguardando a SEFAZ ou recusada */
export function EmitResult({
  document: doc,
  onNew,
  onFix,
}: {
  document: FiscalDocument;
  /** Formulário limpo para outra nota */
  onNew: () => void;
  /** Volta ao formulário com os mesmos dados (nota recusada) */
  onFix: () => void;
}) {
  const [printing, setPrinting] = useState(false);
  const label = modelLabel(doc.model);
  const printable = isPrintable(doc);
  const pending = doc.status === "PENDING" || doc.status === "PROCESSING";

  const print = async () => {
    setPrinting(true);
    try {
      await PrintDanfce(doc.id);
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Erro ao abrir o ${printoutLabel(doc.model)}`));
    } finally {
      setPrinting(false);
    }
  };

  const tone = printable
    ? { icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />, title: `${label} nº ${doc.number} autorizada` }
    : pending
      ? { icon: <Clock className="h-6 w-6 text-amber-600" />, title: `${label} enviada; aguardando a SEFAZ` }
      : { icon: <XCircle className="h-6 w-6 text-destructive" />, title: `${label} não emitida` };

  return (
    <section className="mx-auto max-w-xl space-y-5 rounded-2xl border border-border/70 bg-card p-6">
      <div className="flex items-start gap-3">
        {tone.icon}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{tone.title}</h2>
          {doc.status === "CONTINGENCY" && (
            <p className="text-sm text-muted-foreground">
              Emitida em contingência: vale normalmente e será transmitida à SEFAZ.
            </p>
          )}
          {pending && (
            <p className="text-sm text-muted-foreground">
              {doc.error_message ?? "A nota aparece na lista assim que a SEFAZ responder."}
            </p>
          )}
          {!printable && !pending && (
            <p className="text-sm text-destructive">
              {doc.status_code ? `${doc.status_code} – ` : ""}
              {doc.reject_reason ?? doc.error_message ?? "Verifique os dados da nota."}
            </p>
          )}
          {doc.access_key && (
            <p className="mt-2 font-mono text-xs break-all text-muted-foreground">
              {doc.access_key.replace(/(\d{4})/g, "$1 ").trim()}
            </p>
          )}
          {doc.environment === "test" && (
            <p className="mt-1 text-xs text-muted-foreground">Emitida em homologação: sem valor fiscal.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/nfce">Ver notas</Link>
        </Button>
        {!printable && !pending && (
          <Button variant="outline" onClick={onFix}>
            <Pencil className="h-4 w-4" /> Corrigir e emitir de novo
          </Button>
        )}
        <Button variant={printable ? "outline" : "default"} onClick={onNew}>
          <Plus className="h-4 w-4" /> Nova nota
        </Button>
        {printable && (
          <Button onClick={print} disabled={printing}>
            {printing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            Imprimir {printoutLabel(doc.model)}
          </Button>
        )}
      </div>
    </section>
  );
}
