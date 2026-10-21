import Link from "next/link";
import logo from "@/assets/logo-gerencial-dark.svg";
import Image from "next/image";

const systemLinks: [string, string][] = [
  ["Estoque", "#modulo-estoque"],
  ["Financeiro", "#modulo-financeiro"],
  ["Vendas", "#modulo-vendas"],
  ["Recursos", "#recursos"],
];

const companyLinks: [string, string][] = [
  ["Planos", "#planos"],
  ["Perguntas frequentes", "#faq"],
  ["Ver demonstração", "/demo"],
  ["Criar conta", "/register"],
];

const linkClass =
  "link-grow pb-0.5 text-white/65 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[hsl(var(--night))] text-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 border-t border-white/10 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src={logo}
              alt="ProTrack Gerencial"
              width={208}
              height={48}
              className="h-11 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Sistema de gestão empresarial para controlar estoque, vendas,
              clientes e financeiro em um só lugar.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[hsl(211_90%_70%)]">
              Sistema
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {systemLinks.map(([l, href]) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[hsl(155_65%_60%)]">
              Empresa
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {companyLinks.map(([l, href]) => (
                <li key={href}>
                  {href.startsWith("#") ? (
                    <a href={href} className={linkClass}>
                      {l}
                    </a>
                  ) : (
                    <Link href={href} className={linkClass}>
                      {l}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[hsl(21_95%_72%)]">
              Contato
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <span className="block text-xs text-white/40">Suporte</span>
                <a
                  href="mailto:suporte.protrack@ptsolutionss.com"
                  className="break-words text-white/65 transition-colors hover:text-white"
                >
                  suporte.protrack@ptsolutionss.com
                </a>
              </li>
              <li>
                <span className="block text-xs text-white/40">Contato</span>
                <a
                  href="mailto:contato.protrack@ptsolutionss.com"
                  className="break-words text-white/65 transition-colors hover:text-white"
                >
                  contato.protrack@ptsolutionss.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* marca d'água gigante, como no rodapé do Discord */}
        <p
          aria-hidden="true"
          className="font-display pointer-events-none select-none bg-linear-to-b from-white/12 to-transparent bg-clip-text text-center text-[clamp(4rem,19vw,16rem)] font-extrabold leading-[0.8] tracking-tighter text-transparent"
        >
          ProTrack
        </p>
      </div>

      <div className="relative border-t border-white/10 py-6 text-center text-xs text-white/45">
        © {new Date().getFullYear()} ProTrack Gerencial. Todos os direitos reservados.
      </div>
    </footer>
  );
}
