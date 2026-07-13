"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - Configurações de perfil, preferências e dados pessoais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
