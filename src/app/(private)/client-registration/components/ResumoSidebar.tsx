import { ClienteFormData } from "@/@types/client-registration.type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eraser, Save, User } from "lucide-react";

interface ResumoSidebarProps {
  formData: ClienteFormData;
  onReset: () => void;
}

function buildEnderecoLabel(formData: ClienteFormData): string {
  const {
    address_street,
    address_number,
    address_complement,
    address_city,
    address_state,
  } = formData;

  if (!address_street || !address_number) return "—";

  return [
    `${address_street}, ${address_number}`,
    address_complement ? `- ${address_complement}` : null,
    address_city || null,
    address_state ? `- ${address_state}` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ResumoSidebar({ formData, onReset }: ResumoSidebarProps) {
  return (
    <Card className="border-border/50 sticky top-6">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Resumo</h2>
            <p className="text-xs text-muted-foreground">Pré-visualização</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Cliente
            </p>
            <p className="text-sm font-semibold text-foreground mt-1 break-words">
              {formData.full_name || "—"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                CPF
              </p>
              <p className="text-sm font-bold text-foreground mt-1">
                {formData.cpf || "—"}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Gênero
              </p>
              <p className="text-sm font-bold text-foreground mt-1 capitalize">
                {formData.gender ? formData.gender.replace("_", " ") : "—"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Email
            </p>
            <p className="text-sm font-bold text-foreground mt-1 break-words">
              {formData.email || "—"}
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Endereço
            </p>
            <p className="text-sm font-bold text-foreground mt-1">
              {buildEnderecoLabel(formData)}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Cadastrar cliente
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full h-11"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Limpar formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
