"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type AdminSidebarLink = {
  href: string;
  label: string;
  exact?: boolean;
  badge?: number;
  urgent?: boolean;
};

type Props = {
  role: string;
  pendingCreators?: number;
  pendingFlags?: number;
  newInquiries?: number;
};

export function AdminSidebar({
  role,
  pendingCreators = 0,
  pendingFlags = 0,
  newInquiries = 0,
}: Props) {
  const pathname = usePathname();

  const baseLinks: AdminSidebarLink[] = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/articles", label: "Articles" },
    {
      href: "/admin/creators",
      label: "Créateurs",
      badge: pendingCreators,
      urgent: pendingCreators > 0,
    },
    {
      href: "/admin/moderation",
      label: "Modération",
      badge: pendingFlags,
      urgent: pendingFlags > 0,
    },
    {
      href: "/admin/productions",
      label: "Productions",
      badge: newInquiries,
      urgent: newInquiries > 0,
    },
    { href: "/admin/homepage", label: "Home" },
    { href: "/admin/newsletter", label: "Newsletter" },
  ];

  const superAdminLinks: AdminSidebarLink[] = [
    { href: "/admin/team", label: "Équipe" },
  ];

  function isActive(link: AdminSidebarLink): boolean {
    if (link.exact) return pathname === link.href;
    return pathname === link.href || pathname.startsWith(link.href + "/");
  }

  return (
    <aside className="w-[260px] bg-creme-clair border-r border-noir flex flex-col shrink-0">
      <div className="px-5 py-4 border-b border-noir">
        <Link
          href="/"
          className="font-display font-semibold text-xl tracking-tight leading-none block"
        >
          CREON
        </Link>
        <p className="mono-meta text-noir-doux mt-1.5">Back-office</p>
      </div>
      <nav className="flex-1 py-3">
        {baseLinks.map((link) => (
          <SidebarItem key={link.href} link={link} active={isActive(link)} />
        ))}
        {role === "super_admin" && (
          <>
            <div className="border-t border-noir/15 my-3 mx-5" />
            {superAdminLinks.map((link) => (
              <SidebarItem
                key={link.href}
                link={link}
                active={isActive(link)}
              />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

function SidebarItem({
  link,
  active,
}: {
  link: AdminSidebarLink;
  active: boolean;
}) {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-between gap-2 px-5 py-2 border-l-2 transition-colors duration-150",
        active
          ? "border-accent bg-accent-soft text-noir font-medium"
          : "border-transparent text-noir-doux hover:bg-creme-fonce hover:text-noir",
      )}
    >
      <span className="font-body text-[14px]">{link.label}</span>
      {link.badge !== undefined && link.badge > 0 && (
        <span
          className={cn(
            "mono-meta",
            link.urgent ? "text-accent-deep" : "text-noir-doux",
          )}
        >
          {link.badge}
        </span>
      )}
    </Link>
  );
}
