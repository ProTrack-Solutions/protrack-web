"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCustomersChanged } from "@/hooks/useCustomerProfile";
import { SetCustomerActive } from "@/service/customer-profile.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { money } from "./format";

export interface ActiveToggleTarget {
  id: string;
  name: string;
  active: boolean;
  balanceDue: number;
}

/** Confirma inativar (mantém o histórico) ou reativar o cliente */
export function ActiveToggleDialog({
  target,
  onClose,
}: {
  target: ActiveToggleTarget | null;
  onClose: () => void;
}) {
  const changed = useCustomersChanged();
  const [saving, setSaving] = useState(false);
  const deactivating = !!target?.active;

  const confirm = async () => {
    if (!target) return;
    setSaving(true);
    try {
      await SetCustomerActive(target.id, !target.active);
      toast.success(deactivating ? `${target.name} foi inativado.` : `${target.name} foi reativado.`);
      changed();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível atualizar o cliente."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AlertDialog open={!!target} onOpenChange={(open) => !open && !saving && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deactivating ? `Inativar ${target?.name}?` : `Reativar ${target?.name}?`}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              {deactivating ? (
                <>
                  <p>
                    O cliente deixa de aparecer na venda e nas listas. O histórico de compras e as
                    parcelas continuam guardados e você pode reativar quando quiser.
                  </p>
                  {target && target.balanceDue > 0 && (
                    <p className="rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                      Ele ainda deve {money(target.balanceDue)}. As parcelas continuam em Contas a
                      Receber.
                    </p>
                  )}
                </>
              ) : (
                <p>O cliente volta a aparecer na venda e nas listas.</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving} className="cursor-pointer">Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              confirm();
            }}
            disabled={saving}
            className={`cursor-pointer ${deactivating ? "bg-destructive text-white hover:bg-destructive/90" : ""}`}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {deactivating ? "Inativar" : "Reativar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
