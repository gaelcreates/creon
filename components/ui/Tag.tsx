import { cn } from "@/lib/cn";

type TagProps = {
  variant?: "default" | "accent" | "dark";
  className?: string;
  children: React.ReactNode;
};

const variants: Record<NonNullable<TagProps["variant"]>, string> = {
  default: "bg-creme text-noir",
  accent: "bg-accent text-noir",
  dark: "bg-noir text-creme",
};

export function Tag({ variant = "default", className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 border-[1.5px] border-noir font-body text-xs uppercase tracking-[0.12em] rounded-[2px]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
