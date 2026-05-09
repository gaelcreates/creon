import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreatorPostCard } from "@/components/feed/CreatorPostCard";
import { SectionDecor } from "@/components/SectionDecor";
import { buildQuery } from "@/lib/format";
import { cn } from "@/lib/cn";

const TYPES = [
  { value: "short", label: "Posts" },
  { value: "article", label: "Articles" },
  { value: "service", label: "Services" },
];

const CITIES = [
  "Lausanne",
  "Genève",
  "Zurich",
  "Vevey",
  "Fribourg",
  "Neuchâtel",
];

export const metadata = {
  title: "Feed — CREON",
  description:
    "Le feed de la plateforme : tous les posts, articles et services publiés par les créateurs suisses.",
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

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    city?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const type = params.type ?? null;
  const city = params.city ?? null;
  const sort = params.sort === "popular" ? "popular" : "recent";

  const supabase = await createClient();

  let query = supabase
    .from("creator_posts")
    .select(
      "id, slug, type, title, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count, creator:creators!inner(handle, display_name, city, profile_image, status)",
    )
    .eq("status", "published");

  if (type) query = query.eq("type", type);
  if (city) query = query.eq("creator.city", city);

  query =
    sort === "popular"
      ? query.order("view_count", { ascending: false })
      : query.order("published_at", { ascending: false });

  query = query.limit(60);

  const { data: posts } = await query;
  const list = (posts ?? []) as unknown as PostRow[];

  return (
    <>
      <section className="relative px-6 lg:px-14 pt-28 pb-12 lg:pt-32 max-w-[1320px] mx-auto w-full overflow-hidden">
        <SectionDecor variant="feed" />
        <p className="eyebrow text-noir-doux mb-5">
          Plateforme · contenus créateurs
        </p>
        <h1 className="display-1 max-w-4xl">
          Le <span className="hl">feed</span>.
        </h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Tout ce que les créateurs publient eux-mêmes : posts courts,
          articles longs, services proposés. Sans algorithme de tri caché.
        </p>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full space-y-4">
        <div>
          <p className="eyebrow text-noir-doux mb-2">Type</p>
          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={`/feed${buildQuery({ city, sort: sort === "popular" ? "popular" : null })}`}
              active={!type}
            >
              Tout
            </ChipLink>
            {TYPES.map((t) => (
              <ChipLink
                key={t.value}
                href={`/feed${buildQuery({ city, sort: sort === "popular" ? "popular" : null, type: type === t.value ? null : t.value })}`}
                active={type === t.value}
              >
                {t.label}
              </ChipLink>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-noir-doux mb-2">Ville</p>
          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={`/feed${buildQuery({ type, sort: sort === "popular" ? "popular" : null })}`}
              active={!city}
            >
              Toutes
            </ChipLink>
            {CITIES.map((c) => (
              <ChipLink
                key={c}
                href={`/feed${buildQuery({ type, sort: sort === "popular" ? "popular" : null, city: city === c ? null : c })}`}
                active={city === c}
              >
                {c}
              </ChipLink>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-noir-doux mb-2">Tri</p>
          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={`/feed${buildQuery({ type, city })}`}
              active={sort === "recent"}
            >
              Récent
            </ChipLink>
            <ChipLink
              href={`/feed${buildQuery({ type, city, sort: "popular" })}`}
              active={sort === "popular"}
            >
              Populaire
            </ChipLink>
          </div>
        </div>
      </section>

      <hr className="border-0 border-t border-noir/15 m-0 max-w-[1320px] mx-auto" />

      <section className="px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-6">
          <p className="small text-noir-doux">
            <span className="font-medium text-noir">{list.length}</span>{" "}
            contenu{list.length > 1 ? "s" : ""}
            {type ? ` · ${type}` : ""}
            {city ? ` à ${city}` : ""}
          </p>
          {(type || city || sort === "popular") && (
            <Link
              href="/feed"
              className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
            >
              Effacer ✕
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
            <p className="heading-2 mb-3">Le feed démarre.</p>
            <p className="small text-noir-doux mb-4 max-w-md mx-auto">
              {type || city
                ? "Aucun contenu ne match ces filtres."
                : "Les premiers créateurs sont en cours d'invitation. Reviens dans quelques jours."}
            </p>
            <Link
              href="/proposer-mon-profil"
              className="mono-meta text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
            >
              Proposer mon profil →
            </Link>
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
