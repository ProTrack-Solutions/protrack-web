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
  ConnectInstance,
  CreateInstance,
  DeleteInstance,
} from "@/service/whatsapp.service";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { SimpleLoading } from "@/components/SimpleLoading";

export const ConfigWhatsApp = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeResp, setQrCodeResp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { connectionsState, loading, refetch, pausePolling } = useWhatsApp();

  const handleGenerateQR = async (status: string) => {
    try {
      setIsLoading(true);
      if (status == "not_created") {
        pausePolling(15000);
        const qrCode = await CreateInstance();
        setQrCodeResp(qrCode.qr_code);
      } else {
        pausePolling(5000);
        const qrCode = await ConnectInstance();
        setQrCodeResp(qrCode.qr_code);
      }

      toast.success("QR Code gerado. Escaneie com seu WhatsApp.");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("Erro ao gerar QrCode.");
    } finally {
      setIsLoading(false);
      refetch();
    }
  };

  useEffect(() => {
    if (qrCodeResp) {
      // Converte a string do WhatsApp em uma Data URL (Base64)
      QRCode.toDataURL(qrCodeResp)
        .then((url) => setQrCode(url))
        .catch((err) => console.error("Erro ao gerar QR Code:", err));
    }
  }, [qrCodeResp]);

  const handleRefreshQR = async () => {
    try {
      const qrCode = await ConnectInstance();
      setQrCodeResp(qrCode.qr_code);
      toast.success("QR Code atualizado.");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar qrCode");
    } finally {
      refetch();
    }
  };

  const handleDisconnect = async () => {
    try {
      await DeleteInstance();
      toast.success("WhatsApp desconectado.");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao se desconectar!");
    } finally {
      refetch();
      setQrCodeResp("");
    }
  };

  const statusBadge = {
    not_created: (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" /> Desconectado
      </Badge>
    ),
    connecting: (
      <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
        <Loader2 className="h-3 w-3 animate-spin" /> Aguardando leitura
      </Badge>
    ),
    open: (
      <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Conectado
      </Badge>
    ),
    close: (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" /> Desconectado
      </Badge>
    ),
  }[connectionsState?.state ?? ""];

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

        {loading ? (
          <div className="flex w-full justify-center items-center">
            <SimpleLoading label="Carregando..." size="lg" />
          </div>
        ) : (
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session">Nome da Sessão</Label>
                <Input
                  value={connectionsState?.instance_name ?? ""}
                  placeholder="Ex: Principal, Vendas..."
                  disabled
                />
              </div>
            </div>

            <Separator />

            {/* Área do QR Code */}
            {connectionsState?.state === "open" ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="p-4 rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold">WhatsApp conectado</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  className="gap-2 cursor-pointer"
                >
                  <Power className="h-4 w-4" /> Desconectar
                </Button>
              </div>
            ) : connectionsState?.state == "connecting" ? (
              <div className="grid gap-6 md:grid-cols-[auto_1fr] items-start">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-xl border shadow-sm">
                    <Image
                      src={qrCode ?? ""}
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
                      O QR Code expira em alguns minutos. Caso isso ocorra,
                      clique em atualizar para gerar um novo.
                    </p>
                  </div>

                  <Button
                    onClick={() => refetch()}
                    variant="secondary"
                    className="w-full"
                  >
                    Verificar conexão
                  </Button>
                </div>
              </div>
            ) : (
              (connectionsState?.state == "not_created" ||
                connectionsState?.state == "close") && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 border-2 border-dashed rounded-lg">
                  <div className="p-4 rounded-full bg-muted">
                    <QrCode className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-1 max-w-sm">
                    <p className="font-semibold">Nenhuma sessão ativa</p>
                    <p className="text-sm text-muted-foreground">
                      Gere um QR Code para conectar seu WhatsApp e começar a
                      enviar mensagens automaticamente.
                    </p>
                  </div>
                  <Button
                    onClick={() => handleGenerateQR(connectionsState?.state)}
                    className=" cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <SimpleLoading size="sm" className="text-white" />
                    ) : (
                      <span className="flex justify-center items-center gap-2">
                        <QrCode className="h-4 w-4" /> Gerar QR Code
                      </span>
                    )}
                  </Button>
                </div>
              )
            )}
          </CardContent>
        )}
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
