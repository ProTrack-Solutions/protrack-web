import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { brl } from "./types";
import { PlansResponse } from "@/interfaces/plans.interface";

interface ChangePlanDialogProps {
  planoAtual: PlansResponse;
  planoSelecionado: PlansResponse | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ChangePlanDialog({
  planoAtual,
  planoSelecionado,
  onOpenChange,
  onConfirm,
}: ChangePlanDialogProps) {
  return (
    <Dialog
      open={!!planoSelecionado}
      onOpenChange={(o) => !o && onOpenChange(false)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirmar mudança para {planoSelecionado?.name}
          </DialogTitle>
          <DialogDescription>
            O novo valor de{" "}
            {planoSelecionado ? brl(planoSelecionado.price_cents / 100) : ""}
            /mês passa a valer no próximo ciclo, com cobrança proporcional dos
            dias restantes.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plano atual</span>
            <span>
              {planoAtual.name} — {brl(planoAtual.price_cents / 100)}/mês
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Novo plano</span>
            <span className="font-semibold">
              {planoSelecionado?.name} —{" "}
              {planoSelecionado ? brl(planoSelecionado.price_cents / 100) : ""}
              /mês
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onConfirm}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
