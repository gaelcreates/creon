"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

// ─── Géométrie de la jauge "liquide" ──────────────────────────────────────
// 18 boules empilées verticalement, tangentes au remplissage maximum.
// Le filtre SVG "goo" fait fusionner les boules entre elles → 1 seul objet
// visuel qui se remplit progressivement (effet métabal / mercure).
const N_BUBBLES = 18;
const BUBBLE_R = 9; // rayon max d'une boule
const BUBBLE_GAP = 18; // distance centre-à-centre = 2 × R → tangentes pleines
const SVG_W = 22;
const SVG_H = (N_BUBBLES - 1) * BUBBLE_GAP + BUBBLE_R * 2;

type SectionInfo = {
  id: string;
  position: number; // 0-1 = top section / docHeight scrollable
};

/**
 * Une boule de la jauge. Son rayon va de 0 à R sur sa "fenêtre" de
 * scrollYProgress. En dehors de la fenêtre, le rayon est clampé (0 avant,
 * R après) → la boule reste pleine une fois le seuil dépassé.
 */
function Bubble({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const cy = BUBBLE_R + index * BUBBLE_GAP;
  const start = index / total;
  const end = (index + 1) / total;
  const r = useTransform(progress, [start, end], [0, BUBBLE_R], {
    clamp: true,
  });
  return <motion.circle cx={SVG_W / 2} cy={cy} r={r} fill="#ff7a00" />;
}

/**
 * Indicateur de scroll vertical, fixé à droite.
 *
 * 1. Jauge liquide (SVG + filtre goo) : 18 boules orange qui se forment
 *    une par une à mesure que la page scrolle ; le filtre les fusionne
 *    en un seul "blob" continu façon mercure.
 * 2. Marqueurs noirs (un par section) à gauche de la jauge ; le marqueur
 *    actif grossit doucement (pas de halo, pas de glow).
 *
 * Pas d'effet lumineux sur la jauge : c'est juste de l'orange plein qui
 * remplit. Fluide. Propre.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Spring pour amortir et garder le mouvement fluide même sur scroll rapide
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    function calculate() {
      const els = Array.from(
        document.querySelectorAll("main section, body section"),
      ).filter(
        (el): el is HTMLElement =>
          el instanceof HTMLElement && el.offsetHeight > 200,
      );
      els.forEach((el, i) => {
        if (!el.id) el.id = `sp-section-${i}`;
      });
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const computed: SectionInfo[] =
        docHeight > 0
          ? els.map((el) => ({
              id: el.id,
              position: Math.min(1, Math.max(0, el.offsetTop / docHeight)),
            }))
          : [];
      setSections(computed);

      if (observer) observer.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) setActiveId(visible[0].target.id);
        },
        {
          threshold: [0.25, 0.5, 0.75],
          rootMargin: "-20% 0px -30% 0px",
        },
      );
      els.forEach((el) => observer?.observe(el));
    }

    rafId = requestAnimationFrame(() => {
      setTimeout(calculate, 100);
    });
    window.addEventListener("resize", calculate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", calculate);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden md:block pointer-events-none"
      style={{ height: SVG_H, width: SVG_W + 18 }}
    >
      {/* ─── Marqueurs de section (à gauche de la jauge, discrets) ─── */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{ width: 12 }}
      >
        {sections.map((sec) => {
          const isActive = sec.id === activeId;
          return (
            <motion.div
              key={sec.id}
              className="absolute left-0 rounded-full bg-noir"
              style={{
                top: `${sec.position * 100}%`,
                y: "-50%",
              }}
              animate={{
                width: isActive ? 8 : 4,
                height: isActive ? 8 : 4,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          );
        })}
      </div>

      {/* ─── Jauge liquide (SVG + goo filter) ─── */}
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="absolute top-0 right-0"
      >
        <defs>
          {/*
            Filtre "goo" classique : un blur fort + une matrice de couleur
            qui ré-amplifie l'alpha → les pixels semi-transparents (issus
            du blur) deviennent opaques. Effet : les boules voisines fusionnent
            en un seul blob continu.
          */}
          <filter id="sp-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
            <feColorMatrix
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 22 -11
              "
            />
          </filter>
        </defs>
        <g filter="url(#sp-goo)">
          {Array.from({ length: N_BUBBLES }, (_, i) => (
            <Bubble
              key={i}
              index={i}
              total={N_BUBBLES}
              progress={progress}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
