import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

// Usa getSession em vez de useSession porque o layout de /config não tem
// SessionProvider. A flag só muda no login, então não precisa refazer a busca.
export const useIsDemo = () => {
  const { data } = useQuery({
    queryKey: ["session", "isDemo"],
    queryFn: async () => (await getSession())?.isDemo ?? false,
    staleTime: Infinity,
  });

  return data ?? false;
};
