/**
 * Céu estrelado decorativo (inspirado no hero do Discord).
 * As posições são pseudo-aleatórias porém determinísticas, para que
 * servidor e cliente renderizem exatamente o mesmo HTML.
 */

const seeded = (i: number, salt: number) => {
  // Hash inteiro (mulberry32): resultado idêntico em qualquer engine JS
  let t = (i * 2654435761 + salt * 1013904223) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (((t ^ (t >>> 14)) >>> 0) % 1000) / 1000;
};

type StarfieldProps = {
  stars?: number;
  sparkles?: number;
  className?: string;
};

export function Starfield({
  stars = 70,
  sparkles = 8,
  className = "",
}: StarfieldProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {Array.from({ length: stars }, (_, i) => {
        const size = 1 + seeded(i, 3) * 2;
        return (
          <span
            key={`s${i}`}
            className="star"
            style={
              {
                left: `${seeded(i, 1) * 100}%`,
                top: `${seeded(i, 2) * 100}%`,
                width: size,
                height: size,
                "--dur": `${3 + seeded(i, 4) * 4}s`,
                "--delay": `${seeded(i, 5) * -6}s`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {Array.from({ length: sparkles }, (_, i) => {
        const size = 10 + seeded(i, 8) * 14;
        return (
          <svg
            key={`k${i}`}
            className="sparkle"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            style={
              {
                left: `${4 + seeded(i, 6) * 92}%`,
                top: `${4 + seeded(i, 7) * 80}%`,
                "--dur": `${2.5 + seeded(i, 9) * 3}s`,
                "--delay": `${seeded(i, 10) * -5}s`,
              } as React.CSSProperties
            }
          >
            <path
              fill="currentColor"
              d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
            />
          </svg>
        );
      })}
    </div>
  );
}
