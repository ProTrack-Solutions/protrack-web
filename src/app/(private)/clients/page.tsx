"use client";

import { useState } from "react";
import {
  Search,
  Edit,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Header } from "@/components/Header";
import { FilterShearch } from "@/components/FilterShearch";

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  status: "ativo" | "inativo";
  type: "pf" | "pj";
  created_at: string;
  updated_at: string;
}

const mockClientes: Cliente[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    document: "123.456.789-00",
    address: "Rua das Flores, 123 - São Paulo, SP",
    status: "ativo",
    type: "pf",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 2,
    name: "Maria Santos Comércio LTDA",
    email: "contato@mariasantos.com.br",
    phone: "(11) 3333-4444",
    document: "12.345.678/0001-90",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    status: "ativo",
    type: "pj",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-03-10T14:30:00Z",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    phone: "(21) 91234-5678",
    document: "987.654.321-00",
    address: "Rua do Sol, 456 - Rio de Janeiro, RJ",
    status: "inativo",
    type: "pf",
    created_at: "2023-11-05T09:00:00Z",
    updated_at: "2023-12-01T16:00:00Z",
  },
  {
    id: 4,
    name: "Ana Oliveira ME",
    email: "ana@oliveirame.com.br",
    phone: "(31) 3222-1111",
    document: "98.765.432/0001-10",
    address: "Rua da Lua, 789 - Belo Horizonte, MG",
    status: "ativo",
    type: "pj",
    created_at: "2024-03-01T11:00:00Z",
    updated_at: "2024-03-01T11:00:00Z",
  },
];

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.document.includes(searchTerm) ||
      cliente.phone.includes(searchTerm),
  );

  const getStatusBadge = (status: Cliente["status"]) => {
    const variants = {
      ativo: "bg-green-100 text-green-800 hover:bg-green-100",
      inativo: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return (
      <Badge className={variants[status]}>
        {status === "ativo" ? "Ativo" : "Inativo"}
      </Badge>
    );
  };

  const getTypeLabel = (type: Cliente["type"]) => {
    return type === "pf" ? "Pessoa Física" : "Pessoa Jurídica";
  };

  const toggleClienteStatus = (clienteId: number) => {
    setClientes((prev) =>
      prev.map((cliente) =>
        cliente.id === clienteId
          ? {
              ...cliente,
              status:
                cliente.status === "ativo"
                  ? ("inativo" as const)
                  : ("ativo" as const),
              updated_at: new Date().toISOString(),
            }
          : cliente,
      ),
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página clientes!"
        text="Aqui você pode visualizar todos os clientes cadastrados no sistema.."
      />

      <FilterShearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Tabela de Clientes */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{cliente.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cliente.address}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getTypeLabel(cliente.type)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {cliente.email}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {cliente.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {cliente.document}
                </TableCell>
                <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                <TableCell>
                  {new Date(cliente.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleClienteStatus(cliente.id)}
                    >
                      {cliente.status === "ativo" ? (
                        <UserX className="h-4 w-4 text-red-600" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredClientes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cliente encontrado
          </div>
        )}
      </Card>
    </div>
  );
}
