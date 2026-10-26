"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  Clock,
  Loader2,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/DataPagination";
import { DialogConfirm } from "@/components/DialogConfirm";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { usePagination } from "@/hooks/usePagination";
import { useMe } from "@/hooks/useMe";
import { AnnouncementsResponse } from "@/interfaces/announcements.interface";
import { DeleteAnnouncement } from "@/service/announcements.service";
import { formatDateTime } from "@/utils/dateFormat";
import {
  ANNOUNCEMENT_STATUS,
  getAnnouncementStatus,
  getAnnouncementTimeHint,
  getAnnouncementType,
  parseAnnouncementDate,
  timeAgo,
} from "@/utils/announcementFormat";
import { AnnouncementForm } from "./AnnouncementForm";

const PER_PAGE = 8;

interface AnnouncementsBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Aviso a abrir já selecionado (ex.: clicado no card do dashboard) */
  initialSelected?: AnnouncementsResponse | null;
}

export function AnnouncementsBoardDialog({
  open,
  onOpenChange,
  initialSelected = null,
}: AnnouncementsBoardDialogProps) {
  const queryClient = useQueryClient();
  const { user } = useMe();
  const isAdmin = user?.role === "ADMIN";

  const [view, setView] = useState<"browse" | "create">("browse");
  const [selected, setSelected] = useState<AnnouncementsResponse | null>(
    initialSelected,
  );
  // No celular a lista e o detalhe não cabem lado a lado
  const [mobileDetail, setMobileDetail] = useState(!!initialSelected);
  const [toDelete, setToDelete] = useState<AnnouncementsResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { currentPage, displayPage, pageRange, goToPage, setTotalPages } =
    usePagination({ totalPages: 1 });

  const { announcements, announcementsCount, totalPages, loading, error } =
    useAnnouncements({ Page: currentPage, PerPage: PER_PAGE }, open);

  useEffect(() => {
    setTotalPages(totalPages || 1);
  }, [totalPages, setTotalPages]);

  // Sem seleção, o detalhe mostra o primeiro aviso da página
  const current = selected ?? announcements[0] ?? null;

  const select = (a: AnnouncementsResponse) => {
    setSelected(a);
    setMobileDetail(true);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      goToPage(1);
      setSelected(null);
      setMobileDetail(false);
      setView("browse");
    }
    onOpenChange(value);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await DeleteAnnouncement(toDelete.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["announcements"] }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard", "announcements"],
        }),
      ]);
      toast.success("Aviso removido.");
      setSelected(null);
      setMobileDetail(false);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível remover o aviso.");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b bg-muted/40 px-5 py-4">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Megaphone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-base">
                  {view === "create" ? "Novo aviso" : "Quadro de avisos"}
                </DialogTitle>
                <DialogDescription>
                  {view === "create"
                    ? "Publique um comunicado para toda a empresa"
                    : announcementsCount > 0
                      ? `${announcementsCount} ${announcementsCount === 1 ? "aviso" : "avisos"} da empresa`
                      : "Comunicados da empresa para a equipe"}
                </DialogDescription>
              </div>
            </div>
            {isAdmin && view === "browse" && (
              <Button
                size="sm"
                onClick={() => setView("create")}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Novo aviso
              </Button>
            )}
          </div>
        </DialogHeader>

        {view === "create" ? (
          <div className="max-h-[75vh] overflow-y-auto px-5 py-4">
            <AnnouncementForm
              onCancel={() => setView("browse")}
              onCreated={() => {
                goToPage(1);
                setSelected(null);
                setView("browse");
              }}
            />
          </div>
        ) : loading ? (
          <div className="grid h-[460px] place-items-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="grid h-[460px] place-items-center text-sm text-destructive">
            {error}
          </div>
        ) : announcements.length === 0 && !selected ? (
          <EmptyBoard isAdmin={isAdmin} onCreate={() => setView("create")} />
        ) : (
          <div className="grid h-[min(560px,70vh)] md:grid-cols-[minmax(0,340px)_1fr]">
            {/* lista */}
            <div
              className={`flex min-h-0 flex-col border-r ${
                mobileDetail ? "hidden md:flex" : "flex"
              }`}
            >
              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                {announcements.map((a) => (
                  <li key={a.id}>
                    <AnnouncementListItem
                      announcement={a}
                      active={current?.id === a.id}
                      onClick={() => select(a)}
                    />
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="border-t bg-muted/30 px-2">
                  <DataPagination
                    currentPage={displayPage}
                    totalPages={totalPages}
                    pageRange={pageRange}
                    goToPage={goToPage}
                    className="py-1.5"
                  />
                </div>
              )}
            </div>

            {/* detalhe */}
            <div
              className={`min-h-0 overflow-y-auto ${
                mobileDetail ? "block" : "hidden md:block"
              }`}
            >
              {current && (
                <AnnouncementDetail
                  key={current.id}
                  announcement={current}
                  canDelete={isAdmin}
                  deleting={deleting}
                  onBack={() => setMobileDetail(false)}
                  onDelete={() => setToDelete(current)}
                />
              )}
            </div>
          </div>
        )}
      </DialogContent>

      <DialogConfirm
        id={toDelete?.id ?? ""}
        open={!!toDelete}
        onOpenChange={(value) => !value && setToDelete(null)}
        title="Remover aviso?"
        description={`"${toDelete?.title ?? ""}" deixará de aparecer para toda a empresa.`}
        onDelete={handleDelete}
      />
    </Dialog>
  );
}

