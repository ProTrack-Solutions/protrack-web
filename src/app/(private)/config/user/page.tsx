"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Building, Clock } from "lucide-react";
import { toast } from "sonner";

const perfilSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  username: z
    .string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .optional(),
  role: z.string(),
  departamento_id: z.string().optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

// Dados mock do usuário
const mockUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@empresa.com",
  username: "joaosilva",
  role: "admin",
  status: "ativo",
  empresa_id: 1,
  departamento_id: 2,
  ultimo_login: "2024-01-15T10:30:00",
  created_at: "2023-06-15T09:00:00",
  updated_at: "2024-01-10T14:20:00",
};

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "financeiro", label: "Financeiro" },
  { value: "vendas", label: "Vendas" },
  { value: "user", label: "Usuário" },
];

const departamentos = [
  { value: "1", label: "Administrativo" },
  { value: "2", label: "Financeiro" },
  { value: "3", label: "Vendas" },
  { value: "4", label: "Estoque" },
];

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      username: mockUser.username,
      role: mockUser.role,
      departamento_id: mockUser.departamento_id?.toString(),
    },
  });

  const onSubmit = (data: PerfilFormData) => {
    console.log("Dados do perfil:", data);
    toast.success("Suas informações foram atualizadas com sucesso.");
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-success text-success-foreground";
      case "inativo":
        return "bg-secondary text-secondary-foreground";
      case "bloqueado":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleLabel = (role: string) => {
    return roles.find((r) => r.value === role)?.label || role;
  };

  const getDepartamentoLabel = (departamentoId: number) => {
    return (
      departamentos.find((d) => d.value === departamentoId.toString())?.label ||
      "Não informado"
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card do Avatar e Informações Básicas */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-2xl">
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{mockUser.name}</CardTitle>
            <CardDescription>{mockUser.email}</CardDescription>
            <Badge className={getStatusColor(mockUser.status)}>
              {mockUser.status.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{getRoleLabel(mockUser.role)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {getDepartamentoLabel(mockUser.departamento_id!)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Último login:{" "}
                {new Date(mockUser.ultimo_login).toLocaleString("pt-BR")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card do Formulário */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            className="flex items-center gap-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="departamento_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departamentos.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar Alterações</Button>
                  </div>
                )}
              </form>
            </Form>

            <Separator className="my-6" />

            {/* Informações de Sistema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">ID do Usuário</Label>
                  <p className="font-medium">#{mockUser.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium capitalize">{mockUser.status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data de Cadastro
                  </Label>
                  <p className="font-medium">
                    {new Date(mockUser.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Última Atualização
                  </Label>
                  <p className="font-medium">
                    {new Date(mockUser.updated_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
