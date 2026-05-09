import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { CreatorCard } from "@/components/CreatorCard";
import { ArticleCard } from "@/components/ArticleCard";
import { CreatorPostCard } from "@/components/feed/CreatorPostCard";
import { HeroCinematic } from "@/components/HeroCinematic";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate, formatArticleDate } from "@/lib/format";

const PORTRAIT_FALLBACKS = [
  "/assets/riso-portrait-1.svg",
  "/assets/riso-portrait-2.svg",
  "/assets/riso-portrait-3.svg",
];
const ARTICLE_FALLBACK = "/assets/riso-article-1.svg";
const EVENT_FALLBACK = "/assets/riso-event-1.svg";

const TYPE_LABELS: Record<string, string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  signature: "Signature",
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  categories: string[];
  date_start: string;
  city: string;
  venue: string;
  price_info: string | null;
};

type CreatorRow = {
  id: string;
  handle: string;
  display_name: string;
  short_bio: string | null;
  city: string | null;
  categories: string[];
  profile_image: string | null;
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  type: string;
  reading_time: number | null;
  published_at: string | null;
};

type PostRow = {
  id: string;
  slug: string;
  type: "short" | "article" | "service";
  title: string | null;
  content_html: string | null;
  cover_image: string | null;
  gallery_images: string[];
  service_url: string | null;
  service_price: string | null;
  service_cta: string | null;
  tags: string[];
  published_at: string | null;
  view_count: number;
  creator: {
    handle: string;
    display_name: string;
    city: string | null;
    profile_image: string | null;
  };
};

function reorderByIds<T extends { id: string }>(
  rows: T[],
  ids: string[],
): T[] {
  if (ids.length === 0) return rows;
  return ids.map((id) => rows.find((r) => r.id === id)).filter(Boolean) as T[];
}

