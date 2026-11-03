"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileKey2,
  Loader2,
  Plug,
  Receipt,
  Rocket,
  ScrollText,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FiscalProfileParams,
  FiscalSettings,
  SefazStatus,
  TAX_REGIME_LABEL,
  TaxRegime,
} from "@/interfaces/fiscal.interface";
import {
  useFiscalProfile,
  useInvalidateFiscal,
  useTaxProfiles,
} from "@/hooks/useFiscal";
import {
  CheckSefazStatus,
  GoLiveFiscal,
  RegisterFiscalIssuer,
  SaveFiscalProfile,
  UpdateFiscalSettings,
  UploadFiscalCertificate,
} from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { TaxProfileDialog } from "./TaxProfileDialog";

const formatCNPJ = (v: string) =>
  v.length === 14
    ? v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    : v || "—";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

function Step({
  n,
  title,
  description,
  done,
  disabled,
  icon: Icon,
  children,
}: {
  n: number;
  title: string;
  description: string;
  done: boolean;
  disabled?: boolean;
  icon: typeof Building2;
  children: ReactNode;
}) {
  return (
    <Card className={cn(disabled && "opacity-60")}>
      <CardContent className="flex gap-4 pt-6">
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold",
            done
              ? "bg-emerald-600 text-white"
              : "bg-muted text-muted-foreground",
          )}
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : n}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <Icon className="h-4 w-4 text-muted-foreground" /> {title}
            </p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {disabled ? (
            <p className="text-xs text-muted-foreground">
              Conclua o passo anterior primeiro.
            </p>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const profileFromCompany = (s: FiscalSettings): FiscalProfileParams => ({
  state_registration: s.company.state_registration,
  tax_regime: s.tax_regime ?? "",
  street: s.company.street,
  number: s.company.number,
  complement: s.company.complement,
  district: s.company.district,
  city_code: "",
  city_name: s.company.city,
  zip_code: s.company.zip_code,
  phone: s.company.phone,
  csc_id: "",
  csc_secret: "",
});

export function FiscalSetup({ settings }: { settings: FiscalSettings }) {
  const invalidate = useInvalidateFiscal();
  const issuerOk = settings.issuer_registered;
  // Momento em que a tela abriu (render puro): basta para saber se o A1 venceu
  const [openedAt] = useState(() => Date.now());
  const certOk =
    !!settings.certificate_expires_at &&
    new Date(settings.certificate_expires_at).getTime() > openedAt;
  const { data: profile, isLoading: loadingProfile } =
    useFiscalProfile(issuerOk);
  const profileOk = !!profile && profile.csc_configured;
  const { data: taxProfiles = [] } = useTaxProfiles();
  const defaultOk = !!settings.default_tax_profile_id;
  const ready = issuerOk && certOk && profileOk && defaultOk;
  const live = settings.environment === "live";
  const wrongState =
    settings.company.state !== "" && settings.company.state !== "MG";

  const [busy, setBusy] = useState<string | null>(null);
  const run = async (
    key: string,
    fn: () => Promise<void>,
    fallback: string,
  ) => {
    setBusy(key);
    try {
      await fn();
    } catch (error) {
      toast.error(getApiErrorMessage(error, fallback));
    } finally {
      setBusy(null);
    }
  };

  // Certificado
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certPassword, setCertPassword] = useState("");
  const [replacingCert, setReplacingCert] = useState(false);

  // Perfil fiscal (rascunho; sem edição mostra o salvo)
  const [draft, setDraft] = useState<FiscalProfileParams | null>(null);
  const saved: FiscalProfileParams | null = profile
    ? { ...profile, csc_secret: "" }
    : null;
  const form = draft ?? saved ?? profileFromCompany(settings);
  const setForm = (patch: Partial<FiscalProfileParams>) =>
    setDraft({ ...form, ...patch });

  const [sefaz, setSefaz] = useState<SefazStatus | null>(null);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  const [liveCsc, setLiveCsc] = useState({ id: "", secret: "" });

  const toggleEnabled = (enabled: boolean) =>
    run(
      "enabled",
      async () => {
        await UpdateFiscalSettings({
          enabled,
          default_tax_profile_id: settings.default_tax_profile_id,
        });
        toast.success(
          enabled ? "Emissão de NFC-e ligada." : "Emissão de NFC-e desligada.",
        );
        invalidate();
      },
      "Erro ao salvar",
    );

  return (
    <div className="space-y-4">
      {!settings.server_configured && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />O servidor ainda
          não está ligado ao serviço fiscal. Fale com o suporte do ProTrack.
        </div>
      )}

      {/* Situação geral */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              Emitir NFC-e ao finalizar a venda
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  live
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
                )}
              >
                {live ? "Produção" : "Homologação (sem valor fiscal)"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {ready
                ? "Tudo configurado. Com a emissão ligada, cada venda do PDV sai com a NFC-e."
                : "Complete os passos abaixo para poder ligar a emissão."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {busy === "enabled" && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              checked={settings.enabled}
              disabled={(!ready && !settings.enabled) || busy === "enabled"}
              onCheckedChange={toggleEnabled}
              aria-label="Emitir NFC-e nas vendas"
            />
          </div>
        </CardContent>
      </Card>

      {settings.products_missing_ncm > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {settings.products_missing_ncm}{" "}
            {settings.products_missing_ncm === 1
              ? "produto está"
              : "produtos estão"}{" "}
            sem NCM e não saem na nota. Preencha em{" "}
            <Link href="/stock" className="font-medium underline">
              Produtos → Dados fiscais
            </Link>
            .
          </span>
        </div>
      )}

      <Step
        n={1}
        icon={Building2}
        title="Cadastrar a empresa como emitente"
        description="Usa o CNPJ e a razão social do cadastro da empresa."
        done={issuerOk}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm">
          <div>
            <p className="font-medium">{settings.company.name}</p>
            <p className="text-muted-foreground">
              CNPJ {formatCNPJ(settings.company.cnpj)} ·{" "}
              {settings.company.city || "—"}/{settings.company.state || "—"}
            </p>
          </div>
          {issuerOk ? (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <BadgeCheck className="h-4 w-4" /> Cadastrada
            </span>
          ) : (
            <Button
              disabled={!settings.server_configured || busy === "issuer"}
              onClick={() =>
                run(
                  "issuer",
                  async () => {
                    await RegisterFiscalIssuer();
                    toast.success("Empresa cadastrada como emitente.");
                    invalidate();
                  },
                  "Erro ao cadastrar o emitente",
                )
              }
            >
              {busy === "issuer" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Cadastrar emitente
            </Button>
          )}
        </div>
        {wrongState && !issuerOk && (
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Por enquanto a NFC-e atende só empresas de Minas Gerais (o cadastro
            da empresa está em {settings.company.state}).
          </p>
        )}
      </Step>

      <Step
        n={2}
        icon={FileKey2}
        title="Certificado digital A1"
        description="Arquivo .pfx da empresa. Vai direto para o serviço fiscal: o ProTrack não guarda o certificado nem a senha."
        done={certOk}
        disabled={!issuerOk}
      >
        {certOk && !replacingCert ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm">
            <span>
              Válido até{" "}
              <strong>{formatDate(settings.certificate_expires_at!)}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReplacingCert(true)}
            >
              Trocar certificado
            </Button>
          </div>
        ) : (
          <form
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (!certFile) return;
              run(
                "cert",
                async () => {
                  const info = await UploadFiscalCertificate(
                    certFile,
                    certPassword,
                  );
                  toast.success(
                    `Certificado enviado. Válido até ${formatDate(info.expires_at)}.`,
                  );
                  setCertFile(null);
                  setCertPassword("");
                  setReplacingCert(false);
                  invalidate();
                },
                "Erro ao enviar o certificado",
              );
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="cert-file">Arquivo (.pfx ou .p12)</Label>
              <Input
                id="cert-file"
                type="file"
                accept=".pfx,.p12"
                onChange={(e) => setCertFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cert-password">Senha do certificado</Label>
              <Input
                id="cert-password"
                type="password"
                autoComplete="off"
                value={certPassword}
                onChange={(e) => setCertPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {replacingCert && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReplacingCert(false)}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={!certFile || !certPassword || busy === "cert"}
              >
                {busy === "cert" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Enviar
              </Button>
            </div>
          </form>
        )}
      </Step>

      <Step
        n={3}
        icon={ScrollText}
        title="Dados fiscais do emitente"
        description="Inscrição estadual, regime tributário, endereço e o CSC (código de segurança da NFC-e, gerado no portal da SEFAZ-MG)."
        done={profileOk}
        disabled={!certOk}
      >
        {loadingProfile ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(
                "profile",
                async () => {
                  await SaveFiscalProfile(form);
                  toast.success("Dados fiscais salvos.");
                  setDraft(null);
                  invalidate();
                },
                "Erro ao salvar os dados fiscais",
              );
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Inscrição estadual" id="fp-ie">
                <Input
                  id="fp-ie"
                  value={form.state_registration}
                  onChange={(e) =>
                    setForm({ state_registration: e.target.value })
                  }
                  required
                />
              </Field>
              <Field label="Regime tributário" id="fp-regime">
                <Select
                  value={form.tax_regime}
                  onValueChange={(v) => setForm({ tax_regime: v as TaxRegime })}
                >
                  <SelectTrigger id="fp-regime" className="w-full">
                    <SelectValue placeholder="Escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TAX_REGIME_LABEL) as TaxRegime[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {TAX_REGIME_LABEL[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
              <Field label="Rua" id="fp-street">
                <Input
                  id="fp-street"
                  value={form.street}
                  onChange={(e) => setForm({ street: e.target.value })}
                  required
                />
              </Field>
              <Field label="Número" id="fp-number">
                <Input
                  id="fp-number"
                  value={form.number}
                  onChange={(e) => setForm({ number: e.target.value })}
                  required
                />
              </Field>
              <Field label="Complemento" id="fp-compl">
                <Input
                  id="fp-compl"
                  value={form.complement}
                  onChange={(e) => setForm({ complement: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Bairro" id="fp-district">
                <Input
                  id="fp-district"
                  value={form.district}
                  onChange={(e) => setForm({ district: e.target.value })}
                  required
                />
              </Field>
              <Field label="Cidade" id="fp-city">
                <Input
                  id="fp-city"
                  value={form.city_name}
                  onChange={(e) => setForm({ city_name: e.target.value })}
                  required
                />
              </Field>
              <Field
                label="Código IBGE da cidade"
                id="fp-ibge"
                hint="7 dígitos. Belo Horizonte: 3106200"
              >
                <Input
                  id="fp-ibge"
                  inputMode="numeric"
                  value={form.city_code}
                  onChange={(e) =>
                    setForm({
                      city_code: e.target.value.replace(/\D/g, "").slice(0, 7),
                    })
                  }
                  required
                />
              </Field>
              <Field label="CEP" id="fp-cep">
                <Input
                  id="fp-cep"
                  value={form.zip_code}
                  onChange={(e) => setForm({ zip_code: e.target.value })}
                  required
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Telefone" id="fp-phone">
                <Input
                  id="fp-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ phone: e.target.value })}
                />
              </Field>
              <Field
                label="ID do CSC"
                id="fp-csc-id"
                hint={live ? "CSC de produção" : "CSC de homologação"}
              >
                <Input
                  id="fp-csc-id"
                  inputMode="numeric"
                  value={form.csc_id}
                  onChange={(e) =>
                    setForm({
                      csc_id: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                />
              </Field>
              <Field
                label="Código do CSC"
                id="fp-csc-secret"
                hint={
                  profile?.csc_configured
                    ? "Em branco mantém o atual"
                    : undefined
                }
              >
                <Input
                  id="fp-csc-secret"
                  type="password"
                  autoComplete="off"
                  value={form.csc_secret}
                  onChange={(e) => setForm({ csc_secret: e.target.value })}
                  placeholder={profile?.csc_configured ? "••••••••" : ""}
                />
              </Field>
            </div>
            <div className="flex justify-end gap-2">
              {draft && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDraft(null)}
                >
                  Descartar
                </Button>
              )}
              <Button
                type="submit"
                disabled={busy === "profile" || (!draft && profileOk)}
              >
                {busy === "profile" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Salvar dados fiscais
              </Button>
            </div>
          </form>
        )}
      </Step>

      <Step
        n={4}
        icon={Receipt}
        title="Perfil tributário padrão"
        description="Os impostos que vão nos itens da nota quando o produto e a categoria não têm um perfil próprio."
        done={defaultOk}
        disabled={!profileOk}
      >
        {taxProfiles.length === 0 ? (
          <Button onClick={() => setCreatingProfile(true)}>
            Criar o primeiro perfil
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={settings.default_tax_profile_id ?? ""}
              onValueChange={(v) =>
                run(
                  "default",
                  async () => {
                    await UpdateFiscalSettings({
                      enabled: settings.enabled,
                      default_tax_profile_id: v,
                    });
                    toast.success("Perfil padrão atualizado.");
                    invalidate();
                  },
                  "Erro ao salvar",
                )
              }
            >
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Escolha o perfil padrão" />
              </SelectTrigger>
              <SelectContent>
                {taxProfiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setCreatingProfile(true)}>
              Novo perfil
            </Button>
          </div>
        )}
      </Step>

      <Step
        n={5}
        icon={Plug}
        title="Testar a conexão com a SEFAZ"
        description="Consulta o serviço da NFC-e em MG com o certificado da empresa, sem emitir nada."
        done={!!sefaz?.online}
        disabled={!certOk}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            disabled={busy === "sefaz"}
            onClick={() =>
              run(
                "sefaz",
                async () => setSefaz(await CheckSefazStatus()),
                "Não foi possível consultar a SEFAZ",
              )
            }
          >
            {busy === "sefaz" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            Testar agora
          </Button>
          {sefaz && (
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm",
                sefaz.online
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-destructive",
              )}
            >
              {sefaz.online ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              {sefaz.status_code} – {sefaz.reason} ({sefaz.latency_ms} ms)
            </span>
          )}
        </div>
      </Step>

      {!live && (
        <Card className="border-dashed">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div className="space-y-1">
              <p className="flex items-center gap-2 font-semibold">
                <Rocket className="h-4 w-4" /> Passar para produção
              </p>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Em homologação as notas não têm valor fiscal. Depois de testar
                algumas vendas, passe para produção: o certificado e os dados
                fiscais são copiados e você informa o CSC de produção.
              </p>
            </div>
            <Button disabled={!ready} onClick={() => setGoLiveOpen(true)}>
              Ir para produção
            </Button>
          </CardContent>
        </Card>
      )}

      <TaxProfileDialog
        open={creatingProfile}
        onOpenChange={setCreatingProfile}
        taxRegime={settings.tax_regime}
      />

      <Dialog open={goLiveOpen} onOpenChange={setGoLiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passar a emitir em produção</DialogTitle>
            <DialogDescription>
              A partir daqui as NFC-e passam a ter valor fiscal. Gere o CSC de
              produção no portal da SEFAZ-MG e informe abaixo. Não dá para
              voltar para homologação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <Field label="ID do CSC" id="live-csc-id">
              <Input
                id="live-csc-id"
                inputMode="numeric"
                value={liveCsc.id}
                onChange={(e) =>
                  setLiveCsc((c) => ({
                    ...c,
                    id: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }))
                }
              />
            </Field>
            <Field label="Código do CSC" id="live-csc-secret">
              <Input
                id="live-csc-secret"
                type="password"
                autoComplete="off"
                value={liveCsc.secret}
                onChange={(e) =>
                  setLiveCsc((c) => ({ ...c, secret: e.target.value }))
                }
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoLiveOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!liveCsc.id || !liveCsc.secret || busy === "live"}
              onClick={() =>
                run(
                  "live",
                  async () => {
                    await GoLiveFiscal(liveCsc.id, liveCsc.secret);
                    toast.success("Pronto! As NFC-e agora saem em produção.");
                    setGoLiveOpen(false);
                    setLiveCsc({ id: "", secret: "" });
                    invalidate();
                  },
                  "Erro ao passar para produção",
                )
              }
            >
              {busy === "live" && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar produção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
