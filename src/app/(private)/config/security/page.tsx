"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - Senhas, autenticação de dois fatores, permissões.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
