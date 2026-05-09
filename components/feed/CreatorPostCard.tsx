import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type CreatorLite = {
  handle: string;
  display_name: string;
  city: string | null;
  profile_image: string | null;
};

type BasePost = {
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
  creator: CreatorLite;
};

type Props = {
  post: BasePost;
};

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return d.toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function CreatorBlock({ creator }: { creator: CreatorLite }) {
  return (
    <Link
      href={`/createurs/${creator.handle}`}
      className="flex items-center gap-2 hover:text-accent-deep transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {creator.profile_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={creator.profile_image}
          alt=""
          className="w-9 h-9 rounded-full border border-noir bg-creme-fonce object-cover"
        />
      ) : (
        <div className="w-9 h-9 rounded-full border border-noir bg-creme-fonce flex items-center justify-center mono-meta text-noir-doux">
          {creator.display_name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
      )}
      <div className="min-w-0 leading-tight">
        <div className="font-body text-[14px] font-medium truncate">
          {creator.display_name}
        </div>
      </div>
    </Link>
  );
}

export function CreatorPostCard({ post }: Props) {
  const href = `/createurs/${post.creator.handle}/${post.slug}`;

  if (post.type === "short") return <ShortPost post={post} href={href} />;
  if (post.type === "article") return <ArticlePost post={post} href={href} />;
  if (post.type === "service") return <ServicePost post={post} href={href} />;
  return null;
}

function ShortPost({ post, href }: { post: BasePost; href: string }) {
  const text = post.content_html
    ? post.content_html.replace(/<[^>]+>/g, "").trim()
    : "";
  const excerpt = text.length > 280 ? text.slice(0, 277) + "…" : text;
  const images = post.gallery_images.slice(0, 4);

  return (
    <Link
      href={href}
      className="group block border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]"
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CreatorBlock creator={post.creator} />
            <span className="mono-meta text-noir-doux shrink-0">
              {post.creator.city ? `· ${post.creator.city} ` : ""}
              {timeAgo(post.published_at)}
            </span>
          </div>
        </div>

        {post.title && (
          <h3 className="heading-3 leading-tight">{post.title}</h3>
        )}

        {excerpt && <p className="body leading-snug">{excerpt}</p>}

        {images.length > 0 && (
          <div
            className={cn(
              "grid gap-1.5",
              images.length === 1 && "grid-cols-1",
              images.length === 2 && "grid-cols-2",
              images.length === 3 && "grid-cols-3",
              images.length === 4 && "grid-cols-2",
            )}
          >
            {images.map((src, i) => (
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
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-noir/15">
            {post.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            <span className="ml-auto mono-meta text-noir-doux">
              ↗ {post.view_count}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function ArticlePost({ post, href }: { post: BasePost; href: string }) {
  const excerpt = post.content_html
    ? post.content_html.replace(/<[^>]+>/g, "").slice(0, 160).trim() + "…"
    : "";

  return (
    <Link
      href={href}
      className="group block border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]"
    >
      {post.cover_image && (
        <div className="aspect-[16/10] overflow-hidden border-b border-noir bg-creme-fonce">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <Tag>Article</Tag>
        <h3 className="heading-3 leading-tight">{post.title ?? "Sans titre"}</h3>
        {excerpt && (
          <p className="small text-noir-doux leading-snug line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-2.5 border-t border-noir/15">
          <CreatorBlock creator={post.creator} />
          <span className="mono-meta text-noir-doux">
            {timeAgo(post.published_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ServicePost({ post, href }: { post: BasePost; href: string }) {
  return (
    <Link
      href={href}
      className="group block border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]"
    >
      {post.cover_image && (
        <div className="aspect-[16/10] overflow-hidden border-b border-noir bg-creme-fonce">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Tag variant="accent">Service</Tag>
          {post.service_price && (
            <span className="mono-meta text-noir">{post.service_price}</span>
          )}
        </div>
        <h3 className="heading-3 leading-tight">{post.title ?? "Service"}</h3>
        <div className="flex items-center justify-between pt-2.5 border-t border-noir/15">
          <CreatorBlock creator={post.creator} />
          <span
            className={cn(
              buttonVariants({ variant: "accent", size: "sm" }),
              "pointer-events-none",
            )}
          >
            {post.service_cta ?? "Découvrir"} →
          </span>
        </div>
      </div>
    </Link>
  );
}
