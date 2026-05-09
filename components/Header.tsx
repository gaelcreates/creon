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
  bannerText?: string | null;
};

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/feed", label: "Feed" },
  { href: "/createurs", label: "Créateurs" },
  { href: "/events", label: "Events" },
  { href: "/articles", label: "Articles" },
  { href: "/services", label: "Services" },
  { href: "/productions", label: "Productions" },
];

export function Header({
  creator = null,
  isAdmin = false,
  bannerText = null,
}: HeaderProps) {
  const pathname = usePathname();
  const isAuthenticated = creator !== null || isAdmin;

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {bannerText && (
        <div className="bg-noir text-creme px-6 lg:px-14 py-1.5 text-center text-[12px] tracking-tight">
          {bannerText}
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur-md bg-creme/80 [box-shadow:0_1px_0_rgba(16,6,9,0.06),0_8px_24px_-16px_rgba(16,6,9,0.12)]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 block leading-none">
            <Image
              src="/assets/creon-logo.png"
              alt="CREON"
              width={220}
              height={84}
              priority
              className="w-[96px] sm:w-[108px] h-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 bg-creme-clair/70 backdrop-blur border border-noir/15 rounded-full px-1.5 py-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full font-body text-[14px] font-medium transition-all duration-200",
                    active
                      ? "bg-noir text-creme shadow-[0_2px_8px_-2px_rgba(16,6,9,0.3)]"
                      : "text-noir-doux hover:text-noir hover:bg-creme-fonce/60",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-3 py-1.5 font-body text-[13px] text-noir-doux hover:text-noir transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/newsletter"
                  className={buttonVariants({ variant: "primary", size: "sm" })}
                >
                  S&apos;abonner
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
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  aria-hidden
                />
                Admin
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
