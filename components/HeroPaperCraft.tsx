"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

// R3F = client-only (WebGL). Lazy-load pour SSR + perfs initiales.
const PaperCraftCanvas = dynamic(() => import("./paperCraft/PaperCraftCanvas"), {
  ssr: false,
  loading: () => null,
});

// Timing global de la timeline GSAP côté Canvas (voir CameraRig.tsx) :
// Phase 1-5 = 0 → 5.5s. Flash transition = 5.5 → 5.65s. Émergence = 5.65 → 7s.
// On révèle le texte juste après le flash, au début de la phase 7.
const TEXT_REVEAL_AT = 5.7; // secondes
const FLASH_AT = 5.5; // secondes
const FLASH_DURATION = 0.3; // secondes

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

/**
 * Hero CREON — bureau de créatif en 3D papier découpé (R3F + GSAP).
 *
 * - Canvas R3F avec timeline GSAP qui pilote la caméra à travers 5 phases.
 * - Overlay HTML synchronisé : texte révélé après le flash (~5.7s).
 * - sessionStorage : si l'utilisateur a déjà vu l'intro, on skip directement.
 * - prefers-reduced-motion : pas de timeline, scene statique, texte immédiat.
 * - Bouton Passer → permet de skip manuellement.
 */
export function HeroPaperCraft({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  const reducedMotion = useReducedMotion() ?? false;
  const [textVisible, setTextVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Setup de la séquence : skip si déjà vu / reduced-motion, sinon timer
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      reducedMotion ||
      sessionStorage.getItem("creon-hero-seen") === "1"
    ) {
      setTextVisible(true);
      setSkipped(true);
      return;
    }

    const flashT = setTimeout(() => {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), FLASH_DURATION * 1000);
    }, FLASH_AT * 1000);

    const revealT = setTimeout(() => {
      setTextVisible(true);
      sessionStorage.setItem("creon-hero-seen", "1");
    }, TEXT_REVEAL_AT * 1000);

    return () => {
      clearTimeout(flashT);
      clearTimeout(revealT);
    };
  }, [reducedMotion]);

  function handleSkip() {
    setTextVisible(true);
    setSkipped(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("creon-hero-seen", "1");
    }
  }

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#fbf3e2]">
      {/* ─── Canvas R3F (couche 0) ─── */}
      <div className="absolute inset-0 z-0">
        <PaperCraftCanvas reducedMotion={reducedMotion || skipped} />
      </div>

      {/* ─── Flash transition (couche overlay, juste avant la révélation texte) ─── */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FLASH_DURATION / 2, ease: "easeOut" }}
            className="absolute inset-0 z-20 bg-creme pointer-events-none"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ─── Subtle dark overlay pour lisibilité texte (révélé en même temps) ─── */}
      <AnimatePresence>
        {textVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.2, ease: easeOut }}
            className="absolute inset-0 z-10 bg-gradient-to-b from-creme/0 via-creme/40 to-creme/70 pointer-events-none"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ─── Skip button (visible uniquement pendant l'intro) ─── */}
      {!textVisible && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-30 mono-meta text-noir-doux hover:text-noir px-3 py-1.5 rounded-md bg-creme-clair/80 backdrop-blur border border-noir/15 transition-colors"
        >
          Passer →
        </button>
      )}

      {/* ─── Editorial content (révélé après le flash) ─── */}
      <AnimatePresence>
        {textVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: easeOut }}
            className="relative z-20 text-center px-6 lg:px-14 max-w-[1100px] mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
              className="eyebrow text-noir-doux mb-8"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
              className="font-display font-semibold tracking-[-0.04em] leading-[0.85] text-noir mb-6"
              style={{ fontSize: "clamp(64px, 11vw, 156px)" }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: easeOut }}
              className="lead text-noir-doux max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: easeOut }}
              className="flex flex-wrap items-center justify-center gap-3 mt-10"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scroll indicator (apparait après le texte) ─── */}
      {textVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="mono-meta text-noir-doux">Défile</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-noir-doux"
          />
        </motion.div>
      )}
    </section>
  );
}
