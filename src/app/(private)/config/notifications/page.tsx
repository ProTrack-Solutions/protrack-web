"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsConfigPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento - E-mail, push notifications, alertas personalizados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
