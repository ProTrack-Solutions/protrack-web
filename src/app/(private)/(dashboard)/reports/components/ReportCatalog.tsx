"use client";

import { ReportType } from "@/interfaces/reports.interface";
import { REPORT_GROUPS } from "./catalog";

interface ReportCatalogProps {
  selected: ReportType;
  onSelect: (type: ReportType) => void;
}

/** Lista de relatórios agrupada; no celular vira um select compacto */
export function ReportCatalog({ selected, onSelect }: ReportCatalogProps) {
  return (
    <>
      <label className="block lg:hidden">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Relatório
        </span>
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value as ReportType)}
          className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-medium shadow-[var(--shadow-soft)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {REPORT_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.reports.map((report) => (
                <option key={report.type} value={report.type}>
                  {report.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <nav
        aria-label="Relatórios disponíveis"
        className="dash-in hidden self-start rounded-2xl border border-border/70 bg-card p-3 shadow-[var(--shadow-soft)] lg:sticky lg:top-6 lg:block"
      >
        {REPORT_GROUPS.map((group, index) => (
          <div key={group.label} className={index > 0 ? "mt-3" : ""}>
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.reports.map((report) => {
                const active = report.type === selected;
                return (
                  <li key={report.type}>
                    <button
                      type="button"
                      onClick={() => onSelect(report.type)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-2 py-2 text-left transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-background"
                        }`}
                      >
                        {report.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-5">
                          {report.title}
                        </span>
                        <span className="block text-xs leading-4 text-muted-foreground">
                          {report.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
