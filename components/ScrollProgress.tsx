"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden
      className="fixed right-3 top-1/2 -translate-y-1/2 h-[40vh] w-[3px] z-30 hidden md:block pointer-events-none"
    >
      {/* Track */}
      <div className="absolute inset-0 bg-noir/8 rounded-full" />
      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-accent rounded-full origin-top"
        style={{ scaleY, height: "100%" }}
      />
      {/* Progress dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,122,0,0.5)]"
        style={{
          top: useSpring(scrollYProgress, {
            stiffness: 120,
            damping: 30,
          }) as never,
          y: "-50%",
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
