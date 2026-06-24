import { useState, useEffect } from "react";

export default function Loading() {
  const [pontos, setPontos] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPontos((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Muda o ponto a cada 500 milissegundos

    // Limpa o intervalo quando o componente sai da tela
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 min-h-[150px]">
      {/* Spinner Animado */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

      {/* Texto com pontos progressivos */}
      <p className="text-base font-medium text-gray-600 tracking-wide">
        Carregando
        <span className="inline-block w-8 text-left">{pontos}</span>
      </p>
    </div>
  );
}
