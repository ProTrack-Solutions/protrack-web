/** Carrega o PDF num iframe invisível e abre a janela de impressão do navegador */
export function printPdfBlob(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // Limpeza depois que a janela de impressão já leu o arquivo
    setTimeout(() => {
      iframe.remove();
      window.URL.revokeObjectURL(url);
    }, 60_000);
  };
  document.body.appendChild(iframe);
}
