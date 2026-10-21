import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { navLinks } from "../landing-data";
import Image from "next/image";
import logo from "@/assets/logo-gerencial-dark.svg";

interface NavbarProps {
  scrolled: boolean;
}

export function Navbar({ scrolled }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const linksRef = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Scroll-spy: descobre qual seção está no meio da tela
  useEffect(() => {
    const sections = navLinks
      .map(([, href]) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));

    // Acima da primeira seção nenhum link fica ativo
    const onScroll = () => {
      if (sections[0] && window.scrollY + window.innerHeight * 0.45 < sections[0].offsetTop) {
        setActive(null);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Move a pílula indicadora até o link ativo
  useEffect(() => {
    const el = active ? linksRef.current[active] : null;
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, scrolled]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "glass-night border-b border-white/10 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.5)]"
          : "border-b border-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link href="/" className="flex items-center" aria-label="ProTrack Gerencial">
          <Image
            src={logo}
            alt="ProTrack Gerencial"
            width={174}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <div className="relative hidden items-center gap-1 md:flex">
          <span
            aria-hidden="true"
            className={`absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-white/12 ring-1 ring-white/15 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              active ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: indicator.left, width: indicator.width }}
          />
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              ref={(el) => {
                linksRef.current[href] = el;
              }}
              aria-current={active === href ? "true" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                active === href ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="btn-pill hidden px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="btn-pill btn-shine inline-flex items-center bg-white px-5 py-2.5 text-sm font-bold text-[hsl(var(--night))] shadow-[0_8px_24px_-8px_rgb(255_255_255/0.45)] hover:shadow-[0_12px_32px_-8px_hsl(211_79%_63%/0.8)]"
          >
            Começar agora <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
          <button
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-5 pb-6 pt-2">
            {navLinks.map(([label, href], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block py-3 text-lg font-semibold text-white/85 transition-all duration-500 hover:text-white ${
                  menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }}
              >
                {label}
              </a>
            ))}
            <div className="mt-4 flex gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-pill flex-1 border border-white/20 py-3 text-center font-semibold text-white"
              >
                Entrar
              </Link>
              <Link
                href="/demo"
                onClick={() => setMenuOpen(false)}
                className="btn-pill flex-1 bg-white/10 py-3 text-center font-semibold text-white"
              >
                Ver demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
