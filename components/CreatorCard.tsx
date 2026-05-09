import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

type CreatorCardProps = {
  display_name: string;
  handle: string;
  display_handle?: string;
  city: string;
  category: string;
  portrait: string;
  short_bio?: string | null;
};

export function CreatorCard({
  display_name,
  handle,
  display_handle,
  city,
  category,
  portrait,
  short_bio,
}: CreatorCardProps) {
  return (
    <Link
      href={`/createurs/${handle}`}
      className="group block border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]"
    >
      <div className="aspect-square overflow-hidden border-b border-noir bg-creme-fonce">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portrait}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-4 pt-3.5 pb-4 space-y-1.5">
        <p className="mono-meta text-noir-doux">
          {display_handle ?? `@${handle}`} · {city}
        </p>
        <h3 className="heading-3 leading-tight">{display_name}</h3>
        {short_bio && (
          <p className="small text-noir-doux leading-snug line-clamp-2 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-200 ease-out">
            {short_bio}
          </p>
        )}
        <div className="pt-2 mt-1 border-t border-noir/15">
          <Tag>{category}</Tag>
        </div>
      </div>
    </Link>
  );
}
