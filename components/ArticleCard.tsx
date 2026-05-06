import Link from "next/link";

type ArticleCardProps = {
  title: string;
  slug: string;
  cover: string;
  type: string;
  reading_time: number;
  date: string;
};

export function ArticleCard({
  title,
  slug,
  cover,
  type,
  reading_time,
  date,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group block border-2 border-noir bg-creme overflow-hidden transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
    >
      <div className="aspect-[4/3] overflow-hidden border-b-2 border-noir">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-4 pt-4 pb-5">
        <p className="mono-meta uppercase">
          {type} · {reading_time} min
        </p>
        <h4 className="font-display text-[28px] leading-[0.95] mt-2 mb-1.5">
          {title}
        </h4>
        <p className="mono-meta text-noir-doux">{date}</p>
      </div>
    </Link>
  );
}
