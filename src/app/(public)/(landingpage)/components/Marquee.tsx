import { marqueeWords } from "../landing-data";

const half = Math.ceil(marqueeWords.length / 2);
const rows = [
  { words: [...marqueeWords.slice(half), ...marqueeWords.slice(0, half)], reverse: false },
  { words: [...marqueeWords].reverse(), reverse: true },
];

export function Marquee() {
  return (
    <section
      aria-label="Destaques do sistema"
      className="marquee-pause relative overflow-hidden py-10"
    >
      <div className="-rotate-2 space-y-3 sm:-rotate-1">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`py-4 ${
              r === 0
                ? "bg-gradient-primary text-white shadow-lg"
                : "border-y border-border bg-card text-muted-foreground"
            }`}
          >
            <div
              className={`flex w-max items-center gap-10 whitespace-nowrap ${
                row.reverse ? "animate-marquee-reverse" : "animate-marquee"
              }`}
            >
              {[...row.words, ...row.words].map((w, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className="font-display text-lg font-bold uppercase tracking-[0.15em] sm:text-xl">
                    {w}
                  </span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-80">
                    <path
                      fill="currentColor"
                      d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
                    />
                  </svg>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
