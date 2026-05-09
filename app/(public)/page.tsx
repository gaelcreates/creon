import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { CreatorCard } from "@/components/CreatorCard";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { HeroCinematic } from "@/components/HeroCinematic";
import { HeroVideo } from "@/components/HeroVideo";
import { createClient } from "@/lib/supabase/server";
import { formatEventDate } from "@/lib/format";

const PORTRAIT_FALLBACKS = [
  "/assets/riso-portrait-1.svg",
  "/assets/riso-portrait-2.svg",
  "/assets/riso-portrait-3.svg",
];
const EVENT_FALLBACK = "/assets/riso-event-1.svg";

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

type ProductionRow = {
  id: string;
  slug: string;
  client_name: string;
  project_title: string;
  cover_image: string | null;
  tags: string[];
};

function reorderByIds<T extends { id: string }>(rows: T[], ids: string[]): T[] {
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
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="mono-meta text-noir-doux">{number}</span>
          <h2 className="display-2">{title}</h2>
        </div>
        {description && (
          <p className="lead text-noir-doux max-w-md">{description}</p>
        )}
      </div>
      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className={`shrink-0 ${buttonVariants({ variant: "primary", size: "md" })}`}
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
  const featuredProductionIds = (config?.featured_production_ids ??
    []) as string[];

  const [eventsRes, creatorsRes, productionsRes] = await Promise.all([
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
    featuredProductionIds.length > 0
      ? supabase
          .from("productions_references")
          .select("id, slug, client_name, project_title, cover_image, tags")
          .eq("status", "published")
          .in("id", featuredProductionIds)
      : supabase
          .from("productions_references")
          .select("id, slug, client_name, project_title, cover_image, tags")
          .eq("status", "published")
          .order("order_index", { ascending: true })
          .limit(3),
  ]);

  const events = reorderByIds(
    (eventsRes.data ?? []) as EventRow[],
    featuredEventIds,
  );
  const creators = reorderByIds(
    (creatorsRes.data ?? []) as CreatorRow[],
    featuredCreatorIds,
  );
  const productions = reorderByIds(
    (productionsRes.data ?? []) as ProductionRow[],
    featuredProductionIds,
  );

  const heroTitle =
    config?.hero_title ?? "La plateforme suisse pour les créateurs.";
  const heroSubtitle =
    config?.hero_subtitle ??
    "Annuaire, feed et events de la scène créative romande. Curé à la main par CREON crew.";

  return (
    <>
      <HeroVideo
        videoSrc="/hero/intro.mp4"
        webmSrc="/hero/intro.webm"
        posterSrc="/hero/intro-poster.jpg"
        eyebrow="CREON · Plateforme créative suisse"
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaPrimary={{ label: "Explorer le feed", href: "/feed" }}
        ctaSecondary={{
          label: "Devenir créateur",
          href: "/proposer-mon-profil",
        }}
        fallback={
          <HeroCinematic
            eyebrow="CREON · Plateforme créative suisse"
            title={heroTitle}
            subtitle={heroSubtitle}
            ctaPrimary={{ label: "Explorer le feed", href: "/feed" }}
            ctaSecondary={{
              label: "Devenir créateur",
              href: "/proposer-mon-profil",
            }}
          />
        }
      />

      <section className="border-t border-noir px-6 lg:px-14 pt-28 pb-20 lg:pt-32 lg:pb-24 max-w-[1320px] mx-auto w-full">
        <SectionHeader
          number="01"
          title="Events actuels"
          description="Vernissages, concerts, soirées, marchés. Sélection à pas rater."
          cta="Tous les events →"
          ctaHref="/events"
        />
        {events.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-noir/30">
            <p className="heading-3 mb-2">L&apos;agenda se remplit.</p>
            <p className="small text-noir-doux">
              Les premiers events arrivent. Reviens dans quelques jours.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.slice(0, 3).map((e) => (
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
        )}
      </section>

      <section className="border-t border-noir px-6 lg:px-14 pt-28 pb-20 lg:pt-32 lg:pb-24 max-w-[1320px] mx-auto w-full">
        <SectionHeader
          number="02"
          title="Créateurs du moment"
          description="Mode, musique, art visuel, photo, design. Sélection humaine, sans algo."
          cta="Tout l'annuaire →"
          ctaHref="/createurs"
        />
        {creators.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-noir/30">
            <p className="heading-3 mb-2">L&apos;annuaire arrive.</p>
            <p className="small text-noir-doux">
              Les premiers créateurs sont en cours d&apos;invitation.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {creators.slice(0, 4).map((c, i) => (
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
        )}
      </section>

      <section className="border-t border-noir px-6 lg:px-14 pt-28 pb-20 lg:pt-32 lg:pb-24 max-w-[1320px] mx-auto w-full">
        <SectionHeader
          number="03"
          title="Dernières productions"
          description="Films institutionnels, captations, événementiel. Production maison CREON crew."
          cta="Voir toutes nos productions →"
          ctaHref="/productions"
        />
        {productions.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-noir/30">
            <p className="heading-3 mb-2">
              Vitrine productions en cours de remplissage.
            </p>
            <p className="small text-noir-doux mb-4">Tu as un projet vidéo ?</p>
            <Link
              href="/productions"
              className={buttonVariants({ variant: "accent", size: "sm" })}
            >
              Demander un devis →
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {productions.slice(0, 3).map((pr) => (
              <Card
                key={pr.id}
                hoverable
                className="overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-creme-fonce border-b border-noir overflow-hidden">
                  {pr.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pr.cover_image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <p className="mono-meta text-noir-doux">{pr.client_name}</p>
                  <h3 className="heading-3 leading-tight">
                    {pr.project_title}
                  </h3>
                  {pr.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-noir/15">
                      {pr.tags.slice(0, 3).map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
