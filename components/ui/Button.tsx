import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-body uppercase tracking-wider " +
  "border-2 border-noir transition-all duration-150 cursor-pointer " +
  "shadow-[3px_3px_0_var(--color-noir)] " +
  "hover:shadow-[5px_5px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 " +
  "active:shadow-none active:translate-x-0 active:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-noir",
  secondary: "bg-creme text-noir hover:bg-creme-fonce",
  tertiary:
    "border-transparent shadow-none bg-transparent text-noir " +
    "underline decoration-accent decoration-2 underline-offset-4 " +
    "hover:shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-creme-fonce",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
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
