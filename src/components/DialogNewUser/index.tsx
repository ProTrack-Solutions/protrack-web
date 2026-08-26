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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCog, Save, X } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/interfaces/user.interface";
import { CreateUser, UpdateUser } from "@/service/user.service";
import { useDepartments } from "@/hooks/useDepartments";

const roles = [
  { value: "ADMIN", label: "Administrador" },
  { value: "USER", label: "Usuário" },
];

interface FormState {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  department_id: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  username: "",
  password: "",
  role: "",
  department_id: "",
};

interface DialogNewUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  setSelectUser: (user: User | null) => void;
  refetch: () => void;
}

export function DialogNewUser({
  open,
  onOpenChange,
  user,
  setSelectUser,
  refetch,
}: DialogNewUserProps) {
  const [form, setForm] = useState<FormState>(
    user
      ? {
          name: user.name,
          email: user.email,
          username: user.username,
          password: "",
          role: user.role,
          department_id: user.department_id ?? "",
        }
      : emptyForm,
  );
  const { departments } = useDepartments();

  const isEditing = !!user?.id;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    try {
      if (isEditing && user) {
        await UpdateUser(user.id, {
          name: form.name,
          email: form.email,
          username: form.username,
          role: form.role,
          status: user.status,
          department_id: form.department_id,
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await CreateUser({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          department_id: form.department_id,
        });
        toast.success("Usuário criado com sucesso!");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        isEditing ? "Erro ao atualizar usuário!" : "Erro ao criar usuário!",
      );
    } finally {
      onOpenChange(false);
      refetch();
      setForm(emptyForm);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-lg p-0 overflow-hidden"
        onCloseAutoFocus={() => setSelectUser(null)}
      >
        <div className="bg-linear-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/15">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-primary-foreground">
                  {isEditing ? "Editar Usuário" : "Novo Usuário"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  {isEditing
                    ? "Atualize os dados de acesso do usuário."
                    : "Cadastre um novo usuário para acessar o sistema."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="user-name">
              Nome completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="user-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ex: João Silva"
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="nome@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-username"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="Ex: joao.silva"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="user-password">
                Senha <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Crie uma senha provisória"
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {isEditing && (
              <div className="space-y-2">
                <Label>Perfil</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => update("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select
                value={form.department_id}
                onValueChange={(value) => update("department_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
