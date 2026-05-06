import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

type CreatorCardProps = {
  display_name: string;
  city: string;
  short_bio: string;
  categories: string[];
  handle: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CreatorCard({
  display_name,
  city,
  short_bio,
  categories,
  handle,
}: CreatorCardProps) {
  return (
    <Link
      href={`/createurs/${handle}`}
      className="group block border-2 border-noir bg-creme transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
    >
      <div className="aspect-square bg-creme-fonce border-b-2 border-noir flex items-center justify-center">
        <span className="font-display text-7xl text-noir/30 leading-none">
          {getInitials(display_name)}
        </span>
      </div>
      <div className="p-5 space-y-2">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
          {city}
        </p>
        <h3 className="font-display text-2xl leading-tight">{display_name}</h3>
        <p className="font-body text-sm text-noir-doux leading-snug line-clamp-2">
          {short_bio}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.slice(0, 2).map((cat) => (
            <Tag key={cat}>{cat}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
