import type { TypeHeader } from "../../@types/types.components";

export function Header({ title, text }: TypeHeader) {
  return (
    <div className="pb-5">
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">{text}.</p>
    </div>
  );
}
