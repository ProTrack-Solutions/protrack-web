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