function EmptyBoard({
  isAdmin,
  onCreate,
}: {
  isAdmin: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex h-[460px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-muted">
        <Megaphone className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <p className="font-semibold text-foreground">Nenhum aviso por aqui</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {isAdmin
          ? "Use os avisos para comunicar manutenções, metas e novidades para toda a equipe."
          : "Quando a administração publicar um comunicado, ele aparece aqui."}
      </p>
      {isAdmin && (
        <Button onClick={onCreate} className="mt-5 cursor-pointer">
          <Plus className="h-4 w-4" /> Criar primeiro aviso
        </Button>
      )}
    </div>
  );
}

function StatusPill({ announcement }: { announcement: AnnouncementsResponse }) {
  const status = ANNOUNCEMENT_STATUS[getAnnouncementStatus(announcement)];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}
    >
      {status.label}
    </span>
  );
}

function AnnouncementListItem({
  announcement,
  active,
  onClick,
}: {
  announcement: AnnouncementsResponse;
  active: boolean;
  onClick: () => void;
}) {
  const style = getAnnouncementType(announcement.type);
  const expired = getAnnouncementStatus(announcement) === "expired";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      className={`group flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active ? "bg-primary/8 ring-1 ring-primary/25" : "hover:bg-muted/70"
      } ${expired ? "opacity-60" : ""}`}
    >
      <span
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${style.soft}`}
      >
        <style.icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {announcement.title}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {timeAgo(announcement.created_at)}
          </span>
        </span>
        {announcement.content && (
          <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
            {announcement.content}
          </span>
        )}
        <span className="mt-1.5 flex items-center gap-2">
          <StatusPill announcement={announcement} />
          <span className="text-[11px] text-muted-foreground">
            {style.label}
          </span>
        </span>
      </span>
    </button>
  );
}

function AnnouncementDetail({
  announcement,
  canDelete,
  deleting,
  onBack,
  onDelete,
}: {
  announcement: AnnouncementsResponse;
  canDelete: boolean;
  deleting: boolean;
  onBack: () => void;
  onDelete: () => void;
}) {
  const style = getAnnouncementType(announcement.type);
  const starts = parseAnnouncementDate(announcement.starts_at);
  const expires = parseAnnouncementDate(announcement.expires_at);
  const hint = getAnnouncementTimeHint(announcement);

  return (
    <article className="dash-in flex min-h-full flex-col">
      <div className={`h-1.5 ${style.bar}`} />
      <div className="flex flex-1 flex-col gap-5 p-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground md:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Todos os avisos
        </button>

        <header className="flex items-start gap-4">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${style.soft}`}
          >
            <style.icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.soft}`}
              >
                {style.label}
              </span>
              <StatusPill announcement={announcement} />
            </div>
            <h2 className="break-words text-xl font-bold leading-tight text-foreground">
              {announcement.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Publicado {timeAgo(announcement.created_at)}
            </p>
          </div>
        </header>

        <p className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground/90">
          {announcement.content || (
            <span className="italic text-muted-foreground">
              Este aviso não tem mensagem.
            </span>
          )}
        </p>

        <dl className="mt-auto grid gap-2 border-t pt-4 text-xs sm:grid-cols-3">
          <div className="rounded-lg bg-muted/60 p-2.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Início
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {starts ? formatDateTime(starts) : "Imediato"}
            </dd>
          </div>
          <div className="rounded-lg bg-muted/60 p-2.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" /> Fim
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {expires ? formatDateTime(expires) : "Sem data de fim"}
            </dd>
          </div>
          <div className="rounded-lg bg-muted/60 p-2.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Situação
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {hint ?? "Encerrado"}
            </dd>
          </div>
        </dl>

        {canDelete && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={deleting}
              className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remover aviso
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
