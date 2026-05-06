"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const baseLinks = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/creators", label: "Créateurs" },
  { href: "/admin/homepage", label: "Home" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

const superAdminLinks = [{ href: "/admin/team", label: "Équipe" }];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean): boolean {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="w-64 bg-creme-fonce border-r-2 border-noir flex flex-col shrink-0">
      <div className="p-6 border-b-2 border-noir">
        <Link href="/" className="font-display text-3xl leading-none block">
          CREON
        </Link>
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux mt-1.5">
          Back-office
        </p>
      </div>
      <nav className="flex-1 py-4">
        {baseLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            active={isActive(link.href, link.exact)}
          >
            {link.label}
          </SidebarLink>
        ))}
        {role === "super_admin" && (
          <>
            <div className="border-t border-noir/20 my-4 mx-6" />
            {superAdminLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
              >
                {link.label}
              </SidebarLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-6 py-3 font-body text-sm uppercase tracking-wider border-l-4 transition-colors",
        active
          ? "bg-accent text-noir border-noir font-medium"
          : "border-transparent text-noir hover:bg-creme",
      )}
    >
      {children}
    </Link>
  );
}
