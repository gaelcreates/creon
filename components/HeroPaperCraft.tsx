"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

// R3F = client-only (uses WebGL). Lazy-load to keep the home server-render fast
// and avoid SSR errors.
const PaperCraftCanvas = dynamic(() => import("./paperCraft/PaperCraftCanvas"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

/**
 * Hero CREON — bureau de créatif en 3D papier découpé (R3F + GSAP).
 * Étape 1 : Canvas vide + caméra + lights, fond beige. Overlay texte visible.
 * Le contenu 3D s'ajoute progressivement étape par étape (voir paperCraft/).
 */
export function HeroPaperCraft({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#fbf3e2]">
      {/* Couche 3D (absolute, derrière le texte) */}
      <div className="absolute inset-0 z-0">
        <PaperCraftCanvas />
      </div>

      {/* Overlay éditorial — pour étape 1 visible dès le start.
          Sera synchronisé avec la timeline GSAP en étape 10. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: easeOut }}
        className="relative z-10 text-center px-6 lg:px-14 max-w-[1100px] mx-auto pointer-events-none"
      >
        <p className="eyebrow text-noir-doux mb-8 pointer-events-auto">
          {eyebrow}
        </p>

        <h1
          className="font-display font-semibold tracking-[-0.04em] leading-[0.85] text-noir mb-6 pointer-events-auto"
          style={{ fontSize: "clamp(64px, 11vw, 156px)" }}
        >
          {title}
        </h1>

        <p className="lead text-noir-doux max-w-2xl mx-auto pointer-events-auto">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 pointer-events-auto">
          <Link
            href={ctaPrimary.href}
            className={buttonVariants({ variant: "accent", size: "lg" })}
          >
            {ctaPrimary.label}
          </Link>
          {ctaSecondary && (
            <Link
              href={ctaSecondary.href}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}
