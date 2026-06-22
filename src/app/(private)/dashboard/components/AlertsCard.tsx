"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AlertaItem {
  tipo: string;
  mensagem: string;
  urgencia: string;
}

interface AlertsCardProps {
  data: AlertaItem[];
}

export function AlertsCard({ data }: AlertsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((alerta, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                alerta.urgencia === "alta" ? "bg-destructive" : "bg-secondary"
              }`}
            />
            <span className="text-sm text-foreground">{alerta.mensagem}</span>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full mt-4">
          Ver Todos os Alertas
        </Button>
      </CardContent>
    </Card>
  );
}
