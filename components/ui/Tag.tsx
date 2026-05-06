import { cn } from "@/lib/cn";

type TagProps = {
  variant?: "default" | "accent";
  className?: string;
  children: React.ReactNode;
};

export function Tag({ variant = "default", className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 border border-noir font-body text-xs uppercase tracking-wider",
        variant === "default" && "bg-creme text-noir",
        variant === "accent" && "bg-accent text-noir",
        className,
      )}
    >
      {children}
    </span>
  );
}
