import { cn } from "@/lib/cn";

type Variant = "default" | "accent" | "dark" | "soft";

type TagProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

/**
 * Tag style "étiquette collée" : bordure 1.5px (trait de stylo), padding plus
 * généreux que la version SaaS clean, légère ombre papier à droite-bas.
 * Suffisamment visible pour fonctionner comme étiquette autonome dans une grille.
 */
const variants: Record<Variant, string> = {
  default:
    "bg-creme-clair text-noir border-noir " +
    "shadow-[1.5px_2px_0_rgba(16,6,9,0.12)]",
  accent:
    "bg-accent text-noir border-noir " +
    "shadow-[1.5px_2px_0_rgba(16,6,9,0.18)]",
  dark:
    "bg-noir text-creme border-noir " +
    "shadow-[1.5px_2px_0_rgba(16,6,9,0.25)]",
  soft:
    "bg-accent-soft text-accent-deep border-transparent",
};

export function Tag({ variant = "default", className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-[3px] border-[1.5px] rounded-[5px] " +
          "font-body text-[12px] font-medium tracking-tight",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
