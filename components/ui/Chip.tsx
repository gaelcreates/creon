"use client";

import { cn } from "@/lib/cn";

type ChipProps = {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Chip({
  active = false,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center px-3.5 py-1.5 rounded-md border " +
          "font-body text-[13px] font-medium cursor-pointer " +
          "transition-all duration-150 ease-out",
        active
          ? "bg-accent text-noir border-accent shadow-[0_1px_3px_rgba(233,106,0,0.2)]"
          : "bg-creme-clair text-noir border-noir hover:bg-creme-fonce",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
