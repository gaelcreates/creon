import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/components/ui/Tag";
import { EventCard } from "@/components/EventCard";
import { ArticleCard } from "@/components/ArticleCard";
import { getAuthState } from "@/lib/auth";
import {
  formatEventDate,
  formatArticleDate,
} from "@/lib/format";

type CreatorDetail = {
  id: string;
  handle: string;
  email: string;
  display_name: string;
  short_bio: string | null;
  long_bio: string | null;
  profile_image: string | null;
  cover_image: string | null;
  city: string | null;
  canton: string | null;
  categories: string[];
  links: Array<{ label: string; url: string; type?: string }>;
};

const typeLabels: Record<string, string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();
  const { data: creator } = await supabase
    .from("creators")
    .select("display_name, short_bio, profile_image, cover_image")
    .eq("handle", handle)
    .eq("status", "active")
    .maybeSingle();
  if (!creator) return { title: "Créateur introuvable — CREON" };
  return {
    title: `${creator.display_name} — CREON`,
    description: creator.short_bio ?? undefined,
    openGraph: creator.cover_image
      ? { images: [creator.cover_image] }
      : creator.profile_image
        ? { images: [creator.profile_image] }
        : undefined,
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: creator } = await supabase
    .from("creators")
    .select(
      "id, handle, email, display_name, short_bio, long_bio, profile_image, cover_image, city, canton, categories, links",
    )
    .eq("handle", handle)
    .eq("status", "active")
    .maybeSingle();

  if (!creator) notFound();
  const c = creator as unknown as CreatorDetail;

  const auth = await getAuthState();
  const isOwner = auth.user?.email === c.email;

  const [eventsRes, articlesRes] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, cover_image, categories, date_start, city, venue, price_info",
      )
      .eq("status", "published")
      .eq("linked_creator", c.id)
      .order("date_start", { ascending: true })
      .limit(6),
    supabase
      .from("editorial_articles")
      .select(
        "id, slug, title, cover_image, type, reading_time, published_at",
      )
      .eq("status", "published")
      .eq("linked_creator", c.id)
      .order("published_at", { ascending: false })
      .limit(6),
  ]);

  const events = eventsRes.data ?? [];
  const articles = articlesRes.data ?? [];

  const initials = c.display_name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article>
      {isOwner && (
        <div className="bg-creme-fonce border-b-[2.5px] border-noir">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-14 py-3 flex items-center justify-between gap-4">
            <p className="font-body text-sm">
              <strong>Tu vois ta page publique.</strong>{" "}
              <span className="text-noir-doux">
                C&apos;est ce que voient les visiteurs de l&apos;annuaire.
              </span>
            </p>
            <Link
              href="/compte"
              className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep shrink-0"
            >
              Modifier mon profil →
            </Link>
          </div>
        </div>
      )}

      {/* Cover */}
      <section className="relative">
        {c.cover_image ? (
          <div className="aspect-[21/9] max-h-[420px] overflow-hidden border-b-[2.5px] border-noir">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.cover_image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[21/9] max-h-[280px] bg-creme-fonce border-b-[2.5px] border-noir grain-bg overflow-hidden" />
        )}
      </section>

      {/* Identity */}
      <section className="px-6 lg:px-14 max-w-[1320px] mx-auto w-full -mt-16 lg:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-end">
          <div className="aspect-square w-40 lg:w-[200px] border-[2.5px] border-noir shadow-[6px_6px_0_var(--color-noir)] bg-creme-fonce overflow-hidden flex items-center justify-center">
            {c.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.profile_image}
                alt={c.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display text-7xl text-noir/40 leading-none">
                {initials}
              </span>
            )}
          </div>
          <div className="space-y-3 lg:pb-6">
            <p className="mono-meta text-noir-doux">@{c.handle}</p>
            <h1 className="font-display text-[clamp(48px,7vw,120px)] leading-[0.88] m-0 tracking-tight">
              {c.display_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {c.city && (
                <span className="font-body text-base">
                  {c.city}
                  {c.canton ? ` · ${c.canton}` : ""}
                </span>
              )}
              {c.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {c.categories.map((cat) => (
                    <Tag key={cat}>{cat}</Tag>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      {(c.long_bio || c.short_bio) && (
        <section className="px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
            <p className="eyebrow text-noir-doux">Bio</p>
            <div className="max-w-[720px] space-y-4">
              {(c.long_bio ?? c.short_bio ?? "")
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="font-body text-[18px] leading-relaxed">
                    {para}
                  </p>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Links */}
      {c.links && c.links.length > 0 && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 max-w-[1320px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
            <p className="eyebrow text-noir-doux">Liens</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {c.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-noir bg-creme px-4 py-3 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-noir)] transition-all flex items-center justify-between gap-3"
                >
                  <span className="font-body text-base">{link.label}</span>
                  <span className="mono-meta text-noir-doux">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="mb-7">
            <p className="eyebrow text-noir-doux">Agenda</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1.5 leading-[0.92]">
              Events à venir
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => (
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

      {/* Articles */}
      {articles.length > 0 && (
        <section className="border-t-[2.5px] border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="mb-7">
            <p className="eyebrow text-noir-doux">Vu dans CREON</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1.5 leading-[0.92]">
              Articles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                cover={a.cover_image ?? "/assets/riso-article-1.svg"}
                type={typeLabels[a.type as string]}
                reading_time={a.reading_time ?? 0}
                date={a.published_at ? formatArticleDate(a.published_at) : ""}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
