"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useMe } from "@/hooks/useMe";
import { useDashboardRefresh } from "@/hooks/useDashboard";
import { useNow } from "@/components/DashCard";

const greeting = (hour: number) =>
  hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function timeAgo(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 10) return "agora mesmo";
  if (s < 60) return `há ${s}s`;
  const m = Math.round(s / 60);
  return `há ${m} min`;
}

/** Isolado em componente próprio: o relógio re-renderiza só este trecho */
function LastUpdated({ at }: { at: number }) {
  const now = useNow(10_000);
  return <>Atualizado {timeAgo(now - at)}</>;
}

export function DashboardHeader() {
  const { user } = useMe();
  const { isFetching, refresh, updatedAt } = useDashboardRefresh();
  const [today] = useState(() => new Date());

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="dash-in flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-medium capitalize text-muted-foreground">
          {dateFormatter.format(today)}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {greeting(today.getHours())}
          {firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Veja como sua empresa está indo hoje.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            {isFetching && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
          {isFetching || !updatedAt ? (
            "Atualizando..."
          ) : (
            <LastUpdated at={updatedAt} />
          )}
        </span>
        <button
          type="button"
          onClick={refresh}
          disabled={isFetching}
          aria-label="Atualizar dados"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
