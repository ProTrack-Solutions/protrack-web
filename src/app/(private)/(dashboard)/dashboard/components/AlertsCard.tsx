"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { BellRing, ChevronRight } from "lucide-react";
import { useTopAnnouncements } from "@/hooks/useDashboard";
import { AnnouncementsResponse } from "@/interfaces/announcements.interface";
import {
  getAnnouncementTimeHint,
  getAnnouncementType,
} from "@/utils/announcementFormat";
import { DashCard, Skeleton } from "./shared";

// O quadro de avisos só é baixado quando o usuário abre pela primeira vez
const AnnouncementsBoardDialog = dynamic(
  () =>
    import("./AnnouncementsBoardDialog").then(
      (m) => m.AnnouncementsBoardDialog,
    ),
  { ssr: false },
);

export function AlertsCard() {
  const { data, isLoading } = useTopAnnouncements();
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  // Muda a cada abertura: remonta o quadro já com o aviso clicado selecionado
  const [openCount, setOpenCount] = useState(0);
  const [initial, setInitial] = useState<AnnouncementsResponse | null>(null);

  const announcements = Array.isArray(data) ? data : [];
  const urgentCount = announcements.filter(
    (a) => getAnnouncementType(a.type).urgent,
  ).length;

  const openBoard = (announcement: AnnouncementsResponse | null = null) => {
    setInitial(announcement);
    setOpenCount((c) => c + 1);
    setIsBoardOpen(true);
  };

  return (
    <DashCard
      title="Avisos do dia"
      icon={<BellRing className="h-4 w-4" />}
      delay={180}
      action={
        urgentCount > 0 && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
            {urgentCount} {urgentCount === 1 ? "importante" : "importantes"}
          </span>
        )
      }
    >
      <div className="flex-1 space-y-2">
        {isLoading ? (
          <>
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
          </>
        ) : announcements.length === 0 ? (
          <div className="grid h-full min-h-32 place-items-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
            <p>
              Tudo tranquilo por aqui.
              <br />
              Nenhum aviso para hoje.
            </p>
          </div>
        ) : (
          announcements.map((alerta, index) => {
            const style = getAnnouncementType(alerta.type);
            const hint = getAnnouncementTimeHint(alerta);
            return (
              <button
                key={alerta.id ?? `${alerta.title}-${index}`}
                type="button"
                onClick={() => openBoard(alerta)}
                className="dash-in group relative flex w-full cursor-pointer items-start gap-3 overflow-hidden rounded-xl bg-muted/50 p-3 pl-4 text-left transition-colors hover:bg-muted"
                style={{ animationDelay: `${240 + index * 60}ms` }}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1 ${style.bar}`}
                />
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${style.soft}`}
                >
                  <style.icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {alerta.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {style.label}
                    {hint && ` · ${hint}`}
                  </span>
                </span>
                <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={() => openBoard()}
        className="mt-4 h-9 w-full cursor-pointer rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted"
      >
        Ver quadro de avisos
      </button>

      {openCount > 0 && (
        <AnnouncementsBoardDialog
          key={openCount}
          open={isBoardOpen}
          onOpenChange={setIsBoardOpen}
          initialSelected={initial}
        />
      )}
    </DashCard>
  );
}
