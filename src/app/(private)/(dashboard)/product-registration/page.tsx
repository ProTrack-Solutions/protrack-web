"use client";

import { useMemo, useState } from "react";
import { CadastroProdutoResumo } from "./components/CadastroProdutoResumo";
import { FormEstoque } from "./components/FormEstoque";
import { FormInfoBasica } from "./components/FormInfoBasica";
import { FormPrecificacao } from "./components/FormPrecificacao";
import {
  FormGrade,
  GridCombo,
  GridState,
  initialGridState,
} from "./components/FormGrade";
import { Header } from "@/components/Header";
import { CreateModel, CreateProduct } from "@/service/products.service";
import { toast } from "sonner";
import {
  CreateProductParams,
  initialFormData,
} from "@/interfaces/products.interface";
import { cellKey, variationName } from "@/components/ProductGrid/grid";
import { FormTipoCadastro } from "./components/FormTipoCadastro";
import { useInvalidateGrid } from "@/hooks/useProductGrid";
import { getApiErrorMessage } from "@/utils/apiError";

const MAX_VARIATIONS = 200;

export default function ProductRegistration() {
  const [formData, setFormData] =
    useState<CreateProductParams>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [grid, setGrid] = useState<GridState>(initialGridState);
  const invalidateGrid = useInvalidateGrid();

  // Todas as combinações da tabela; só as com estoque viram cadastro
  // (variação zerada não é cadastrada — a API também recusa)
  const allCombos = useMemo<GridCombo[]>(() => {
    const rows = grid.colors.length ? grid.colors : [""];
    const cols = grid.sizes.length ? grid.sizes : [""];
    if (!grid.colors.length && !grid.sizes.length) return [];
    return rows.flatMap((color) =>
      cols.map((size) => ({ color, size, key: cellKey(color, size) })),
    );
  }, [grid.colors, grid.sizes]);
  const combos = allCombos.filter((c) => (grid.quantities[c.key] || 0) > 0);

  const gridPieces = combos.reduce((s, c) => s + (grid.quantities[c.key] || 0), 0);

  const gridErrors = gridEnabled
    ? ([
        formData.name.trim().length < 2 && "Informe o nome do modelo.",
        !formData.category_id && "Escolha a categoria.",
        allCombos.length === 0 && "Monte a grade com os tamanhos e/ou as cores.",
        allCombos.length > 0 &&
          combos.length === 0 &&
          "Informe o estoque de pelo menos uma combinação (variação zerada não é cadastrada).",
        combos.length > MAX_VARIATIONS &&
          `No máximo ${MAX_VARIATIONS} variações por cadastro.`,
      ].filter(Boolean) as string[])
    : [];

  const handleChange = (
    field: keyof CreateProductParams,
    value: string | number | boolean,
  ) => {
    const numericFields: (keyof CreateProductParams)[] = [
      "quantity",
      "cost_price",
      "sale_price",
    ];
    const booleansFields: (keyof CreateProductParams)[] = [
      "not_barcode",
      "sell_in_bulk",
    ];

    let finalValue: string | number | boolean = value;

    if (numericFields.includes(field)) {
      finalValue = value === "" ? 0 : Number(value);
    } else if (booleansFields.includes(field)) {
      // Converts "true"/"false" strings or truthy/falsy values to a strict boolean
      finalValue =
        typeof value === "string" ? value === "true" : Boolean(value);
    }

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setGrid(initialGridState);
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      await CreateProduct(formData);
      toast.success("Produto cadastrado com sucesso!");
      invalidateGrid();
      setFormData(initialFormData);
    } catch (error) {
      // Mantém o formulário preenchido para o usuário corrigir e reenviar
      toast.error(getApiErrorMessage(error, "Erro ao cadastrar produto!"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async () => {
    if (gridErrors.length) {
      toast.error(gridErrors[0]);
      return;
    }
    try {
      setLoading(true);
      const created = await CreateModel({
        model_name: formData.name.trim(),
        category_id: formData.category_id,
        description: formData.description.trim() || undefined,
        cost_price: formData.cost_price,
        sale_price: formData.sale_price,
        variations: combos.map((c) => {
          const own = grid.customPrices ? grid.overrides[c.key] : undefined;
          return {
            color: c.color,
            size: c.size,
            quantity: grid.quantities[c.key] || 0,
            cost_price: own?.cost,
            sale_price: own?.price,
          };
        }),
      });
      toast.success(
        `${created.length} ${created.length === 1 ? "variação cadastrada" : "variações cadastradas"} de "${formData.name.trim()}".`,
      );
      invalidateGrid();
      handleReset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao cadastrar o modelo!"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (gridEnabled) handleCreateModel();
    else handleCreateProduct();
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página cadastro de produtos!"
        text="Aqui você pode cadastrar novos produtos no estoque."
      />
      <div className="p-6 space-y-6 mx-auto">
        <form
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="lg:col-span-2 space-y-6">
            <FormTipoCadastro
              gridEnabled={gridEnabled}
              onChange={(enabled) => {
                setGridEnabled(enabled);
                // Grade não combina com venda a granel
                if (enabled) handleChange("sell_in_bulk", false);
              }}
            />
            <FormInfoBasica
              formData={formData}
              onChange={handleChange}
              gridEnabled={gridEnabled}
            />
            {gridEnabled ? (
              <>
                {/* Na grade o preço vem antes: ele é herdado pelas variações */}
                <FormPrecificacao
                  formData={formData}
                  onChange={handleChange}
                  gridEnabled
                />
                <FormGrade
                  grid={grid}
                  combos={combos}
                  skipped={allCombos.length - combos.length}
                  modelName={formData.name}
                  costPrice={formData.cost_price}
                  salePrice={formData.sale_price}
                  onChange={setGrid}
                />
              </>
            ) : (
              <>
                <FormEstoque formData={formData} onChange={handleChange} />
                <FormPrecificacao formData={formData} onChange={handleChange} />
              </>
            )}
          </div>

          <div className="space-y-6">
            <CadastroProdutoResumo
              formData={formData}
              onReset={handleReset}
              loading={loading}
              grid={
                gridEnabled
                  ? {
                      names: combos.map((c) =>
                        variationName(
                          formData.name.trim() || "Modelo",
                          c.color,
                          c.size,
                        ),
                      ),
                      variations: combos.length,
                      pieces: gridPieces,
                      colors: grid.colors,
                      sizes: grid.sizes,
                      errors: gridErrors,
                    }
                  : undefined
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
