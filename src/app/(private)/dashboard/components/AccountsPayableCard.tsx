"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface AccountsPayableCardProps {
  totalPendente: number;
}

export function AccountsPayableCard({
  totalPendente,
}: AccountsPayableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Contas a Pagar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-destructive">
              R${" "}
              {totalPendente.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-muted-foreground">Total pendente</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Vencidas</span>
              <span className="font-medium text-destructive">R$ 2.400</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Vencem hoje</span>
              <span className="font-medium text-secondary">R$ 1.800</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Próximos 7 dias</span>
              <span className="font-medium">R$ 4.200</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Gerenciar Contas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
