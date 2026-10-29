"use client";

import { HeaderConfig } from "@/components/HeaderConfig";
import { ConfigWhatsApp } from "./components/ConfigWhatsApp";
import { ConfigCashRegister } from "./components/ConfigCashRegister";
import { ConfigCashRegisters } from "./components/ConfigCashRegisters";
import { ConfigStock } from "./components/ConfigStock";
import { ConfigReturns } from "./components/ConfigReturns";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { ArrowLeftRight, MessageCircle, Package, Vault } from "lucide-react";

export default function SystemConfigPage() {
  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Configurações do sistema"
        description="Aqui você encontra as configurações do sistema"
      />

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger value="cash-register" className="gap-2">
            <Vault className="h-4 w-4" /> Caixa
          </TabsTrigger>
          <TabsTrigger value="stock" className="gap-2">
            <Package className="h-4 w-4" /> Estoque
          </TabsTrigger>
          <TabsTrigger value="returns" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" /> Trocas
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <MessageCircle className="h-4 w-4" /> E-mail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-4 mt-4">
          <ConfigWhatsApp />
        </TabsContent>

        <TabsContent value="cash-register" className="space-y-4 mt-4">
          <ConfigCashRegister />
          <ConfigCashRegisters />
        </TabsContent>

        <TabsContent value="stock" className="space-y-4 mt-4">
          <ConfigStock />
        </TabsContent>

        <TabsContent value="returns" className="space-y-4 mt-4">
          <ConfigReturns />
        </TabsContent>
      </Tabs>
    </div>
  );
}
