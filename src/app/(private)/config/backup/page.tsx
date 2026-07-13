"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BackupConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - Backup automático, exportação e importação de dados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
