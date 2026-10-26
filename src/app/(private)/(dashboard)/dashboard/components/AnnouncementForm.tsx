"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnnouncementType } from "@/interfaces/announcements.interface";
import { CreateAnnouncement } from "@/service/announcements.service";
import { ANNOUNCEMENT_TYPES } from "@/utils/announcementFormat";

const TITLE_MAX = 150;

// Prazos rápidos para a data de fim; null = aviso sem data de fim
const DURATIONS: { label: string; days: number | null }[] = [
  { label: "1 dia", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "Sem fim", days: null },
];

/** Date -> valor aceito pelo <input type="datetime-local"> (hora local) */
function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const addDays = (base: string, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return toLocalInput(d);
};

interface AnnouncementFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

export function AnnouncementForm({
  onCancel,
  onCreated,
}: AnnouncementFormProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<AnnouncementType>("info");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startsAt, setStartsAt] = useState(() => toLocalInput(new Date()));
  const [expiresAt, setExpiresAt] = useState(() =>
    addDays(toLocalInput(new Date()), 7),
  );
  const [saving, setSaving] = useState(false);

  const selectedDuration = DURATIONS.find((d) =>
    d.days === null ? !expiresAt : expiresAt === addDays(startsAt, d.days),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return toast.error("Informe o título do aviso.");
    if (!content.trim()) return toast.error("Escreva a mensagem do aviso.");
    if (!startsAt) return toast.error("Informe quando o aviso começa.");
    if (expiresAt && new Date(expiresAt) <= new Date(startsAt))
      return toast.error("A data de fim precisa ser depois do início.");

    try {
      setSaving(true);
      await CreateAnnouncement({
        title: title.trim(),
        content: content.trim(),
        type,
        starts_at: new Date(startsAt).toISOString(),
        ...(expiresAt && { expires_at: new Date(expiresAt).toISOString() }),
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["announcements"] }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard", "announcements"],
        }),
      ]);
      toast.success("Aviso publicado para toda a empresa.");
      onCreated();
    } catch (error) {
      console.error(error);
      const message = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;
      toast.error(
        typeof message === "string"
          ? message
          : "Não foi possível publicar o aviso.",
      );
    } finally {
      setSaving(false);
    }
  }

  const style = ANNOUNCEMENT_TYPES[type];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao quadro
      </button>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          {/* tipo */}
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold">
              Tipo do aviso
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(ANNOUNCEMENT_TYPES) as AnnouncementType[]).map(
                (key) => {
                  const t = ANNOUNCEMENT_TYPES[key];
                  const active = key === type;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setType(key)}
                      className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-xs font-semibold transition-all ${
                        active
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-lg ${t.soft}`}
                      >
                        <t.icon className="h-4 w-4" />
                      </span>
                      {t.label}
                    </button>
                  );
                },
              )}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="ann-title" className="font-semibold">
                Título
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <Input
              id="ann-title"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Inventário no sábado"
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ann-content" className="font-semibold">
              Mensagem
            </Label>
            <Textarea
              id="ann-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explique o que a equipe precisa saber..."
              className="min-h-28 resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ann-start" className="font-semibold">
                Começa em
              </Label>
              <Input
                id="ann-start"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ann-end" className="font-semibold">
                Termina em
              </Label>
              <Input
                id="ann-end"
                type="datetime-local"
                value={expiresAt}
                min={startsAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() =>
                  setExpiresAt(d.days === null ? "" : addDays(startsAt, d.days))
                }
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedDuration === d
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* prévia de como o aviso vai aparecer */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Prévia</p>
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className={`h-1.5 ${style.bar}`} />
            <div className="space-y-2 p-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${style.soft}`}
              >
                <style.icon className="h-3.5 w-3.5" />
                {style.label}
              </span>
              <p className="break-words font-semibold text-foreground">
                {title || "Título do aviso"}
              </p>
              <p className="line-clamp-6 whitespace-pre-line break-words text-sm text-muted-foreground">
                {content || "A mensagem aparece aqui."}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Todos os usuários da empresa verão este aviso no dashboard enquanto
            ele estiver no ar.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving} className="cursor-pointer">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Publicar aviso
        </Button>
      </div>
    </form>
  );
}
