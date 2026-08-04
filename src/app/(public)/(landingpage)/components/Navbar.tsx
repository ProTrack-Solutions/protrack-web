import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "../landing-data";
import Image from "next/image";
import logo from "@/assets/full-logo-small.png";

interface NavbarProps {
  scrolled: boolean;
}

export function Navbar({ scrolled }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel border-b" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={logo} alt="ProTrack Logo" width={200} height={200} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden text-foreground hover:bg-secondary sm:inline-flex"
          >
            <Link href="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-primary font-semibold text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Link href="/register">
              Começar agora <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <button
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 rounded-lg border border-border p-2 text-foreground md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="glass-panel border-t px-5 py-4 md:hidden">
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm uppercase tracking-wider text-muted-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
