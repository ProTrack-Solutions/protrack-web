"use client";

import { useState } from "react";
import {
  Ban,
  FileCode2,
  Loader2,
  MoreHorizontal,
  Printer,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FiscalDocument,
  isPrintable,
  modelLabel,
  needsAttention,
  printoutLabel,
} from "@/interfaces/fiscal.interface";
import {
  CancelFiscalDocument,
  DownloadFiscalXml,
  EmitSaleFiscalDocument,
  PrintDanfce,
} from "@/service/fiscal.service";
import { useInvalidateFiscal } from "@/hooks/useFiscal";
import { getApiErrorMessage } from "@/utils/apiError";

interface Props {
  /** Nulo na nota manual: não há venda para emitir de novo */
  saleId: string | null;
  document: FiscalDocument | null;
  /** Mostra "Emitir NFC-e" para venda sem nota (emissão desligada na hora da venda) */
  allowEmitWithoutDocument?: boolean;
}

export const emitResultToast = (doc: FiscalDocument) => {
  const label = modelLabel(doc.model);
  if (isPrintable(doc)) {
    toast.success(
      doc.status === "CONTINGENCY"
        ? `${label} nº ${doc.number} emitida em contingência (vale normalmente; será transmitida à SEFAZ).`
        : `${label} nº ${doc.number} autorizada.`,
    );
  } else if (doc.status === "PENDING" || doc.status === "PROCESSING") {
    toast.info(
      doc.error_message ?? `${label} enviada; aguardando a SEFAZ responder.`,
    );
  } else {
    toast.error(
      `${label} não emitida: ${doc.reject_reason ?? doc.error_message ?? "verifique a nota"}`,
    );
  }
};

/** Menu de ações da nota (NFC-e da venda ou NF-e/NFC-e manual): imprimir, reemitir, XML e cancelar */
export function FiscalDocumentActions({
  saleId,
  document,
  allowEmitWithoutDocument,
}: Props) {
  const invalidate = useInvalidateFiscal();
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");

  const label = modelLabel(document?.model);
  const printout = printoutLabel(document?.model);
  // Reemitir é da venda; a nota manual com problema se corrige numa nova emissão
  const canEmit =
    !!saleId &&
    (needsAttention(document) || (!document && allowEmitWithoutDocument));
  const printable = isPrintable(document);
  const cancellable = document?.status === "AUTHORIZED";
  const hasXml = printable || document?.status === "CANCELLED";

  if (!printable && !canEmit && !hasXml) return null;

  const run = async (fn: () => Promise<void>, fallback: string) => {
    setBusy(true);
    try {
      await fn();
    } catch (error) {
      toast.error(getApiErrorMessage(error, fallback));
    } finally {
      setBusy(false);
    }
  };

  const emit = () =>
    run(async () => {
      const doc = await EmitSaleFiscalDocument(saleId!);
      emitResultToast(doc);
      invalidate();
    }, "Erro ao emitir a NFC-e");

  const cancel = () =>
    run(async () => {
      await CancelFiscalDocument(document!.id, reason);
      toast.success(`${label} cancelada na SEFAZ.`);
      setCancelOpen(false);
      setReason("");
      invalidate();
    }, `Erro ao cancelar a ${label}`);

  const reasonOk = reason.trim().length >= 15 && reason.trim().length <= 255;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={busy}
            aria-label={`Ações da ${label}`}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {printable && (
            <DropdownMenuItem
              onClick={() =>
                run(
                  () => PrintDanfce(document!.id),
                  `Erro ao abrir o ${printout}`,
                )
              }
            >
              <Printer className="h-4 w-4" /> Imprimir {printout}
            </DropdownMenuItem>
          )}
          {canEmit && (
            <DropdownMenuItem onClick={emit}>
              <RefreshCcw className="h-4 w-4" />
              {document ? "Emitir de novo" : "Emitir NFC-e"}
            </DropdownMenuItem>
          )}
          {hasXml && (
            <DropdownMenuItem
              onClick={() =>
                run(
                  () =>
                    DownloadFiscalXml(
                      document!.id,
                      document!.access_key,
                      document!.model,
                    ),
                  "Erro ao baixar o XML",
                )
              }
            >
              <FileCode2 className="h-4 w-4" /> Baixar XML
            </DropdownMenuItem>
          )}
          {cancellable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setCancelOpen(true)}
              >
                <Ban className="h-4 w-4" /> Cancelar {label}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cancelar {label} nº {document?.number}
            </DialogTitle>
            <DialogDescription>
              O cancelamento vai para a SEFAZ e só é aceito dentro do prazo da
              UF.
              {saleId &&
                " A venda continua registrada: para desfazer a venda inteira, cancele a venda no histórico (a nota é cancelada junto)."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Justificativa</Label>
            <Textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={255}
              placeholder="Ex.: venda digitada com o valor errado"
            />
            <p className="text-xs text-muted-foreground">
              De 15 a 255 caracteres ({reason.trim().length}).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={!reasonOk || busy}
              onClick={cancel}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Cancelar {label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
