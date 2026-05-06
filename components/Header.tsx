import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
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
  const isAuthenticated = creator !== null || isAdmin;

  return (
    <header className="border-b-2 border-noir bg-creme sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-3xl tracking-tight leading-none shrink-0"
        >
          CREON
        </Link>

        <nav className="hidden md:flex items-center gap-7 font-body uppercase tracking-wider text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="hidden sm:inline font-body uppercase tracking-wider text-sm underline decoration-accent decoration-2 underline-offset-4 hover:bg-creme-fonce px-2 py-1"
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
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
