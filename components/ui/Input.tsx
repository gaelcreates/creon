import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 border-2 border-noir bg-creme",
        "font-body text-base text-noir placeholder:text-noir-doux/60",
        "focus:outline-none focus:border-accent focus:bg-creme-fonce",
        "transition-colors duration-150",
        className,
      )}
      {...props}
    />
  );
}
