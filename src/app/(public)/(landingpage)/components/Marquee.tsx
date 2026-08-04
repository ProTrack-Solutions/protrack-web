import { marqueeWords } from "../landing-data";

export function Marquee() {
  return (
    <section className="border-y border-border bg-secondary/60 py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {[...marqueeWords, ...marqueeWords].map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {w}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </section>
  );
}
