"use client";

import { useState } from "react";
import { FolderTree, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFiscalCategories,
  useInvalidateFiscal,
  useTaxProfiles,
} from "@/hooks/useFiscal";
import { SetCategoryTaxProfile } from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";

const INHERIT = "__default__";

/** Perfil tributário de cada categoria (vale para os produtos sem perfil próprio) */
export function CategoryTaxProfiles() {
  const { data: categories = [], isLoading } = useFiscalCategories();
  const { data: profiles = [] } = useTaxProfiles();
  const invalidate = useInvalidateFiscal();
  const [saving, setSaving] = useState<string | null>(null);
  const defaultProfile = profiles.find((p) => p.is_default);

  const change = async (categoryId: string, value: string) => {
    setSaving(categoryId);
    try {
      await SetCategoryTaxProfile(categoryId, value === INHERIT ? null : value);
      toast.success("Categoria atualizada.");
      invalidate();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao salvar a categoria"));
    } finally {
      setSaving(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FolderTree className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Tributação por categoria</CardTitle>
            <CardDescription>
              Útil quando uma categoria inteira é diferente (ex.: cimento com
              substituição tributária). Produtos podem ter um perfil próprio no
              cadastro fiscal do produto.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma categoria cadastrada.
          </p>
        ) : (
          <div className="divide-y rounded-lg border">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-4 px-4 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: c.color ?? "var(--muted-foreground)" }}
                  />
                  {c.name}
                </span>
                <div className="flex items-center gap-2">
                  {saving === c.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Select
                    value={c.tax_profile_id ?? INHERIT}
                    onValueChange={(v) => change(c.id, v)}
                    disabled={saving === c.id}
                  >
                    <SelectTrigger className="w-72">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={INHERIT}>
                        Padrão da empresa
                        {defaultProfile ? ` (${defaultProfile.name})` : ""}
                      </SelectItem>
                      {profiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
