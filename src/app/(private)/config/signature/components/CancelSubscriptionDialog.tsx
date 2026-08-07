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

interface CancelSubscriptionDialogProps {
  open: boolean;
  planoNome: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CancelSubscriptionDialog({
  open,
  planoNome,
  onOpenChange,
  onConfirm,
}: CancelSubscriptionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
          <AlertDialogDescription>
            Você mantém acesso ao plano {planoNome} até 05/09/2026. Depois
            disso, os recursos premium serão desativados e nenhuma nova cobrança
            será feita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Manter assinatura</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Cancelar assinatura
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
