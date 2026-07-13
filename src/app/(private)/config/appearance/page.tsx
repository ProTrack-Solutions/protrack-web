"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppearanceConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Aparência</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - Tema claro/escuro, cores, layout personalizado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
