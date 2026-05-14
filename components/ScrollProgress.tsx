"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type SectionInfo = {
  id: string;
  /** Position 0-1 = top de la section / hauteur scrollable du document */
  position: number;
};

/**
 * Indicateur de scroll vertical, fixé à droite.
 *
 * - Track gris fin
 * - Barre orange qui se remplit selon le scrollYProgress global
 * - Curseur orange (point) qui glisse en suivant le scroll
 * - Un point orange par section détectée dans le DOM ; le point grossit
 *   et brille quand on entre dans la section correspondante
 *
 * Recalcul auto des sections à chaque navigation (dépendance pathname),
 * et IntersectionObserver pour suivre quelle section est active.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Barre orange : scaleY de 0 à 1
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Curseur qui glisse : top en pourcentage (0% → 100% de la barre)
  const cursorTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const cursorTopSpring = useSpring(cursorTop, {
    stiffness: 120,
    damping: 30,
  });

  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    function calculate() {
      // Récupère les <section> top-level visibles avec un peu de hauteur
      const els = Array.from(
        document.querySelectorAll("main section, body section"),
      ).filter((el): el is HTMLElement => {
        if (!(el instanceof HTMLElement)) return false;
        // Ignore sections trop petites (séparateurs, sticky bars, etc.)
        return el.offsetHeight > 200;
      });

      // Garantit un id sur chaque section pour pouvoir les tracker
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

      // (re)setup IntersectionObserver pour détecter la section active
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          // Prend la section avec le plus gros ratio d'intersection
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          threshold: [0.25, 0.5, 0.75],
          rootMargin: "-20% 0px -30% 0px",
        },
      );
      els.forEach((el) => observer?.observe(el));
    }

    // Petit délai pour que les sections soient bien rendues (R3F lazy, fonts swap, etc.)
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
      className="fixed right-3 top-1/2 -translate-y-1/2 h-[40vh] w-[16px] z-30 hidden md:block pointer-events-none"
    >
      {/* Track + barre orange (largeur 3px centrée) */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px]">
        <div className="absolute inset-0 bg-noir/10 rounded-full" />
        <motion.div
          className="absolute top-0 left-0 right-0 bg-accent rounded-full origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>

      {/* Curseur qui suit le scroll */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,122,0,0.55)]"
        style={{
          top: cursorTopSpring,
          y: "-50%",
        }}
      />

      {/* Points fixes : un par section. Grossissent quand actifs. */}
      {sections.map((sec) => {
        const isActive = sec.id === activeId;
        return (
          <motion.div
            key={sec.id}
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-accent border-2 border-creme"
            style={{
              top: `${sec.position * 100}%`,
              y: "-50%",
            }}
            animate={{
              width: isActive ? 14 : 7,
              height: isActive ? 14 : 7,
              boxShadow: isActive
                ? "0 0 18px rgba(255,122,0,0.75)"
                : "0 0 0 rgba(255,122,0,0)",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
