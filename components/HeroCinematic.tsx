"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
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

export function HeroCinematic({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  const [introDone, setIntroDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Auto-skip if user has already seen intro this session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("creon-hero-seen");
    if (seen === "1") {
      setIntroDone(true);
      setSkipped(true);
    }
  }, []);

  function handleComplete() {
    setIntroDone(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("creon-hero-seen", "1");
    }
  }

  function handleSkip() {
    setIntroDone(true);
    setSkipped(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("creon-hero-seen", "1");
    }
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-creme"
    >
      {/* Three.js intro scene — absolute, fades out when done */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
            className="absolute inset-0 z-20"
          >
            <Suspense fallback={null}>
              <HeroScene3D onComplete={handleComplete} />
            </Suspense>
            <button
              onClick={handleSkip}
              className="absolute top-6 right-6 mono-meta text-noir-doux hover:text-noir z-30 px-3 py-1.5 rounded-md bg-creme-clair/80 backdrop-blur border border-noir/15 transition-colors"
            >
              Passer →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient bg under intro and content */}
      <AmbientBackground />

      {/* Subtle grid for depth */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,6,9,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,6,9,1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Editorial content (revealed after intro) */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        initial={{ opacity: skipped ? 1 : 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1, delay: introDone ? 0.6 : 0 }}
        className="relative z-10 text-center px-6 lg:px-14 max-w-[1100px] mx-auto pt-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 12 }}
          transition={{ duration: 0.6, delay: introDone ? 0.7 : 0, ease: easeOut }}
          className="eyebrow text-noir-doux mb-8"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{
            opacity: introDone ? 1 : 0,
            y: introDone ? 0 : 24,
            filter: introDone ? "blur(0px)" : "blur(8px)",
          }}
          transition={{ duration: 0.9, delay: introDone ? 0.9 : 0, ease: easeOut }}
          className="font-display font-semibold tracking-[-0.04em] leading-[0.85] text-noir mb-6"
          style={{
            fontSize: "clamp(64px, 11vw, 156px)",
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 16 }}
          transition={{ duration: 0.7, delay: introDone ? 1.2 : 0, ease: easeOut }}
          className="lead text-noir-doux max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 16 }}
          transition={{ duration: 0.6, delay: introDone ? 1.5 : 0, ease: easeOut }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          <Link
            href={ctaPrimary.href}
            className={buttonVariants({ variant: "primary", size: "lg" })}
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ delay: introDone ? 2 : 0, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="mono-meta text-noir-doux">Défile</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-noir-doux"
        />
      </motion.div>
    </section>
  );
}

function AmbientBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 900,
          maxHeight: 900,
          top: "-15%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(255,122,0,0.15) 0%, rgba(255,122,0,0) 70%)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 100, 0],
        }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "55vw",
          height: "55vw",
          maxWidth: 800,
          maxHeight: 800,
          bottom: "-20%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(228,212,173,0.5) 0%, rgba(228,212,173,0) 70%)",
        }}
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 80, -50, 0],
        }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}
