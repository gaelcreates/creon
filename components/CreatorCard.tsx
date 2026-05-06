import Link from "next/link";
import { Tag } from "@/components/ui/Tag";

type CreatorCardProps = {
  display_name: string;
  handle: string;
  display_handle?: string;
  city: string;
  category: string;
  portrait: string;
  index?: number;
};

export function CreatorCard({
  display_name,
  handle,
  display_handle,
  city,
  category,
  portrait,
  index,
}: CreatorCardProps) {
  return (
    <Link
      href={`/createurs/${handle}`}
      className="group block border-2 border-noir bg-creme relative overflow-hidden transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-noir)]"
    >
      <div className="aspect-[4/5] overflow-hidden border-b-2 border-noir relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portrait}
          alt=""
          className="w-full h-full object-cover"
        />
        {index !== undefined && (
          <span
            className="font-display absolute top-2 left-2.5 text-[22px] text-creme leading-none"
            style={{ mixBlendMode: "difference" }}
          >
            —{String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="px-3.5 pt-3 pb-4">
        <p className="mono-meta text-noir-doux text-[11px]">
          {display_handle ?? `@${handle}`}
        </p>
        <h4 className="font-display text-[22px] leading-none mt-1 mb-2">
          {display_name}
        </h4>
        <div className="flex justify-between items-center">
          <Tag className="text-[10px] px-1.5 py-0.5">{category}</Tag>
          <span className="mono-meta text-noir-doux text-[10px]">{city}</span>
        </div>
      </div>
    </Link>
  );
}
