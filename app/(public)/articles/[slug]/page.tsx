import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { ArticleCard } from "@/components/ArticleCard";
import { formatArticleDate } from "@/lib/format";

type ArticleDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  content_html: string | null;
  cover_image: string | null;
  type: "coulisses" | "profil" | "educatif" | "signature";
  reading_time: number | null;
  author: string;
  published_at: string | null;
  linked_creator: string | null;
  creator?: { handle: string; display_name: string; city: string | null } | null;
};

const typeLabels: Record<ArticleDetail["type"], string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  signature: "Signature",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("editorial_articles")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!article) return { title: "Article introuvable — CREON" };
  return {
    title: `${article.title} — CREON`,
    description: article.excerpt ?? undefined,
    openGraph: article.cover_image ? { images: [article.cover_image] } : undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("editorial_articles")
    .select(
      "id, slug, title, subtitle, excerpt, content_html, cover_image, type, reading_time, author, published_at, linked_creator, creator:creators(handle, display_name, city)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!article) notFound();
  const art = article as unknown as ArticleDetail;

  const { data: similar } = await supabase
    .from("editorial_articles")
    .select(
      "id, slug, title, cover_image, type, reading_time, published_at, excerpt",
    )
    .eq("status", "published")
    .neq("id", art.id)
    .eq("type", art.type)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <article>
      <section className="px-6 lg:px-14 pt-10 pb-10 max-w-[820px] mx-auto w-full">
        <p className="mono-meta text-noir-doux mb-6">
          <Link
            href="/articles"
            className="hover:text-accent-deep transition-colors"
          >
            ← Tous les dossiers
          </Link>
        </p>

        <div className="flex items-center gap-3 mb-6">
          <Tag variant="soft">{typeLabels[art.type]}</Tag>
          <span className="mono-meta text-noir-doux">
            {art.reading_time ?? "—"} min
          </span>
        </div>

        <h1 className="display-1">{art.title}</h1>

        {art.subtitle && (
          <p className="lead text-noir-doux mt-6">{art.subtitle}</p>
        )}

        <p className="mono-meta text-noir-doux mt-8 pt-6 border-t border-noir/15">
          par <span className="text-noir font-medium">{art.author}</span>
          {art.published_at && ` · ${formatArticleDate(art.published_at)}`}
        </p>
      </section>

      {art.cover_image && (
        <section className="px-6 lg:px-14 mb-10 max-w-[1080px] mx-auto w-full">
          <div className="aspect-[16/10] overflow-hidden border border-noir rounded-lg bg-creme-fonce">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.cover_image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="px-6 lg:px-14 py-8 max-w-[720px] mx-auto w-full">
        {art.content_html ? (
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{ __html: art.content_html }}
          />
        ) : (
          <p className="body text-noir-doux italic">
            (Contenu en cours de rédaction.)
          </p>
        )}
      </section>

      {art.creator && (
        <section className="border-t border-noir px-6 lg:px-14 py-10 max-w-[820px] mx-auto w-full">
          <p className="eyebrow text-noir-doux mb-4">À découvrir</p>
          <Link
            href={`/createurs/${art.creator.handle}`}
            className="inline-flex items-center gap-4 border border-noir bg-creme-clair px-5 py-4 rounded-lg hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)] transition-all duration-150 w-fit"
          >
            <div className="w-12 h-12 rounded-full bg-creme-fonce border border-noir flex items-center justify-center mono-meta text-noir-doux">
              {art.creator.display_name
                .split(" ")
                .map((p: string) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="heading-3 leading-tight">
                {art.creator.display_name}
              </p>
              {art.creator.city && (
                <p className="mono-meta text-noir-doux mt-1">
                  {art.creator.city}
                </p>
              )}
            </div>
            <span className="ml-3 mono-meta text-noir-doux">→</span>
          </Link>
        </section>
      )}

      {similar && similar.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="mono-meta text-noir-doux">→</span>
            <h2 className="heading-1">Continuer · {typeLabels[art.type]}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similar.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                cover={a.cover_image ?? "/assets/riso-article-1.svg"}
                type={typeLabels[a.type as ArticleDetail["type"]]}
                reading_time={a.reading_time ?? 0}
                date={a.published_at ? formatArticleDate(a.published_at) : ""}
                excerpt={a.excerpt}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
