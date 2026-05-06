import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
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
    "Tous les events de la scène créative suisse romande, sélectionnés à la main par la rédaction de CREON.",
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
  short_description: string | null;
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
      "id, slug, title, cover_image, categories, date_start, city, venue, price_info, short_description",
    )
    .eq("status", "published")
    .order("date_start", { ascending: true });

  if (city) query = query.eq("city", city);
  if (category) query = query.contains("categories", [category]);

  const { data: events } = await query;
  const list = (events ?? []) as EventRow[];

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-12 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">
          Agenda · Suisse romande
        </p>
        <h1 className="font-display text-[clamp(56px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
          Tous les <span className="hl-block">events</span>.
        </h1>
        <p className="font-body text-[17px] leading-relaxed mt-8 max-w-[640px]">
          Vernissages, concerts, soirées, marchés, ateliers ouverts. On
          parcourt les programmes, on garde ce qui vaut le déplacement.
        </p>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      <section className="px-6 lg:px-14 py-10 max-w-[1320px] mx-auto w-full">
        <div className="space-y-3">
          <p className="eyebrow text-noir-doux mb-2">Villes</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="Toutes"
              href={`/events${buildQuery({ category })}`}
              active={!city}
            />
            {CITIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                href={`/events${buildQuery({ city: city === c ? null : c, category })}`}
                active={city === c}
              />
            ))}
          </div>
          <p className="eyebrow text-noir-doux mb-2 mt-5">Catégories</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="Toutes"
              href={`/events${buildQuery({ city })}`}
              active={!category}
            />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                href={`/events${buildQuery({ city, category: category === c ? null : c })}`}
                active={category === c}
              />
            ))}
          </div>
        </div>
      </section>

      <hr className="border-0 border-t-[1.5px] border-noir/30 m-0 max-w-[1320px] mx-auto" />

      <section className="px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-7">
          <p className="font-body text-sm text-noir-doux">
            <span className="font-medium text-noir">{list.length}</span>{" "}
            event{list.length > 1 ? "s" : ""}
            {city ? ` à ${city}` : ""}
            {category ? ` · ${category}` : ""}
          </p>
          {(city || category) && (
            <Link
              href="/events"
              className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Effacer les filtres ✕
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="border-2 border-noir bg-creme p-10 text-center">
            <p className="font-display text-3xl mb-3">Aucun event ne match.</p>
            <p className="font-body text-noir-doux">
              {city || category
                ? "Tente avec moins de filtres ou regarde l'agenda complet."
                : "L'agenda se remplit. Reviens dans quelques jours, ou abonne-toi à la newsletter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {list.map((e) => (
              <EventCard
                key={e.id}
                title={e.title}
                href={`/events/${e.slug}`}
                cover={e.cover_image ?? "/assets/riso-event-1.svg"}
                category={e.categories[0] ?? "Event"}
                date={formatEventDate(e.date_start)}
                meta={`${e.city} · ${e.venue}`}
                price={e.price_info ?? "À voir"}
              />
            ))}
          </div>
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
