import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriaValor } from "../page";

interface CategoriaCardProps {
  titulo: string;
  categorias: CategoriaValor[];
  corBarra: "bg-secondary" | "bg-destructive";
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
          <div key={categoria.categoria} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{categoria.categoria}</span>
              <span className="text-sm text-muted-foreground">
                R${" "}
                {categoria.valor.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`${corBarra} h-2 rounded-full transition-all`}
                style={{ width: `${categoria.percentual}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {categoria.percentual}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
