"use client";

import { PrivateLayout } from "@/layout/PrivateLayout";

// Caminho onde você salvou o layout da Sidebar

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
