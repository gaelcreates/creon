import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

type EventCardProps = {
  title: string;
  href: string;
  cover: string;
  category: string;
  date: string;
  meta: string;
  price: string;
  likes?: number;
};

export function EventCard({
  title,
  href,
  cover,
  category,
  date,
  meta,
  price,
  likes,
}: EventCardProps) {
  return (
    <Link
      href={href}
      className="group block border-2 border-noir bg-creme relative overflow-hidden transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
    >
      <div className="aspect-[4/3] overflow-hidden border-b-2 border-noir relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Tag variant="accent">{category}</Tag>
        </div>
        <div className="absolute bottom-0 right-0 bg-noir text-creme px-3 py-1.5 font-body text-xs tracking-[0.14em] uppercase">
          {price}
        </div>
      </div>
      <div className="px-5 pt-4 pb-5">
        <p className="mono-meta text-accent-deep mb-1.5">{date}</p>
        <h3 className="font-display text-[28px] leading-[0.95] mb-2">
          {title}
        </h3>
        <p className="mono-meta text-noir-doux">{meta}</p>
        <div className="flex justify-between items-center mt-4 pt-3.5 border-t-[1.5px] border-noir/40">
          <span className="mono-meta">→ Détails</span>
          {likes !== undefined && (
            <span className="mono-meta text-noir-doux">♡ {likes}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
