import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { CreatorCard } from "@/components/CreatorCard";
import { ArticleCard } from "@/components/ArticleCard";
import { Tag } from "@/components/ui/Tag";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate, formatArticleDate } from "@/lib/format";

const PORTRAIT_FALLBACKS = [
  "/assets/riso-portrait-1.svg",
  "/assets/riso-portrait-2.svg",
  "/assets/riso-portrait-3.svg",
];
const ARTICLE_FALLBACK = "/assets/riso-article-1.svg";
const ARTICLE_FALLBACK_BIG = "/assets/riso-article-2.svg";
const EVENT_FALLBACK = "/assets/riso-event-1.svg";

const TYPE_LABELS: Record<string, string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
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
  author: string;
};

function reorderByIds<T extends { id: string }>(
  rows: T[],
  ids: string[],
): T[] {
  if (ids.length === 0) return rows;
  return ids.map((id) => rows.find((r) => r.id === id)).filter(Boolean) as T[];
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

  const eventsQuery =
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
          .limit(3);

  const creatorsQuery =
    featuredCreatorIds.length > 0
      ? supabase
          .from("creators")
          .select(
            "id, handle, display_name, city, categories, profile_image",
          )
          .eq("status", "active")
          .in("id", featuredCreatorIds)
      : supabase
          .from("creators")
          .select(
            "id, handle, display_name, city, categories, profile_image",
          )
          .eq("status", "active")
          .order("display_name", { ascending: true })
          .limit(5);

  const articlesQuery =
    featuredArticleIds.length > 0
      ? supabase
          .from("editorial_articles")
          .select(
            "id, slug, title, excerpt, cover_image, type, reading_time, published_at, author",
          )
          .eq("status", "published")
          .in("id", featuredArticleIds)
      : supabase
          .from("editorial_articles")
          .select(
            "id, slug, title, excerpt, cover_image, type, reading_time, published_at, author",
          )
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);

  const [eventsRes, creatorsRes, articlesRes] = await Promise.all([
    eventsQuery,
    creatorsQuery,
    articlesQuery,
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

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1, 3);

  return (
    <>
      {/* HERO */}
      <section className="px-6 lg:px-14 pt-10 pb-16 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">
          Édito ·{" "}
          {new Date().toLocaleDateString("fr-CH", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-12 items-end">
          <h1 className="font-display text-[clamp(64px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
            La scène<br />
            <span className="hl-block">romande</span>
            <br />
            n&apos;attend<br />personne.
          </h1>
          <div>
            <div className="aspect-[5/4] overflow-hidden border-[2.5px] border-noir shadow-[6px_6px_0_var(--color-noir)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/riso-hero.svg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-5 text-[17px] leading-relaxed max-w-[440px]">
              Mode, musique, design, photo, art. Six villes, vingt-trois
              lieux, des dizaines de créateurs. Tu rates rien.{" "}
              <Link
                href="/a-propos"
                className="text-accent border-b-2 border-accent hover:text-accent-deep"
              >
                Lis le manifeste →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      {/* 01 — EVENTS */}
      {events.length > 0 && (
        <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline justify-between mb-7">
            <div>
              <p className="eyebrow text-noir-doux">01 — À l&apos;affiche</p>
              <h2 className="font-display text-[44px] sm:text-6xl lg:text-7xl mt-1.5 leading-[0.92] m-0">
                Cette semaine
              </h2>
            </div>
            <Link
              href="/events"
              className={`hidden sm:inline-flex ${buttonVariants({ variant: "secondary", size: "sm" })}`}
            >
              Tous les events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((e) => (
              <EventCard
                key={e.id}
                title={e.title}
                href={`/events/${e.slug}`}
                cover={e.cover_image ?? EVENT_FALLBACK}
                category={e.categories[0] ?? "Event"}
                date={formatEventDate(e.date_start)}
                meta={`${e.city} · ${e.venue}`}
                price={e.price_info ?? "À voir"}
              />
            ))}
          </div>
        </section>
      )}

      {/* 02 — CREATORS */}
      {creators.length > 0 && (
        <section className="bg-creme-fonce border-y-[2.5px] border-noir grain-bg">
          <div className="relative z-[2] px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row items-baseline justify-between gap-6 mb-9">
              <div>
                <p className="eyebrow text-noir-doux">02 — Sous le radar</p>
                <h2 className="font-display text-[44px] sm:text-6xl lg:text-7xl mt-1.5 leading-[0.92] m-0">
                  Les créateurs<br className="hidden lg:block" /> du moment.
                </h2>
              </div>
              <p className="max-w-sm text-[15px] leading-relaxed text-noir-doux">
                Cinq portraits par semaine. Mode, art, musique, design, photo.
                Choisis par la rédaction, pas par un algo.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {creators.map((c, i) => (
                <CreatorCard
                  key={c.id}
                  display_name={c.display_name}
                  handle={c.handle}
                  display_handle={`@${c.handle}`}
                  category={c.categories[0] ?? "Créateur"}
                  city={c.city ?? "—"}
                  portrait={
                    c.profile_image ??
                    PORTRAIT_FALLBACKS[i % PORTRAIT_FALLBACKS.length]
                  }
                  index={i + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MANIFESTE */}
      <section className="bg-noir text-creme grain-bg grain-on-dark">
        <div className="relative z-[2] px-6 lg:px-14 py-20 lg:py-24 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_200px] gap-8 lg:gap-10 items-start">
            <p className="eyebrow text-accent">Manifeste</p>
            <div>
              <p className="font-display text-[32px] sm:text-5xl lg:text-[56px] leading-[1.05] m-0">
                On fait un magazine pour celles et ceux qui pensent encore
                qu&apos;une{" "}
                <span className="bg-accent text-noir px-1">
                  affiche risographe
                </span>{" "}
                dans une cave de Renens vaut mieux qu&apos;un post sponso.
              </p>
              <div className="flex flex-wrap items-center gap-5 mt-8">
                <Link
                  href="/a-propos"
                  className={buttonVariants({ variant: "primary" })}
                >
                  Lire le manifeste complet →
                </Link>
                <span className="mono-meta text-paper-edge">
                  Écrit en 2024 · révisé chaque année
                </span>
              </div>
            </div>
            <p className="mono-meta text-paper-edge text-[11px] leading-relaxed border-l-2 border-accent pl-3.5">
              « Indépendant ne veut pas dire amateur.
              <br />
              Imparfait ne veut pas dire bâclé.
              <br />
              Suisse ne veut pas dire timide. »
            </p>
          </div>
        </div>
      </section>

      {/* 03 — ARTICLES */}
      {articles.length > 0 && (
        <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="eyebrow text-noir-doux">03 — Lecture longue</p>
              <h2 className="font-display text-[44px] sm:text-6xl lg:text-7xl mt-1.5 leading-[0.92] m-0">
                Les dossiers.
              </h2>
            </div>
            <Link
              href="/articles"
              className={`hidden sm:inline-flex ${buttonVariants({ variant: "secondary", size: "sm" })}`}
            >
              Toutes les archives →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr_1fr] gap-7 items-stretch">
            {featuredArticle && (
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group flex flex-col border-[2.5px] border-noir bg-creme transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
              >
                <div className="aspect-[16/10] overflow-hidden border-b-[2.5px] border-noir">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredArticle.cover_image ?? ARTICLE_FALLBACK_BIG}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-6 pt-5 pb-6 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <Tag variant="dark">
                      {TYPE_LABELS[featuredArticle.type] ?? featuredArticle.type}
                    </Tag>
                    <span className="mono-meta">
                      {featuredArticle.reading_time ?? "—"} MIN ·{" "}
                      {featuredArticle.published_at
                        ? formatArticleDate(featuredArticle.published_at)
                        : ""}
                    </span>
                  </div>
                  <h3 className="font-display text-[40px] sm:text-5xl leading-[0.94] m-0">
                    {featuredArticle.title}
                  </h3>
                  {featuredArticle.excerpt && (
                    <p className="text-base leading-relaxed max-w-[600px]">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  <p className="mono-meta text-noir-doux">
                    par {featuredArticle.author}
                  </p>
                </div>
              </Link>
            )}

            {restArticles.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                cover={a.cover_image ?? ARTICLE_FALLBACK}
                type={TYPE_LABELS[a.type] ?? a.type}
                reading_time={a.reading_time ?? 0}
                date={a.published_at ? formatArticleDate(a.published_at) : ""}
              />
            ))}
          </div>
        </section>
      )}

      {/* 04 — NEWSLETTER */}
      <section className="bg-accent border-y-[2.5px] border-noir grain-bg grain-on-orange">
        <div className="relative z-[2] px-6 lg:px-14 py-20 lg:py-24 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <p className="eyebrow mb-3.5">04 — Newsletter</p>
              <h2 className="font-display text-[48px] sm:text-7xl lg:text-[88px] leading-[0.88] m-0">
                La crème
                <br />
                du vendredi,
                <br />
                direct dans la boîte.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed max-w-[460px] mb-6">
                Une fois par semaine. Cinq events à pas rater, un créateur à
                découvrir, un dossier à lire. C&apos;est tout. Pas de spam,
                jamais.
              </p>
              <Link
                href="/newsletter"
                className={`${buttonVariants({ variant: "primary", size: "lg" })} bg-noir text-creme border-noir`}
              >
                S&apos;abonner →
              </Link>
              <p className="mono-meta mt-3.5 text-xs">
                4 200+ abonnés · taux d&apos;ouverture 64 % · désabonnement
                libre
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
