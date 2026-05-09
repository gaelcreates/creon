import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  date_start: string;
  city: string;
  venue: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
};

type Tab = "all" | "draft" | "published" | "archived";

export const metadata = {
  title: "Events — CREON Admin",
};

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab: Tab =
    params.tab === "draft" ||
    params.tab === "published" ||
    params.tab === "archived"
      ? params.tab
      : "all";

  const supabase = await createClient();

  let listQuery = supabase
    .from("events")
    .select(
      "id, slug, title, cover_image, date_start, city, venue, status, featured",
    )
    .order("date_start", { ascending: false });
  if (tab !== "all") listQuery = listQuery.eq("status", tab);

  const [allCount, draftCount, publishedCount, archivedCount, listRes] =
    await Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "archived"),
      listQuery,
    ]);

  const events = (listRes.data ?? []) as EventRow[];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow text-noir-doux">
            Back-office
          </p>
          <h1 className="display-2 mt-2">Events</h1>
        </div>
        <Link
          href="/admin/events/new"
          className="font-body text-xs uppercase tracking-wider px-4 py-2.5 border-2 border-noir bg-accent text-noir shadow-[3px_3px_0_var(--color-noir)] hover:shadow-[5px_5px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          + Nouvel event
        </Link>
      </div>

      <div className="flex gap-3 border-b border-noir flex-wrap">
        <TabLink
          active={tab === "all"}
          href="/admin/events"
          label="Tous"
          count={allCount.count ?? 0}
        />
        <TabLink
          active={tab === "draft"}
          href="/admin/events?tab=draft"
          label="Brouillons"
          count={draftCount.count ?? 0}
        />
        <TabLink
          active={tab === "published"}
          href="/admin/events?tab=published"
          label="Publiés"
          count={publishedCount.count ?? 0}
        />
        <TabLink
          active={tab === "archived"}
          href="/admin/events?tab=archived"
          label="Archivés"
          count={archivedCount.count ?? 0}
        />
      </div>

      {events.length === 0 ? (
        <p className="font-body text-noir-doux py-8">
          Aucun event dans cette catégorie.{" "}
          <Link
            href="/admin/events/new"
            className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            En créer un →
          </Link>
        </p>
      ) : (
        <div className="border-2 border-noir overflow-hidden">
          <table className="w-full font-body text-sm">
            <thead className="bg-creme-fonce border-b border-noir">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest w-16">
                  Cover
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Titre
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Lieu
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Statut
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Featured
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr
                  key={e.id}
                  className={cn(
                    "border-b border-noir/20 last:border-0 hover:bg-creme-fonce/40 transition-colors",
                    i % 2 === 1 && "bg-creme-fonce/20",
                  )}
                >
                  <td className="px-4 py-2">
                    <Link href={`/admin/events/${e.id}`} className="block">
                      {e.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={e.cover_image}
                          alt=""
                          className="w-12 h-12 object-cover border border-noir"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-creme-fonce border border-noir" />
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/events/${e.id}`}
                      className="font-display text-lg leading-tight hover:text-accent-deep"
                    >
                      {e.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 mono-meta text-noir-doux">
                    {new Date(e.date_start).toLocaleDateString("fr-CH", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{e.venue}</span>
                    <span className="mono-meta text-noir-doux block">
                      {e.city}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {e.status === "published" ? (
                      <Tag variant="accent">Publié</Tag>
                    ) : e.status === "archived" ? (
                      <Tag variant="dark">Archivé</Tag>
                    ) : (
                      <Tag>Brouillon</Tag>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {e.featured ? (
                      <span className="text-accent">★</span>
                    ) : (
                      <span className="text-noir-doux/40">·</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TabLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-3 font-body text-sm uppercase tracking-widest border-b-4 -mb-[2px] transition-colors",
        active
          ? "border-accent text-noir font-medium"
          : "border-transparent text-noir-doux hover:text-noir",
      )}
    >
      {label}
      <span className="ml-1.5 text-noir-doux">·&nbsp;{count}</span>
    </Link>
  );
}
