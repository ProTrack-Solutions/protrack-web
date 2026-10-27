import { useFormContext, useWatch } from "react-hook-form";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { Product } from "@/interfaces/products.interface";

/** Total da venda (produtos menos desconto) a partir dos itens do formulário */
export function useSaleTotal(products: Product[]) {
  const { control } = useFormContext<CreateSaleParams>();

  const items = useWatch({ control, name: "items" }) ?? [];
  const discount = useWatch({ control, name: "discount_amount" });

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return sum + (product ? product.sale_price : 0) * (item.quantity || 0);
  }, 0);

  return {
    itemsCount: items.length,
    quantity: items.reduce((sum, p) => sum + (p.quantity || 0), 0),
    total: subtotal - (discount || 0),
  };
}
