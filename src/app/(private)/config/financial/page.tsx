"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  CreditCard,
  Tag,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Save,
  Bell,
} from "lucide-react";
import { toast } from "sonner";

interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  saldo: number;
  ativa: boolean;
}

interface MetodoPagamento {
  id: string;
  nome: string;
  tipo: "dinheiro" | "cartao" | "pix" | "transferencia";
  ativo: boolean;
}

interface Categoria {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
}

export default function FinancialConfigPage() {
  // Estados para contas bancárias
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([
    {
      id: "1",
      nome: "Conta Principal",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      conta: "12345-6",
      saldo: 45200.3,
      ativa: true,
    },
    {
      id: "2",
      nome: "Conta Reserva",
      banco: "Banco Itaú",
      agencia: "5678-9",
      conta: "67890-1",
      saldo: 18500.5,
      ativa: true,
    },
  ]);

  // Estados para métodos de pagamento
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>([
    { id: "1", nome: "Dinheiro", tipo: "dinheiro", ativo: true },
    { id: "2", nome: "Cartão de Débito", tipo: "cartao", ativo: true },
    { id: "3", nome: "Cartão de Crédito", tipo: "cartao", ativo: true },
    { id: "4", nome: "PIX", tipo: "pix", ativo: true },
    {
      id: "5",
      nome: "Transferência Bancária",
      tipo: "transferencia",
      ativo: false,
    },
  ]);

  // Estados para categorias
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: "1", nome: "Vendas", tipo: "receita", cor: "#22c55e" },
    { id: "2", nome: "Serviços", tipo: "receita", cor: "#3b82f6" },
    { id: "3", nome: "Mercadorias", tipo: "despesa", cor: "#ef4444" },
    { id: "4", nome: "Salários", tipo: "despesa", cor: "#f97316" },
    { id: "5", nome: "Utilidades", tipo: "despesa", cor: "#8b5cf6" },
    { id: "6", nome: "Marketing", tipo: "despesa", cor: "#ec4899" },
  ]);

  const [alertas, setAlertas] = useState({
    contasVencidas: true,
    estoqueMinimo: true,
    fluxoCaixaNegativo: true,
    metaVendas: false,
    limiteCredito: true,
  });

  // Estados para limites
  const [limites, setLimites] = useState({
    limiteDiario: 5000,
    limiteSemanal: 25000,
    limiteMensal: 100000,
    alertaFluxoCaixa: 10000,
  });

  const handleSalvarConfiguracoes = () => {
    toast("As configurações financeiras foram atualizadas com sucesso.");
  };

  const handleAdicionarConta = () => {
    toast("Funcionalidade para adicionar nova conta bancária.");
  };

  const handleEditarConta = (id: string) => {
    toast(`Editando conta bancária ID: ${id}`);
  };

  const handleExcluirConta = (id: string) => {
    setContasBancarias((contas) => contas.filter((c) => c.id !== id));
    toast("A conta bancária foi removida com sucesso.");
  };

  const handleToggleMetodo = (id: string) => {
    setMetodosPagamento((metodos) =>
      metodos.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m)),
    );
  };

  const handleAdicionarCategoria = () => {
    toast("Funcionalidade para adicionar nova categoria.");
  };

  const getTipoMetodoIcon = (tipo: string) => {
    switch (tipo) {
      case "dinheiro":
        return "💵";
      case "cartao":
        return "💳";
      case "pix":
        return "📱";
      case "transferencia":
        return "🏦";
      default:
        return "💰";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configurações Financeiras
        </h1>
        <p className="text-muted-foreground">
          Configure contas, métodos de pagamento, categorias e alertas
        </p>
      </div>

      {/* Contas Bancárias */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Contas Bancárias
            </CardTitle>
            <Button onClick={handleAdicionarConta}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Agência</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contasBancarias.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.nome}</TableCell>
                  <TableCell>{conta.banco}</TableCell>
                  <TableCell>{conta.agencia}</TableCell>
                  <TableCell>{conta.conta}</TableCell>
                  <TableCell>
                    R${" "}
                    {conta.saldo.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={conta.ativa ? "secondary" : "outline"}>
                      {conta.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditarConta(conta.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExcluirConta(conta.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Métodos de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metodosPagamento.map((metodo) => (
              <div
                key={metodo.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getTipoMetodoIcon(metodo.tipo)}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{metodo.nome}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {metodo.tipo}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={metodo.ativo}
                  onCheckedChange={() => handleToggleMetodo(metodo.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Categorias de Receitas e Despesas
            </CardTitle>
            <Button onClick={handleAdicionarCategoria}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Receitas</h4>
              <div className="space-y-2">
                {categorias
                  .filter((c) => c.tipo === "receita")
                  .map((categoria) => (
                    <div
                      key={categoria.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoria.cor }}
                        />
                        <span className="font-medium">{categoria.nome}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Despesas</h4>
              <div className="space-y-2">
                {categorias
                  .filter((c) => c.tipo === "despesa")
                  .map((categoria) => (
                    <div
                      key={categoria.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoria.cor }}
                        />
                        <span className="font-medium">{categoria.nome}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limites e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Limites de Fluxo de Caixa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Limite Diário (R$)</Label>
                <Input
                  type="number"
                  value={limites.limiteDiario}
                  onChange={(e) =>
                    setLimites((prev) => ({
                      ...prev,
                      limiteDiario: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Limite Semanal (R$)</Label>
                <Input
                  type="number"
                  value={limites.limiteSemanal}
                  onChange={(e) =>
                    setLimites((prev) => ({
                      ...prev,
                      limiteSemanal: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Limite Mensal (R$)</Label>
                <Input
                  type="number"
                  value={limites.limiteMensal}
                  onChange={(e) =>
                    setLimites((prev) => ({
                      ...prev,
                      limiteMensal: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alerta Fluxo de Caixa (R$)</Label>
                <Input
                  type="number"
                  value={limites.alertaFluxoCaixa}
                  onChange={(e) =>
                    setLimites((prev) => ({
                      ...prev,
                      alertaFluxoCaixa: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Configurações de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contas Vencidas</p>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre contas em atraso
                  </p>
                </div>
                <Switch
                  checked={alertas.contasVencidas}
                  onCheckedChange={(checked) =>
                    setAlertas((prev) => ({
                      ...prev,
                      contasVencidas: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estoque Mínimo</p>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre produtos com estoque baixo
                  </p>
                </div>
                <Switch
                  checked={alertas.estoqueMinimo}
                  onCheckedChange={(checked) =>
                    setAlertas((prev) => ({
                      ...prev,
                      estoqueMinimo: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fluxo de Caixa Negativo</p>
                  <p className="text-sm text-muted-foreground">
                    Alertar quando saldo ficar negativo
                  </p>
                </div>
                <Switch
                  checked={alertas.fluxoCaixaNegativo}
                  onCheckedChange={(checked) =>
                    setAlertas((prev) => ({
                      ...prev,
                      fluxoCaixaNegativo: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Meta de Vendas</p>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre metas não atingidas
                  </p>
                </div>
                <Switch
                  checked={alertas.metaVendas}
                  onCheckedChange={(checked) =>
                    setAlertas((prev) => ({
                      ...prev,
                      metaVendas: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Limite de Crédito</p>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre limites excedidos
                  </p>
                </div>
                <Switch
                  checked={alertas.limiteCredito}
                  onCheckedChange={(checked) =>
                    setAlertas((prev) => ({
                      ...prev,
                      limiteCredito: checked,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSalvarConfiguracoes}
          className="bg-gradient-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}
