import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  CheckCircle2,
  Power,
  RefreshCw,
  Smartphone,
  Info,
  QrCode,
  Loader2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type WhatsAppStatus = "disconnected" | "connecting" | "connected";

export const ConfigWhatsApp = () => {
  const [status, setStatus] = useState<WhatsAppStatus>("disconnected");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sessionName, setSessionName] = useState("Principal");
  const [connectedAt, setConnectedAt] = useState<string | null>(null);

  const handleGenerateQR = () => {
    setStatus("connecting");
    // QR Code mockado (placeholder visual)
    setQrCode(
      `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=whatsapp-session-${Date.now()}`,
    );
    toast.info("QR Code gerado. Escaneie com seu WhatsApp.");
  };

  const handleRefreshQR = () => {
    setQrCode(
      `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=whatsapp-session-${Date.now()}`,
    );
    toast.success("QR Code atualizado.");
  };

  const handleSimulateConnect = () => {
    setStatus("connected");
    setConnectedAt(new Date().toLocaleString("pt-BR"));
    setPhoneNumber("+55 11 99999-9999");
    setQrCode(null);
    toast.success("WhatsApp conectado com sucesso!");
  };

  const handleDisconnect = () => {
    setStatus("disconnected");
    setQrCode(null);
    setConnectedAt(null);
    setPhoneNumber("");
    toast.success("WhatsApp desconectado.");
  };

  const statusBadge = {
    disconnected: (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" /> Desconectado
      </Badge>
    ),
    connecting: (
      <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
        <Loader2 className="h-3 w-3 animate-spin" /> Aguardando leitura
      </Badge>
    ),
    connected: (
      <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Conectado
      </Badge>
    ),
  }[status];

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Conexão WhatsApp</CardTitle>
                <CardDescription>
                  Conecte sua conta escaneando o QR Code com o aplicativo do
                  WhatsApp.
                </CardDescription>
              </div>
            </div>
            {statusBadge}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configurações da Sessão */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="session">Nome da Sessão</Label>
              <Input
                id="session"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Ex: Principal, Vendas..."
                disabled={status !== "disconnected"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Número Conectado</Label>
              <Input
                id="phone"
                value={phoneNumber}
                placeholder="Aparecerá após conectar"
                disabled
              />
            </div>
          </div>

          <Separator />

          {/* Área do QR Code */}
          {status === "connected" ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold">WhatsApp conectado</p>
                <p className="text-sm text-muted-foreground">
                  Conectado em {connectedAt}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="gap-2"
              >
                <Power className="h-4 w-4" /> Desconectar
              </Button>
            </div>
          ) : qrCode ? (
            <div className="grid gap-6 md:grid-cols-[auto_1fr] items-start">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-white rounded-xl border shadow-sm">
                  <Image
                    src={qrCode}
                    alt="QR Code WhatsApp"
                    width={260}
                    height={260}
                    unoptimized
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshQR}
                  className="gap-2"
                >
                  <RefreshCw className="h-3 w-3" /> Atualizar QR Code
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Como conectar
                  </h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>
                      Toque em <strong>Mais opções</strong> ou{" "}
                      <strong>Configurações</strong>
                    </li>
                    <li>
                      Selecione <strong>Aparelhos conectados</strong>
                    </li>
                    <li>
                      Toque em <strong>Conectar um aparelho</strong>
                    </li>
                    <li>Aponte a câmera para este QR Code</li>
                  </ol>
                </div>

                <div className="rounded-lg border bg-muted/50 p-3 flex gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">
                    O QR Code expira em alguns minutos. Caso isso ocorra, clique
                    em atualizar para gerar um novo.
                  </p>
                </div>

                <Button
                  onClick={handleSimulateConnect}
                  variant="secondary"
                  className="w-full"
                >
                  Simular conexão (demo)
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed rounded-lg">
              <div className="p-4 rounded-full bg-muted">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1 max-w-sm">
                <p className="font-semibold">Nenhuma sessão ativa</p>
                <p className="text-sm text-muted-foreground">
                  Gere um QR Code para conectar seu WhatsApp e começar a enviar
                  mensagens automaticamente.
                </p>
              </div>
              <Button onClick={handleGenerateQR} className="gap-2">
                <QrCode className="h-4 w-4" /> Gerar QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card informativo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sobre a integração</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            A conexão é feita via WhatsApp Web. Mantenha seu celular conectado à
            internet para que as mensagens sejam enviadas corretamente.
          </p>
          <p>
            Você pode desconectar a qualquer momento por aqui ou diretamente
            pelo aplicativo do WhatsApp em <strong>Aparelhos conectados</strong>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
