"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Receipt, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FiscalSettings, TaxProfile } from "@/interfaces/fiscal.interface";
import { useInvalidateFiscal, useTaxProfiles } from "@/hooks/useFiscal";
import {
  DeleteTaxProfile,
  UpdateFiscalSettings,
} from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { TaxProfileDialog } from "./TaxProfileDialog";

const pct = (v: number | null) =>
  v === null ? "—" : `${String(v).replace(".", ",")}%`;

interface Props {
  settings: FiscalSettings;
}

/** Lista de perfis tributários da empresa */
export function TaxProfiles({ settings }: Props) {
  const { data: profiles = [], isLoading } = useTaxProfiles();
  const invalidate = useInvalidateFiscal();
  const [editing, setEditing] = useState<TaxProfile | null>(null);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<TaxProfile | null>(null);
  const [busy, setBusy] = useState(false);

  const makeDefault = async (p: TaxProfile) => {
    setBusy(true);
    try {
      await UpdateFiscalSettings({
        enabled: settings.enabled,
        default_tax_profile_id: p.id,
      });
      toast.success(`"${p.name}" agora é o perfil padrão.`);
      invalidate();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao definir o perfil padrão"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!removing) return;
    setBusy(true);
    try {
      await DeleteTaxProfile(removing.id);
      toast.success("Perfil excluído.");
      invalidate();
      setRemoving(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao excluir o perfil"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Perfis tributários</CardTitle>
            <CardDescription>
              O imposto de cada item da nota vem do perfil: primeiro o do
              produto, depois o da categoria e, por último, o padrão da empresa.
            </CardDescription>
          </div>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Novo perfil
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Nenhum perfil ainda. Crie o primeiro: ele vira o padrão da empresa e
            vale para todos os produtos.
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>ICMS / CFOP</TableHead>
                  <TableHead>PIS / COFINS</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    IBS / CBS
                  </TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.id}>
                    {/* Nome quebra linha; o uso fica embaixo para a tabela caber */}
                    <TableCell className="min-w-48 whitespace-normal">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                        {p.name}
                        {p.is_default && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            Padrão
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.is_default
                          ? "Vale para os produtos sem outro perfil"
                          : `Em ${p.categories_count} categ. · ${p.products_count} prod.`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block">
                        {p.icms_csosn
                          ? `CSOSN ${p.icms_csosn}`
                          : `CST ${p.icms_cst}`}
                        {p.icms_rate !== null && (
                          <span className="text-muted-foreground">
                            {" "}
                            · {pct(p.icms_rate)}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        CFOP {p.cfop}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="block">
                        PIS {p.pis_cst}
                        {p.pis_rate !== null && ` · ${pct(p.pis_rate)}`}
                      </span>
                      <span className="block">
                        COFINS {p.cofins_cst}
                        {p.cofins_rate !== null && ` · ${pct(p.cofins_rate)}`}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm xl:table-cell">
                      {p.ibs_cbs_cst} · {p.ibs_cbs_class_code}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {!p.is_default && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Usar como padrão"
                            disabled={busy}
                            onClick={() => makeDefault(p)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Editar"
                          onClick={() => setEditing(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          title="Excluir"
                          onClick={() => setRemoving(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <TaxProfileDialog
        open={creating || !!editing}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
        profile={editing}
        taxRegime={settings.tax_regime}
      />

      <AlertDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir &quot;{removing?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removing?.is_default
                ? "É o perfil padrão: sem outro padrão, produtos sem perfil próprio ou de categoria ficam sem nota até você escolher um."
                : "Categorias e produtos que usam este perfil voltam a usar o perfil padrão da empresa."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                remove();
              }}
              disabled={busy}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
