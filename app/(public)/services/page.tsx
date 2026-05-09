import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreatorPostCard } from "@/components/feed/CreatorPostCard";
import { SectionDecor } from "@/components/SectionDecor";
import { cn } from "@/lib/cn";
import { buildQuery } from "@/lib/format";

const CITIES = [
  "Lausanne",
  "Genève",
  "Zurich",
  "Vevey",
  "Fribourg",
  "Neuchâtel",
];

export const metadata = {
  title: "Services — CREON",
  description:
    "Tous les services proposés par les créateurs CREON : tirages, productions, design, mode sur mesure et plus.",
};

type PostRow = {
  id: string;
  slug: string;
  type: "service";
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

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; q?: string }>;
}) {
  const params = await searchParams;
  const city = params.city ?? null;
  const q = params.q ?? null;

  const supabase = await createClient();
  let query = supabase
    .from("creator_posts")
    .select(
      "id, slug, type, title, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count, creator:creators!inner(handle, display_name, city, profile_image, status)",
    )
    .eq("status", "published")
    .eq("type", "service")
    .order("published_at", { ascending: false });

  if (city) query = query.eq("creator.city", city);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data: services } = await query;
  const list = (services ?? []) as unknown as PostRow[];

  return (
    <>
      <section className="relative px-6 lg:px-14 pt-16 pb-12 lg:pt-20 max-w-[1320px] mx-auto w-full overflow-hidden">
        <SectionDecor variant="shop" />
        <p className="eyebrow text-noir-doux mb-5">
          Vitrine cross-créateurs
        </p>
        <h1 className="display-1 max-w-4xl">Les services.</h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Tirages, design, photo d&apos;événement, sur-mesure : ce que les
          créateurs CREON proposent à la commande. Contact direct chez
          eux.
        </p>

        <form className="mt-8 max-w-md" action="/services" method="get">
          {city && <input type="hidden" name="city" value={city} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Chercher un service…"
            className="w-full px-4 py-2.5 border border-noir bg-creme-clair rounded-md font-body text-[14px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </form>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-2">Ville</p>
        <div className="flex flex-wrap gap-2">
          <ChipLink href={`/services${buildQuery({ q })}`} active={!city}>
            Toutes
          </ChipLink>
          {CITIES.map((c) => (
            <ChipLink
              key={c}
              href={`/services${buildQuery({ q, city: city === c ? null : c })}`}
              active={city === c}
            >
              {c}
            </ChipLink>
          ))}
        </div>
      </section>

      <hr className="border-0 border-t border-noir/15 m-0 max-w-[1320px] mx-auto" />

      <section className="px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-6">
          <p className="small text-noir-doux">
            <span className="font-medium text-noir">{list.length}</span>{" "}
            service{list.length > 1 ? "s" : ""}
            {q ? ` pour "${q}"` : ""}
            {city ? ` à ${city}` : ""}
          </p>
          {(city || q) && (
            <Link
              href="/services"
              className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
            >
              Effacer ✕
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
            <p className="heading-2 mb-3">Aucun service.</p>
            <p className="small text-noir-doux">
              {q || city
                ? "Tente sans filtre."
                : "Les premiers services arrivent quand les créateurs publient."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((p) => (
              <CreatorPostCard key={p.id} post={p} />
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
      className={cn(
        "inline-flex items-center px-3.5 py-1.5 rounded-md border font-body text-[13px] font-medium transition-all duration-150",
        active
          ? "border-accent bg-accent text-noir"
          : "border-noir bg-creme-clair text-noir hover:bg-creme-fonce",
      )}
    >
      {children}
    </Link>
  );
}
