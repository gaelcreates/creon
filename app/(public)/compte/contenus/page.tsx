import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type PostRow = {
  id: string;
  slug: string;
  type: "short" | "article" | "service";
  title: string | null;
  status: "draft" | "published" | "archived" | "flagged";
  view_count: number;
  flag_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type Tab = "all" | "draft" | "published" | "archived";

const TYPE_LABELS: Record<string, string> = {
  short: "Post",
  article: "Article",
  service: "Service",
};

export const metadata = {
  title: "Mes contenus — CREON",
};

export default async function ContenusPage({
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, handle, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator || creator.status !== "active") {
    redirect("/compte");
  }

  let listQuery = supabase
    .from("creator_posts")
    .select(
      "id, slug, type, title, status, view_count, flag_count, published_at, created_at, updated_at",
    )
    .eq("creator_id", creator.id)
    .order("updated_at", { ascending: false });

  if (tab !== "all") listQuery = listQuery.eq("status", tab);

  const [allCount, draftCount, publishedCount, archivedCount, listRes] =
    await Promise.all([
      supabase
        .from("creator_posts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creator.id),
      supabase
        .from("creator_posts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creator.id)
        .eq("status", "draft"),
      supabase
        .from("creator_posts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creator.id)
        .eq("status", "published"),
      supabase
        .from("creator_posts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creator.id)
        .eq("status", "archived"),
      listQuery,
    ]);

  const posts = (listRes.data ?? []) as PostRow[];

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-6 max-w-[1320px] mx-auto w-full">
        <p className="mono-meta text-noir-doux mb-3">
          <Link
            href="/compte"
            className="hover:text-accent-deep transition-colors"
          >
            ← Mon compte
          </Link>
        </p>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow text-noir-doux mb-2">Bibliothèque</p>
            <h1 className="display-2">Mes contenus</h1>
          </div>
          <Link
            href="/compte/composer"
            className={buttonVariants({ variant: "accent", size: "md" })}
          >
            + Nouveau contenu
          </Link>
        </div>
      </section>

      <section className="px-6 lg:px-14 py-6 max-w-[1320px] mx-auto w-full">
        <div className="flex gap-3 border-b border-noir flex-wrap">
          <TabLink
            active={tab === "all"}
            href="/compte/contenus"
            label="Tous"
            count={allCount.count ?? 0}
          />
          <TabLink
            active={tab === "draft"}
            href="/compte/contenus?tab=draft"
            label="Brouillons"
            count={draftCount.count ?? 0}
          />
          <TabLink
            active={tab === "published"}
            href="/compte/contenus?tab=published"
            label="Publiés"
            count={publishedCount.count ?? 0}
          />
          <TabLink
            active={tab === "archived"}
            href="/compte/contenus?tab=archived"
            label="Archivés"
            count={archivedCount.count ?? 0}
          />
        </div>
      </section>

      <section className="px-6 lg:px-14 pb-20 max-w-[1320px] mx-auto w-full">
        {posts.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-noir/30">
            <p className="heading-2 mb-3">Pas encore de contenu.</p>
            <p className="small text-noir-doux mb-4 max-w-md mx-auto">
              Lance-toi avec un post court — c&apos;est le format le plus
              rapide pour démarrer.
            </p>
            <Link
              href="/compte/composer?type=short"
              className={buttonVariants({ variant: "accent", size: "md" })}
            >
              Écrire mon premier post →
            </Link>
          </Card>
        ) : (
          <div className="border border-noir bg-creme-clair rounded-lg overflow-hidden divide-y divide-noir/15">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/compte/composer/${p.id}`}
                className="block px-5 py-4 hover:bg-creme-fonce/40 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag>{TYPE_LABELS[p.type]}</Tag>
                    <span className="font-body font-medium text-[15px] truncate">
                      {p.title ?? (
                        <em className="text-noir-doux">Sans titre</em>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 mono-meta text-noir-doux">
                    <span>↗ {p.view_count}</span>
                    {p.flag_count > 0 && (
                      <span className="text-rouge-brique">
                        ⚠ {p.flag_count}
                      </span>
                    )}
                    {p.status === "published" ? (
                      <span className="text-accent-deep">● Publié</span>
                    ) : p.status === "archived" ? (
                      <span>● Archivé</span>
                    ) : p.status === "flagged" ? (
                      <span className="text-rouge-brique">⚠ Signalé</span>
                    ) : (
                      <span>○ Brouillon</span>
                    )}
                  </div>
                </div>
                <p className="mono-meta text-noir-doux mt-1">
                  Modifié le{" "}
                  {new Date(p.updated_at).toLocaleDateString("fr-CH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                  {p.published_at && (
                    <>
                      {" "}
                      · publié le{" "}
                      {new Date(p.published_at).toLocaleDateString("fr-CH", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
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
        "px-4 py-3 font-body text-[14px] font-medium border-b-2 -mb-[1px] transition-colors",
        active
          ? "border-accent text-noir"
          : "border-transparent text-noir-doux hover:text-noir",
      )}
    >
      {label}
      <span className="mono-meta text-noir-doux ml-1.5">·&nbsp;{count}</span>
    </Link>
  );
}
