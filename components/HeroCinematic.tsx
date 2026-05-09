"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax on hero content as user scrolls
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-creme"
    >
      <AmbientBackground />

      {/* Subtle grid for depth perception */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,6,9,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,6,9,1) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6 lg:px-14 max-w-[1100px] mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: easeOut }}
          className="eyebrow text-noir-doux mb-8"
        >
          {eyebrow}
        </motion.p>

        {/* Wordmark cinematic 3D entry */}
        <div
          className="relative"
          style={{ perspective: 1200, perspectiveOrigin: "50% 60%" }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 6,
              rotateX: -25,
              filter: "blur(20px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
            className="relative inline-block"
          >
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.85] text-noir"
              style={{
                fontSize: "clamp(80px, 16vw, 220px)",
              }}
            >
              CREON
            </h1>
            {/* Glow halo */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="absolute -inset-8 -z-10 blur-3xl rounded-full bg-accent/10"
            />
          </motion.div>
        </div>

        {/* Title (reveal after wordmark) */}
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1.6, ease: easeOut }}
          className="display-2 mt-8 max-w-3xl mx-auto"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.0, ease: easeOut }}
          className="lead text-noir-doux mt-6 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3, ease: easeOut }}
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
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
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
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Blob 1 — orange warm, top-left */}
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
            "radial-gradient(circle, rgba(255,122,0,0.18) 0%, rgba(255,122,0,0) 70%)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 100, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {/* Blob 2 — beige deep, bottom-right */}
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
            "radial-gradient(circle, rgba(228,212,173,0.55) 0%, rgba(228,212,173,0) 70%)",
        }}
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 28,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {/* Blob 3 — soft accent, center */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: 600,
          maxHeight: 600,
          top: "30%",
          right: "20%",
          background:
            "radial-gradient(circle, rgba(255,122,0,0.08) 0%, rgba(255,122,0,0) 70%)",
        }}
        animate={{
          scale: [1, 1.25, 0.95, 1],
          opacity: [0.6, 1, 0.8, 0.6],
        }}
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {/* Blob 4 — noir touch */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "30vw",
          height: "30vw",
          maxWidth: 500,
          maxHeight: 500,
          top: "20%",
          left: "30%",
          background:
            "radial-gradient(circle, rgba(16,6,9,0.05) 0%, rgba(16,6,9,0) 70%)",
        }}
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -40, 60, 0],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute w-1 h-1 rounded-full bg-noir/15"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + (i % 4) * 2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}
