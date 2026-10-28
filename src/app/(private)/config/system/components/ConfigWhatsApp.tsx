import { SimpleLoading } from "@/components/SimpleLoading";
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
import { useConfigSettings } from "@/hooks/useSubscriptionManager";
import { UpsetCompanySettingsRequest } from "@/interfaces/company-settings.interface";
import { UpsetCompanySettings } from "@/service/company-settings.service";
import {
  FileText,
  CheckCircle2,
  Send,
  AlertTriangle,
  BellRing,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const ConfigWhatsApp = () => {
  const [templateVenda, setTemplateVenda] = useState<string | null>(null);

  const {
    companySettings,
    loading: settingsLoading,
    refetch: settingsRefetch,
  } = useCompanySettings();

  const { usageMenssages, templates, loading, refetch } = useConfigSettings();

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
      await settingsRefetch();
      await refetch();
      if (params.key == CompanySettings.IsWhatsappActive) {
        toast.success(
          params.value
            ? "Mensagens via WhatsApp ativadas."
            : "Mensagens via WhatsApp desativadas.",
        );
      } else if (params.key == CompanySettings.IsExcessUsage) {
        toast.success(
          params.value
            ? "Mensagens excedentes ativadas."
            : "Mensagens excedentes desativadas.",
        );
      } else if (params.key == CompanySettings.SaleOverdueTemplate) {
        toast.success(`Template "${params.value}" selecionado.`);
      } else if (params.key == CompanySettings.DueReminderTemplate) {
        toast.success(
          params.value
            ? `Template "${params.value}" usado nos lembretes de vencimento.`
            : "Lembrete de parcela a vencer desativado.",
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const savedTemplateId = useMemo(() => {
    const setting = companySettings?.find(
      (cs) => cs.key === CompanySettings.SaleOverdueTemplate,
    );
    return setting?.value as string | undefined;
  }, [companySettings]);

  const savedDueReminderTemplate = useMemo(() => {
    const setting = companySettings?.find(
      (cs) => cs.key === CompanySettings.DueReminderTemplate,
    );
    return (setting?.value as string | undefined) ?? "";
  }, [companySettings]);

  const selectedTemplate = useMemo(() => {
    const templateName = templateVenda ?? savedTemplateId;
    return (
      templates?.find((tpl) => tpl.meta_template_name === templateName) ??
      templates?.[0]
    );
  }, [templates, templateVenda, savedTemplateId]);

  if (loading && settingsLoading) {
    return (
      <SimpleLoading label="Carregando configurações" fullScreen size="lg" />
    );
  }

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
                <CardTitle>Template de cobrança de venda vencida</CardTitle>
                <CardDescription>
                  Modelo enviado ao cliente quando uma parcela vence e no botão
                  &quot;Cobrar&quot; do contas a receber.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {templates?.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {templates.map((tpl) => {
                const selected = savedTemplateId === tpl.meta_template_name;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setTemplateVenda(tpl.meta_template_name);
                      handleWhatsappSettings({
                        key: CompanySettings.SaleOverdueTemplate,
                        value: String(tpl.meta_template_name),
                      });
                    }}
                    className={`cursor-pointer text-left rounded-lg border p-4 transition-all hover:shadow-sm ${
                      selected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {tpl.meta_template_name}
                      </span>
                      {selected && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {tpl.body_text}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum template de mensagem cadastrado.
            </p>
          )}

          {selectedTemplate && (
            <>
              <Separator />

              <div className="space-y-2">
                <Label>Pré-visualização</Label>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <div className="max-w-md rounded-2xl rounded-tl-sm bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm whitespace-pre-line">
                    {selectedTemplate.body_text}
                  </div>
                </div>
                {!!selectedTemplate.variables?.length && (
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis:{" "}
                    {selectedTemplate.variables
                      .map((v) => (v.startsWith("{") ? v : `{${v}}`))
                      .join(", ")}
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BellRing className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Template de lembrete de vencimento</CardTitle>
              <CardDescription>
                Usado no botão &quot;Lembrete&quot; do contas a receber para avisar
                parcelas que ainda vão vencer. Sem template, o lembrete fica
                disponível só para parcelas vencidas.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() =>
                handleWhatsappSettings({
                  key: CompanySettings.DueReminderTemplate,
                  value: "",
                })
              }
              className={`cursor-pointer text-left rounded-lg border p-4 transition-all hover:shadow-sm ${
                !savedDueReminderTemplate
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-sm">Não enviar</span>
                {!savedDueReminderTemplate && (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Lembrete só para parcelas vencidas.
              </p>
            </button>
            {templates
              ?.filter((tpl) => tpl.meta_template_name !== savedTemplateId)
              .map((tpl) => {
                const selected =
                  savedDueReminderTemplate === tpl.meta_template_name;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() =>
                      handleWhatsappSettings({
                        key: CompanySettings.DueReminderTemplate,
                        value: String(tpl.meta_template_name),
                      })
                    }
                    className={`cursor-pointer text-left rounded-lg border p-4 transition-all hover:shadow-sm ${
                      selected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {tpl.meta_template_name}
                      </span>
                      {selected && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {tpl.body_text}
                    </p>
                  </button>
                );
              })}
          </div>
          <p className="text-xs text-muted-foreground">
            O template precisa estar aprovado na Meta e usar as mesmas
            variáveis do de cobrança: cabeçalho {"{{1}}"} = nome da empresa;
            corpo {"{{1}}"} cliente, {"{{2}}"} data da compra, {"{{3}}"} valor,{" "}
            {"{{4}}"} vencimento e {"{{5}}"} contato da empresa.
          </p>
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
              className="cursor-pointer"
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
              className="cursor-pointer"
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
                  value={usageMenssages?.limit_menssage ?? ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Consumo do mês</Label>
                <div className="h-10 flex items-center text-sm font-medium">
                  {usageMenssages?.menssage_amount} /
                  {usageMenssages?.limit_menssage} ({usageMenssages?.percentage}
                  %)
                </div>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${usageMenssages?.percentage}%` }}
              />
            </div>
            {(usageMenssages?.percentage ?? 0) >= 100 &&
              !mensagensExcedentes && (
                <div className="flex gap-2 text-sm text-amber-600">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Limite atingido. Ative as mensagens excedentes para
                    continuar enviando.
                  </p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
