"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BillsPayable } from "@/interfaces/bills-payable.interface";
import { SheduleBill } from "@/service/bills-payable.service";

interface DialogAgendarPagamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta: BillsPayable | null;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export const DialogSheduledBill = ({
  open,
  onOpenChange,
  conta,
}: DialogAgendarPagamentoProps) => {
  const [scheduledDate, setScheduledDate] = useState<string>(todayISO());

  const diasParaAgendamento = useMemo(() => {
    if (!scheduledDate) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const alvo = new Date(scheduledDate + "T00:00:00");
    const diff = Math.round(
      (alvo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  }, [scheduledDate]);

  const statusAgendamento = useMemo(() => {
    if (diasParaAgendamento === null) return null;
    if (diasParaAgendamento < 0)
      return { label: "Data retroativa", variant: "warning" as const };
    if (diasParaAgendamento === 0)
      return { label: "Agendado para hoje", variant: "info" as const };
    return { label: "Agendamento futuro", variant: "success" as const };
  }, [diasParaAgendamento]);

  const handleSubmit = async () => {
    try {
      await SheduleBill(conta?.id ?? "", {
        scheduled_date: scheduledDate,
      });
      toast.success("Conta agendada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao agendar conta!");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-lg px-0 pb-4 pt-0 overflow-hidden">
        <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-5 text-primary-foreground">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-foreground/15 p-2">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-primary-foreground text-xl">
                  Agendar Pagamento
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Escolha a data em que o pagamento deve ser efetuado.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
          {conta && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {conta.vendor_name}
                </p>
                <Badge variant="outline" className="text-xs">
                  Conta #{conta.id}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {conta.description}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Valor da conta:
                </span>
                <span className="text-sm font-semibold text-foreground">
                  R${" "}
                  {conta.amount?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Data do Agendamento
              </h3>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="scheduled_date">
                Data do agendamento <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="scheduled_date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {scheduledDate && (
            <div
              className={`rounded-lg border p-4 flex items-center justify-between ${
                statusAgendamento?.variant === "success"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : statusAgendamento?.variant === "warning"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusAgendamento?.variant === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle
                    className={`h-5 w-5 ${
                      statusAgendamento?.variant === "warning"
                        ? "text-amber-600"
                        : "text-primary"
                    }`}
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {statusAgendamento?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {diasParaAgendamento === 0
                      ? "O pagamento será efetuado hoje"
                      : diasParaAgendamento && diasParaAgendamento > 0
                        ? `Faltam ${diasParaAgendamento} dia(s) para o pagamento`
                        : `${Math.abs(diasParaAgendamento ?? 0)} dia(s) no passado`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Agendado para</p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(scheduledDate + "T00:00:00").toLocaleDateString(
                    "pt-BR",
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer">
            <Clock className="h-4 w-4 mr-2" />
            Confirmar Agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
