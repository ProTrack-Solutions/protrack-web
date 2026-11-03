"use client";

import LayoutConfig from "@/layout/ConfigLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutConfig>{children}</LayoutConfig>
    </QueryClientProvider>
  );
}
