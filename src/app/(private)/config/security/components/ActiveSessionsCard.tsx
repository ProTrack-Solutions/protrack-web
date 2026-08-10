"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import type { SessaoAtiva } from "./types";

interface ActiveSessionsCardProps {
  sessoes: SessaoAtiva[];
}

export function ActiveSessionsCard({ sessoes }: ActiveSessionsCardProps) {
  const handleEncerrarSessao = () => {
    toast.success("A sessão foi encerrada com sucesso.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Sessões Ativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessoes.map((sessao) => (
            <div
              key={sessao.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                {sessao.atual ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-muted" />
                )}
                <div>
                  <h4 className="font-medium text-sm">
                    {sessao.dispositivo}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {sessao.localizacao} • {sessao.ultimoAcesso}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sessao.atual ? (
                  <Badge variant="secondary" className="text-xs">
                    Atual
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEncerrarSessao}
                  >
                    Encerrar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 text-sm">
                Atenção
              </h4>
              <p className="text-xs text-yellow-700">
                Sessões não reconhecidas? Altere sua senha imediatamente.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
