import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelSubscriptionDialogProps {
  open: boolean;
  planoNome: string;
  proximaCobranca: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (motivo: string, cancelarImediatamente: boolean) => void;
}

interface CancelDialogBodyProps {
  planoNome: string;
  proximaCobranca: string;
  isSubmitting: boolean;
  onConfirm: (motivo: string, cancelarImediatamente: boolean) => void;
}

// Mounted only while the dialog is open (Radix unmounts AlertDialogContent on
// close), so its local state starts fresh every time the dialog is reopened.
function CancelDialogBody({
  planoNome,
  proximaCobranca,
  isSubmitting,
  onConfirm,
}: CancelDialogBodyProps) {
  const [motivo, setMotivo] = useState("");
  const [cancelarImediatamente, setCancelarImediatamente] = useState(false);

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onConfirm(motivo, cancelarImediatamente);
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
        <AlertDialogDescription>
          {cancelarImediatamente ? (
            <>
              O acesso ao plano {planoNome} e os recursos premium serão
              desativados imediatamente após a confirmação.
            </>
          ) : (
            <>
              Você mantém acesso ao plano {planoNome} até {proximaCobranca}.
              Depois disso, os recursos premium serão desativados e nenhuma
              nova cobrança será feita.
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="motivo-cancelamento">Motivo do cancelamento</Label>
          <Textarea
            id="motivo-cancelamento"
            placeholder="Conte pra gente por que está cancelando..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={cancelarImediatamente}
            onCheckedChange={(checked) =>
              setCancelarImediatamente(checked === true)
            }
            disabled={isSubmitting}
          />
          <span className="text-sm">
            Cancelar imediatamente, sem manter acesso até o fim do período já
            pago
          </span>
        </label>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isSubmitting}>
          Manter assinatura
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-rose-600 hover:bg-rose-700 text-white"
        >
          {isSubmitting ? "Cancelando..." : "Cancelar assinatura"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}

export function CancelSubscriptionDialog({
  open,
  planoNome,
  proximaCobranca,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: CancelSubscriptionDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;
    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <CancelDialogBody
          planoNome={planoNome}
          proximaCobranca={proximaCobranca}
          isSubmitting={isSubmitting}
          onConfirm={onConfirm}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
