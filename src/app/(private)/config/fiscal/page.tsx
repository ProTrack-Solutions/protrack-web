"use client";

import { FolderTree, Loader2, Receipt, Settings2 } from "lucide-react";
import { HeaderConfig } from "@/components/HeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFiscalSettings } from "@/hooks/useFiscal";
import { getApiErrorMessage } from "@/utils/apiError";
import { FiscalSetup } from "./components/FiscalSetup";
import { TaxProfiles } from "./components/TaxProfiles";
import { CategoryTaxProfiles } from "./components/CategoryTaxProfiles";

export default function FiscalConfigPage() {
  const { data: settings, isLoading, error } = useFiscalSettings();

  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Nota fiscal (NFC-e)"
        description="Emissão da nota fiscal de consumidor nas vendas do PDV"
      />

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !settings ? (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(
            error,
            "Não foi possível carregar a configuração fiscal.",
          )}
        </p>
      ) : (
        <Tabs defaultValue="setup" className="w-full">
          <TabsList>
            <TabsTrigger value="setup" className="gap-2">
              <Settings2 className="h-4 w-4" /> Emissão
            </TabsTrigger>
            <TabsTrigger value="profiles" className="gap-2">
              <Receipt className="h-4 w-4" /> Perfis tributários
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderTree className="h-4 w-4" /> Categorias
            </TabsTrigger>
          </TabsList>
          <TabsContent value="setup" className="mt-4">
            <FiscalSetup settings={settings} />
          </TabsContent>
          <TabsContent value="profiles" className="mt-4">
            <TaxProfiles settings={settings} />
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <CategoryTaxProfiles />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
