"use client";

import { useState } from "react";
import { HeaderConfig } from "@/components/HeaderConfig";
import { SecurityStatusCard } from "./components/SecurityStatusCard";
import { ChangePasswordCard } from "./components/ChangePasswordCard";
import { TwoFactorAuthCard } from "./components/TwoFactorAuthCard";

import { ActiveSessionsCard } from "./components/ActiveSessionsCard";
import type { Configuracoes2FA } from "./components/types";

export default function SecurityConfigPage() {
  const [configuracoes2FA, setConfiguracoes2FA] = useState<Configuracoes2FA>({
    ativo: false,
    emailBackup: true,
    codigoRecuperacao: true,
  });

  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Segurança"
        description="Configure suas opções de segurança e controle de acesso"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SecurityStatusCard twoFactorEnabled={configuracoes2FA.ativo} />

          <ChangePasswordCard />

          <TwoFactorAuthCard
            config={configuracoes2FA}
            onActivate={() =>
              setConfiguracoes2FA((prev) => ({ ...prev, ativo: true }))
            }
            onDeactivate={() =>
              setConfiguracoes2FA((prev) => ({ ...prev, ativo: false }))
            }
            onOptionChange={(field, checked) =>
              setConfiguracoes2FA((prev) => ({ ...prev, [field]: checked }))
            }
          />
        </div>

        <div className="space-y-6">
          <ActiveSessionsCard sessoes={[]} />
        </div>
      </div>
    </div>
  );
}
