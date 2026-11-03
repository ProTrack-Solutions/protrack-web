export const formatDocument = (doc: string | null | undefined): string => {
  if (!doc) return "";

  const numbers = doc.replace(/\D/g, "");

  if (numbers.length === 11) {
    return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  if (numbers.length === 14) {
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }

  return doc;
};

/** Confere os dígitos verificadores do CPF (só números ou formatado). */
export const isValidCPF = (value: string): boolean => {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const n of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += Number(cpf[i]) * (n + 1 - i);
    const digit = ((sum * 10) % 11) % 10;
    if (digit !== Number(cpf[n])) return false;
  }
  return true;
};

/** Máscara de CPF enquanto digita */
export const maskCPF = (value: string): string => {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};