function SectionHeader({
  number,
  title,
  description,
  cta,
  ctaHref,
}: {
  number: string;
  title: string;
  description?: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-7">
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="mono-meta text-noir-doux">{number}</span>
          <h2 className="heading-1">{title}</h2>
        </div>
        {description && (
          <p className="small text-noir-doux max-w-md">{description}</p>
        )}
      </div>
      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className={`shrink-0 ${buttonVariants({ variant: "secondary", size: "sm" })}`}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("homepage_config")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const featuredEventIds = (config?.featured_event_ids ?? []) as string[];
  const featuredCreatorIds = (config?.featured_creator_ids ?? []) as string[];
  const featuredArticleIds = (config?.featured_article_ids ?? []) as string[];
  const featuredPostIds = (config?.featured_post_ids ?? []) as string[];

  const [eventsRes, creatorsRes, articlesRes, postsRes] = await Promise.all([
    featuredEventIds.length > 0
      ? supabase
          .from("events")
          .select(
            "id, slug, title, cover_image, categories, date_start, city, venue, price_info",
          )
          .eq("status", "published")
          .in("id", featuredEventIds)
      : supabase
          .from("events")
          .select(
            "id, slug, title, cover_image, categories, date_start, city, venue, price_info",
          )
          .eq("status", "published")
          .order("date_start", { ascending: true })
          .limit(3),
    featuredCreatorIds.length > 0
      ? supabase
          .from("creators")
          .select(
            "id, handle, display_name, short_bio, city, categories, profile_image",
          )
          .eq("status", "active")
          .in("id", featuredCreatorIds)
      : supabase
          .from("creators")
          .select(
            "id, handle, display_name, short_bio, city, categories, profile_image",
          )
          .eq("status", "active")
          .order("display_name", { ascending: true })
          .limit(4),
    featuredArticleIds.length > 0
      ? supabase
          .from("editorial_articles")
          .select(
            "id, slug, title, excerpt, cover_image, type, reading_time, published_at",
          )
          .eq("status", "published")
          .in("id", featuredArticleIds)
      : supabase
          .from("editorial_articles")
          .select(
            "id, slug, title, excerpt, cover_image, type, reading_time, published_at",
          )
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3),
    featuredPostIds.length > 0
      ? supabase
          .from("creator_posts")
          .select(
            "id, slug, type, title, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count, creator:creators(handle, display_name, city, profile_image)",
          )
          .eq("status", "published")
          .in("id", featuredPostIds)
      : supabase
          .from("creator_posts")
          .select(
            "id, slug, type, title, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count, creator:creators(handle, display_name, city, profile_image)",
          )
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(4),
  ]);

  const events = reorderByIds(
    (eventsRes.data ?? []) as EventRow[],
    featuredEventIds,
  );
  const creators = reorderByIds(
    (creatorsRes.data ?? []) as CreatorRow[],
    featuredCreatorIds,
  );
  const articles = reorderByIds(
    (articlesRes.data ?? []) as ArticleRow[],
    featuredArticleIds,
  );
  const posts = reorderByIds(
    (postsRes.data ?? []) as unknown as PostRow[],
    featuredPostIds,
  );

  const heroTitle =
    config?.hero_title ?? "La plateforme suisse pour les créateurs.";
  const heroSubtitle =
    config?.hero_subtitle ??
    "Annuaire, feed et events de la scène créative romande. Curé à la main par CREON crew.";

  return (
    <>
      <HeroCinematic
        eyebrow="CREON · La plateforme suisse pour les créateurs"
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaPrimary={{ label: "Explorer le feed", href: "/feed" }}
        ctaSecondary={{
          label: "Devenir créateur",
          href: "/proposer-mon-profil",
        }}
      />

      {/* 01 — EVENTS */}
      {events.length > 0 && (
        <section className="px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full">
          <SectionHeader
            number="01"
            title="Cette semaine"
            description="Vernissages, concerts, soirées, marchés. Sélection à pas rater."
            cta="Tous les events →"
            ctaHref="/events"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <EventCard
                key={e.id}
                title={e.title}
                href={`/events/${e.slug}`}
                cover={e.cover_image ?? EVENT_FALLBACK}
                category={e.categories[0] ?? "Event"}
                date={formatEventDate(e.date_start)}
                meta={`${e.city} · ${e.venue}`}
                price={e.price_info ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* 02 — FEED (creator posts) */}
      <section className="border-t border-noir px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full">
        <SectionHeader
          number="02"
          title="Le feed"
          description="Les derniers posts, articles et services publiés par les créateurs eux-mêmes."
          cta="Tout le feed →"
          ctaHref="/feed"
        />
        {posts.length === 0 ? (
          <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
            <p className="heading-3 mb-3">Le feed démarre.</p>
            <p className="small text-noir-doux max-w-md mx-auto mb-5">
              Les premiers créateurs sont en cours d&apos;invitation. Reviens
              dans quelques jours, ou rejoins-les en proposant ton profil.
            </p>
            <Link
              href="/proposer-mon-profil"
              className={buttonVariants({ variant: "accent", size: "sm" })}
            >
              Proposer mon profil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {posts.map((p) => (
              <CreatorPostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* 03 — CRÉATEURS */}
      {creators.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full">
          <SectionHeader
            number="03"
            title="Nos créateurs"
            description="Mode, musique, art visuel, photo, design, artisanat. Sélection humaine, sans algo."
            cta="Tout l'annuaire →"
            ctaHref="/createurs"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {creators.map((c, i) => (
              <CreatorCard
                key={c.id}
                display_name={c.display_name}
                handle={c.handle}
                display_handle={`@${c.handle}`}
                category={c.categories[0] ?? "Créateur"}
                city={c.city ?? "—"}
                short_bio={c.short_bio}
                portrait={
                  c.profile_image ??
                  PORTRAIT_FALLBACKS[i % PORTRAIT_FALLBACKS.length]
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* 04 — ARTICLES ÉDITORIAUX */}
      {articles.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full">
          <SectionHeader
            number="04"
            title="À lire"
            description="Les dossiers et profils signés par CREON crew."
            cta="Tous les articles →"
            ctaHref="/articles"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                cover={a.cover_image ?? ARTICLE_FALLBACK}
                type={TYPE_LABELS[a.type] ?? a.type}
                reading_time={a.reading_time ?? 0}
                date={a.published_at ? formatArticleDate(a.published_at) : ""}
                excerpt={a.excerpt}
              />
            ))}
          </div>
        </section>
      )}

      {/* 05 — PRODUCTIONS (placeholder, vide pour l'instant) */}
      <section className="border-t border-noir px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full">
        <SectionHeader
          number="05"
          title="Productions"
          description="Le service de production vidéo CREON. Films institutionnels, captations, événementiel."
          cta="Voir nos productions →"
          ctaHref="/productions"
        />
        <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
          <p className="heading-3 mb-3">Page productions en cours.</p>
          <p className="small text-noir-doux max-w-md mx-auto">
            Vitrine des références + formulaire de devis arrivent bientôt.
          </p>
        </div>
      </section>

      {/* 06 — NEWSLETTER CTA */}
      <section className="border-t border-noir bg-creme-clair">
        <div className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <p className="eyebrow text-noir-doux mb-3">Newsletter</p>
              <h2 className="display-2 mb-4">
                La <span className="hl">crème</span> du vendredi, direct dans
                ta boîte.
              </h2>
              <p className="lead text-noir-doux max-w-xl">
                Cinq events, un créateur du moment, un dossier à lire. Une
                fois par semaine, jamais de spam.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <Link
                href="/newsletter"
                className={buttonVariants({ variant: "accent", size: "lg" })}
              >
                S&apos;abonner
              </Link>
              <p className="mono-meta text-noir-doux">
                4 200+ abonnés · taux d&apos;ouverture 64 %
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
