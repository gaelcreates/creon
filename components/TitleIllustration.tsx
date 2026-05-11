"use client";

import { motion } from "framer-motion";

type Variant =
  | "feed"
  | "creators"
  | "events"
  | "productions"
  | "newsletter"
  | "articles";

type Props = {
  variant: Variant;
  className?: string;
};

/**
 * Illustrations papier découpé / collage pour les hero sections des pages
 * publiques principales (Feed, Créateurs, Events, Productions, Newsletter).
 *
 * SVG inline portés depuis le design system v05 (Claude Design). Style :
 * fills plats + stroke noir épais (1.4-1.8), rotations légères, palette
 * du brief (orange #ff7a00, ink #100609, papier #fbf3e2/#ede0c4, accents
 * bleu #2a4a6b, rouge #c63838, jaune #f5c542, vert #5a7a3a).
 *
 * Légère animation de sway (rotation 2-3° en boucle lente) pour donner
 * vie sans distraire. Disabled sur mobile (caché) pour respirer.
 */
export function TitleIllustration({ variant, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -right-6 lg:right-0 top-8 lg:top-1/2 lg:-translate-y-1/2 w-[260px] sm:w-[320px] lg:w-[420px] hidden sm:block ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, 1.5, -1, 0] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        className="w-full h-auto"
      >
        {variant === "feed" && <FeedIllus />}
        {variant === "creators" && <CreatorsIllus />}
        {variant === "events" && <EventsIllus />}
        {variant === "productions" && <ProductionsIllus />}
        {variant === "newsletter" && <NewsletterIllus />}
        {variant === "articles" && <ArticlesIllus />}
      </motion.div>
    </div>
  );
}

// ─── FEED : carte ligneuse + ticket orange + post-it jaune ────────────────
function FeedIllus() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-auto">
      {/* back card — beige */}
      <g transform="rotate(-6 50 70)">
        <rect x="20" y="42" width="62" height="56" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
        <line x1="28" y1="56" x2="74" y2="56" stroke="#3d2a1f" strokeWidth="1.4" />
        <line x1="28" y1="64" x2="68" y2="64" stroke="#3d2a1f" strokeWidth="1.4" />
        <line x1="28" y1="72" x2="72" y2="72" stroke="#3d2a1f" strokeWidth="1.4" />
      </g>
      {/* orange ticket */}
      <g transform="rotate(8 70 38)">
        <path d="M30 22 L96 22 L96 50 L30 50 Z" fill="#ff7a00" stroke="#100609" strokeWidth="1.6" />
        <circle cx="44" cy="36" r="2.5" fill="#100609" />
        <line x1="52" y1="32" x2="86" y2="32" stroke="#100609" strokeWidth="1.4" />
        <line x1="52" y1="40" x2="78" y2="40" stroke="#100609" strokeWidth="1.4" />
      </g>
      {/* post-it jaune */}
      <g transform="rotate(-3 30 95)">
        <rect x="10" y="78" width="38" height="34" fill="#fff5b8" stroke="#100609" strokeWidth="1.4" />
        <line x1="16" y1="88" x2="42" y2="88" stroke="#3d2a1f" strokeWidth="1.2" />
        <line x1="16" y1="95" x2="36" y2="95" stroke="#3d2a1f" strokeWidth="1.2" />
        <line x1="16" y1="102" x2="40" y2="102" stroke="#3d2a1f" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// ─── CREATORS : 3 polaroids sur fil ──────────────────────────────────────
function CreatorsIllus() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-auto">
      {/* fil */}
      <path d="M4 20 Q 80 38, 156 16" stroke="#100609" strokeWidth="1.4" fill="none" />
      {/* polaroid 1 — bleu */}
      <g transform="rotate(-8 30 60)">
        <rect x="10" y="28" width="40" height="50" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
        <rect x="14" y="32" width="32" height="32" fill="#2a4a6b" />
        <circle cx="30" cy="48" r="6" fill="#ffd9b3" />
        <rect x="26" y="22" width="8" height="10" fill="#100609" />
      </g>
      {/* polaroid 2 — rouge */}
      <g transform="rotate(4 80 65)">
        <rect x="60" y="34" width="40" height="50" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
        <rect x="64" y="38" width="32" height="32" fill="#c63838" />
        <circle cx="80" cy="54" r="6" fill="#fbf3e2" />
        <rect x="76" y="28" width="8" height="10" fill="#100609" />
      </g>
      {/* polaroid 3 — vert */}
      <g transform="rotate(-3 130 60)">
        <rect x="110" y="30" width="40" height="50" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
        <rect x="114" y="34" width="32" height="32" fill="#5a7a3a" />
        <circle cx="130" cy="50" r="6" fill="#f5c542" />
        <rect x="126" y="24" width="8" height="10" fill="#100609" />
      </g>
    </svg>
  );
}

