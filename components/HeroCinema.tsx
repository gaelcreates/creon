"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

// Lazy-load le Canvas (WebGL = client-only)
const CinemaCanvas = dynamic(() => import("./cinemaStage/CinemaCanvas"), {
  ssr: false,
  loading: () => null,
});

// Timing global (synchronisé avec CameraRig.tsx) :
//   00.0 → 09.0 : timeline 3D (phases 1-7)
//   09.0 → 09.5 : DEVELOP (flash blanc + scene fades)
//   09.5 → 10.2 : REVEAL (CREON s'écrit)
//   10.2 → 11.7 : SETTLED (overlay éditorial complet)
const FLASH_AT = 9.0;
const FLASH_DURATION = 0.5;
const REVEAL_AT = 9.4;
const TEXT_AT = 10.4;

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

/**
 * Hero CREON v07 — plateau de tournage cinéma stylisé en R3F + GSAP.
 *
 * 10 phases :
 *   01-07 (R3F) : timeline caméra dans la scène 3D
 *   08 DEVELOP  : flash blanc + fade scene (HTML)
 *   09 REVEAL   : "CREON" s'écrit au feutre (SVG handwriting)
 *   10 SETTLED  : éditorial complet (eyebrow / titre / sous-titre / CTAs)
 *
 * - sessionStorage : si l'utilisateur a déjà vu, skip direct
 * - prefers-reduced-motion : pas de timeline, état final immédiat
 * - bouton Passer → manuel
 */
export function HeroCinema({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  const reducedMotion = useReducedMotion() ?? false;
  const [stage, setStage] = useState<"intro" | "flash" | "reveal" | "settled">(
    "intro",
  );
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      reducedMotion ||
      sessionStorage.getItem("creon-hero-seen") === "1"
    ) {
      setStage("settled");
      setSkipped(true);
      return;
    }

    const flashT = setTimeout(() => setStage("flash"), FLASH_AT * 1000);
    const revealT = setTimeout(() => setStage("reveal"), REVEAL_AT * 1000);
    const settledT = setTimeout(() => {
      setStage("settled");
      sessionStorage.setItem("creon-hero-seen", "1");
    }, TEXT_AT * 1000);

    return () => {
      clearTimeout(flashT);
      clearTimeout(revealT);
      clearTimeout(settledT);
    };
  }, [reducedMotion]);

  function handleSkip() {
    setStage("settled");
    setSkipped(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("creon-hero-seen", "1");
    }
  }

  const showCanvas = stage !== "settled" || skipped;

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#f5ead5]">
      {/* ─── Canvas R3F (layer 0) — fade out après le flash ─── */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: stage === "reveal" || stage === "settled" ? 0 : 1,
        }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-0"
      >
        {showCanvas && <CinemaCanvas reducedMotion={reducedMotion} />}
      </motion.div>

      {/* ─── DEVELOP : flash blanc plein écran (phase 08) ─── */}
      <AnimatePresence>
        {stage === "flash" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FLASH_DURATION / 2, ease: "easeOut" }}
            className="absolute inset-0 z-20 bg-[#fbf3e2] pointer-events-none"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ─── REVEAL : "CREON" s'écrit au feutre (phase 09) ─── */}
      <AnimatePresence>
        {stage === "reveal" && <CreonHandwriting />}
      </AnimatePresence>

      {/* ─── Skip button (visible pendant l'intro) ─── */}
      {stage !== "settled" && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-30 mono-meta text-noir-doux hover:text-noir px-3 py-1.5 rounded-md bg-creme-clair/80 backdrop-blur border border-noir/15 transition-colors"
        >
          Passer →
        </button>
      )}

      {/* ─── SETTLED : éditorial complet (phase 10) ─── */}
      <AnimatePresence>
        {stage === "settled" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: easeOut }}
            className="relative z-20 text-center px-6 lg:px-14 max-w-[1100px] mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
              className="eyebrow text-noir-doux mb-8"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.6, ease: easeOut }}
              className="font-display font-semibold tracking-[-0.04em] leading-[0.85] text-noir mb-6"
              style={{ fontSize: "clamp(64px, 11vw, 156px)" }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: easeOut }}
              className="lead text-noir-doux max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3, ease: easeOut }}
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
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scroll indicator (après le settled) ─── */}
      {stage === "settled" && (
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

/**
 * "CREON" qui s'écrit au feutre — SVG handwriting animé via pathLength.
 * Phase 09 du storyboard. ~1s d'écriture, puis disparaît dans la phase 10
 * (recouvert par le titre éditorial centré).
 */
function CreonHandwriting() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <svg
        viewBox="0 0 600 200"
        className="w-[80vw] max-w-[800px] h-auto"
        style={{ filter: "drop-shadow(2px 3px 0 rgba(16,6,9,0.15))" }}
      >
        {/* Cinq lettres "CREON" tracées au feutre orange — paths simplifiés */}
        <motion.path
          d="M 100,30 Q 60,30 60,100 Q 60,170 100,170 L 140,170"
          stroke="#ff7a00"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
        <motion.path
          d="M 175,170 L 175,30 L 225,30 Q 265,30 265,70 Q 265,110 225,110 L 175,110 M 225,110 L 265,170"
          stroke="#ff7a00"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.32, delay: 0.18, ease: "easeOut" }}
        />
        <motion.path
          d="M 300,170 L 300,30 L 380,30 M 300,100 L 360,100 M 300,170 L 380,170"
          stroke="#ff7a00"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.42, ease: "easeOut" }}
        />
        <motion.path
          d="M 450,100 Q 450,30 415,30 Q 380,30 380,100 Q 380,170 415,170 Q 450,170 450,100 Z"
          stroke="#ff7a00"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.32, delay: 0.66, ease: "easeOut" }}
        />
        <motion.path
          d="M 485,170 L 485,30 L 555,170 L 555,30"
          stroke="#ff7a00"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.34, delay: 0.9, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
