import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { EventCard } from "@/components/EventCard";
import { ArticleCard } from "@/components/ArticleCard";
import { CreatorPostCard } from "@/components/feed/CreatorPostCard";
import { getAuthState } from "@/lib/auth";
import { formatEventDate, formatArticleDate } from "@/lib/format";

type CreatorDetail = {
  id: string;
  handle: string;
  email: string;
  display_name: string;
  short_bio: string | null;
  long_bio: string | null;
  profile_image: string | null;
  cover_image: string | null;
  city: string | null;
  canton: string | null;
  categories: string[];
  links: Array<{ label: string; url: string; type?: string }>;
};

const typeLabels: Record<string, string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  signature: "Signature",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();
  const { data: creator } = await supabase
    .from("creators")
    .select("display_name, short_bio, profile_image, cover_image")
    .eq("handle", handle)
    .eq("status", "active")
    .maybeSingle();
  if (!creator) return { title: "Créateur introuvable — CREON" };
  return {
    title: `${creator.display_name} — CREON`,
    description: creator.short_bio ?? undefined,
    openGraph: creator.cover_image
      ? { images: [creator.cover_image] }
      : creator.profile_image
        ? { images: [creator.profile_image] }
        : undefined,
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: creator } = await supabase
    .from("creators")
    .select(
      "id, handle, email, display_name, short_bio, long_bio, profile_image, cover_image, city, canton, categories, links",
    )
    .eq("handle", handle)
    .eq("status", "active")
    .maybeSingle();

  if (!creator) notFound();
  const c = creator as unknown as CreatorDetail;

  const auth = await getAuthState();
  const isOwner = auth.user?.email === c.email;

  const [postsRes, eventsRes, articlesRes] = await Promise.all([
    supabase
      .from("creator_posts")
      .select(
        "id, slug, type, title, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count",
      )
      .eq("status", "published")
      .eq("creator_id", c.id)
      .order("published_at", { ascending: false })
      .limit(12),
    supabase
      .from("events")
      .select(
        "id, slug, title, cover_image, categories, date_start, city, venue, price_info",
      )
      .eq("status", "published")
      .eq("linked_creator", c.id)
      .order("date_start", { ascending: true })
      .limit(6),
    supabase
      .from("editorial_articles")
      .select(
        "id, slug, title, cover_image, type, reading_time, published_at, excerpt",
      )
      .eq("status", "published")
      .eq("linked_creator", c.id)
      .order("published_at", { ascending: false })
      .limit(6),
  ]);

  const ownPosts = (postsRes.data ?? []).map((p) => ({
    ...p,
    creator: {
      handle: c.handle,
      display_name: c.display_name,
      city: c.city,
      profile_image: c.profile_image,
    },
  }));
  const events = eventsRes.data ?? [];
  const articles = articlesRes.data ?? [];

  const initials = c.display_name
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article>
      {isOwner && (
        <div className="bg-accent-soft border-b border-accent">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-14 py-2.5 flex items-center justify-between gap-4">
            <p className="small text-noir">
              <strong className="font-medium">Tu vois ta page publique.</strong>{" "}
              <span className="text-noir-doux">
                C&apos;est ce que voient les visiteurs de l&apos;annuaire.
              </span>
            </p>
            <Link
              href="/compte"
              className="mono-meta text-accent-deep hover:text-accent transition-colors shrink-0"
            >
              Modifier mon profil →
            </Link>
          </div>
        </div>
      )}

      {c.cover_image ? (
        <div className="aspect-[21/9] max-h-[420px] overflow-hidden border-b border-noir">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.cover_image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[21/9] max-h-[260px] bg-creme-fonce border-b border-noir" />
      )}

      <section className="px-6 lg:px-14 max-w-[1320px] mx-auto w-full -mt-14 lg:-mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 items-end">
          <div className="aspect-square w-32 lg:w-[180px] border border-noir rounded-lg bg-creme-clair overflow-hidden flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(16,6,9,0.15)]">
            {c.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.profile_image}
                alt={c.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="display-1 text-noir/30">{initials}</span>
            )}
          </div>
          <div className="space-y-3 lg:pb-4">
            <p className="mono-meta text-noir-doux">@{c.handle}</p>
            <h1 className="display-1">{c.display_name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {c.city && (
                <span className="body">
                  {c.city}
                  {c.canton ? ` · ${c.canton}` : ""}
                </span>
              )}
              {c.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {c.categories.map((cat) => (
                    <Tag key={cat} variant="soft">
                      {cat}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {(c.long_bio || c.short_bio) && (
        <section className="px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
            <p className="eyebrow text-noir-doux">Bio</p>
            <div className="max-w-[720px] space-y-4">
              {(c.long_bio ?? c.short_bio ?? "")
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="lead">
                    {para}
                  </p>
                ))}
            </div>
          </div>
        </section>
      )}

      {c.links && c.links.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-10 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
            <p className="eyebrow text-noir-doux">Liens</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {c.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-noir bg-creme-clair px-4 py-3 rounded-md hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)] transition-all duration-150 flex items-center justify-between gap-3"
                >
                  <span className="body">{link.label}</span>
                  <span className="mono-meta text-noir-doux">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {ownPosts.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="mono-meta text-noir-doux">Feed perso</span>
            <h2 className="heading-1">Publications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ownPosts.map((p) => (
              <CreatorPostCard key={p.id} post={p as Parameters<typeof CreatorPostCard>[0]["post"]} />
            ))}
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="mono-meta text-noir-doux">Agenda</span>
            <h2 className="heading-1">Events à venir</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <EventCard
                key={e.id}
                title={e.title}
                href={`/events/${e.slug}`}
                cover={e.cover_image ?? "/assets/riso-event-1.svg"}
                category={e.categories[0] ?? "Event"}
                date={formatEventDate(e.date_start)}
                meta={`${e.city} · ${e.venue}`}
                price={e.price_info ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="mono-meta text-noir-doux">Vu dans CREON</span>
            <h2 className="heading-1">Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                cover={a.cover_image ?? "/assets/riso-article-1.svg"}
                type={typeLabels[a.type as string]}
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