// ─── EVENTS : ticket orange déchiré + timbre 2025 ────────────────────────
function EventsIllus() {
  return (
    <svg viewBox="0 0 140 120" className="w-full h-auto">
      {/* ticket principal */}
      <g transform="rotate(-4 70 60)">
        <path d="M10 30 L130 26 L132 90 L8 92 Z" fill="#ff7a00" stroke="#100609" strokeWidth="1.8" />
        <line x1="56" y1="30" x2="58" y2="92" stroke="#100609" strokeWidth="1.4" strokeDasharray="3 3" />
        <text x="28" y="68" fontFamily="Fraunces, serif" fontSize="22" fontWeight="700" fill="#100609">
          15
        </text>
        <text x="28" y="82" fontFamily="monospace" fontSize="8" fill="#100609">
          VEN
        </text>
        <line x1="74" y1="44" x2="120" y2="44" stroke="#100609" strokeWidth="1.4" />
        <line x1="74" y1="56" x2="116" y2="56" stroke="#100609" strokeWidth="1.4" />
        <line x1="74" y1="68" x2="118" y2="68" stroke="#100609" strokeWidth="1.4" />
        <line x1="74" y1="80" x2="100" y2="80" stroke="#100609" strokeWidth="1.4" />
      </g>
      {/* timbre 2025 */}
      <g transform="rotate(-14 28 22)">
        <circle cx="28" cy="22" r="16" fill="none" stroke="#c63838" strokeWidth="1.8" />
        <text x="28" y="26" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#c63838" fontWeight="700">
          2025
        </text>
      </g>
    </svg>
  );
}

// ─── PRODUCTIONS : caméra ciné + clap ────────────────────────────────────
function ProductionsIllus() {
  return (
    <svg viewBox="0 0 140 120" className="w-full h-auto">
      {/* clap derrière */}
      <g transform="rotate(-10 36 80)">
        <rect x="14" y="68" width="50" height="36" fill="#100609" />
        <rect x="14" y="60" width="50" height="12" fill="#fbf3e2" stroke="#100609" strokeWidth="1.4" />
        <line x1="22" y1="60" x2="26" y2="72" stroke="#100609" strokeWidth="1.6" />
        <line x1="32" y1="60" x2="36" y2="72" stroke="#100609" strokeWidth="1.6" />
        <line x1="42" y1="60" x2="46" y2="72" stroke="#100609" strokeWidth="1.6" />
        <line x1="52" y1="60" x2="56" y2="72" stroke="#100609" strokeWidth="1.6" />
      </g>
      {/* caméra ciné */}
      <g transform="rotate(4 90 50)">
        <rect x="56" y="30" width="58" height="42" fill="#fbf3e2" stroke="#100609" strokeWidth="1.8" />
        <path d="M114 38 L134 28 L134 74 L114 64 Z" fill="#fbf3e2" stroke="#100609" strokeWidth="1.8" />
        <circle cx="68" cy="26" r="8" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
        <circle cx="100" cy="26" r="8" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
        <circle cx="68" cy="26" r="3" fill="#100609" />
        <circle cx="100" cy="26" r="3" fill="#100609" />
        <circle cx="124" cy="51" r="3" fill="#ff7a00" />
        <text x="64" y="60" fontFamily="monospace" fontSize="7" fill="#100609">
          REC •
        </text>
      </g>
    </svg>
  );
}

