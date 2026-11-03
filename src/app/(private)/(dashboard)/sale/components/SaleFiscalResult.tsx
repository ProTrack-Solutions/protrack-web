"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Printer, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiscalStatusBadge } from "@/components/Fiscal/FiscalStatusBadge";
import {
  FiscalDocument,
  isPrintable,
  needsAttention,
} from "@/interfaces/fiscal.interface";
import { useSaleFiscalDocument, useInvalidateFiscal } from "@/hooks/useFiscal";
import { EmitSaleFiscalDocument, PrintDanfce } from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";

interface Props {
  /** Venda recém-gravada com a nota que veio na resposta; null fecha */
  sale: { id: string; document: FiscalDocument } | null;
  onClose: () => void;
}

/** Depois da venda: situação da NFC-e e impressão do DANFC-e */
export function SaleFiscalResult({ sale, onClose }: Props) {
  return (
    <Dialog open={!!sale} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {sale && <Content key={sale.id} sale={sale} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function Content({
  sale,
  onClose,
}: {
  sale: { id: string; document: FiscalDocument };
  onClose: () => void;
}) {
  const invalidate = useInvalidateFiscal();
  // Pendente/na SEFAZ: a consulta se repete até resolver
  const { data } = useSaleFiscalDocument(
    sale.document.status === "PENDING" || sale.document.status === "PROCESSING"
      ? sale.id
      : null,
  );
  const [override, setOverride] = useState<FiscalDocument | null>(null);
  const doc = override ?? data ?? sale.document;
  const [busy, setBusy] = useState<"print" | "emit" | null>(null);

  const print = async () => {
    setBusy("print");
    try {
      await PrintDanfce(doc.id);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao abrir o DANFC-e"));
    } finally {
      setBusy(null);
    }
  };

  const retry = async () => {
    setBusy("emit");
    try {
      const next = await EmitSaleFiscalDocument(sale.id);
      setOverride(next);
      invalidate();
      if (needsAttention(next)) {
        toast.error(
          next.reject_reason ?? next.error_message ?? "NFC-e não emitida",
        );
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao emitir a NFC-e"));
    } finally {
      setBusy(null);
    }
  };

  const waiting = doc.status === "PENDING" || doc.status === "PROCESSING";
  const problem = needsAttention(doc);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Venda finalizada
        </DialogTitle>
        <DialogDescription>
          A venda foi gravada. Situação da nota fiscal do consumidor:
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">
            NFC-e{doc.number ? ` nº ${doc.number}` : ""}
          </span>
          <FiscalStatusBadge document={doc} />
        </div>
        {waiting && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {doc.error_message ??
              "Aguardando a SEFAZ. Pode seguir vendendo: a nota é enviada sozinha."}
          </p>
        )}
        {doc.status === "CONTINGENCY" && (
          <p className="text-sm text-muted-foreground">
            A SEFAZ não respondeu e a nota saiu em contingência. Ela vale
            normalmente e é transmitida depois, sozinha.
          </p>
        )}
        {problem && (
          <p className="text-sm text-destructive">
            {doc.reject_reason ??
              doc.error_message ??
              "A nota não foi emitida."}
          </p>
        )}
        {doc.environment === "test" && (
          <p className="text-xs text-muted-foreground">
            Emitida em homologação: sem valor fiscal.
          </p>
        )}
      </div>

      <DialogFooter className="gap-2 sm:justify-between">
        <Button variant="outline" onClick={onClose}>
          Nova venda
        </Button>
        <div className="flex gap-2">
          {problem && (
            <Button variant="outline" onClick={retry} disabled={busy !== null}>
              {busy === "emit" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Tentar de novo
            </Button>
          )}
          {isPrintable(doc) && (
            <Button onClick={print} disabled={busy !== null} autoFocus>
              {busy === "print" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              Imprimir DANFC-e
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
