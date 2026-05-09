import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";
import { Tag } from "@/components/ui/Tag";
import { SectionDecor } from "@/components/SectionDecor";
import { formatArticleDate, buildQuery } from "@/lib/format";

const TYPES: Array<{ value: string; label: string }> = [
  { value: "coulisses", label: "Coulisses" },
  { value: "profil", label: "Profil" },
  { value: "educatif", label: "Éducatif" },
  { value: "signature", label: "Signature" },
];

export const metadata = {
  title: "Articles — CREON",
  description:
    "Dossiers, portraits, coulisses : la lecture longue signée par CREON crew.",
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  type: "coulisses" | "profil" | "educatif" | "signature";
  reading_time: number | null;
  author: string;
  published_at: string | null;
  featured: boolean;
};

const typeLabels: Record<ArticleRow["type"], string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  signature: "Signature",
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
    .from("editorial_articles")
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
      <section className="relative px-6 lg:px-14 pt-28 pb-12 lg:pt-32 max-w-[1320px] mx-auto w-full overflow-hidden">
        <SectionDecor variant="documents" />
        <p className="eyebrow text-noir-doux mb-5">
          Lecture longue · CREON crew
        </p>
        <h1 className="display-1 max-w-4xl">Les dossiers.</h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Coulisses, portraits, guides pratiques, signatures. Pas de news
          flash : uniquement ce qui vaut un vrai temps de lecture.
        </p>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full">
        <div className="flex flex-wrap gap-2">
          <ChipLink href="/articles" active={!type}>
            Tous les types
          </ChipLink>
          {TYPES.map((t) => (
            <ChipLink
              key={t.value}
              href={`/articles${buildQuery({ type: type === t.value ? null : t.value })}`}
              active={type === t.value}
            >
              {t.label}
            </ChipLink>
          ))}
        </div>
      </section>

      <hr className="border-0 border-t border-noir/15 m-0 max-w-[1320px] mx-auto" />

      <section className="px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
        {list.length === 0 ? (
          <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
            <p className="heading-2 mb-3">Aucun dossier ici.</p>
            <p className="small text-noir-doux">
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
                className="block mb-10 group"
              >
                <article className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0 border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_28px_-10px_rgba(16,6,9,0.15)]">
                  <div className="aspect-[16/10] lg:aspect-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-noir bg-creme-fonce">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover_image ?? "/assets/riso-article-2.svg"}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-6 lg:p-10 flex flex-col gap-4 justify-center">
                    <div className="flex items-center justify-between">
                      <Tag variant="soft">{typeLabels[featured.type]}</Tag>
                      <span className="mono-meta text-noir-doux">
                        {featured.reading_time ?? "—"} min ·{" "}
                        {featured.published_at
                          ? formatArticleDate(featured.published_at)
                          : ""}
                      </span>
                    </div>
                    <h2 className="display-2 leading-[0.95]">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="body text-noir-doux leading-relaxed">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    excerpt={a.excerpt}
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

function ChipLink({
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
      className={
        active
          ? "inline-flex items-center px-3.5 py-1.5 rounded-md border border-accent bg-accent text-noir font-body text-[13px] font-medium transition-all duration-150"
          : "inline-flex items-center px-3.5 py-1.5 rounded-md border border-noir bg-creme-clair text-noir font-body text-[13px] font-medium hover:bg-creme-fonce transition-all duration-150"
      }
    >
      {children}
    </Link>
  );
}
