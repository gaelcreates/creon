import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

type EventCardProps = {
  title: string;
  href: string;
  cover: string;
  category: string;
  date: string;
  meta: string;
  price?: string;
};

export function EventCard({
  title,
  href,
  cover,
  category,
  date,
  meta,
  price,
}: EventCardProps) {
  return (
    <Link
      href={href}
      className="group block border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]"
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-noir bg-creme-fonce relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-4 pt-3.5 pb-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Tag>{category}</Tag>
          <span className="mono-meta text-noir-doux">{date}</span>
        </div>
        <h3 className="heading-3 leading-tight">{title}</h3>
        <p className="small text-noir-doux">{meta}</p>
        {price && (
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-noir/15">
            <span className="mono-meta text-noir">{price}</span>
            <span className="mono-meta text-noir-doux group-hover:text-accent-deep transition-colors">
              Détails →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
