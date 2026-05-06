import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

type CoverTone = "noir" | "creme-fonce" | "accent";

type EventCardProps = {
  title: string;
  city: string;
  venue: string;
  date: string;
  categories: string[];
  href: string;
  coverTone?: CoverTone;
};

const coverClasses: Record<CoverTone, string> = {
  noir: "bg-noir",
  "creme-fonce": "bg-creme-fonce",
  accent: "bg-accent",
};

const coverTextClasses: Record<CoverTone, string> = {
  noir: "text-creme/30",
  "creme-fonce": "text-noir/25",
  accent: "text-noir/30",
};

export function EventCard({
  title,
  city,
  venue,
  date,
  categories,
  href,
  coverTone = "creme-fonce",
}: EventCardProps) {
  return (
    <Link
      href={href}
      className="group block border-2 border-noir bg-creme transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
    >
      <div
        className={cn(
          "aspect-[16/10] border-b-2 border-noir flex items-center justify-center overflow-hidden",
          coverClasses[coverTone],
        )}
      >
        <span
          className={cn(
            "font-display text-5xl uppercase tracking-wider",
            coverTextClasses[coverTone],
          )}
        >
          {city}
        </span>
      </div>
      <div className="p-5 space-y-3">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
          {date} · {venue}
        </p>
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <Tag key={cat}>{cat}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
