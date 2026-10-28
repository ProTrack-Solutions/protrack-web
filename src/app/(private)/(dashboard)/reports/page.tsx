"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CalendarRange,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useReport } from "@/hooks/useReports";
import { GetReportParams, ReportType } from "@/interfaces/reports.interface";
import { DownloadReport } from "@/service/reports.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { findReport } from "./components/catalog";
import { ReportCatalog } from "./components/ReportCatalog";
import { PeriodFilter } from "./components/PeriodFilter";
import { ReportSummary } from "./components/ReportSummary";
import { ReportTable } from "./components/ReportTable";
import { PeriodPreset, formatISODate, presetRange } from "./components/format";

// Limite da API: ~2 anos por relatório
const MAX_PERIOD_DAYS = 731;

type ExportAction = "xlsx" | "pdf" | "print";

function validateRange(start: string, end: string) {
  if (!start || !end) return "Informe a data inicial e a final.";
  if (start > end) return "A data final não pode ser anterior à inicial.";
  const days = (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1;
  if (days > MAX_PERIOD_DAYS) {
    return `O período máximo é de ${MAX_PERIOD_DAYS} dias.`;
  }
  return undefined;
}

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>("sales");
  const [preset, setPreset] = useState<PeriodPreset>("this_month");
  const [range, setRange] = useState(() => presetRange("this_month"));
  const [exporting, setExporting] = useState<ExportAction | null>(null);

  const definition = findReport(type);
  const rangeError = definition.usesPeriod
    ? validateRange(range.start, range.end)
    : undefined;

  const params: GetReportParams | null = rangeError
    ? null
    : { type, start_date: range.start, end_date: range.end };

  const { data, isLoading, isError, error, isPlaceholderData, isFetching, refetch } =
    useReport(params);

  const changePreset = (next: PeriodPreset) => {
    setPreset(next);
    if (next !== "custom") setRange(presetRange(next));
  };

  const runExport = async (action: ExportAction) => {
    if (!params || exporting) return;
    setExporting(action);
    try {
      const format = action === "xlsx" ? "xlsx" : "pdf";
      const blob = await DownloadReport(params, format);
      const url = window.URL.createObjectURL(blob);

      if (action === "print") {
        // Carrega o PDF num iframe invisível e abre a janela de impressão do navegador
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            iframe.remove();
            window.URL.revokeObjectURL(url);
          }, 60_000);
        };
        document.body.appendChild(iframe);
        return;
      }

      const suffix = definition.usesPeriod
        ? `${params.start_date}_${params.end_date}`
        : params.end_date;
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio_${type}_${suffix}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Não foi possível gerar o arquivo."));
    } finally {
      setExporting(null);
    }
  };

  // Ao trocar de relatório ainda não há dados daquele tipo: mostra skeleton
  const report = data?.type === type ? data : undefined;
  const loading = isLoading || (!report && isFetching);

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Relatórios
        </h1>
        <p className="mt-1 text-muted-foreground">
          Escolha um relatório e o período. Veja na tela ou exporte para Excel e
          PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ReportCatalog selected={type} onSelect={setType} />

        <div className="min-w-0 space-y-5">
          <section className="dash-in space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  {definition.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">
                    {report?.title ?? definition.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {report?.description ?? definition.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={!params || isFetching}
                  aria-label="Atualizar relatório"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                </button>
                <ExportButton
                  label="Excel"
                  icon={<FileSpreadsheet className="h-4 w-4" />}
                  busy={exporting === "xlsx"}
                  disabled={!report || !!exporting}
                  onClick={() => runExport("xlsx")}
                />
                <ExportButton
                  label="PDF"
                  icon={<FileText className="h-4 w-4" />}
                  busy={exporting === "pdf"}
                  disabled={!report || !!exporting}
                  onClick={() => runExport("pdf")}
                />
                <ExportButton
                  label="Imprimir"
                  icon={<Printer className="h-4 w-4" />}
                  busy={exporting === "print"}
                  disabled={!report || !!exporting}
                  onClick={() => runExport("print")}
                />
              </div>
            </div>

            {definition.usesPeriod ? (
              <PeriodFilter
                preset={preset}
                start={range.start}
                end={range.end}
                error={rangeError}
                onPresetChange={changePreset}
                onCustomChange={setRange}
              />
            ) : (
              <p className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0" />
                Este relatório mostra a posição atual e não depende de período.
              </p>
            )}

            {report && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5" />
                {report.uses_period
                  ? `${formatISODate(report.start_date)} a ${formatISODate(report.end_date)}`
                  : "Posição atual"}
                {" · "}gerado às {report.generated_at.slice(11, 16)}
              </p>
            )}
          </section>

          {isError && !report ? (
            <div className="dash-in flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="font-medium text-foreground">
                {getApiErrorMessage(
                  error,
                  "Não foi possível carregar o relatório.",
                )}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div
              aria-busy={isPlaceholderData}
              className={`space-y-5 transition-opacity duration-300 ${
                isPlaceholderData ? "opacity-60" : ""
              }`}
            >
              <ReportSummary items={report?.summary} loading={loading} />
              <ReportTable report={report} loading={loading} />
              {report?.notes?.map((note) => (
                <p
                  key={note}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ExportButtonProps {
  label: string;
  icon: React.ReactNode;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}

function ExportButton({
  label,
  icon,
  busy,
  disabled,
  onClick,
}: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}
