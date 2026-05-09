import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  type: "coulisses" | "profil" | "educatif" | "annonce";
  author: string;
  reading_time: number | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  published_at: string | null;
  created_at: string;
};

type Tab = "all" | "draft" | "published" | "archived";

const typeLabels: Record<ArticleRow["type"], string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
};

export const metadata = {
  title: "Articles — CREON Admin",
};

export default async function AdminArticlesPage({
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
    .from("editorial_articles")
    .select(
      "id, slug, title, cover_image, type, author, reading_time, status, featured, published_at, created_at",
    )
    .order("created_at", { ascending: false });
  if (tab !== "all") listQuery = listQuery.eq("status", tab);

  const [allCount, draftCount, publishedCount, archivedCount, listRes] =
    await Promise.all([
      supabase.from("editorial_articles").select("id", { count: "exact", head: true }),
      supabase
        .from("editorial_articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("editorial_articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("editorial_articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "archived"),
      listQuery,
    ]);

  const articles = (listRes.data ?? []) as ArticleRow[];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow text-noir-doux">
            Back-office
          </p>
          <h1 className="display-2 mt-2">Articles</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="font-body text-xs uppercase tracking-wider px-4 py-2.5 border-2 border-noir bg-accent text-noir shadow-[3px_3px_0_var(--color-noir)] hover:shadow-[5px_5px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="flex gap-3 border-b border-noir flex-wrap">
        <TabLink
          active={tab === "all"}
          href="/admin/articles"
          label="Tous"
          count={allCount.count ?? 0}
        />
        <TabLink
          active={tab === "draft"}
          href="/admin/articles?tab=draft"
          label="Brouillons"
          count={draftCount.count ?? 0}
        />
        <TabLink
          active={tab === "published"}
          href="/admin/articles?tab=published"
          label="Publiés"
          count={publishedCount.count ?? 0}
        />
        <TabLink
          active={tab === "archived"}
          href="/admin/articles?tab=archived"
          label="Archivés"
          count={archivedCount.count ?? 0}
        />
      </div>

      {articles.length === 0 ? (
        <p className="font-body text-noir-doux py-8">
          Aucun article dans cette catégorie.{" "}
          <Link
            href="/admin/articles/new"
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
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Auteur
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Statut
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  ★
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => (
                <tr
                  key={a.id}
                  className={cn(
                    "border-b border-noir/20 last:border-0 hover:bg-creme-fonce/40 transition-colors",
                    i % 2 === 1 && "bg-creme-fonce/20",
                  )}
                >
                  <td className="px-4 py-2">
                    <Link href={`/admin/articles/${a.id}`} className="block">
                      {a.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.cover_image}
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
                      href={`/admin/articles/${a.id}`}
                      className="font-display text-lg leading-tight hover:text-accent-deep block"
                    >
                      {a.title}
                    </Link>
                    {a.reading_time && (
                      <span className="mono-meta text-noir-doux">
                        {a.reading_time} min
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Tag>{typeLabels[a.type]}</Tag>
                  </td>
                  <td className="px-4 py-3 mono-meta">{a.author}</td>
                  <td className="px-4 py-3 mono-meta text-noir-doux">
                    {a.published_at
                      ? new Date(a.published_at).toLocaleDateString("fr-CH")
                      : new Date(a.created_at).toLocaleDateString("fr-CH")}
                  </td>
                  <td className="px-4 py-3">
                    {a.status === "published" ? (
                      <Tag variant="accent">Publié</Tag>
                    ) : a.status === "archived" ? (
                      <Tag variant="dark">Archivé</Tag>
                    ) : (
                      <Tag>Brouillon</Tag>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {a.featured ? (
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
