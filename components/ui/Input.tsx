import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-3.5 py-2.5 border border-noir bg-creme-clair rounded-md",
        "font-body text-[14px] text-noir placeholder:text-noir-doux/50",
        "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30",
        "disabled:bg-creme-fonce disabled:text-noir-doux disabled:cursor-not-allowed",
        "transition-all duration-150 ease-out",
        className,
      )}
      {...props}
    />
  );
}
