"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntegrationsConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Integrações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - APIs externas, webhooks, conectores de terceiros.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
