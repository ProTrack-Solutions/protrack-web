import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface SecurityStatusCardProps {
  twoFactorEnabled: boolean;
}

export function SecurityStatusCard({
  twoFactorEnabled,
}: SecurityStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Status de Segurança
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <span className="text-sm font-medium text-green-800">
              Conta Protegida
            </span>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700"
            >
              Ativo
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Senha forte:</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">2FA:</span>
              <span
                className={
                  twoFactorEnabled
                    ? "text-green-600 font-medium"
                    : "text-yellow-600 font-medium"
                }
              >
                {twoFactorEnabled ? "✓" : "!"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
