"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  /** Exige ao menos 3 caracteres (o estorno pede motivo obrigatório) */
  required?: boolean;
  destructive?: boolean;
  onConfirm: (reason: string) => Promise<void>;
}

/** Confirmação com campo de motivo: encerrar, cancelar e estornar */
export function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  required = false,
  destructive = false,
  onConfirm,
}: ReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const valid = !required || reason.trim().length >= 3;

  const handleOpenChange = (next: boolean) => {
    if (submitting) return;
    if (!next) setReason("");
    onOpenChange(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {description}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reason-field">
              Motivo{" "}
              {required ? (
                <span className="text-destructive">*</span>
              ) : (
                <span className="text-muted-foreground">(opcional)</span>
              )}
            </Label>
            <Textarea
              id="reason-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={3}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
              className="cursor-pointer"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant={destructive ? "destructive" : "default"}
              disabled={!valid || submitting}
              className="cursor-pointer"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
