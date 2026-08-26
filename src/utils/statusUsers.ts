export function translateUserStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: "Ativado",
    INACTIVE: "Desativado",
  };

  return statusMap[status] ?? status;
}