// ─── ARTICLES : magazine ouvert + stylo plume + signet rouge ─────────────
function ArticlesIllus() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-auto">
      {/* magazine ouvert : 2 pages côte à côte, légèrement inclinées */}
      <g transform="rotate(-3 80 70)">
        {/* page gauche */}
        <path
          d="M14 32 L80 28 L80 102 L14 98 Z"
          fill="#fbf3e2"
          stroke="#100609"
          strokeWidth="1.8"
        />
        {/* page droite */}
        <path
          d="M80 28 L146 32 L146 98 L80 102 Z"
          fill="#ede0c4"
          stroke="#100609"
          strokeWidth="1.8"
        />
        {/* pli central (un peu plus marqué) */}
        <line x1="80" y1="28" x2="80" y2="102" stroke="#100609" strokeWidth="1" opacity="0.5" />
        {/* titre de l'article (bandeau orange en haut de la page gauche) */}
        <rect x="22" y="40" width="38" height="6" fill="#ff7a00" />
        {/* lignes de texte page gauche */}
        <line x1="22" y1="56" x2="72" y2="56" stroke="#3d2a1f" strokeWidth="1.3" />
        <line x1="22" y1="64" x2="68" y2="64" stroke="#3d2a1f" strokeWidth="1.3" />
        <line x1="22" y1="72" x2="74" y2="72" stroke="#3d2a1f" strokeWidth="1.3" />
        <line x1="22" y1="80" x2="62" y2="80" stroke="#3d2a1f" strokeWidth="1.3" />
        <line x1="22" y1="88" x2="70" y2="88" stroke="#3d2a1f" strokeWidth="1.3" />
        {/* photo carrée page droite (rectangle plein) */}
        <rect x="86" y="40" width="36" height="28" fill="#2a4a6b" stroke="#100609" strokeWidth="1.4" />
        {/* lignes de texte page droite (sous l'image) */}
        <line x1="86" y1="76" x2="138" y2="76" stroke="#3d2a1f" strokeWidth="1.3" />
        <line x1="86" y1="84" x2="134" y2="84" stroke="#3d2a1f" strokeWidth="1.3" />
        <line x1="86" y1="92" x2="138" y2="92" stroke="#3d2a1f" strokeWidth="1.3" />
      </g>
      {/* signet rouge qui dépasse en haut */}
      <g transform="rotate(8 100 28)">
        <path d="M96 14 L106 14 L106 36 L101 32 L96 36 Z" fill="#c63838" stroke="#100609" strokeWidth="1.4" />
      </g>
      {/* stylo plume incliné posé en travers */}
      <g transform="rotate(28 60 100)">
        {/* corps */}
        <rect x="20" y="98" width="50" height="6" fill="#1a1612" stroke="#100609" strokeWidth="1.4" />
        {/* capuchon */}
        <rect x="68" y="98" width="14" height="6" fill="#ff7a00" stroke="#100609" strokeWidth="1.4" />
        {/* clip métal */}
        <rect x="76" y="96" width="3" height="10" fill="#100609" />
        {/* pointe argentée */}
        <path d="M20 101 L10 101 L20 105 Z" fill="#7a7570" stroke="#100609" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// ─── NEWSLETTER : enveloppe ouverte + lettre + sceau "C" ─────────────────
function NewsletterIllus() {
  return (
    <svg viewBox="0 0 140 120" className="w-full h-auto">
      <g transform="rotate(-3 70 70)">
        <rect x="14" y="50" width="112" height="60" fill="#ede0c4" stroke="#100609" strokeWidth="1.8" />
        {/* lettre qui dépasse */}
        <g transform="rotate(6 70 40)">
          <rect x="30" y="14" width="78" height="46" fill="#fbf3e2" stroke="#100609" strokeWidth="1.6" />
          <line x1="38" y1="26" x2="98" y2="26" stroke="#3d2a1f" strokeWidth="1.4" />
          <line x1="38" y1="34" x2="92" y2="34" stroke="#3d2a1f" strokeWidth="1.4" />
          <line x1="38" y1="42" x2="96" y2="42" stroke="#3d2a1f" strokeWidth="1.4" />
          <line x1="38" y1="50" x2="80" y2="50" stroke="#3d2a1f" strokeWidth="1.4" />
        </g>
        {/* rabats */}
        <path d="M14 50 L70 88 L126 50" fill="none" stroke="#100609" strokeWidth="1.6" />
        {/* sceau cire rouge avec C */}
        <circle cx="70" cy="92" r="9" fill="#c63838" stroke="#100609" strokeWidth="1.4" />
        <text x="70" y="96" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="11" fontWeight="700" fill="#fbf3e2">
          C
        </text>
      </g>
    </svg>
  );
}
