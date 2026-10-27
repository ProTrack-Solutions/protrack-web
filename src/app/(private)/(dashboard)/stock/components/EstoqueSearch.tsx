import { useEffect, useRef, useState } from "react";
import { Search, Tag, X } from "lucide-react";
import FilterPopOver, { FiltrosReceber } from "@/components/FilterPopOver";

const types: { value: string; label: string; hint: string }[] = [
  {
    value: "criacao",
    label: "Data de criação",
    hint: "Quando o produto foi cadastrado",
  },
];

interface EstoqueSearchProps {
  /** Termo de busca já aplicado na consulta */
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onClearSelection: () => void;
  handleGenerateLabel: () => void;
  generatingLabel: boolean;
  onApplyFilter: (filtros: FiltrosReceber) => void;
  filter: FiltrosReceber;
}

export function EstoqueSearch({
  searchTerm,
  onSearchChange,
  selectedCount,
  onClearSelection,
  handleGenerateLabel,
  generatingLabel,
  onApplyFilter,
  filter,
}: EstoqueSearchProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [text, setText] = useState(searchTerm);

  // Guarda o callback mais recente sem reiniciar o temporizador a cada render
  const onSearchRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchRef.current = onSearchChange;
  });

  // Busca enquanto digita, esperando uma pausa para não consultar a cada tecla
  useEffect(() => {
    const value = text.trim();
    if (value === searchTerm) return;
    const timer = window.setTimeout(() => onSearchRef.current(value), 350);
    return () => window.clearTimeout(timer);
  }, [text, searchTerm]);

  return (
    <div
      className="dash-in flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center"
      style={{ animationDelay: "240ms" }}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Pesquisar por nome ou código de barras..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchChange(text.trim());
          }}
          className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={() => {
              setText("");
              onSearchChange("");
            }}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterPopOver
          open={filterOpen}
          onOpenChange={setFilterOpen}
          value={filter}
          onApply={onApplyFilter}
          types={types}
        />

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Limpar seleção
          </button>
        )}

        <button
          type="button"
          onClick={handleGenerateLabel}
          disabled={selectedCount === 0 || generatingLabel}
          title={
            selectedCount === 0
              ? "Selecione produtos na tabela para gerar etiquetas"
              : undefined
          }
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Tag className="h-4 w-4" />
          Gerar etiquetas
          {selectedCount > 0 && (
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs tabular-nums">
              {selectedCount.toLocaleString("pt-BR")}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
