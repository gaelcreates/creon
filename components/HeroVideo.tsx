"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

type Props = {
  /** /hero/intro.mp4 (H.264 web-optimized) */
  videoSrc: string;
  /** /hero/intro.webm (VP9 fallback for slower devices) */
  webmSrc?: string;
  /** /hero/intro-poster.jpg (last frame static, shown before video plays) */
  posterSrc?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Seconds to wait before showing text overlay (default 5.5s = duration of intro before loop) */
  textRevealDelay?: number;
  /** Rendered when the video file fails to load (e.g. file not yet uploaded). */
  fallback?: React.ReactNode;
};

/**
 * Hero with looping background video + editorial text overlay.
 * Drop your video files in /public/hero/ — see public/hero/README.md
 */
export function HeroVideo({
  videoSrc,
  webmSrc,
  posterSrc,
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  textRevealDelay = 5.5,
  fallback,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // If video fails to load AND a fallback is provided, render that instead
  if (videoFailed && fallback) {
    return <>{fallback}</>;
  }

  // Check if user has seen the intro (sessionStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("creon-hero-seen") === "1") {
      setTextVisible(true);
      setSkipped(true);
    }
  }, []);

  // Reveal text after first cycle (or immediately if skipped)
  useEffect(() => {
    if (skipped || textVisible) return;
    const t = setTimeout(() => {
      setTextVisible(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("creon-hero-seen", "1");
      }
    }, textRevealDelay * 1000);
    return () => clearTimeout(t);
  }, [skipped, textVisible, textRevealDelay]);

  function handleSkip() {
    setSkipped(true);
    setTextVisible(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("creon-hero-seen", "1");
    }
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration ?? 0;
    }
  }

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-noir">
      {/* Video background */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          poster={posterSrc}
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Subtle dark overlay for text legibility once revealed */}
      <AnimatePresence>
        {textVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: easeOut }}
            className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/40 to-noir/70"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Skip button */}
      {!textVisible && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 mono-meta text-creme/70 hover:text-creme z-30 px-3 py-1.5 rounded-md bg-noir/30 backdrop-blur border border-creme/20 transition-colors"
        >
          Passer →
        </button>
      )}

      {/* Editorial content overlay */}
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
              className="eyebrow text-creme/80 mb-8"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
              className="font-display font-semibold tracking-[-0.04em] leading-[0.85] text-creme mb-6 drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
              style={{ fontSize: "clamp(64px, 11vw, 156px)" }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: easeOut }}
              className="lead text-creme/85 max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
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
                  className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-md transition-all duration-150 ease-out cursor-pointer px-5 py-2.5 text-[15px] bg-creme/10 backdrop-blur text-creme border border-creme/30 hover:bg-creme hover:text-noir"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      {textVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="mono-meta text-creme/70">Défile</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-creme/70"
          />
        </motion.div>
      )}
    </section>
  );
}
