import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreatorCard } from "@/components/CreatorCard";
import { SectionDecor } from "@/components/SectionDecor";
import { buildQuery } from "@/lib/format";

const CITIES = [
  "Lausanne",
  "Genève",
  "Zurich",
  "Vevey",
  "Fribourg",
  "Neuchâtel",
];

const CATEGORIES = [
  "Mode",
  "Musique",
  "Art visuel",
  "Photo",
  "Vidéo",
  "Design",
  "Artisanat",
];

export const metadata = {
  title: "Créateurs — CREON",
  description:
    "L'annuaire des créateurs suisses sélectionnés par CREON. Mode, musique, art visuel, photo, vidéo, design, artisanat.",
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

const PORTRAITS = [
  "/assets/riso-portrait-1.svg",
  "/assets/riso-portrait-2.svg",
  "/assets/riso-portrait-3.svg",
];

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const city = params.city ?? null;
  const category = params.category ?? null;
  const q = params.q ?? null;

  const supabase = await createClient();
  let query = supabase
    .from("creators")
    .select(
      "id, handle, display_name, short_bio, city, categories, profile_image",
    )
    .eq("status", "active")
    .order("display_name", { ascending: true });

  if (city) query = query.eq("city", city);
  if (category) query = query.contains("categories", [category]);
  if (q) query = query.ilike("display_name", `%${q}%`);

  const { data: creators } = await query;
  const list = (creators ?? []) as CreatorRow[];

  return (
    <>
      <section className="relative px-6 lg:px-14 pt-16 pb-10 lg:pt-20 max-w-[1320px] mx-auto w-full overflow-hidden">
        <SectionDecor variant="portraits" />
        <p className="eyebrow text-noir-doux mb-5">
          Annuaire · sur invitation
        </p>
        <h1 className="display-1 max-w-4xl">Les créateurs.</h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Mode, musique, art visuel, photo, vidéo, design, artisanat. Une
          sélection humaine, sans algorithme. Tu te reconnais ?{" "}
          <Link
            href="/proposer-mon-profil"
            className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
          >
            Propose ton profil →
          </Link>
        </p>

        <form className="mt-8 max-w-md" action="/createurs" method="get">
          {city && <input type="hidden" name="city" value={city} />}
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Chercher un créateur, une discipline…"
            className="w-full px-4 py-2.5 border border-noir bg-creme-clair rounded-md font-body text-[14px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </form>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-8 max-w-[1320px] mx-auto w-full space-y-4">
        <div>
          <p className="eyebrow text-noir-doux mb-2">Catégories</p>
          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={`/createurs${buildQuery({ city, q })}`}
              active={!category}
            >
              Toutes
            </ChipLink>
            {CATEGORIES.map((c) => (
              <ChipLink
                key={c}
                href={`/createurs${buildQuery({ city, q, category: category === c ? null : c })}`}
                active={category === c}
              >
                {c}
              </ChipLink>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-noir-doux mb-2">Villes</p>
          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={`/createurs${buildQuery({ category, q })}`}
              active={!city}
            >
              Toutes
            </ChipLink>
            {CITIES.map((c) => (
              <ChipLink
                key={c}
                href={`/createurs${buildQuery({ category, q, city: city === c ? null : c })}`}
                active={city === c}
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
            créateur{list.length > 1 ? "s" : ""}
            {q ? ` pour "${q}"` : ""}
            {category ? ` · ${category}` : ""}
            {city ? ` à ${city}` : ""}
          </p>
          {(city || category || q) && (
            <Link
              href="/createurs"
              className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
            >
              Effacer ✕
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="border border-dashed border-noir/30 rounded-lg p-10 text-center">
            <p className="heading-2 mb-3">Personne ne match.</p>
            <p className="small text-noir-doux">
              Tente sans filtre ou{" "}
              <Link
                href="/proposer-mon-profil"
                className="text-accent-deep underline decoration-accent underline-offset-4"
              >
                propose ton profil
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {list.map((c, i) => (
              <CreatorCard
                key={c.id}
                display_name={c.display_name}
                handle={c.handle}
                display_handle={`@${c.handle}`}
                category={c.categories[0] ?? "Créateur"}
                city={c.city ?? "—"}
                short_bio={c.short_bio}
                portrait={c.profile_image ?? PORTRAITS[i % PORTRAITS.length]}
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
          ? "inline-flex items-center px-3.5 py-1.5 rounded-md border border-accent bg-accent text-noir font-body text-[13px] font-medium transition-all duration-150"
          : "inline-flex items-center px-3.5 py-1.5 rounded-md border border-noir bg-creme-clair text-noir font-body text-[13px] font-medium hover:bg-creme-fonce transition-all duration-150"
      }
    >
      {children}
    </Link>
  );
}
