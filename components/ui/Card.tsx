import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
};

export function Card({ className, children, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        "border border-noir bg-creme-clair rounded-lg",
        hoverable &&
          "transition-all duration-150 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_-8px_rgba(16,6,9,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
