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
import { Switch } from "@/components/ui/switch";
import { CompanySettings } from "@/enum/company-settings.enum";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { UpsetCompanySettingsRequest } from "@/interfaces/company-settings.interface";
import { UpsetCompanySettings } from "@/service/company-settings.service";
import { FileText, CheckCircle2, Send, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type SaleTemplate = {
  id: string;
  name: string;
  description: string;
  body: string;
};

const SALE_TEMPLATES: SaleTemplate[] = [
  {
    id: "padrao",
    name: "Padrão",
    description: "Mensagem simples de confirmação de venda.",
    body: "Olá {cliente}! ✅ Sua compra na {empresa} foi confirmada.\n\nProdutos: {produtos}\nValor: {valor}\n\nObrigado pela preferência!",
  },
  {
    id: "detalhado",
    name: "Detalhado",
    description: "Inclui vencimento e mais informações da venda.",
    body: "Olá {cliente}, tudo bem?\n\nSua compra na {empresa} foi registrada com sucesso:\n\n🛒 Produtos: {produtos}\n💰 Valor: {valor}\n📅 Vencimento: {vencimento}\n\nQualquer dúvida, estamos à disposição!",
  },
  {
    id: "resumido",
    name: "Resumido",
    description: "Versão curta, ideal para envios em massa.",
    body: "{empresa}: venda de {valor} confirmada para {cliente}. Vencimento: {vencimento}.",
  },
];

export const ConfigWhatsApp = () => {
  const [templateVenda, setTemplateVenda] = useState(SALE_TEMPLATES[0].id);
  const [limiteMensagens, setLimiteMensagens] = useState(500);
  const [mensagensEnviadas] = useState(0);

  const { companySettings } = useCompanySettings();

  const mensagensAtivas = useMemo(() => {
    const setting = companySettings?.find(
      (cs) => cs.key === CompanySettings.IsWhatsappActive,
    );
    return setting ? Boolean(setting.value) : true; // default
  }, [companySettings]);

  const mensagensExcedentes = useMemo(() => {
    const setting = companySettings?.find(
      (cs) => cs.key === CompanySettings.IsExcessUsage,
    );
    return setting ? Boolean(setting.value) : false; // default
  }, [companySettings]);

  const handleWhatsappSettings = async (
    params: UpsetCompanySettingsRequest,
  ) => {
    try {
      await UpsetCompanySettings(params);
      if (params.key == CompanySettings.IsWhatsappActive) {
        toast.success(
          params.value
            ? "Mensagens via WhatsApp ativadas."
            : "Mensagens via WhatsApp desativadas.",
        );
      } else {
        toast.success(
          params.value
            ? "Mensagens excedentes ativadas."
            : "Mensagens excedentes desativadas.",
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedTemplate =
    SALE_TEMPLATES.find((tpl) => tpl.id === templateVenda) ?? SALE_TEMPLATES[0];

  const percentualUso =
    limiteMensagens > 0
      ? Math.min(100, Math.round((mensagensEnviadas / limiteMensagens) * 100))
      : 0;

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Template da mensagem de venda</CardTitle>
                <CardDescription>
                  Escolha o modelo de mensagem enviada ao cliente quando uma
                  venda for concluída.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            {SALE_TEMPLATES.map((tpl) => {
              const selected = templateVenda === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setTemplateVenda(tpl.id);
                    toast.success(`Template "${tpl.name}" selecionado.`);
                  }}
                  className={`text-left rounded-lg border p-4 transition-all hover:shadow-sm ${
                    selected
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm">{tpl.name}</span>
                    {selected && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Pré-visualização</Label>
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="max-w-md rounded-2xl rounded-tl-sm bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm whitespace-pre-line">
                {selectedTemplate.body}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Variáveis disponíveis: {"{cliente}"}, {"{valor}"}, {"{produtos}"},{" "}
              {"{empresa}"}, {"{vencimento}"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mensagens */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Envio de mensagens</CardTitle>
              <CardDescription>
                Ative o disparo de mensagens via WhatsApp e defina o
                comportamento ao ultrapassar o limite do plano.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="msg-ativas" className="text-sm font-medium">
                Mensagens via WhatsApp
              </Label>
              <p className="text-sm text-muted-foreground">
                Envia automaticamente cobranças, lembretes e confirmações pelo
                WhatsApp.
              </p>
            </div>
            <Switch
              id="msg-ativas"
              checked={mensagensAtivas}
              onCheckedChange={(v) => {
                handleWhatsappSettings({
                  key: CompanySettings.IsWhatsappActive,
                  value: v,
                });
              }}
            />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="msg-excedentes" className="text-sm font-medium">
                Mensagens excedentes
              </Label>
              <p className="text-sm text-muted-foreground">
                Permite continuar enviando após atingir o limite do plano, com
                cobrança adicional por mensagem.
              </p>
            </div>
            <Switch
              id="msg-excedentes"
              checked={mensagensExcedentes}
              disabled={!mensagensAtivas}
              onCheckedChange={(v) => {
                handleWhatsappSettings({
                  key: CompanySettings.IsExcessUsage,
                  value: v,
                });
              }}
            />
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="limite-msg">Limite mensal de mensagens</Label>
                <Input
                  id="limite-msg"
                  type="number"
                  min={0}
                  value={limiteMensagens}
                  onChange={(e) => setLimiteMensagens(Number(e.target.value))}
                  disabled={!mensagensAtivas}
                />
              </div>
              <div className="space-y-2">
                <Label>Consumo do mês</Label>
                <div className="h-10 flex items-center text-sm font-medium">
                  {mensagensEnviadas} / {limiteMensagens} ({percentualUso}%)
                </div>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percentualUso}%` }}
              />
            </div>
            {percentualUso >= 100 && !mensagensExcedentes && (
              <div className="flex gap-2 text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Limite atingido. Ative as mensagens excedentes para continuar
                  enviando.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
