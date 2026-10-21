/**
 * Divisória em SVG com duas camadas de onda deslizando em loop.
 * `from` é a cor da seção de cima e `to` a da seção de baixo (classes text-*);
 * `accent` pinta a onda de trás (padrão: a mesma cor de `to`).
 * Cada camada tem dois períodos idênticos lado a lado, então
 * transladar -50% fecha o loop sem emenda.
 */

const WAVE =
  "M0 40 C 180 80, 360 0, 540 40 S 900 80, 1080 40 S 1260 0, 1440 40 V 100 H 0 Z";

type WaveDividerProps = {
  from: string;
  to: string;
  accent?: string;
};

export function WaveDivider({ from, to, accent = to }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-20 overflow-hidden sm:h-28 ${from}`}
      style={{ backgroundColor: "currentColor" }}
    >
      {[
        { opacity: 0.45, dur: "18s", delay: "-6s" },
        { opacity: 1, dur: "11s", delay: "0s" },
      ].map((layer, i) => (
        <svg
          key={i}
          viewBox="0 0 2880 100"
          preserveAspectRatio="none"
          className={`wave-layer absolute bottom-0 left-0 h-full w-[200%] ${i ? to : accent}`}
          style={
            {
              "--dur": layer.dur,
              opacity: layer.opacity,
              animationDelay: layer.delay,
              animationDirection: i ? "normal" : "reverse",
            } as React.CSSProperties
          }
        >
          <path fill="currentColor" d={WAVE} />
          <path fill="currentColor" d={WAVE} transform="translate(1440 0)" />
        </svg>
      ))}
    </div>
  );
}
