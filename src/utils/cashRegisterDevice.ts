// Caixa físico em que este computador trabalha. Fica no navegador (cada
// computador do balcão escolhe o seu) e vai em toda requisição no header
// CashRegisterId: é por ele que a API sabe em qual turno a venda entra.

const STORAGE_KEY = "protrack:cash-register-id";

type Listener = () => void;
const listeners = new Set<Listener>();

let current: string | null | undefined;

function read(): string | null {
  if (current !== undefined) return current;
  try {
    current = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    current = null;
  }
  return current;
}

export function getDeviceCashRegisterId(): string | null {
  if (typeof window === "undefined") return null;
  return read();
}

export function setDeviceCashRegisterId(id: string | null) {
  current = id;
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sem storage (aba anônima bloqueada): vale só enquanto a página estiver aberta
  }
  listeners.forEach((l) => l());
}

/** Para useSyncExternalStore: avisa quando outra parte da tela troca o caixa */
export function subscribeDeviceCashRegister(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
