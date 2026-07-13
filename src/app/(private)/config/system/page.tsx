"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - Configurações gerais, idioma, fuso horário.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
