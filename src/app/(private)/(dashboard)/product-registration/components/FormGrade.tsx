"use client";

import { ReactNode } from "react";
import { AlertTriangle, Barcode, Grid3x3, Info, ListChecks, ScanLine, Tag, Warehouse } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChipInput } from "@/components/ProductGrid/ChipInput";
import { GridMatrix } from "@/components/ProductGrid/GridMatrix";
import { SIZE_PRESETS, variationLabel, variationName } from "@/components/ProductGrid/grid";
import { brl } from "@/components/DashCard";
import { CardSection } from "./CardSection";

export interface GridCombo {
  color: string;
  size: string;
  key: string;
}

export interface GridState {
  colors: string[];
  sizes: string[];
  /** Estoque inicial por combinação */
  quantities: Record<string, number>;
  customPrices: boolean;
  overrides: Record<string, { cost?: number; price?: number }>;
}

export const initialGridState: GridState = {
  colors: [],
  sizes: [],
  quantities: {},
  customPrices: false,
  overrides: {},
};

interface FormGradeProps {
  grid: GridState;
  /** Só as combinações com estoque: são as que viram cadastro */
  combos: GridCombo[];
  /** Combinações da tabela que estão zeradas (não serão cadastradas) */
  skipped: number;
  modelName: string;
  costPrice: number;
  salePrice: number;
  onChange: (next: GridState) => void;
}

const moneyInput = (
  id: string,
  value: number,
  onChange: (v: number) => void,
  label: string,
) => (
  <Input
    id={id}
    type="number"
    min={0}
    step="0.01"
    inputMode="decimal"
    value={value || ""}
    placeholder="0,00"
    onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
    aria-label={label}
    className="h-9 text-right"
  />
);

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fuchsia-600 text-xs font-bold text-white">
        {n}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

/** Grade do modelo em passos: tamanhos, cores, estoque inicial e prévia do que será criado */
export function FormGrade({ grid, combos, skipped, modelName, costPrice, salePrice, onChange }: FormGradeProps) {
  const set = (patch: Partial<GridState>) => onChange({ ...grid, ...patch });

  // Sem "preço diferente" ligado, todas seguem o preço do modelo
  const costOf = (key: string) =>
    grid.customPrices ? (grid.overrides[key]?.cost ?? costPrice) : costPrice;
  const priceOf = (key: string) =>
    grid.customPrices ? (grid.overrides[key]?.price ?? salePrice) : salePrice;
  const setOverride = (key: string, patch: { cost?: number; price?: number }) =>
    set({ overrides: { ...grid.overrides, [key]: { ...grid.overrides[key], ...patch } } });

  const hasAxes = grid.colors.length + grid.sizes.length > 0;
  const model = modelName.trim() || "Nome do modelo";

  return (
    <CardSection
      icon={Grid3x3}
      iconGradient="from-fuchsia-500 to-pink-600"
      title="Grade de cores e tamanhos"
      subtitle="Monte as combinações do modelo em 3 passos"
    >
      <div className="space-y-6">
        <Step
          n={1}
          title="Quais tamanhos esse modelo tem?"
          hint="Digite e tecle Enter, ou use um atalho. Deixe vazio se o modelo só varia de cor."
        >
          <ChipInput
            id="grid-sizes"
            values={grid.sizes}
            onChange={(sizes) => set({ sizes })}
            placeholder="Ex.: P, M, G"
            presets={SIZE_PRESETS}
          />
        </Step>

        <Step
          n={2}
          title="Quais cores?"
          hint="Deixe vazio se o modelo só varia de tamanho."
        >
          <ChipInput
            id="grid-colors"
            values={grid.colors}
            onChange={(colors) => set({ colors })}
            maxLength={50}
            placeholder="Ex.: Preta, Branca"
          />
        </Step>

        <Step
          n={3}
          title="Quantas peças você tem de cada combinação?"
          hint="Esse é o estoque inicial. Só as combinações com quantidade são cadastradas; as que você ainda não tem ficam de fora e podem ser adicionadas depois, em Editar modelo."
        >
          {hasAxes ? (
            <>
              <GridMatrix
                colors={grid.colors}
                sizes={grid.sizes}
                quantities={grid.quantities}
                onChange={(key, qty) => set({ quantities: { ...grid.quantities, [key]: qty } })}
              />
              {combos.length === 0 ? (
                <p className="flex items-start gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Informe a quantidade de pelo menos uma combinação. Variação sem estoque não é cadastrada.
                </p>
              ) : (
                skipped > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {skipped} {skipped === 1 ? "combinação zerada fica" : "combinações zeradas ficam"} de fora do cadastro.
                  </p>
                )
              )}
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
              Informe os tamanhos e/ou as cores acima e a tabela aparece aqui.
            </p>
          )}
        </Step>

        {/* Prévia: exatamente o que vai ser criado */}
        {combos.length > 0 && (
          <section className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <ListChecks className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                Serão criados {combos.length} {combos.length === 1 ? "produto" : "produtos"}
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-prices" className="text-xs font-normal text-muted-foreground">
                  Preço diferente em alguma variação
                </Label>
                <Switch
                  id="custom-prices"
                  checked={grid.customPrices}
                  onCheckedChange={(customPrices) => set({ customPrices })}
                />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-semibold">Nome do produto</th>
                    <th className="px-3 py-1.5 text-center font-semibold">Estoque</th>
                    <th className="w-28 px-3 py-1.5 text-right font-semibold">Custo</th>
                    <th className="w-28 px-3 py-1.5 text-right font-semibold">Venda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {combos.map((c) => (
                    <tr key={c.key}>
                      <td className="px-3 py-1.5">
                        <span className="font-medium">{variationName(model, c.color, c.size)}</span>
                      </td>
                      <td className="px-3 py-1.5 text-center tabular-nums">{grid.quantities[c.key] || 0}</td>
                      <td className="px-3 py-1">
                        {grid.customPrices ? (
                          moneyInput(`cost-${c.key}`, costOf(c.key), (cost) => setOverride(c.key, { cost }), `Custo de ${variationLabel(c.color, c.size)}`)
                        ) : (
                          <span className="block text-right tabular-nums text-muted-foreground">{brl(costOf(c.key))}</span>
                        )}
                      </td>
                      <td className="px-3 py-1">
                        {grid.customPrices ? (
                          moneyInput(`price-${c.key}`, priceOf(c.key), (price) => setOverride(c.key, { price }), `Preço de ${variationLabel(c.color, c.size)}`)
                        ) : (
                          <span className="block text-right tabular-nums">{brl(priceOf(c.key))}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Barcode className="h-3.5 w-3.5" />
              Cada um ganha um código de barras próprio, gerado automaticamente.
            </p>
          </section>
        )}

        {/* Como a grade aparece no resto do sistema */}
        <aside className="space-y-2 rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Info className="h-4 w-4" />
            Como a grade funciona depois do cadastro
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2">
              <Warehouse className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>Produtos:</strong>{" "}o modelo aparece numa linha só, com o estoque somado.
                Clique nela para ver cada cor e tamanho, dar entrada pela grade ou editar o modelo.
              </span>
            </li>
            <li className="flex gap-2">
              <ScanLine className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>Venda:</strong>{" "}bipe o código da peça (já cai na cor e tamanho certos) ou use
                &quot;Adicionar pela grade&quot; para escolher várias de uma vez.
              </span>
            </li>
            <li className="flex gap-2">
              <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>Etiquetas:</strong>{" "}saem com o nome do modelo, a cor e o tamanho em destaque.
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </CardSection>
  );
}
