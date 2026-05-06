import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { EventCard } from "@/components/EventCard";
import { buttonVariants } from "@/components/ui/Button";
import {
  formatEventDateLong,
  formatEventTime,
  formatEventDate,
} from "@/lib/format";

type EventDetail = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  categories: string[];
  date_start: string;
  date_end: string | null;
  city: string;
  venue: string;
  venue_address: string | null;
  short_description: string | null;
  price_info: string | null;
  external_url: string | null;
  external_label: string | null;
  linked_creator: string | null;
  creator?: { handle: string; display_name: string; city: string | null } | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, short_description, cover_image")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!event) return { title: "Event introuvable — CREON" };
  return {
    title: `${event.title} — CREON`,
    description: event.short_description ?? undefined,
    openGraph: event.cover_image ? { images: [event.cover_image] } : undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(
      "id, slug, title, cover_image, categories, date_start, date_end, city, venue, venue_address, short_description, price_info, external_url, external_label, linked_creator, creator:creators(handle, display_name, city)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!event) notFound();
  const evt = event as unknown as EventDetail;

  const { data: similar } = await supabase
    .from("events")
    .select(
      "id, slug, title, cover_image, categories, date_start, city, venue, price_info",
    )
    .eq("status", "published")
    .neq("id", evt.id)
    .or(
      evt.categories.length > 0
        ? `categories.cs.{${evt.categories[0]}},city.eq.${evt.city}`
        : `city.eq.${evt.city}`,
    )
    .order("date_start", { ascending: true })
    .limit(3);

  return (
    <article>
      {/* Hero with cover */}
      <section className="px-6 lg:px-14 pt-8 pb-10 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">
          <Link
            href="/events"
            className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            ← Tous les events
          </Link>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
          <div className="aspect-[4/3] overflow-hidden border-[2.5px] border-noir shadow-[6px_6px_0_var(--color-noir)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={evt.cover_image ?? "/assets/riso-event-1.svg"}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            {evt.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {evt.categories.map((c) => (
                  <Tag key={c} variant="accent">
                    {c}
                  </Tag>
                ))}
              </div>
            )}
            <h1 className="font-display text-[clamp(40px,5.5vw,80px)] leading-[0.92] m-0 tracking-tight">
              {evt.title}
            </h1>

            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 mt-2">
              <dt className="eyebrow text-noir-doux">Date</dt>
              <dd className="font-body">
                {formatEventDateLong(evt.date_start)} · {formatEventTime(evt.date_start)}
                {evt.date_end && (
                  <>
                    {" "}
                    → {formatEventTime(evt.date_end)}
                  </>
                )}
              </dd>
              <dt className="eyebrow text-noir-doux">Lieu</dt>
              <dd className="font-body">
                <strong>{evt.venue}</strong>
                <br />
                <span className="text-noir-doux">
                  {evt.city}
                  {evt.venue_address ? ` · ${evt.venue_address}` : ""}
                </span>
              </dd>
              {evt.price_info && (
                <>
                  <dt className="eyebrow text-noir-doux">Prix</dt>
                  <dd className="font-body">{evt.price_info}</dd>
                </>
              )}
            </dl>

            {evt.external_url && (
              <a
                href={evt.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-3 w-fit`}
              >
                {evt.external_label ?? "S'inscrire"} ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {evt.short_description && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
            <p className="eyebrow text-noir-doux">Description</p>
            <div className="max-w-[720px]">
              <p className="font-body text-[18px] leading-relaxed">
                {evt.short_description}
              </p>
            </div>
          </div>
        </section>
      )}

      {evt.creator && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
            <p className="eyebrow text-noir-doux">Avec</p>
            <div>
              <Link
                href={`/createurs/${evt.creator.handle}`}
                className="inline-flex items-center gap-4 border-2 border-noir bg-creme px-5 py-4 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-noir)] transition-all"
              >
                <div className="w-14 h-14 bg-creme-fonce border-2 border-noir flex items-center justify-center font-display text-xl text-noir/40">
                  {evt.creator.display_name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-display text-2xl leading-none">
                    {evt.creator.display_name}
                  </p>
                  {evt.creator.city && (
                    <p className="mono-meta text-noir-doux mt-1">
                      {evt.creator.city}
                    </p>
                  )}
                </div>
                <span className="ml-3 mono-meta">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {similar && similar.length > 0 && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="mb-7">
            <p className="eyebrow text-noir-doux">À voir aussi</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1.5 leading-[0.92]">
              Events similaires
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similar.map((e) => (
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
        </section>
      )}
    </article>
  );
}
