import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plano, brl } from "./types";

interface ChangePlanDialogProps {
  planoAtual: Plano;
  planoSelecionado: Plano | null;
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
            Confirmar mudança para {planoSelecionado?.nome}
          </DialogTitle>
          <DialogDescription>
            O novo valor de{" "}
            {planoSelecionado ? brl(planoSelecionado.preco) : ""}/mês passa a
            valer no próximo ciclo, com cobrança proporcional dos dias
            restantes.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plano atual</span>
            <span>
              {planoAtual.nome} — {brl(planoAtual.preco)}/mês
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Novo plano</span>
            <span className="font-semibold">
              {planoSelecionado?.nome} —{" "}
              {planoSelecionado ? brl(planoSelecionado.preco) : ""}/mês
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
