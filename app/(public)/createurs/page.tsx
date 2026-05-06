import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreatorCard } from "@/components/CreatorCard";
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
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const city = params.city ?? null;
  const category = params.category ?? null;

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

  const { data: creators } = await query;
  const list = (creators ?? []) as CreatorRow[];

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-12 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">
          Annuaire · sur invitation
        </p>
        <h1 className="font-display text-[clamp(56px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
          Les <span className="hl-block">créateurs</span>.
        </h1>
        <p className="font-body text-[17px] leading-relaxed mt-8 max-w-[640px]">
          Mode, musique, art visuel, photo, vidéo, design, artisanat. Une
          sélection humaine, sans algorithme. Tu te reconnais&nbsp;?{" "}
          <Link
            href="/proposer-mon-profil"
            className="text-accent border-b-2 border-accent hover:text-accent-deep"
          >
            Propose ton profil →
          </Link>
        </p>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      <section className="px-6 lg:px-14 py-10 max-w-[1320px] mx-auto w-full">
        <div className="space-y-3">
          <p className="eyebrow text-noir-doux mb-2">Catégories</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="Toutes"
              href={`/createurs${buildQuery({ city })}`}
              active={!category}
            />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                href={`/createurs${buildQuery({ city, category: category === c ? null : c })}`}
                active={category === c}
              />
            ))}
          </div>
          <p className="eyebrow text-noir-doux mb-2 mt-5">Villes</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="Toutes"
              href={`/createurs${buildQuery({ category })}`}
              active={!city}
            />
            {CITIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                href={`/createurs${buildQuery({ city: city === c ? null : c, category })}`}
                active={city === c}
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
            créateur{list.length > 1 ? "s" : ""}
            {category ? ` · ${category}` : ""}
            {city ? ` à ${city}` : ""}
          </p>
          {(city || category) && (
            <Link
              href="/createurs"
              className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Effacer ✕
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="border-2 border-noir bg-creme p-10 text-center">
            <p className="font-display text-3xl mb-3">
              Personne ne match ces filtres.
            </p>
            <p className="font-body text-noir-doux">
              Tente sans filtre ou{" "}
              <Link
                href="/proposer-mon-profil"
                className="underline decoration-accent decoration-2 underline-offset-4"
              >
                propose ton profil
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {list.map((c, i) => (
              <CreatorCard
                key={c.id}
                display_name={c.display_name}
                handle={c.handle}
                display_handle={`@${c.handle}`}
                category={c.categories[0] ?? "Créateur"}
                city={c.city ?? "—"}
                portrait={c.profile_image ?? PORTRAITS[i % PORTRAITS.length]}
                index={i + 1}
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
