export function formatDate(date: string | Date): string {
  return String(date).slice(0, 10).split("-").reverse().join("/");
}

export function formatDateRequest(dataInput: Date | string | number): string {
  const data = new Date(dataInput);

  if (isNaN(data.getTime())) return "";

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
