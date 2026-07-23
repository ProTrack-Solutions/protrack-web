"use client";

import { HeaderConfig } from "@/components/HeaderConfig";
import { ConfigWhatsApp } from "./components/ConfigWhatsApp";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { MessageCircle } from "lucide-react";

export default function SystemConfigPage() {
  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Configurações financeiras"
        description="Aqui você encontra as configurações do sistema"
      />

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <MessageCircle className="h-4 w-4" /> E-mail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-4 mt-4">
          <ConfigWhatsApp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
