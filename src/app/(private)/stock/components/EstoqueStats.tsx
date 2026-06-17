import { type EstoqueStats } from "@/@types/stock.type";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Boxes, DollarSign, Package } from "lucide-react";

interface EstoqueStatsProps {
  stats: EstoqueStats;
}

const STAT_CARDS = (stats: EstoqueStats) => [
  {
    label: "Produtos Cadastrados",
    value: stats.totalProdutos,
    icon: Package,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    label: "Itens em Estoque",
    value: stats.totalItens,
    icon: Boxes,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    label: "Valor Total",
    value: `R$ ${stats.valorTotal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    label: "Estoque Baixo",
    value: stats.baixoEstoque,
    icon: AlertTriangle,
    gradient: "from-rose-500 to-orange-500",
  },
];

export function EstoqueStats({ stats }: EstoqueStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS(stats).map((card) => (
        <Card
          key={card.label}
          className="group relative overflow-hidden border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
