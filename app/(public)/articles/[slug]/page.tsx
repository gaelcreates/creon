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
  type: "coulisses" | "profil" | "educatif" | "annonce";
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
  annonce: "Annonce",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
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
    .from("articles")
    .select(
      "id, slug, title, subtitle, excerpt, content_html, cover_image, type, reading_time, author, published_at, linked_creator, creator:creators(handle, display_name, city)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!article) notFound();
  const art = article as unknown as ArticleDetail;

  const { data: similar } = await supabase
    .from("articles")
    .select(
      "id, slug, title, cover_image, type, reading_time, published_at",
    )
    .eq("status", "published")
    .neq("id", art.id)
    .eq("type", art.type)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <article>
      {/* Header */}
      <section className="px-6 lg:px-14 pt-8 pb-10 max-w-[820px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-5">
          <Link
            href="/articles"
            className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            ← Tous les dossiers
          </Link>
        </p>

        <div className="flex items-center gap-3 mb-6">
          <Tag variant="dark">{typeLabels[art.type]}</Tag>
          <span className="mono-meta text-noir-doux">
            {art.reading_time ?? "—"} MIN
          </span>
        </div>

        <h1 className="font-display text-[clamp(40px,6vw,88px)] leading-[0.92] m-0 tracking-tight">
          {art.title}
        </h1>

        {art.subtitle && (
          <p className="font-body text-[20px] leading-relaxed text-noir-doux mt-6">
            {art.subtitle}
          </p>
        )}

        <p className="mono-meta text-noir-doux mt-6 pt-6 border-t-[1.5px] border-noir/30">
          par <span className="text-noir font-medium">{art.author}</span>
          {art.published_at && ` · ${formatArticleDate(art.published_at)}`}
        </p>
      </section>

      {/* Cover */}
      {art.cover_image && (
        <section className="px-6 lg:px-14 mb-12 max-w-[1080px] mx-auto w-full">
          <div className="aspect-[16/10] overflow-hidden border-[2.5px] border-noir shadow-[6px_6px_0_var(--color-noir)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.cover_image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-6 lg:px-14 py-8 max-w-[720px] mx-auto w-full">
        {art.content_html ? (
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{ __html: art.content_html }}
          />
        ) : (
          <p className="font-body text-noir-doux italic">
            (Contenu en cours de rédaction.)
          </p>
        )}
      </section>

      {/* Linked creator */}
      {art.creator && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 max-w-[820px] mx-auto w-full">
          <p className="eyebrow text-noir-doux mb-4">À découvrir</p>
          <Link
            href={`/createurs/${art.creator.handle}`}
            className="inline-flex items-center gap-4 border-2 border-noir bg-creme px-5 py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-noir)] transition-all"
          >
            <div className="w-14 h-14 bg-creme-fonce border-2 border-noir flex items-center justify-center font-display text-xl text-noir/40">
              {art.creator.display_name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="font-display text-2xl leading-none">
                {art.creator.display_name}
              </p>
              {art.creator.city && (
                <p className="mono-meta text-noir-doux mt-1">
                  {art.creator.city}
                </p>
              )}
            </div>
            <span className="ml-3 mono-meta">→</span>
          </Link>
        </section>
      )}

      {/* Similar */}
      {similar && similar.length > 0 && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="mb-7">
            <p className="eyebrow text-noir-doux">
              Continuer · {typeLabels[art.type]}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1.5 leading-[0.92]">
              Articles similaires
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similar.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                cover={a.cover_image ?? "/assets/riso-article-1.svg"}
                type={typeLabels[a.type as ArticleDetail["type"]]}
                reading_time={a.reading_time ?? 0}
                date={a.published_at ? formatArticleDate(a.published_at) : ""}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
