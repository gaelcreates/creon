"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { wordReveal, stagger, fadeUp, easeOut } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

export function HeroAnimated({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  const words = title.split(" ");

  return (
    <section className="px-6 lg:px-14 pt-16 pb-20 lg:pt-24 lg:pb-28 max-w-[1320px] mx-auto w-full overflow-hidden">
      <motion.p
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="eyebrow text-noir-doux mb-6"
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        initial="hidden"
        animate="show"
        variants={stagger(0.15, 0.07)}
        className="display-1 max-w-5xl mb-6 leading-[0.92]"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordReveal}
            className="inline-block mr-[0.22em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: easeOut }}
        className="lead text-noir-doux max-w-2xl"
      >
        {subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: easeOut }}
        className="flex flex-wrap gap-3 mt-10"
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

      {/* Animated decorative shape — bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
        className="hidden lg:block absolute pointer-events-none"
        style={{
          right: "5%",
          top: "10%",
          width: 320,
          height: 320,
        }}
      >
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ff7a00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M44.7,-58.3C58.6,-49.4,71.3,-37.4,75.9,-22.9C80.5,-8.5,77,8.5,69.4,22.5C61.7,36.5,49.9,47.5,36.4,55.5C22.9,63.5,7.8,68.5,-7.7,77.6C-23.2,86.7,-39.1,99.9,-49.7,95.5C-60.4,91.1,-65.7,69.1,-69.6,49.5C-73.4,29.9,-75.9,12.7,-74.4,-3.7C-72.9,-20,-67.5,-35.5,-57.7,-46.3C-47.9,-57,-33.7,-63.1,-19.7,-67.5C-5.6,-71.9,8.4,-74.6,21.7,-71.7C35.1,-68.8,30.8,-67.3,44.7,-58.3Z"
            transform="translate(100 100)"
            fill="url(#g1)"
            stroke="#ff7a00"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
