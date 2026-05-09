import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { Chip } from "@/components/ui/Chip";
import { formatEventDate, buildQuery } from "@/lib/format";

const CITIES = [
  "Lausanne",
  "Genève",
  "Zurich",
  "Berne",
  "Bâle",
  "Vevey",
  "Fribourg",
  "Neuchâtel",
];
const CATEGORIES = [
  "Musique",
  "Art visuel",
  "Mode",
  "Design",
  "Photo",
  "Vidéo",
  "Artisanat",
];

export const metadata = {
  title: "Events — CREON",
  description:
    "Tous les events de la scène créative suisse romande, sélectionnés à la main par CREON crew.",
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

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const city = params.city ?? null;
  const category = params.category ?? null;

  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select(
      "id, slug, title, cover_image, categories, date_start, city, venue, price_info",
    )
    .eq("status", "published")
    .order("date_start", { ascending: true });

  if (city) query = query.eq("city", city);
  if (category) query = query.contains("categories", [category]);

  const { data: events } = await query;
  const list = (events ?? []) as EventRow[];

  return (
    <>
      <section className="px-6 lg:px-14 pt-16 pb-12 lg:pt-20 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-5">Agenda · Suisse romande</p>
        <h1 className="display-1 max-w-4xl">Tous les events.</h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Vernissages, concerts, soirées, marchés, ateliers ouverts. On
          parcourt les programmes, on garde ce qui vaut le déplacement.
        </p>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full space-y-4">
        <div>
          <p className="eyebrow text-noir-doux mb-2">Villes</p>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={!city}
              onClick={undefined}
              {...({} as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            >
              <Link
                href={`/events${buildQuery({ category })}`}
                className="contents"
              >
                Toutes
              </Link>
            </Chip>
            {CITIES.map((c) => (
              <ChipLink
                key={c}
                href={`/events${buildQuery({ city: city === c ? null : c, category })}`}
                active={city === c}
              >
                {c}
              </ChipLink>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-noir-doux mb-2">Catégories</p>
          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={`/events${buildQuery({ city })}`}
              active={!category}
            >
              Toutes
            </ChipLink>
            {CATEGORIES.map((c) => (
              <ChipLink
                key={c}
                href={`/events${buildQuery({ city, category: category === c ? null : c })}`}
                active={category === c}
              >
                {c}
              </ChipLink>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-0 border-t border-noir/15 m-0 max-w-[1320px] mx-auto" />

      <section className="px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-6">
          <p className="small text-noir-doux">
            <span className="font-medium text-noir">{list.length}</span>{" "}
            event{list.length > 1 ? "s" : ""}
            {city ? ` à ${city}` : ""}
            {category ? ` · ${category}` : ""}
          </p>
          {(city || category) && (
            <Link
              href="/events"
              className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
            >
              Effacer ✕
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
            <p className="heading-2 mb-3">Aucun event ne match.</p>
            <p className="small text-noir-doux">
              {city || category
                ? "Tente avec moins de filtres ou regarde l'agenda complet."
                : "L'agenda se remplit. Reviens dans quelques jours, ou abonne-toi à la newsletter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((e) => (
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
          ? "inline-flex items-center px-3.5 py-1.5 rounded-md border border-accent bg-accent text-noir font-body text-[13px] font-medium shadow-[0_1px_3px_rgba(233,106,0,0.2)] transition-all duration-150"
          : "inline-flex items-center px-3.5 py-1.5 rounded-md border border-noir bg-creme-clair text-noir font-body text-[13px] font-medium hover:bg-creme-fonce transition-all duration-150"
      }
    >
      {children}
    </Link>
  );
}
