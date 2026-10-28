"use client";

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
import { AccountsReceivable } from "@/interfaces/accounts-receivable.interface";
import { formatISODate } from "./receivableActions";

interface ReminderDialogProps {
  account: AccountsReceivable | null;
  kind: "overdue" | "due";
  onCancel: () => void;
  onConfirm: (account: AccountsReceivable) => void;
}

const brl = (value: number) =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Confirmação antes do envio: cada mensagem tem custo e conta no limite do plano */
export function ReminderDialog({ account, kind, onCancel, onConfirm }: ReminderDialogProps) {
  return (
    <AlertDialog open={!!account} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {kind === "overdue" ? "Enviar cobrança pelo WhatsApp?" : "Enviar lembrete de vencimento?"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              {account && (
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-muted/60 p-3 text-foreground">
                  <dt className="text-muted-foreground">Cliente</dt>
                  <dd className="font-medium">{account.customer_name}</dd>
                  <dt className="text-muted-foreground">Valor em aberto</dt>
                  <dd className="font-medium tabular-nums">{brl(account.balance)}</dd>
                  <dt className="text-muted-foreground">Vencimento</dt>
                  <dd className="font-medium">{formatISODate(account.due_date)}</dd>
                </dl>
              )}
              <p>
                {kind === "overdue"
                  ? "O cliente recebe a mensagem de cobrança de parcela vencida no WhatsApp cadastrado."
                  : "O cliente recebe o aviso de que a parcela está para vencer no WhatsApp cadastrado."}{" "}
                A mensagem conta no limite do plano e só pode ser reenviada para esta parcela depois de 24 horas.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Voltar</AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => account && onConfirm(account)}
          >
            Enviar mensagem
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
