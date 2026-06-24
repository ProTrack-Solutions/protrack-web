export function formatDate(date: string | Date): string {
  return String(date).slice(0, 10).split("-").reverse().join("/");
}
