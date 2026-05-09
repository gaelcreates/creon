import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Tag } from "@/components/ui/Tag";
import { CreatorPostCard } from "@/components/feed/CreatorPostCard";
import { buttonVariants } from "@/components/ui/Button";

type PostDetail = {
  id: string;
  slug: string;
  type: "short" | "article" | "service";
  title: string | null;
  content: object | null;
  content_html: string | null;
  cover_image: string | null;
  gallery_images: string[];
  service_url: string | null;
  service_price: string | null;
  service_cta: string | null;
  tags: string[];
  published_at: string | null;
  view_count: number;
  creator_id: string;
  creator: {
    id: string;
    handle: string;
    display_name: string;
    city: string | null;
    profile_image: string | null;
  };
};

const TYPE_LABELS: Record<string, string> = {
  short: "Post",
  article: "Article",
  service: "Service",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; postSlug: string }>;
}) {
  const { handle, postSlug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("creator_posts")
    .select(
      "title, content_html, cover_image, type, creator:creators!inner(handle, display_name)",
    )
    .eq("slug", postSlug)
    .eq("status", "published")
    .eq("creator.handle", handle)
    .maybeSingle();

  if (!post) return { title: "Contenu introuvable — CREON" };

  const p = post as unknown as PostDetail;
  const title = p.title ?? `${TYPE_LABELS[p.type]} de ${p.creator.display_name}`;
  const description =
    p.content_html?.replace(/<[^>]+>/g, "").slice(0, 160) ?? undefined;

  return {
    title: `${title} — CREON`,
    description,
    openGraph: p.cover_image ? { images: [p.cover_image] } : undefined,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ handle: string; postSlug: string }>;
}) {
  const { handle, postSlug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("creator_posts")
    .select(
      "id, slug, type, title, content, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count, creator_id, creator:creators!inner(id, handle, display_name, city, profile_image, status)",
    )
    .eq("slug", postSlug)
    .eq("status", "published")
    .eq("creator.handle", handle)
    .maybeSingle();

  if (!post) notFound();
  const p = post as unknown as PostDetail;

  // Increment view count (fire-and-forget, no await blocking)
  const adminClient = createAdminClient();
  adminClient
    .from("creator_posts")
    .update({ view_count: p.view_count + 1 })
    .eq("id", p.id)
    .then(() => undefined);

  // Fetch other posts by same creator
  const { data: otherPosts } = await supabase
    .from("creator_posts")
    .select(
      "id, slug, type, title, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, published_at, view_count",
    )
    .eq("status", "published")
    .eq("creator_id", p.creator_id)
    .neq("id", p.id)
    .order("published_at", { ascending: false })
    .limit(3);

  const initials = p.creator.display_name
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const morePosts = (otherPosts ?? []).map((other) => ({
    ...other,
    creator: {
      handle: p.creator.handle,
      display_name: p.creator.display_name,
      city: p.creator.city,
      profile_image: p.creator.profile_image,
    },
  }));

  return (
    <article>
      <section className="px-6 lg:px-14 pt-10 pb-8 max-w-[820px] mx-auto w-full">
        <p className="mono-meta text-noir-doux mb-5">
          <Link
            href={`/createurs/${p.creator.handle}`}
            className="hover:text-accent-deep transition-colors"
          >
            ← Profil de {p.creator.display_name}
          </Link>
        </p>

        <div className="flex items-center gap-3 mb-6">
          <Tag variant={p.type === "service" ? "accent" : "soft"}>
            {TYPE_LABELS[p.type]}
          </Tag>
          {p.published_at && (
            <span className="mono-meta text-noir-doux">
              {new Date(p.published_at).toLocaleDateString("fr-CH", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          <span className="mono-meta text-noir-doux">
            ↗ {p.view_count + 1}
          </span>
        </div>

        {p.title && <h1 className="display-1">{p.title}</h1>}

        {/* Author block */}
        <Link
          href={`/createurs/${p.creator.handle}`}
          className="inline-flex items-center gap-3 mt-8 group"
        >
          {p.creator.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.creator.profile_image}
              alt=""
              className="w-12 h-12 rounded-full border border-noir bg-creme-fonce object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border border-noir bg-creme-fonce flex items-center justify-center mono-meta text-noir-doux">
              {initials}
            </div>
          )}
          <div>
            <p className="font-body text-[15px] font-medium group-hover:text-accent-deep transition-colors">
              {p.creator.display_name}
            </p>
            <p className="mono-meta text-noir-doux">
              @{p.creator.handle}
              {p.creator.city ? ` · ${p.creator.city}` : ""}
            </p>
          </div>
        </Link>
      </section>

      {p.cover_image && (
        <section className="px-6 lg:px-14 mb-8 max-w-[1080px] mx-auto w-full">
          <div className="aspect-[16/10] overflow-hidden border border-noir rounded-lg bg-creme-fonce">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.cover_image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {p.gallery_images && p.gallery_images.length > 0 && p.type === "short" && (
        <section className="px-6 lg:px-14 mb-8 max-w-[820px] mx-auto w-full">
          <div
            className={
              p.gallery_images.length === 1
                ? "grid grid-cols-1 gap-2"
                : "grid grid-cols-2 gap-2"
            }
          >
            {p.gallery_images.slice(0, 4).map((src, i) => (
              <div
                key={i}
                className="aspect-square bg-creme-fonce border border-noir rounded overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 lg:px-14 py-6 max-w-[720px] mx-auto w-full">
        {p.content_html ? (
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{ __html: p.content_html }}
          />
        ) : (
          <p className="body text-noir-doux italic">(Contenu vide.)</p>
        )}
      </section>

      {p.type === "service" && p.service_url && (
        <section className="border-t border-noir px-6 lg:px-14 py-12 max-w-[820px] mx-auto w-full">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              {p.service_price && (
                <p className="mono-meta text-noir-doux mb-1">
                  Prix indicatif
                </p>
              )}
              {p.service_price && (
                <p className="display-2">{p.service_price}</p>
              )}
            </div>
            <a
              href={p.service_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants({ variant: "accent", size: "lg" })}`}
            >
              {p.service_cta ?? "Découvrir"} ↗
            </a>
          </div>
        </section>
      )}

      {p.tags && p.tags.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-8 max-w-[820px] mx-auto w-full">
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </section>
      )}

      {morePosts.length > 0 && (
        <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="mono-meta text-noir-doux">→</span>
            <h2 className="heading-1">Plus de {p.creator.display_name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {morePosts.map((other) => (
              <CreatorPostCard
                key={other.id}
                post={other as Parameters<typeof CreatorPostCard>[0]["post"]}
              />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-noir px-6 lg:px-14 py-8 max-w-[820px] mx-auto w-full text-center">
        <p className="mono-meta text-noir-doux">
          Contenu inapproprié ?{" "}
          <Link
            href={`mailto:hello@creon.ch?subject=Signalement%20${p.id}`}
            className="text-rouge-brique hover:underline transition-colors"
          >
            Signaler ce contenu
          </Link>
        </p>
      </section>
    </article>
  );
}
