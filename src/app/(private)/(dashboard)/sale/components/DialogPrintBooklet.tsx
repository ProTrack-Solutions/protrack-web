"use client";

import { useState } from "react";
import { Loader2, NotebookText, Printer } from "lucide-react";
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
import { GetSaleBooklet } from "@/service/sale.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { printPdfBlob } from "@/utils/printPdf";

export interface BookletSale {
  saleId: string;
  installments: number;
}

interface DialogPrintBookletProps {
  /** Venda no crediário recém-gravada; null fecha o diálogo */
  sale: BookletSale | null;
  onClose: () => void;
}

/** Oferece a impressão do carnê logo depois de uma venda no crediário */
export function DialogPrintBooklet({ sale, onClose }: DialogPrintBookletProps) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    if (!sale) return;
    setPrinting(true);
    try {
      printPdfBlob(await GetSaleBooklet(sale.saleId));
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(getApiErrorMessage(error, "Erro ao gerar o carnê"));
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Dialog
      open={!!sale}
      onOpenChange={(open) => {
        if (!open && !printing) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <NotebookText className="h-5 w-5" />
          </div>
          <DialogTitle>Imprimir carnê do cliente?</DialogTitle>
          <DialogDescription>
            A venda no crediário foi registrada
            {sale && sale.installments > 0
              ? ` em ${sale.installments} ${sale.installments === 1 ? "parcela" : "parcelas"}`
              : ""}
            . O carnê traz uma lâmina por parcela, com o canhoto da loja e a
            via do cliente. Você também pode imprimi-lo depois pelo histórico
            de vendas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={printing}
            onClick={onClose}
          >
            Agora não
          </Button>
          <Button
            className="cursor-pointer"
            disabled={printing}
            onClick={handlePrint}
            autoFocus
          >
            {printing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            {printing ? "Gerando..." : "Imprimir carnê"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
