"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ListAnnouncementsResponse } from "@/interfaces/announcements.interface";

interface AlertsCardProps {
  announcements: ListAnnouncementsResponse[];
}

export function AlertsCard({ announcements }: AlertsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!Array.isArray(announcements) || announcements.length === 0 ? (
          <span className="text-sm text-muted-foreground">Não há avisos</span>
        ) : (
          announcements.map((alerta, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  alerta.type === "alta" ? "bg-destructive" : "bg-secondary"
                }`}
              />
              <span className="text-sm text-foreground">{alerta.title}</span>
            </div>
          ))
        )}
        <Button variant="outline" size="sm" className="w-full mt-4">
          Ver Todos os Alertas
        </Button>
      </CardContent>
    </Card>
  );
}
