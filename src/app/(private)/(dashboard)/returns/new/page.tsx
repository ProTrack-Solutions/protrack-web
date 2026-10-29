"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/DashCard";
import { useReturnableSale } from "@/hooks/useReturns";
import { getApiErrorMessage } from "@/utils/apiError";
import { ReturnForm } from "../components/ReturnForm";
import { SalePicker } from "../components/SalePicker";

// A rota é pré-renderizada como estática no build, então o searchParams da página
// chega vazio em produção; useSearchParams lê a URL no cliente
export default function NewReturnPage() {
  return (
    <Suspense>
      <NewReturnContent />
    </Suspense>
  );
}

function NewReturnContent() {
  const router = useRouter();
  const saleId = useSearchParams().get("sale") ?? "";
  const { data: sale, isLoading, isError, error, refetch } = useReturnableSale(saleId);

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={saleId ? "/returns/new" : "/returns"}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {saleId ? "Escolher outra venda" : "Trocas e devoluções"}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nova troca ou devolução</h1>
        </div>
      </div>

      {!saleId ? (
        <SalePicker onPick={(id) => router.replace(`/returns/new?sale=${id}`)} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      ) : isError || !sale ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium">{getApiErrorMessage(error, "Não foi possível carregar a venda.")}</p>
          <Button onClick={() => refetch()} className="cursor-pointer">Tentar novamente</Button>
        </div>
      ) : sale.canceled ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium">Esta venda foi cancelada e não pode ter itens devolvidos.</p>
          <Button asChild variant="outline">
            <Link href="/returns/new">Escolher outra venda</Link>
          </Button>
        </div>
      ) : (
        <ReturnForm key={sale.sale_id} sale={sale} />
      )}
    </div>
  );
}
