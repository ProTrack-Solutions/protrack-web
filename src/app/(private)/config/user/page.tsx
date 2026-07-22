"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { useMe } from "@/hooks/useMe";
import { UpdateUserParams } from "@/interfaces/user.interface";
import { formatDate, formatDateTime } from "@/utils/dateFormat";
import { UpdateUser } from "@/service/user.service";

const departamentos = [
  { value: "1", label: "Administrativo" },
  { value: "2", label: "Financeiro" },
  { value: "3", label: "Vendas" },
  { value: "4", label: "Estoque" },
];

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useMe();

  const form = useForm<UpdateUserParams>({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "",
      department_id: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        username: user.username ?? "",
        role: user.role ?? "",
        department_id: user.department_id ? String(user.department_id) : "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateUserParams) => {
    try {
      UpdateUser(user?.id ?? "", data);
      toast.success("Dados do usuario atualizado!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar dados do usuario");
    } finally {
      setIsEditing(false);
    }
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
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <Badge className={getStatusColor(user?.status ?? "")}>
              {user?.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user?.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user?.department_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Último login: {formatDateTime(user?.last_login_at ?? "")}
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
                    name="department_id"
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
                  <p className="font-medium">#{user?.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium capitalize">{user?.status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Data de Cadastro
                  </Label>
                  <p className="font-medium">
                    {formatDate(user?.created_at ?? "")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Última Atualização
                  </Label>
                  <p className="font-medium">
                    {formatDate(user?.updated_at ?? "")}
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
