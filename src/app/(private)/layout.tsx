"use client";

import { Toaster } from "@/components/ui/sonner";
import { PrivateLayout } from "@/layout/PrivateLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Caminho onde você salvou o layout da Sidebar

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivateLayout>{children}</PrivateLayout>
      <Toaster />
    </QueryClientProvider>
  );
}
