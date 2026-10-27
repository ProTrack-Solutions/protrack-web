import { EstoqueStatsProps } from "@/interfaces/products.interface";
import { Kpi } from "@/components/DashCard";
import { AlertTriangle, Boxes, Package, Wallet } from "lucide-react";

const integer = (value: number) => Math.round(value).toLocaleString("pt-BR");

export function EstoqueStats({
  itensInStock,
  lowItensInStock,
  productsCount,
  totalValueInStock,
  loading,
}: EstoqueStatsProps & { loading: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        tone="primary"
        label="Valor em estoque"
        icon={<Wallet className="h-4 w-4" />}
        loading={loading}
        value={totalValueInStock}
        footer="Soma dos produtos disponíveis"
        delay={0}
      />
      <Kpi
        tone="plain"
        label="Produtos cadastrados"
        icon={<Package className="h-4 w-4 text-primary" />}
        loading={loading}
        value={productsCount}
        format={integer}
        footer="Itens diferentes no catálogo"
        delay={60}
      />
      <Kpi
        tone="plain"
        label="Itens em estoque"
        icon={<Boxes className="h-4 w-4 text-secondary" />}
        loading={loading}
        value={itensInStock}
        format={integer}
        footer="Unidades disponíveis para venda"
        delay={120}
      />
      <Kpi
        tone="plain"
        label="Estoque baixo"
        icon={
          <AlertTriangle
            className={`h-4 w-4 ${lowItensInStock > 0 ? "text-destructive" : "text-muted-foreground"}`}
          />
        }
        loading={loading}
        value={lowItensInStock}
        format={integer}
        accent={lowItensInStock > 0 ? "text-destructive" : "text-foreground"}
        footer={
          lowItensInStock > 0 ? (
            <span className="font-semibold text-destructive">
              Precisam de reposição
            </span>
          ) : (
            "Nenhum produto acabando"
          )
        }
        delay={180}
      />
    </div>
  );
}
