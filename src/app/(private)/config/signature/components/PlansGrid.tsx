import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Plano, planos, brl } from "./types";

interface PlansGridProps {
  planoAtual: Plano;
  onSelect: (plano: Plano) => void;
}

export function PlansGrid({ planoAtual, onSelect }: PlansGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {planos.map((p) => {
        const atual = p.id === planoAtual.id;
        const upgrade = p.preco > planoAtual.preco;
        return (
          <Card
            key={p.id}
            className={`relative border-border/60 shadow-sm transition-all hover:shadow-md ${
              atual ? "ring-2 ring-blue-600" : ""
            }`}
          >
            {p.destaque && !atual && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Mais popular
              </span>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{p.nome}</CardTitle>
                {atual && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400"
                  >
                    Atual
                  </Badge>
                )}
              </div>
              <CardDescription>{p.descricao}</CardDescription>
              <p className="pt-2 text-3xl font-bold">
                {brl(p.preco)}
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {p.recursos.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
              <Button
                className={`w-full ${atual ? "" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                variant={atual ? "outline" : "default"}
                disabled={atual}
                onClick={() => onSelect(p)}
              >
                {atual
                  ? "Plano atual"
                  : upgrade
                    ? "Fazer upgrade"
                    : "Fazer downgrade"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
