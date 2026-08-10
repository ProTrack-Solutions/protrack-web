"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Smartphone } from "lucide-react";
import { toast } from "sonner";
import type { Configuracoes2FA } from "./types";

interface TwoFactorAuthCardProps {
  config: Configuracoes2FA;
  onActivate: () => void;
  onDeactivate: () => void;
  onOptionChange: (
    field: "emailBackup" | "codigoRecuperacao",
    checked: boolean,
  ) => void;
}

export function TwoFactorAuthCard({
  config,
  onActivate,
  onDeactivate,
  onOptionChange,
}: TwoFactorAuthCardProps) {
  const [emSetup2FA, setEmSetup2FA] = useState(false);
  const [codigo2FA, setCodigo2FA] = useState("");

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setEmSetup2FA(true);
      setCodigo2FA("");
      return;
    }
    onDeactivate();
    setEmSetup2FA(false);
    toast.success("Autenticação de dois fatores foi desabilitada.");
  };

  const handleConfirmar2FA = () => {
    if (codigo2FA.length !== 6) {
      toast.error(
        "Informe o código de 6 dígitos do aplicativo autenticador.",
      );
      return;
    }
    onActivate();
    setEmSetup2FA(false);
    setCodigo2FA("");
    toast.success("Verificação em duas etapas habilitada com sucesso.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Autenticação de Dois Fatores (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h4 className="font-medium">Ativar 2FA</h4>
            <p className="text-sm text-muted-foreground">
              Proteja sua conta com verificação em duas etapas
            </p>
          </div>
          <Switch checked={config.ativo} onCheckedChange={handleToggle} />
        </div>

        {emSetup2FA && !config.ativo && (
          <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
            <div>
              <h4 className="font-medium text-sm">1. Escaneie o QR Code</h4>
              <p className="text-xs text-muted-foreground">
                Use Google Authenticator, Authy ou similar.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="h-40 w-40 rounded-lg bg-background border grid grid-cols-8 grid-rows-8 gap-0.5 p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${(i * 7 + (i % 5)) % 3 === 0 ? "bg-foreground" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Ou insira a chave manualmente:
              </p>
              <code className="block text-center text-sm font-mono p-2 rounded bg-background border tracking-widest">
                JBSW Y3DP EHPK 3PXP
              </code>
            </div>
            <Separator />
            <div>
              <Label htmlFor="codigo-2fa">
                2. Digite o código de 6 dígitos
              </Label>
              <Input
                id="codigo-2fa"
                inputMode="numeric"
                maxLength={6}
                value={codigo2FA}
                onChange={(e) =>
                  setCodigo2FA(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="text-center tracking-[0.5em] font-mono"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEmSetup2FA(false)}
              >
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleConfirmar2FA}>
                Confirmar e ativar
              </Button>
            </div>
          </div>
        )}

        {config.ativo && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email de backup</span>
              <Switch
                checked={config.emailBackup}
                onCheckedChange={(checked) =>
                  onOptionChange("emailBackup", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Códigos de recuperação</span>
              <Switch
                checked={config.codigoRecuperacao}
                onCheckedChange={(checked) =>
                  onOptionChange("codigoRecuperacao", checked)
                }
              />
            </div>

            <Separator />

            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Aplicativo Autenticador
            </Button>

            <Button variant="outline" size="sm" className="w-full">
              Gerar Códigos de Recuperação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
