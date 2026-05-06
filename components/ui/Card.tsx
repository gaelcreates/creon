import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "border-2 border-noir bg-creme shadow-[4px_4px_0_var(--color-noir)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
