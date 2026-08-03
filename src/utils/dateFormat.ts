export function formatDate(date: string | Date): string {
  return String(date).slice(0, 10).split("-").reverse().join("/");
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Garante que a data é válida antes de tentar formatar
  if (isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit", // Descomente se precisar dos segundos
  }).format(parsedDate);
}

export function formatDateRequest(dataInput: Date | string | number): string {
  const data = new Date(dataInput);

  if (isNaN(data.getTime())) return "";

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
