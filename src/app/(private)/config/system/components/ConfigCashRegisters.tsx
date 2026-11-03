import { useState } from "react";
import { Check, Monitor, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/DashCard";
import { CashRegister } from "@/interfaces/cash-register.interface";
import {
  useCashRegisterAdmin,
  useCashRegisters,
} from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";

function RegisterRow({ register }: { register: CashRegister }) {
  const { update } = useCashRegisterAdmin();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(register.name);

  const save = (params: { name: string; active: boolean }, done: string) =>
    update.mutate(
      { id: register.id, ...params },
      {
        onSuccess: () => {
          toast.success(done);
          setEditing(false);
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao salvar o caixa")),
      },
    );

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <Monitor className="h-4 w-4 shrink-0 text-muted-foreground" />
      {editing ? (
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim())
              save(
                { name: name.trim(), active: register.active },
                "Caixa renomeado",
              );
          }}
        >
          <Input
            autoFocus
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            className="h-8"
            aria-label="Nome do caixa"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            aria-label="Salvar"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            aria-label="Cancelar"
            onClick={() => {
              setName(register.name);
              setEditing(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium ${register.active ? "" : "text-muted-foreground line-through"}`}
          >
            {register.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {register.open_session
              ? `Turno aberto por ${register.open_session.opened_by_name}`
              : register.active
                ? "Fechado"
                : "Desativado"}
          </p>
        </div>
      )}
      {!editing && (
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
          aria-label="Renomear"
          onClick={() => setEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <Switch
        className="cursor-pointer"
        checked={register.active}
        disabled={update.isPending}
        aria-label={register.active ? "Desativar caixa" : "Ativar caixa"}
        onCheckedChange={(active) =>
          save(
            { name: register.name, active },
            active ? "Caixa ativado" : "Caixa desativado",
          )
        }
      />
    </li>
  );
}

/** Cadastro dos caixas físicos da empresa */
export const ConfigCashRegisters = () => {
  const { data: registers, isLoading } = useCashRegisters();
  const { create } = useCashRegisterAdmin();
  const [name, setName] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success("Caixa cadastrado");
          setName("");
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao cadastrar o caixa")),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Monitor className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Caixas da loja</CardTitle>
            <CardDescription>
              Cadastre cada gaveta física. Vários funcionários podem vender no
              mesmo caixa aberto; cada computador escolhe em qual caixa
              trabalha. Com um caixa só, nada precisa ser escolhido.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <ul className="space-y-2">
            {registers?.map((r) => (
              <RegisterRow key={r.id} register={r} />
            ))}
          </ul>
        )}
        <form onSubmit={add} className="flex gap-2">
          <Input
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Caixa 2, Balcão"
            aria-label="Nome do novo caixa"
          />
          <Button
            type="submit"
            disabled={create.isPending || !name.trim()}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
