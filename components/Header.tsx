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
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {bannerText && (
        <div className="bg-noir text-creme px-6 lg:px-14 py-1.5 text-center text-[12px] tracking-tight">
          {bannerText}
        </div>
      )}

      <header className="border-b border-noir bg-creme">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-14 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0 block leading-none">
            <Image
              src="/assets/creon-logo.png"
              alt="CREON"
              width={200}
              height={76}
              priority
              className="w-[88px] sm:w-[96px] h-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md font-body text-[14px] font-medium transition-colors duration-150",
                    active
                      ? "bg-accent-soft text-accent-deep"
                      : "text-noir hover:bg-creme-fonce",
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
                  className="hidden sm:inline-flex px-3 py-1.5 font-body text-[13px] text-noir hover:text-accent-deep transition-colors"
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
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden />
                Admin
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
