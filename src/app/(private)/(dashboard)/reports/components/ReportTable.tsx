"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Skeleton } from "@/components/DashCard";
import { Input } from "@/components/ui/input";
import {
  ReportCell,
  ReportColumn,
  ReportResponse,
} from "@/interfaces/reports.interface";
import { compareCells, formatCell, isNumericColumn } from "./format";

interface ReportTableProps {
  report?: ReportResponse;
  loading: boolean;
}

type Sort = { index: number; direction: "asc" | "desc" } | null;

const alignClass = (column: ReportColumn) =>
  isNumericColumn(column.type)
    ? "text-right"
    : column.type === "date" || column.type === "datetime"
      ? "text-center"
      : "text-left";

// Na DRE a ordem das linhas é a própria demonstração: não ordena nem filtra
const isStatement = (report?: ReportResponse) => report?.type === "dre";

export function ReportTable({ report, loading }: ReportTableProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>(null);
  const [lastType, setLastType] = useState(report?.type);

  // Trocou de relatório: limpa busca e ordenação (as colunas são outras)
  if (report?.type !== lastType) {
    setLastType(report?.type);
    setSearch("");
    setSort(null);
  }

  const statement = isStatement(report);

  const rows = useMemo(() => {
    if (!report) return [];
    let result = report.rows;

    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (term && !statement) {
      result = result.filter((row) =>
        row.some((cell, i) =>
          formatCell(cell, report.columns[i]?.type ?? "text")
            .toLocaleLowerCase("pt-BR")
            .includes(term),
        ),
      );
    }

    if (sort && !statement) {
      const factor = sort.direction === "asc" ? 1 : -1;
      result = [...result].sort((a, b) => {
        const x = a[sort.index];
        const y = b[sort.index];
        // Vazios ficam sempre no fim, em qualquer direção
        if (isEmpty(x) !== isEmpty(y)) return isEmpty(x) ? 1 : -1;
        return compareCells(x, y) * factor;
      });
    }

    return result;
  }, [report, search, sort, statement]);

  const toggleSort = (index: number, column: ReportColumn) => {
    setSort((current) => {
      // Números começam do maior; textos e datas em ordem crescente
      const first = isNumericColumn(column.type) ? "desc" : "asc";
      if (current?.index !== index) return { index, direction: first };
      if (current.direction === first) {
        return { index, direction: first === "asc" ? "desc" : "asc" };
      }
      return null;
    });
  };

  if (loading || !report) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
        <Skeleton className="mb-4 h-9 w-64" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-8 w-full" />
        ))}
      </div>
    );
  }

  const filtered = rows.length !== report.rows.length;

  return (
    <section className="dash-in overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      {!statement && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nesta tabela"
              aria-label="Buscar nesta tabela"
              className="h-9 bg-background pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground tabular-nums">
            {filtered
              ? `${rows.length.toLocaleString("pt-BR")} de ${report.rows.length.toLocaleString("pt-BR")} registros`
              : `${report.rows.length.toLocaleString("pt-BR")} ${report.rows.length === 1 ? "registro" : "registros"}`}
          </p>
        </div>
      )}

      {report.rows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="font-medium text-foreground">
            Nenhum registro no período.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente escolher outro período.
          </p>
        </div>
      ) : (
        <div className="max-h-[65vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur">
              <tr>
                {report.columns.map((column, i) => {
                  const active = sort?.index === i;
                  const SortIcon = !active
                    ? ArrowUpDown
                    : sort.direction === "asc"
                      ? ArrowUp
                      : ArrowDown;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={
                        active
                          ? sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                      className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-muted-foreground ${alignClass(column)}`}
                    >
                      {statement ? (
                        column.label
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleSort(i, column)}
                          className={`inline-flex cursor-pointer items-center gap-1 hover:text-foreground ${
                            active ? "text-foreground" : ""
                          }`}
                        >
                          {column.label}
                          <SortIcon
                            className={`h-3 w-3 ${active ? "" : "opacity-40"}`}
                          />
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr
                  key={r}
                  className={`border-t border-border/50 transition-colors hover:bg-muted/50 ${rowClass(report, row)}`}
                >
                  {report.columns.map((column, i) => (
                    <td
                      key={column.key}
                      className={`px-3 py-2 whitespace-nowrap ${alignClass(column)} ${cellClass(column, row[i])}`}
                    >
                      {formatCell(row[i], column.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {report.totals && !filtered && (
              <tfoot className="sticky bottom-0 bg-primary/10 font-semibold backdrop-blur">
                <tr className="border-t-2 border-primary/30">
                  {report.columns.map((column, i) => (
                    <td
                      key={column.key}
                      className={`px-3 py-2.5 whitespace-nowrap tabular-nums ${alignClass(column)} ${cellClass(column, report.totals?.[i] ?? null)}`}
                    >
                      {formatCell(report.totals?.[i] ?? null, column.type)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {filtered && report.totals && (
        <p className="border-t border-border/70 px-4 py-2 text-xs text-muted-foreground">
          Os totais ficam ocultos enquanto a busca estiver filtrando a tabela.
        </p>
      )}
    </section>
  );
}

const isEmpty = (cell: ReportCell) => cell === null || cell === "";

function cellClass(column: ReportColumn, value: ReportCell) {
  const classes = isNumericColumn(column.type) ? "tabular-nums" : "";
  if (column.type === "money" && typeof value === "number" && value < 0) {
    return `${classes} text-destructive`;
  }
  return classes;
}

function rowClass(report: ReportResponse, row: ReportCell[]) {
  const first = String(row[0] ?? "");
  if (isStatement(report)) {
    // Linhas de resultado "(=)" em destaque; categorias de despesa recuadas
    if (first.startsWith("(=)")) return "bg-primary/5 font-semibold";
    if (first.startsWith(" ")) return "text-muted-foreground [&>td:first-child]:pl-8";
    return "";
  }
  return row.includes("Cancelado") ? "text-muted-foreground line-through" : "";
}
