import { cn } from "@/lib/cn";

type Variant = "default" | "accent" | "dark" | "soft";

type TagProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

const variants: Record<Variant, string> = {
  default: "bg-creme-clair text-noir border-noir",
  accent: "bg-accent text-noir border-accent",
  dark: "bg-noir text-creme border-noir",
  soft: "bg-accent-soft text-accent-deep border-transparent",
};

export function Tag({ variant = "default", className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 border rounded-[3px] " +
          "font-body text-[11px] font-medium tracking-tight",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
