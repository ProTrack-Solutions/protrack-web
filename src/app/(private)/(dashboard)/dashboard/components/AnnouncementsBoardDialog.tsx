"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  Info,
  Loader2,
  Megaphone,
} from "lucide-react";
import { formatDateTime } from "@/utils/dateFormat";
import { useEffect, useState } from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";
import { AnnouncementsResponse } from "@/interfaces/announcements.interface";

const PER_PAGE = 6;

const TYPE_STYLES = {
  alta: {
    label: "Prioridade alta",
    icon: AlertTriangle,
    bar: "bg-destructive",
    iconBox: "bg-destructive/10 text-destructive",
    badge: "destructive" as const,
  },
  default: {
    label: "Informativo",
    icon: Info,
    bar: "bg-primary",
    iconBox: "bg-primary/10 text-primary",
    badge: "secondary" as const,
  },
};

function getTypeStyle(type: string) {
  return type === "alta" ? TYPE_STYLES.alta : TYPE_STYLES.default;
}

function getExpirationLabel(expiresAt: Date | string | null | undefined) {
  if (!expiresAt) return null;

  const expires = new Date(expiresAt);
  if (isNaN(expires.getTime())) return null;

  const diffDays = Math.ceil(
    (expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return "Expirado";
  if (diffDays === 0) return "Expira hoje";
  if (diffDays === 1) return "Expira amanhã";
  return `Expira em ${diffDays} dias`;
}

interface AnnouncementsBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnnouncementsBoardDialog({
  open,
  onOpenChange,
}: AnnouncementsBoardDialogProps) {
  const [selected, setSelected] = useState<AnnouncementsResponse | null>(null);

  const { currentPage, displayPage, pageRange, goToPage, setTotalPages } =
    usePagination({ totalPages: 1 });

  const { announcements, announcementsCount, totalPages, loading, error } =
    useAnnouncements({ Page: currentPage, PerPage: PER_PAGE }, open);

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      goToPage(1);
      setSelected(null);
    }
    onOpenChange(value);
  };

  const hasAnnouncements =
    Array.isArray(announcements) && announcements.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl gap-0 p-0 overflow-hidden">
        {/* Cabeçalho */}
        <DialogHeader className="border-b bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-base">Quadro de Avisos</DialogTitle>
              <DialogDescription>
                {announcementsCount > 0
                  ? `${announcementsCount} aviso(s) · página ${displayPage} de ${totalPages || 1}`
                  : "Todos os avisos da empresa"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo */}
        <div className="min-h-[300px] px-5 py-4">
          {selected ? (
            <AnnouncementDetail
              announcement={selected}
              onBack={() => setSelected(null)}
            />
          ) : loading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-destructive">
              {error}
            </div>
          ) : !hasAnnouncements ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Megaphone className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <span className="font-medium text-foreground">
                Nenhum aviso por aqui
              </span>
              <span className="text-sm text-muted-foreground">
                Quando houver avisos, eles aparecerão neste quadro.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((aviso, index) => (
                <AnnouncementCard
                  key={index}
                  announcement={aviso}
                  onClick={() => setSelected(aviso)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {!selected && (
          <div className="border-t bg-muted/40 px-5">
            <DataPagination
              currentPage={displayPage}
              totalPages={totalPages || 1}
              pageRange={pageRange}
              goToPage={goToPage}
              className="py-2"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AnnouncementCard({
  announcement,
  onClick,
}: {
  announcement: AnnouncementsResponse;
  onClick: () => void;
}) {
  const style = getTypeStyle(announcement.type);
  const Icon = style.icon;
  const expirationLabel = getExpirationLabel(announcement.expires_at);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-32 flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={`h-1 w-full ${style.bar}`} />

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-start gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${style.iconBox}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h3 className="line-clamp-1 text-sm font-semibold leading-6 text-foreground">
            {announcement.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {announcement.content}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <Badge variant={style.badge}>{style.label}</Badge>
          {expirationLabel && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3 w-3" />
              {expirationLabel}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function AnnouncementDetail({
  announcement,
  onBack,
}: {
  announcement: AnnouncementsResponse;
  onBack: () => void;
}) {
  const style = getTypeStyle(announcement.type);
  const Icon = style.icon;

  return (
    <div className="flex flex-col gap-5">
      <Button variant="ghost" size="sm" className="w-fit" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        Voltar ao quadro
      </Button>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className={`h-2 w-full ${style.bar}`} />
        <div className="space-y-4 p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.iconBox}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Badge variant={style.badge}>{style.label}</Badge>
              <h2 className="text-xl font-semibold text-foreground">
                {announcement.title}
              </h2>
            </div>
          </div>

          <p className="max-h-[220px] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {announcement.content}
          </p>

          <div className="flex flex-wrap gap-3 border-t pt-4 text-xs text-muted-foreground">
            {announcement.starts_at && (
              <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Início: {formatDateTime(announcement.starts_at)}
              </span>
            )}
            {announcement.expires_at && (
              <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                <CalendarClock className="h-3.5 w-3.5" />
                Expira: {formatDateTime(announcement.expires_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
