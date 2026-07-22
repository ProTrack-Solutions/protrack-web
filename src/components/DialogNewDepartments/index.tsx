"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Save, X } from "lucide-react";
import { toast } from "sonner";

export interface DepartamentoData {
  id?: string;
  name: string;
  description: string;
  active: boolean;
}

const emptyDepartamento: DepartamentoData = {
  name: "",
  description: "",
  active: true,
};

interface DialogNewDepartamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento?: DepartamentoData | null;
  onConfirm?: (data: DepartamentoData) => void;
}

export function DialogNewDepartments({
  open,
  onOpenChange,
  departamento,
  onConfirm,
}: DialogNewDepartamentoProps) {
  const [form, setForm] = useState<DepartamentoData>(emptyDepartamento);

  const isEditing = !!departamento?.id;

  const update = <K extends keyof DepartamentoData>(
    key: K,
    value: DepartamentoData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do departamento.");
      return;
    }
    onConfirm?.({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    });
    toast.success(
      isEditing ? "Departamento atualizado." : "Departamento cadastrado.",
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="bg-linear-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/15">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-primary-foreground">
                  {isEditing ? "Editar Departamento" : "Novo Departamento"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Organize as áreas e setores da sua empresa.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="dep-name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dep-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ex: Financeiro, Vendas, Estoque..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dep-desc">Descrição</Label>
            <Textarea
              id="dep-desc"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Descreva a função ou responsabilidades deste departamento..."
              rows={4}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="dep-active" className="cursor-pointer">
                Departamento ativo
              </Label>
              <p className="text-xs text-muted-foreground">
                Departamentos inativos não ficam disponíveis para seleção.
              </p>
            </div>
            <Switch
              id="dep-active"
              checked={form.active}
              onCheckedChange={(v) => update("active", v)}
            />
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            {isEditing ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
