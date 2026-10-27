export const POSITIVE_TEXT = "text-[hsl(150_45%_32%)]";

const time = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});
const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatTime = (iso: string) => time.format(new Date(iso));

/** "27 out, 14:05" */
export const formatDateTime = (iso: string) =>
  dateTime.format(new Date(iso)).replace(/\./g, "");

/** "2h 15min" entre duas datas (ou até agora) */
export function formatDuration(startIso: string, endIso?: string | null) {
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const minutes = Math.max(
    0,
    Math.floor((end - new Date(startIso).getTime()) / 60_000),
  );
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export const integer = (value: number) =>
  Math.round(value).toLocaleString("pt-BR");
