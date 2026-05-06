"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { AuthCreator } from "@/lib/auth";

type HeaderProps = {
  creator?: AuthCreator | null;
  isAdmin?: boolean;
};

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/createurs", label: "Créateurs" },
  { href: "/articles", label: "Articles" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/a-propos", label: "À propos" },
];

export function Header({ creator = null, isAdmin = false }: HeaderProps) {
  const pathname = usePathname();
  const isAuthenticated = creator !== null || isAdmin;

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Editorial top bar */}
      <div className="bg-noir text-creme px-6 lg:px-14 py-2 flex justify-between items-center text-[11px] tracking-[0.16em] uppercase font-light">
        <span>N° 1 · Édition de lancement</span>
        <span className="hidden sm:flex gap-5">
          <span>Lausanne 14°</span>
          <span>Genève 16°</span>
          <span className="text-accent">+ events ce week-end</span>
        </span>
      </div>

      {/* Main header */}
      <header className="border-b-[2.5px] border-noir bg-creme">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-14 py-5 flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0 block leading-none">
            <Image
              src="/assets/creon-logo.png"
              alt="CREON"
              width={260}
              height={100}
              priority
              className="w-[110px] sm:w-[130px] h-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-body text-[13px] tracking-[0.14em] uppercase transition-colors hover:text-accent-deep",
                    active &&
                      "underline decoration-accent decoration-[3px] underline-offset-[6px]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block font-body text-[12px] tracking-[0.14em] uppercase underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep px-2 py-1"
                >
                  Connexion
                </Link>
                <Link
                  href="/newsletter"
                  className={buttonVariants({ variant: "primary", size: "sm" })}
                >
                  S&apos;abonner →
                </Link>
              </>
            )}
            {creator && (
              <Link
                href="/compte"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Compte
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-wider px-3 py-1.5 border-2 border-noir bg-noir text-creme shadow-[3px_3px_0_var(--color-noir)] hover:shadow-[5px_5px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all"
              >
                <span className="text-accent">●</span> Admin
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
