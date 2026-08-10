"use client";

import { HeaderConfig } from "@/components/HeaderConfig";
import { SecurityStatusCard } from "./components/SecurityStatusCard";
import { ChangePasswordCard } from "./components/ChangePasswordCard";

import { ActiveSessionsCard } from "./components/ActiveSessionsCard";

export default function SecurityConfigPage() {
  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Segurança"
        description="Configure suas opções de segurança e controle de acesso"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SecurityStatusCard />

          <ChangePasswordCard />
        </div>

        <div className="space-y-6">
          <ActiveSessionsCard sessoes={[]} />
        </div>
      </div>
    </div>
  );
}
