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
import { Separator } from "@/components/ui/separator";
import { Building2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { GetDepartmentsResponse } from "@/interfaces/departments.interface";
import { ModulesResponse } from "@/interfaces/modules.interface";
import {
  CreateDepartments,
  UpdateDepartments,
} from "@/service/departments.service";
import { Checkbox } from "../ui/checkbox";
import { useModules } from "@/hooks/useModules";

export const emptyDepartamento: GetDepartmentsResponse = {
  id: "",
  name: "",
  description: "",
  status: "ativo", // ou "" se preferir
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: new Date(),
  created_by: "",
  updated_by: "",
  deleted_by: "",
  modules: [],
};

interface DialogNewDepartamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento?: GetDepartmentsResponse | null;
  setSelectDepartment: (params: GetDepartmentsResponse | null) => void;
  refetch: () => void;
}

export function DialogNewDepartments({
  open,
  onOpenChange,
  departamento,
  setSelectDepartment,
  refetch,
}: DialogNewDepartamentoProps) {
  const [form, setForm] = useState<GetDepartmentsResponse>(
    departamento ?? emptyDepartamento,
  );

  const { modules } = useModules();

  const isEditing = !!departamento?.id;

  const update = <K extends keyof GetDepartmentsResponse>(
    key: K,
    value: GetDepartmentsResponse[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleModule = (module: ModulesResponse) => {
    setForm((prev) => {
      const alreadySelected = prev.modules.some(
        (mod) => mod.code === module.code,
      );

      return {
        ...prev,
        modules: alreadySelected
          ? prev.modules.filter((mod) => mod.code !== module.code)
          : [...prev.modules, module],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        console.log("form", form);
        await UpdateDepartments(departamento.id, {
          description: form.description,
          name: form.name,
          modules: form.modules,
        });
        toast.success("Departamento atualizado com sucesso!");
      } else {
        await CreateDepartments({
          description: form.description,
          modules: form.modules,
          name: form.name,
        });
        toast.success("Departamento criado com sucesso!");
      }
    } catch (error) {
      console.log(error);
      if (isEditing) {
        toast.error("Erro ao atualizar departamento!");
      } else {
        toast.error("Erro ao criar departamento!");
      }
    } finally {
      onOpenChange(false);
      refetch();
      setForm(emptyDepartamento);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-lg p-0 overflow-hidden"
        onCloseAutoFocus={() => {
          setSelectDepartment(null);
        }}
      >
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
              placeholder="Ex: Financeiro, Vendas, Estoque"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dep-desc">Descrição</Label>
            <Textarea
              id="dep-desc"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Descreva as responsabilidades deste departamento (opcional)"
              rows={4}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto pr-1">
            {modules?.map((m) => {
              const checked = form.modules.some((mod) => mod.code === m.code);
              return (
                <label
                  key={m.code}
                  htmlFor={`mod-${m.code}`}
                  className={`flex items-start gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                    checked
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    id={`mod-${m.code}`}
                    checked={checked}
                    onCheckedChange={() => toggleModule(m)}
                    className="mt-0.5"
                  />
                  <span className="space-y-0.5">
                    <span className="block text-sm font-medium leading-none">
                      {m.name}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <Separator />
        </div>

        <DialogFooter className="px-6 pb-6 gap-2 bg-transparent">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button className="gap-2" onClick={() => handleSubmit()}>
            <Save className="h-4 w-4" />
            {isEditing ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
