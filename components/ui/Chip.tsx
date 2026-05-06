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
        "inline-flex items-center px-4 py-1.5 border-2 border-noir font-body text-sm uppercase tracking-wider cursor-pointer",
        "transition-colors duration-100",
        active
          ? "bg-accent text-noir"
          : "bg-creme text-noir hover:bg-creme-fonce",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
