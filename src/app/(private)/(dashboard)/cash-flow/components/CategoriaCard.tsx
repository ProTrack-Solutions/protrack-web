import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TotalCategoriesInFlow,
  TotalCategoriesOutFlow,
} from "@/interfaces/cash-flow.interface";

interface CategoriaCardProps {
  titulo: string;
  categorias: TotalCategoriesInFlow[] | TotalCategoriesOutFlow[];
  corBarra: "bg-secondary" | "bg-destructive";
}

function getTotal(categoria: TotalCategoriesInFlow | TotalCategoriesOutFlow) {
  return "total_inflow" in categoria
    ? categoria.total_inflow
    : categoria.total_outflow;
}

export function CategoriaCard({
  titulo,
  categorias,
  corBarra,
}: CategoriaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categorias.map((categoria) => (
          <div key={categoria.name_category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {categoria.name_category}
              </span>
              <span className="text-sm text-muted-foreground">
                R${getTotal(categoria)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`${corBarra} h-2 rounded-full transition-all`}
                style={{ width: `${categoria.percentage_in_flow}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {categoria.percentage_in_flow}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
