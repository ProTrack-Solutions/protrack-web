import * as z from "zod";

export const vendaSchema = z.object({
  clienteId: z.string().min(1, "Selecione um cliente"),
  dataVenda: z.string().min(1, "Data é obrigatória"),
  produtos: z
    .array(
      z.object({
        produtoId: z.string().min(1, "Selecione um produto"),
        quantidade: z.coerce.number().min(1, "Quantidade mínima é 1"),
        precoUnitario: z.coerce
          .number()
          .min(0.01, "Preço deve ser maior que 0"),
      }),
    )
    .min(1, "Adicione pelo menos um produto"),
});

export type VendaForm = z.infer<typeof vendaSchema>;
