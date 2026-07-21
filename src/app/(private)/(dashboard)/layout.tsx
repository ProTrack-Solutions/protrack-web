"use client";

import { Toaster } from "@/components/ui/sonner";
import { PrivateLayout } from "@/layout/PrivateLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

// Caminho onde você salvou o layout da Sidebar

interface DashboardLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

const queryClient = new QueryClient();

export default function DashboardLayout({
  children,
  session,
}: DashboardLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <PrivateLayout>{children}</PrivateLayout>
        <Toaster theme="light" richColors closeButton position="top-right" />
      </SessionProvider>
    </QueryClientProvider>
  );
}
