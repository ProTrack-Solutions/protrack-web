"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePurchaseOrderUpdated } from "@/hooks/usePurchases";
import {
  PurchaseEmailKind,
  PurchaseOrderDetail,
} from "@/interfaces/purchases.interface";
import {
  EmailPurchaseOrder,
  SendPurchaseOrder,
} from "@/service/purchases.service";
import { getApiErrorMessage } from "@/utils/apiError";

/**
 * Envia o e-mail do pedido e avisa o resultado. Se falhar, o pedido já salvo
 * continua salvo: o usuário pode tentar de novo pelo "Reenviar e-mail".
 */
export async function emailOrderWithFeedback(
  orderId: string,
  kind: PurchaseEmailKind,
  recipient: string,
): Promise<PurchaseOrderDetail | null> {
  try {
    const updated = await EmailPurchaseOrder(orderId, kind);
    toast.success(`E-mail do pedido enviado para ${recipient}.`);
    return updated;
  } catch (error) {
    toast.warning(
      `O e-mail não foi enviado: ${getApiErrorMessage(error, "erro inesperado")} Use "Reenviar e-mail" para tentar de novo.`,
    );
    return null;
  }
}

/** Checkbox "enviar por e-mail" com o endereço do fornecedor (ou aviso se não houver) */
export function VendorEmailOption({
  id,
  vendorEmail,
  checked,
  onCheckedChange,
  label = "Enviar o pedido por e-mail (PDF anexo)",
}: {
  id: string;
  vendorEmail: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}) {
  if (!vendorEmail) {
    return (
      <p className="flex items-start gap-2 rounded-lg bg-slate-100 p-3 dark:bg-muted text-xs text-muted-foreground">
        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          O fornecedor não tem e-mail cadastrado, então o pedido não será enviado por e-mail.{" "}
          <Link href="/config/vendors" className="font-medium text-blue-700 dark:text-blue-300 hover:underline">
            Cadastrar e-mail
          </Link>
        </span>
      </p>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border p-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <Label htmlFor={id} className="flex flex-col items-start gap-0.5 font-normal">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          Para {vendorEmail}. As respostas vão para o e-mail da empresa, com cópia para você.
        </span>
      </Label>
    </div>
  );
}

interface SendOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrderDetail;
}

export function SendOrderDialog({ open, onOpenChange, order }: SendOrderDialogProps) {
  const onUpdated = usePurchaseOrderUpdated();
  const [sendEmail, setSendEmail] = useState(!!order.vendor_email);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      let updated = await SendPurchaseOrder(order.id);
      onUpdated(updated);
      toast.success("Pedido marcado como enviado ao fornecedor.");
      if (sendEmail && order.vendor_email) {
        updated = (await emailOrderWithFeedback(order.id, "sent", order.vendor_email)) ?? updated;
        onUpdated(updated);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível enviar o pedido."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar pedido nº {order.number}?</DialogTitle>
          <DialogDescription>
            O pedido sai do rascunho e passa a aguardar a mercadoria de {order.vendor_name}.
          </DialogDescription>
        </DialogHeader>
        <VendorEmailOption
          id="send-order-email"
          vendorEmail={order.vendor_email}
          checked={sendEmail}
          onCheckedChange={setSendEmail}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting} className="cursor-pointer">
            Voltar
          </Button>
          <Button onClick={submit} disabled={submitting} className="cursor-pointer">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sendEmail && order.vendor_email ? "Enviar e mandar e-mail" : "Marcar como enviado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
