"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Loader2, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/interfaces/client.interface";
import { IEIndicator } from "@/interfaces/fiscal.interface";
import { CustomerSearch } from "./Pickers";
import { Field, Section } from "./Section";
import {
  digits,
  FormState,
  formatCep,
  formatDocument,
  IE_INDICATORS,
  isNfe,
  lookupCep,
  UFS,
} from "./manual-form";

type Recipient = FormState["recipient"];

export function RecipientCard({
  form,
  setForm,
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
}) {
  const nfe = isNfe(form);
  const r = form.recipient;
  const [cepLoading, setCepLoading] = useState(false);

  const set = (patch: Partial<Recipient>) =>
    setForm((f) => ({ ...f, recipient: { ...f.recipient, ...patch } }));

  const fillFromCep = async (cep: string, keepStreet = false) => {
    if (digits(cep).length !== 8) return;
    setCepLoading(true);
    const found = await lookupCep(cep);
    setCepLoading(false);
    if (!found) {
      toast.error("CEP não encontrado. Preencha a cidade e o código IBGE à mão.");
      return;
    }
    setForm((f) => ({
      ...f,
      recipient: {
        ...f.recipient,
        city_name: found.city_name,
        city_code: found.city_code,
        state: found.state,
        street: keepStreet && f.recipient.street ? f.recipient.street : found.street || f.recipient.street,
        district: keepStreet && f.recipient.district ? f.recipient.district : found.district || f.recipient.district,
      },
    }));
  };

  const useClient = (c: Client) => {
    const cpf = digits(c.cpf ?? "");
    setForm((f) => ({
      ...f,
      recipient: {
        ...f.recipient,
        customer_id: c.id,
        document: formatDocument(cpf),
        name: c.full_name.slice(0, 60),
        ie_indicator: cpf.length === 11 ? "9" : f.recipient.ie_indicator,
        state_registration: "",
        email: c.email ?? "",
        zip_code: formatCep(c.address_zipcode ?? ""),
        street: c.address_street ?? "",
        number: c.address_number ?? "",
        complement: c.address_complement ?? "",
        district: c.address_neighborhood ?? "",
        city_name: c.address_city ?? "",
        city_code: "",
        state: (c.address_state ?? "").toUpperCase(),
        phone: digits(c.mobile_phone || c.whatsapp || c.home_phone || ""),
      },
    }));
    // O cadastro não tem o código IBGE: vem pelo CEP
    if (digits(c.address_zipcode ?? "").length === 8) {
      fillFromCep(c.address_zipcode, true);
    }
  };

  const clear = () =>
    setForm((f) => ({
      ...f,
      recipient: {
        ...f.recipient,
        customer_id: null,
        document: "",
        name: "",
        state_registration: "",
        email: "",
        zip_code: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city_code: "",
        city_name: "",
        state: "",
        phone: "",
      },
    }));

  const action = (
    <div className="flex gap-2">
      {(r.document || r.name) && (
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          <X className="h-4 w-4" /> Limpar
        </Button>
      )}
      {nfe && <CustomerSearch onSelect={useClient} />}
    </div>
  );

  if (!nfe) {
    return (
      <Section
        icon={<UserRound className="h-4 w-4" />}
        title="Consumidor"
        description="Opcional na NFC-e: o CPF sai impresso no cupom"
        action={action}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CPF" id="r-doc">
            <Input
              id="r-doc"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={r.document}
              onChange={(e) => set({ document: formatDocument(e.target.value).slice(0, 14) })}
            />
          </Field>
          <Field label="Nome (opcional)" id="r-name">
            <Input id="r-name" value={r.name} maxLength={60} onChange={(e) => set({ name: e.target.value })} />
          </Field>
        </div>
      </Section>
    );
  }

  const isCnpj = digits(r.document).length > 11;

  return (
    <Section
      icon={<UserRound className="h-4 w-4" />}
      title="Destinatário"
      description="Quem recebe a mercadoria. A cidade e o código IBGE vêm pelo CEP"
      action={action}
    >
      <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <Field label="CPF ou CNPJ" id="r-doc">
          <Input
            id="r-doc"
            inputMode="numeric"
            value={r.document}
            onChange={(e) => set({ document: formatDocument(e.target.value) })}
          />
        </Field>
        <Field label={isCnpj ? "Razão social" : "Nome"} id="r-name">
          <Input id="r-name" value={r.name} maxLength={60} onChange={(e) => set({ name: e.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <Field label="Situação no ICMS" id="r-ie-ind">
          <Select
            value={r.ie_indicator}
            onValueChange={(v) =>
              set({ ie_indicator: v as IEIndicator, state_registration: v === "1" ? r.state_registration : "" })
            }
          >
            <SelectTrigger id="r-ie-ind" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IE_INDICATORS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Inscrição estadual" id="r-ie">
          <Input
            id="r-ie"
            inputMode="numeric"
            disabled={r.ie_indicator !== "1"}
            value={r.state_registration}
            onChange={(e) => set({ state_registration: digits(e.target.value).slice(0, 14) })}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)_7rem]">
        <Field label="CEP" id="r-cep">
          <div className="relative">
            <Input
              id="r-cep"
              inputMode="numeric"
              value={r.zip_code}
              onChange={(e) => {
                const v = formatCep(e.target.value);
                set({ zip_code: v });
                if (digits(v).length === 8) fillFromCep(v);
              }}
            />
            {cepLoading && (
              <Loader2 className="absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </Field>
        <Field label="Logradouro" id="r-street">
          <Input id="r-street" value={r.street} maxLength={60} onChange={(e) => set({ street: e.target.value })} />
        </Field>
        <Field label="Número" id="r-number">
          <Input id="r-number" value={r.number} maxLength={60} onChange={(e) => set({ number: e.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Complemento" id="r-compl">
          <Input
            id="r-compl"
            value={r.complement}
            maxLength={60}
            onChange={(e) => set({ complement: e.target.value })}
          />
        </Field>
        <Field label="Bairro" id="r-district">
          <Input
            id="r-district"
            value={r.district}
            maxLength={60}
            onChange={(e) => set({ district: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_6rem_8rem]">
        <Field label="Cidade" id="r-city">
          <Input id="r-city" value={r.city_name} maxLength={60} onChange={(e) => set({ city_name: e.target.value })} />
        </Field>
        <Field label="UF" id="r-uf">
          <Select value={r.state || undefined} onValueChange={(v) => set({ state: v })}>
            <SelectTrigger id="r-uf" className="w-full">
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {UFS.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Código IBGE" id="r-ibge">
          <Input
            id="r-ibge"
            inputMode="numeric"
            value={r.city_code}
            onChange={(e) => set({ city_code: digits(e.target.value).slice(0, 7) })}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="E-mail (opcional)" id="r-email">
          <Input id="r-email" type="email" value={r.email} maxLength={60} onChange={(e) => set({ email: e.target.value })} />
        </Field>
        <Field label="Telefone (opcional)" id="r-phone">
          <Input
            id="r-phone"
            inputMode="tel"
            value={r.phone}
            onChange={(e) => set({ phone: digits(e.target.value).slice(0, 14) })}
          />
        </Field>
      </div>
    </Section>
  );
}
