"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  CalendarClock,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  Save,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { CreateBillsPayableParams } from "@/interfaces/bills-payable.interface";
import { useBillsCategories } from "@/hooks/useBillsCategories";
import { useVendors } from "@/hooks/useVendors";
import { CreateBillsPayable } from "@/service/bills-payable.service";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

interface DialogNewContaPagarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (conta: CreateBillsPayableParams) => void;
}

const emptyForm: CreateBillsPayableParams = {
  vendor_id: "",
  amount: 0,
  due_date: "",
  category_id: "",
  description: "",
  payment_method_id: "",
  notes: "",
};

export const DialogNewAccountsPayable = ({
  open,
  onOpenChange,
  onSave,
}: DialogNewContaPagarProps) => {
  const [formData, setFormData] = useState<CreateBillsPayableParams>(emptyForm);

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(emptyForm); // reseta ao fechar, então o próximo "open" já nasce limpo
    }
    onOpenChange(nextOpen);
  };

  const handleChange = <K extends keyof CreateBillsPayableParams>(
    field: K,
    value: CreateBillsPayableParams[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (
        !formData.vendor_id ||
        !formData.amount ||
        !formData.due_date ||
        !formData.category_id ||
        !formData.description
      ) {
        toast.error(
          "Preencha fornecedor, valor, vencimento, categoria e descrição.",
        );
        return;
      }

      await CreateBillsPayable(formData);
      toast.success("Conta cadastrada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar conta!");
    } finally {
      onSave?.(formData);
      handleDialogChange(false);
    }
  };

  const { billsCategories } = useBillsCategories();
  const { vendorsIsActive } = useVendors();
  const { paymentMethods } = usePaymentMethods();

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Informações básicas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dados do fornecedor e da conta
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="new-fornecedor"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  Fornecedor <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.vendor_id}
                  onValueChange={(v) => handleChange("vendor_id", v)}
                >
                  <SelectTrigger id="new-fornecedor" className="h-11">
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(vendorsIsActive) &&
                      vendorsIsActive?.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="new-categoria"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  Categoria <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) => handleChange("category_id", v)}
                >
                  <SelectTrigger id="new-categoria" className="h-11">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(billsCategories) &&
                      billsCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="new-descricao"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  Descrição <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="new-descricao"
                  placeholder="Ex: Conta de energia elétrica"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <CalendarClock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Prazos
                </h3>
                <p className="text-xs text-muted-foreground">
                  Vencimento e agendamento do pagamento
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-vencimento" className="text-sm font-medium">
                  Data de vencimento <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="new-vencimento"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleChange("due_date", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Pagamento
                </h3>
                <p className="text-xs text-muted-foreground">
                  Valores e forma de pagamento
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-valor" className="text-sm font-medium">
                  Valor total <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    id="new-valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      handleChange("amount", parseFloat(e.target.value) || 0)
                    }
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="new-forma"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                  Forma de pagamento
                </Label>
                <Select
                  value={formData.payment_method_id}
                  onValueChange={(v) => handleChange("payment_method_id", v)}
                >
                  <SelectTrigger id="new-forma" className="h-11">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(paymentMethods) &&
                      paymentMethods?.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="new-obs" className="text-sm font-medium">
              Observações
            </Label>
            <Textarea
              id="new-obs"
              placeholder="Adicione observações sobre esta conta (opcional)"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="min-h-22.5 resize-none"
            />
          </div>

          {/* Resumo rápido */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Resumo rápido
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Fornecedor:</span>
              <span className="text-sm font-semibold text-foreground">
                {vendorsIsActive?.map(
                  (v) => formData.vendor_id === v.id && v.name,
                ) || "—"}
              </span>
              {formData.category_id && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400"
                >
                  {billsCategories?.map(
                    (c) => formData.category_id === c.id && c.name,
                  ) || "—"}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border/60 bg-background p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Valor
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  R$ {(formData.amount || 0).toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Vence
                </p>
                <p className="text-sm font-bold text-foreground mt-1">
                  {formData.due_date
                    ? new Date(
                        formData.due_date + "T00:00:00",
                      ).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 bg-transparent">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Cadastrar conta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
