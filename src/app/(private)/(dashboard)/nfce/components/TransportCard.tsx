"use client";

import { Dispatch, SetStateAction } from "react";
import { Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManualTransport } from "@/interfaces/fiscal.interface";
import { Field, Section } from "./Section";
import { digits, formatDocument, FormState, FREIGHT_MODES, UFS } from "./manual-form";

type Transport = FormState["transport"];

export function TransportCard({
  form,
  setForm,
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
}) {
  const t = form.transport;
  const set = (patch: Partial<Transport>) =>
    setForm((f) => ({ ...f, transport: { ...f.transport, ...patch } }));
  const withCarrier = t.mode === "0" || t.mode === "1" || t.mode === "2";

  return (
    <Section icon={<Truck className="h-4 w-4" />} title="Transporte" description="Frete, transportadora e volumes">
      <Field label="Modalidade do frete" id="t-mode">
        <Select value={t.mode} onValueChange={(v) => set({ mode: v as ManualTransport["mode"] })}>
          <SelectTrigger id="t-mode" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREIGHT_MODES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {withCarrier && (
        <>
          <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <Field label="CPF/CNPJ da transportadora" id="t-doc">
              <Input
                id="t-doc"
                inputMode="numeric"
                value={t.carrier_document}
                onChange={(e) => set({ carrier_document: formatDocument(e.target.value) })}
              />
            </Field>
            <Field label="Transportadora (opcional)" id="t-name">
              <Input
                id="t-name"
                maxLength={60}
                value={t.carrier_name}
                onChange={(e) => set({ carrier_name: e.target.value })}
              />
            </Field>
          </div>
          {t.carrier_name.trim() && (
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_6rem]">
              <Field label="Endereço" id="t-addr">
                <Input
                  id="t-addr"
                  maxLength={60}
                  value={t.carrier_address}
                  onChange={(e) => set({ carrier_address: e.target.value })}
                />
              </Field>
              <Field label="Cidade" id="t-city">
                <Input
                  id="t-city"
                  maxLength={60}
                  value={t.carrier_city}
                  onChange={(e) => set({ carrier_city: e.target.value })}
                />
              </Field>
              <Field label="UF" id="t-uf">
                <Select value={t.carrier_state || undefined} onValueChange={(v) => set({ carrier_state: v })}>
                  <SelectTrigger id="t-uf" className="w-full">
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
            </div>
          )}
        </>
      )}

      {t.mode !== "9" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Volumes" id="t-vol">
            <Input
              id="t-vol"
              inputMode="numeric"
              placeholder="0"
              value={t.volumes}
              onChange={(e) => set({ volumes: digits(e.target.value) })}
            />
          </Field>
          <Field label="Espécie" id="t-species">
            <Input
              id="t-species"
              maxLength={60}
              placeholder="Caixa"
              value={t.species}
              onChange={(e) => set({ species: e.target.value })}
            />
          </Field>
          <Field label="Peso líquido (kg)" id="t-net">
            <Input
              id="t-net"
              inputMode="decimal"
              value={t.net_weight}
              onChange={(e) => set({ net_weight: e.target.value })}
            />
          </Field>
          <Field label="Peso bruto (kg)" id="t-gross">
            <Input
              id="t-gross"
              inputMode="decimal"
              value={t.gross_weight}
              onChange={(e) => set({ gross_weight: e.target.value })}
            />
          </Field>
        </div>
      )}
    </Section>
  );
}
