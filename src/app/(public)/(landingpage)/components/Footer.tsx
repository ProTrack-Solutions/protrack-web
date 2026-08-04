import Link from "next/link";
import logo from "@/assets/full-logo-small.png";
import Image from "next/image";

const systemLinks: [string, string][] = [
  ["Estoque", "/estoque"],
  ["Vendas", "/vendas"],
  ["Clientes", "/clientes"],
  ["Fluxo de caixa", "/fluxo-caixa"],
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Image src={logo} alt="ProTrack Logo" width={200} height={200} />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Sistema de gestão empresarial para controlar estoque, vendas,
            clientes e financeiro em um só lugar.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">
            Sistema
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {systemLinks.map(([l, to]) => (
              <li key={to}>
                <Link
                  href={to}
                  className="transition-colors hover:text-primary"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">
            Empresa
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href="#planos"
                className="transition-colors hover:text-primary"
              >
                Planos
              </a>
            </li>
            <li>
              <a href="#faq" className="transition-colors hover:text-primary">
                Perguntas frequentes
              </a>
            </li>
            <li>
              <Link
                href="/cadastro"
                className="transition-colors hover:text-primary"
              >
                Criar conta
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pro Track. Todos os direitos reservados.
      </div>
    </footer>
  );
}
