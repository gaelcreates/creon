import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "tertiary" | "destructive";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-body font-medium rounded-md " +
  "transition-all duration-150 ease-out cursor-pointer " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-creme";

const variants: Record<Variant, string> = {
  primary:
    "bg-noir text-creme hover:bg-noir-doux active:scale-[0.98] " +
    "shadow-[0_1px_2px_rgba(16,6,9,0.08)] hover:shadow-[0_4px_12px_rgba(16,6,9,0.15)]",
  accent:
    "bg-accent text-noir hover:bg-accent-deep active:scale-[0.98] " +
    "shadow-[0_1px_2px_rgba(233,106,0,0.15)] hover:shadow-[0_4px_12px_rgba(233,106,0,0.25)]",
  secondary:
    "bg-creme-clair text-noir border border-noir " +
    "hover:bg-noir hover:text-creme active:scale-[0.98]",
  tertiary:
    "text-noir underline decoration-accent decoration-[1.5px] underline-offset-4 " +
    "hover:text-accent-deep hover:decoration-accent-deep",
  destructive:
    "text-rouge-brique border border-rouge-brique/40 " +
    "hover:bg-rouge-brique hover:text-creme hover:border-rouge-brique active:scale-[0.98]",
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
