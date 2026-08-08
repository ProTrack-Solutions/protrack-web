import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { PlansResponse } from "@/interfaces/plans.interface";

interface CurrentPlanCardProps {
  plano: PlansResponse;
  status: string;
  proximaCobranca: string;
  onUpgrade: () => void;
  onCancel: () => void;
  onReactivate: () => void;
}

export function CurrentPlanCard({
  plano,
  status,
  proximaCobranca,
  onUpgrade,
  onCancel,
  onReactivate,
}: CurrentPlanCardProps) {
  return (
    <Card className="lg:col-span-2 border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Plano {plano.name}
            </CardTitle>
            <CardDescription>{plano.description}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              status == "canceled"
                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
            }
          >
            {status == "canceled" ? "Cancelada" : "Ativa"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {[...plano.features]
            .filter((f) => f.is_enabled)
            .sort((a, b) => a.display_order - b.display_order)
            .map((f) => (
              <div key={f.id} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{f.name}</span>
              </div>
            ))}
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" /> Usuários
              </span>
              <span className="font-medium">6 de 10</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" /> Ciclo atual
              </span>
              <span className="font-medium">
                {status == "canceled"
                  ? `Encerra em ${proximaCobranca}`
                  : `Renova em ${proximaCobranca}`}
              </span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={onUpgrade}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Fazer upgrade
          </Button>
          {status == "canceled" ? (
            <Button variant="outline" onClick={onReactivate}>
              Reativar assinatura
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onCancel}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar assinatura
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
