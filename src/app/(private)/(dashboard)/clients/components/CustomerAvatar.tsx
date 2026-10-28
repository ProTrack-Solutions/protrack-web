import { avatarColor, initials } from "./format";

export function CustomerAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${avatarColor(name)} ${
        size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-xs"
      }`}
    >
      {initials(name)}
    </span>
  );
}
