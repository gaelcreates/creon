import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
};

/**
 * Card style "collage" : feuille posée avec ombre papier marquée et radius
 * légèrement asymétrique (0.5-1px de variation, imperceptible mais casse le
 * carré parfait du SaaS clean).
 *
 * - border-[1.5px] : trait de stylo, pas la bordure 1px de form HTML
 * - rounded-tl/tr/br/bl différents : asymétrie subtile
 * - shadow papier : offset solide (3-4px) + diffuse derrière, comme une
 *   vraie feuille posée sur le bureau (pas un drop-shadow centré SaaS)
 * - hover : décale d'un demi-pixel et resserre l'ombre = effet "soulevée"
 */
export function Card({ className, children, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        "relative bg-creme-clair border-[1.5px] border-noir",
        "rounded-tl-[14px] rounded-tr-[10px] rounded-br-[16px] rounded-bl-[12px]",
        "shadow-[3px_4px_0_rgba(16,6,9,0.08),_5px_7px_18px_-4px_rgba(16,6,9,0.08)]",
        hoverable &&
          "transition-all duration-200 ease-out " +
            "hover:-translate-y-0.5 hover:translate-x-[1px] " +
            "hover:border-accent " +
            "hover:shadow-[2px_3px_0_rgba(255,122,0,0.18),_4px_6px_14px_-2px_rgba(16,6,9,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
