"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface SalesSummaryProps {
  data: {
    mesAtual: number;
    mesAnterior: number;
    crescimento: number;
  };
}

export function SalesSummaryCard({ data }: SalesSummaryProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resumo de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Vendas do Mês</p>
            <p className="text-2xl font-bold text-foreground">
              R${" "}
              {data.mesAtual.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-white">
                +{data.crescimento}%
              </Badge>
              <span className="text-sm text-muted-foreground">
                vs mês anterior
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mês Anterior</p>
            <p className="text-xl font-semibold text-muted-foreground">
              R${" "}
              {data.mesAnterior.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
