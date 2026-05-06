import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

type ArticleType = "coulisses" | "profil" | "educatif" | "annonce";

type CoverTone = "noir" | "creme-fonce" | "accent";

type ArticleCardProps = {
  title: string;
  excerpt: string;
  type: ArticleType;
  reading_time: number;
  author: string;
  date: string;
  slug: string;
  coverTone?: CoverTone;
};

const typeLabels: Record<ArticleType, string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
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

export function ArticleCard({
  title,
  excerpt,
  type,
  reading_time,
  author,
  date,
  slug,
  coverTone = "creme-fonce",
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group block border-2 border-noir bg-creme transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
    >
      <div
        className={cn(
          "aspect-[16/10] border-b-2 border-noir flex items-center justify-center relative",
          coverClasses[coverTone],
        )}
      >
        <span
          className={cn(
            "font-display text-5xl uppercase tracking-wider",
            coverTextClasses[coverTone],
          )}
        >
          {typeLabels[type]}
        </span>
        <div className="absolute top-3 left-3">
          <Tag variant="accent">{typeLabels[type]}</Tag>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        <p className="font-body text-sm text-noir-doux leading-relaxed line-clamp-2">
          {excerpt}
        </p>
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux pt-2">
          {author} · {date} · {reading_time} min
        </p>
      </div>
    </Link>
  );
}
