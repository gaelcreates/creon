import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "tertiary" | "destructive";
type Size = "sm" | "md" | "lg";

/**
 * Boutons style "collage" : ombre papier offset (pas centrée SaaS), bordures
 * 1.5px (trait de stylo), lift léger au hover comme si on soulevait une
 * étiquette collée.
 *
 * Ondes :
 * - shadow offset 2-3px en bas-droite (effet "feuille posée")
 * - hover : translate-up + ombre qui se resserre vers la position de repos
 * - active : scale-down 0.98 (clic taclé)
 */

const base =
  "inline-flex items-center justify-center gap-2 font-body font-medium " +
  "rounded-md transition-all duration-150 ease-out cursor-pointer " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-creme " +
  "active:translate-y-px active:translate-x-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-noir text-creme border-[1.5px] border-noir " +
    "shadow-[2px_3px_0_rgba(16,6,9,0.85)] " +
    "hover:shadow-[1px_2px_0_rgba(16,6,9,0.85)] hover:-translate-y-px " +
    "active:shadow-[0px_1px_0_rgba(16,6,9,0.85)]",
  accent:
    "bg-accent text-noir border-[1.5px] border-noir " +
    "shadow-[2px_3px_0_rgba(16,6,9,0.85)] " +
    "hover:shadow-[1px_2px_0_rgba(16,6,9,0.85)] hover:-translate-y-px hover:bg-accent-deep " +
    "active:shadow-[0px_1px_0_rgba(16,6,9,0.85)]",
  secondary:
    "bg-creme-clair text-noir border-[1.5px] border-noir " +
    "shadow-[2px_3px_0_rgba(16,6,9,0.6)] " +
    "hover:shadow-[1px_2px_0_rgba(16,6,9,0.6)] hover:-translate-y-px hover:bg-noir hover:text-creme " +
    "active:shadow-[0px_1px_0_rgba(16,6,9,0.6)]",
  tertiary:
    "text-noir underline decoration-accent decoration-[1.5px] underline-offset-4 " +
    "hover:text-accent-deep hover:decoration-accent-deep",
  destructive:
    "text-rouge-brique border-[1.5px] border-rouge-brique/50 " +
    "shadow-[2px_3px_0_rgba(177,61,61,0.3)] " +
    "hover:bg-rouge-brique hover:text-creme hover:border-rouge-brique hover:-translate-y-px " +
    "hover:shadow-[1px_2px_0_rgba(177,61,61,0.5)]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-[14px]",
  lg: "px-5 py-2.5 text-[15px]",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
}: {
  variant?: Variant;
  size?: Size;
} = {}): string {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
