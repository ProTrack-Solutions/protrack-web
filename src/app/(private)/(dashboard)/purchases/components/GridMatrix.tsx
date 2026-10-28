"use client";

import { Input } from "@/components/ui/input";

/** Chave da célula: cor e tamanho sem diferenciar maiúsculas (mesma regra da API) */
export const cellKey = (color: string, size: string) =>
  `${color.trim().toLowerCase()}|${size.trim().toLowerCase()}`;

interface GridMatrixProps {
  colors: string[];
  sizes: string[];
  quantities: Record<string, number>;
  onChange: (key: string, quantity: number) => void;
  /** Células que não existem (recompra): ficam desabilitadas */
  isAvailable?: (color: string, size: string) => boolean;
  /** Texto auxiliar abaixo do campo (ex.: estoque atual) */
  hint?: (color: string, size: string) => string | undefined;
}

/**
 * Grade cores × tamanhos com a quantidade de cada combinação. Sem cores ou
 * sem tamanhos, a linha/coluna vira uma só ("—").
 */
export function GridMatrix({
  colors,
  sizes,
  quantities,
  onChange,
  isAvailable = () => true,
  hint,
}: GridMatrixProps) {
  const rows = colors.length ? colors : [""];
  const cols = sizes.length ? sizes : [""];

  const rowTotal = (color: string) =>
    cols.reduce((s, size) => s + (quantities[cellKey(color, size)] || 0), 0);
  const colTotal = (size: string) =>
    rows.reduce((s, color) => s + (quantities[cellKey(color, size)] || 0), 0);
  const total = rows.reduce((s, c) => s + rowTotal(c), 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">
              {colors.length ? "Cor \\ Tamanho" : ""}
            </th>
            {cols.map((size) => (
              <th key={size || "-"} className="px-2 py-2 text-center font-semibold">
                {size || "Qtd."}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((color) => (
            <tr key={color || "-"} className="border-t border-border">
              <td className="px-3 py-1.5 font-medium whitespace-nowrap">{color || "—"}</td>
              {cols.map((size) => {
                const key = cellKey(color, size);
                const available = isAvailable(color, size);
                const note = hint?.(color, size);
                return (
                  <td key={size || "-"} className="px-1.5 py-1.5 text-center">
                    {available ? (
                      <>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          inputMode="numeric"
                          value={quantities[key] || ""}
                          placeholder="0"
                          onChange={(e) =>
                            onChange(key, Math.max(0, Math.trunc(Number(e.target.value) || 0)))
                          }
                          aria-label={`Quantidade ${[color, size].filter(Boolean).join(" ") || "do produto"}`}
                          className="mx-auto h-8 w-16 text-center"
                        />
                        {note && <span className="mt-0.5 block text-[10px] text-muted-foreground">{note}</span>}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground" title="Variação não cadastrada">
                        —
                      </span>
                    )}
                  </td>
                );
              })}
              <td className="px-3 py-1.5 text-right font-medium tabular-nums">{rowTotal(color)}</td>
            </tr>
          ))}
        </tbody>
        {rows.length > 1 && (
          <tfoot className="border-t border-border bg-slate-100 text-xs font-semibold dark:bg-muted">
            <tr>
              <td className="px-3 py-1.5">Total</td>
              {cols.map((size) => (
                <td key={size || "-"} className="px-2 py-1.5 text-center tabular-nums">
                  {colTotal(size)}
                </td>
              ))}
              <td className="px-3 py-1.5 text-right tabular-nums">{total}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
