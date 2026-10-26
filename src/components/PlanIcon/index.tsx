"use client";

import { Sparkles, type LucideProps } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";

// A API manda o nome do ícone do Lucide ("sparkles", "shopping-cart"...);
// normaliza variações como "ShoppingCart" ou "shopping_cart" para kebab-case.
const toIconName = (name?: string | null): IconName | null => {
  if (!name) return null;
  const kebab = name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
  return (iconNames as string[]).includes(kebab) ? (kebab as IconName) : null;
};

interface PlanIconProps extends Omit<LucideProps, "ref" | "name"> {
  name?: string | null;
}

export function PlanIcon({ name, ...props }: PlanIconProps) {
  const iconName = toIconName(name);
  if (!iconName) return <Sparkles {...props} />;
  return (
    <DynamicIcon
      name={iconName}
      fallback={() => <Sparkles {...props} />}
      {...props}
    />
  );
}

export default PlanIcon;
