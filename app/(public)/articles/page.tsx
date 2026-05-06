import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { formatArticleDate, buildQuery } from "@/lib/format";

const TYPES: Array<{ value: string; label: string }> = [
  { value: "coulisses", label: "Coulisses" },
  { value: "profil", label: "Profil" },
  { value: "educatif", label: "Éducatif" },
  { value: "annonce", label: "Annonce" },
];

export const metadata = {
  title: "Articles — CREON",
  description:
    "Dossiers, portraits, coulisses : la lecture longue de la scène créative suisse romande.",
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  type: "coulisses" | "profil" | "educatif" | "annonce";
  reading_time: number | null;
  author: string;
  published_at: string | null;
  featured: boolean;
};

const typeLabels: Record<ArticleRow["type"], string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type ?? null;

  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, cover_image, type, reading_time, author, published_at, featured",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (type) query = query.eq("type", type);

  const { data: articles } = await query;
  const list = (articles ?? []) as ArticleRow[];

  const featured = list.find((a) => a.featured) ?? list[0];
  const rest = featured ? list.filter((a) => a.id !== featured.id) : [];

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-12 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">
          Lecture longue · ~5–15 min
        </p>
        <h1 className="font-display text-[clamp(56px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
          Les <span className="hl-block">dossiers</span>.
        </h1>
        <p className="font-body text-[17px] leading-relaxed mt-8 max-w-[640px]">
          Coulisses, portraits, guides pratiques, annonces. Pas de news flash :
          uniquement ce qui vaut un vrai temps de lecture.
        </p>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Tous les types"
            href={`/articles`}
            active={!type}
          />
          {TYPES.map((t) => (
            <FilterChip
              key={t.value}
              label={t.label}
              href={`/articles${buildQuery({ type: type === t.value ? null : t.value })}`}
              active={type === t.value}
            />
          ))}
        </div>
      </section>

      <hr className="border-0 border-t-[1.5px] border-noir/30 m-0 max-w-[1320px] mx-auto" />

      <section className="px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
        {list.length === 0 ? (
          <div className="border-2 border-noir bg-creme p-10 text-center">
            <p className="font-display text-3xl mb-3">Aucun dossier ici.</p>
            <p className="font-body text-noir-doux">
              {type
                ? "Tente un autre type ou regarde toute la liste."
                : "Premiers dossiers en cours d'écriture. Reviens bientôt."}
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={`/articles/${featured.slug}`}
                className="block mb-12 group"
              >
                <article className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 border-[2.5px] border-noir bg-creme overflow-hidden transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]">
                  <div className="aspect-[16/10] lg:aspect-auto overflow-hidden border-b-[2.5px] lg:border-b-0 lg:border-r-[2.5px] border-noir">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover_image ?? "/assets/riso-article-2.svg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 lg:p-10 flex flex-col gap-4 justify-center">
                    <div className="flex items-center justify-between">
                      <Tag variant="dark">{typeLabels[featured.type]}</Tag>
                      <span className="mono-meta text-noir-doux">
                        {featured.reading_time ?? "—"} MIN ·{" "}
                        {featured.published_at
                          ? formatArticleDate(featured.published_at)
                          : ""}
                      </span>
                    </div>
                    <h2 className="font-display text-[clamp(28px,4vw,52px)] leading-[0.94] m-0 tracking-tight">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="font-body text-base leading-relaxed text-noir-doux">
                        {featured.excerpt}
                      </p>
                    )}
                    <p className="mono-meta text-noir-doux">
                      par {featured.author}
                    </p>
                  </div>
                </article>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {rest.map((a) => (
                  <ArticleCard
                    key={a.id}
                    title={a.title}
                    slug={a.slug}
                    cover={a.cover_image ?? "/assets/riso-article-1.svg"}
                    type={typeLabels[a.type]}
                    reading_time={a.reading_time ?? 0}
                    date={
                      a.published_at
                        ? formatArticleDate(a.published_at)
                        : ""
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-4 py-1.5 border-2 border-noir font-body text-sm uppercase tracking-wider transition-colors",
        active
          ? "bg-accent text-noir"
          : "bg-creme text-noir hover:bg-creme-fonce",
      )}
    >
      {label}
    </Link>
  );
}
