import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

type ArticleCardProps = {
  title: string;
  slug: string;
  cover: string;
  type: string;
  reading_time: number;
  date: string;
  excerpt?: string | null;
};

export function ArticleCard({
  title,
  slug,
  cover,
  type,
  reading_time,
  date,
  excerpt,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group block border border-noir bg-creme-clair rounded-lg overflow-hidden transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]"
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-noir bg-creme-fonce">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-4 pt-3.5 pb-4 space-y-2">
        <Tag>{type}</Tag>
        <h3 className="heading-3 leading-tight">{title}</h3>
        {excerpt && (
          <p className="small text-noir-doux leading-snug line-clamp-2">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-noir/15 mono-meta text-noir-doux">
          <span>{date}</span>
          <span>{reading_time} min</span>
        </div>
      </div>
    </Link>
  );
}
