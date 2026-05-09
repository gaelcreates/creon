import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import {
  approveCreator,
  rejectCreator,
  suspendCreator,
  reactivateCreator,
} from "./actions";

type Tab = "pending" | "active" | "suspended";

type Creator = {
  id: string;
  email: string;
  handle: string;
  display_name: string;
  short_bio: string | null;
  city: string | null;
  categories: string[];
  links: Array<{ label: string; url: string; type?: string }>;
  status: Tab;
  created_at: string;
};

export const metadata = {
  title: "Créateurs — CREON Admin",
};

export default async function AdminCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab: Tab =
    params.tab === "active" || params.tab === "suspended" ? params.tab : "pending";

  const supabase = await createClient();
  const [pendingCount, activeCount, suspendedCount, listRes] = await Promise.all([
    supabase
      .from("creators")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("creators")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("creators")
      .select("id", { count: "exact", head: true })
      .eq("status", "suspended"),
    supabase
      .from("creators")
      .select(
        "id, email, handle, display_name, short_bio, city, categories, links, status, created_at",
      )
      .eq("status", tab)
      .order("created_at", { ascending: false }),
  ]);

  const creators = (listRes.data ?? []) as Creator[];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <p className="eyebrow text-noir-doux">
          Back-office
        </p>
        <h1 className="display-2 mt-2">Créateurs</h1>
      </div>

      <div className="flex gap-3 border-b border-noir">
        <TabLink
          active={tab === "pending"}
          href="/admin/creators?tab=pending"
          label="Candidatures"
          count={pendingCount.count ?? 0}
        />
        <TabLink
          active={tab === "active"}
          href="/admin/creators?tab=active"
          label="Actifs"
          count={activeCount.count ?? 0}
        />
        <TabLink
          active={tab === "suspended"}
          href="/admin/creators?tab=suspended"
          label="Suspendus"
          count={suspendedCount.count ?? 0}
        />
      </div>

      {creators.length === 0 ? (
        <p className="font-body text-noir-doux py-8">
          {tab === "pending"
            ? "Aucune candidature en attente."
            : tab === "active"
              ? "Aucun créateur actif."
              : "Aucun créateur suspendu."}
        </p>
      ) : tab === "pending" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {creators.map((c) => (
            <PendingCard key={c.id} creator={c} />
          ))}
        </div>
      ) : (
        <ActiveTable creators={creators} suspended={tab === "suspended"} />
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

function PendingCard({ creator }: { creator: Creator }) {
  const ig = creator.links?.find((l) => l.type === "instagram")?.url;
  return (
    <article className="border-2 border-noir bg-creme p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl leading-tight">
          {creator.display_name}
        </h3>
        <span className="mono-meta text-noir-doux shrink-0">
          {new Date(creator.created_at).toLocaleDateString("fr-CH")}
        </span>
      </div>
      <p className="mono-meta">
        {creator.email} · {creator.city ?? "Ville ?"}
      </p>
      {creator.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {creator.categories.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
      )}
      <p className="text-sm text-noir-doux leading-relaxed">
        {creator.short_bio}
      </p>
      <div className="flex flex-wrap gap-2 pt-2 border-t-[1.5px] border-noir/30">
        <form action={approveCreator}>
          <input type="hidden" name="id" value={creator.id} />
          <button
            type="submit"
            className="font-body text-xs uppercase tracking-wider px-3 py-1.5 border-2 border-noir bg-accent text-noir hover:shadow-[3px_3px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            ✓ Approuver
          </button>
        </form>
        <form action={rejectCreator}>
          <input type="hidden" name="id" value={creator.id} />
          <button
            type="submit"
            className="font-body text-xs uppercase tracking-wider px-3 py-1.5 border-2 border-noir bg-creme text-noir hover:bg-noir hover:text-creme transition-colors"
          >
            ✗ Refuser
          </button>
        </form>
        {ig && (
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-wider px-3 py-1.5 underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep ml-auto"
          >
            Voir Insta ↗
          </a>
        )}
      </div>
    </article>
  );
}

function ActiveTable({
  creators,
  suspended,
}: {
  creators: Creator[];
  suspended: boolean;
}) {
  return (
    <div className="border-2 border-noir overflow-hidden">
      <table className="w-full font-body text-sm">
        <thead className="bg-creme-fonce border-b border-noir">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
              Nom
            </th>
            <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
              Handle
            </th>
            <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
              Ville
            </th>
            <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
              Catégories
            </th>
            <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-widest">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {creators.map((c, i) => (
            <tr
              key={c.id}
              className={cn(
                "border-b border-noir/20 last:border-0",
                i % 2 === 1 && "bg-creme-fonce/40",
              )}
            >
              <td className="px-4 py-3 font-display text-lg">
                {c.display_name}
              </td>
              <td className="px-4 py-3 mono-meta">
                <Link
                  href={`/createurs/${c.handle}`}
                  className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
                  target="_blank"
                >
                  {c.handle}
                </Link>
              </td>
              <td className="px-4 py-3">{c.city ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.categories.slice(0, 2).map((cat) => (
                    <Tag key={cat} className="text-[10px]">
                      {cat}
                    </Tag>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <form
                  action={suspended ? reactivateCreator : suspendCreator}
                  className="inline"
                >
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="font-body text-xs uppercase tracking-wider px-3 py-1 border-2 border-noir bg-creme hover:bg-noir hover:text-creme transition-colors"
                  >
                    {suspended ? "Réactiver" : "Suspendre"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
