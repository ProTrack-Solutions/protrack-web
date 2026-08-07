import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Filter, X } from "lucide-react";
import { useState } from "react";
import { FiltrosReceber } from "..";
import { format } from "date-fns";

interface FormProps {
  value: FiltrosReceber;
  onApply: (filtros: FiltrosReceber) => void;
  onClose: () => void;
  types: { value: string; label: string; hint: string }[];
}

export const FiltrosForm = ({ value, types, onApply, onClose }: FormProps) => {
  const defaultType = types?.[0]?.value ?? "vencimento";
  const [typeDate, setTypeDate] = useState<string>(
    value.typeDate ?? defaultType,
  );
  const [startDate, setStartDate] = useState<Date | undefined>(value.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(value.endDate);

  const limpar = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTypeDate(defaultType);
  };

  const invalido = !!startDate && !!endDate && startDate > endDate;

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold leading-none">Mais Filtros</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          Filtre as contas a receber por período e escolha qual data considerar.
        </p>
      </div>

      <div className="space-y-5 py-4">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Considerar qual data?</Label>
          <RadioGroup
            value={typeDate}
            onValueChange={(v) => setTypeDate(v as string)}
            className="grid gap-2"
          >
            {types.map((t) => (
              <label
                key={t.value}
                htmlFor={`tipo-${t.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  typeDate === t.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <RadioGroupItem
                  value={t.value}
                  id={`tipo-${t.value}`}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium leading-none">{t.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.hint}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-semibold">Período</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: "De", date: startDate, set: setStartDate },
              { label: "Até", date: endDate, set: setEndDate },
            ].map((campo) => (
              <div key={campo.label} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  {campo.label}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campo.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campo.date
                        ? format(campo.date, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campo.date}
                      onSelect={campo.set}
                      autoFocus
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>

          {invalido && (
            <p className="text-xs text-destructive">
              A data inicial não pode ser maior que a data final.
            </p>
          )}
        </div>
      </div>

      <Separator className="mb-3" />

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={limpar} className="gap-2">
          <X className="h-4 w-4" />
          Limpar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={invalido}
            onClick={() => {
              onApply({ typeDate, startDate, endDate });
              onClose();
            }}
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </>
  );
};
