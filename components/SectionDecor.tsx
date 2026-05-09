"use client";

import { motion } from "framer-motion";

type Variant =
  | "calendar"
  | "documents"
  | "portraits"
  | "shop"
  | "camera"
  | "feed"
  | "manifesto"
  | "envelope"
  | "form";

type Props = {
  variant: Variant;
  className?: string;
};

/**
 * Animated decorative SVG positioned absolutely in a hero section.
 * Subtle, slow-motion, accent orange color, low opacity.
 */
export function SectionDecor({ variant, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-[180px] h-[180px] lg:w-[260px] lg:h-[260px] opacity-90 ${className}`}
    >
      {variant === "calendar" && <CalendarDecor />}
      {variant === "documents" && <DocumentsDecor />}
      {variant === "portraits" && <PortraitsDecor />}
      {variant === "shop" && <ShopDecor />}
      {variant === "camera" && <CameraDecor />}
      {variant === "feed" && <FeedDecor />}
      {variant === "manifesto" && <ManifestoDecor />}
      {variant === "envelope" && <EnvelopeDecor />}
      {variant === "form" && <FormDecor />}
    </div>
  );
}

function CalendarDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.g
        animate={{ rotate: [0, 4, -2, 0] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      >
        <rect
          x="40"
          y="50"
          width="120"
          height="110"
          rx="12"
          fill="none"
          stroke="#100609"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        {/* Header strip */}
        <rect x="40" y="50" width="120" height="22" rx="12" fill="#ff7a00" fillOpacity="0.85" />
        <line x1="40" y1="72" x2="160" y2="72" stroke="#100609" strokeWidth="1.5" strokeOpacity="0.35" />
        {/* Grid dots */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => {
            const i = row * 6 + col;
            const isHighlight = i === 14;
            return (
              <motion.circle
                key={i}
                cx={52 + col * 19}
                cy={88 + row * 14}
                r={isHighlight ? 4 : 2}
                fill={isHighlight ? "#ff7a00" : "#100609"}
                fillOpacity={isHighlight ? 1 : 0.25}
                animate={
                  isHighlight
                    ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }
                    : undefined
                }
                transition={
                  isHighlight
                    ? { duration: 2.5, ease: "easeInOut", repeat: Infinity }
                    : undefined
                }
              />
            );
          }),
        )}
      </motion.g>
    </svg>
  );
}

function DocumentsDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {[2, 1, 0].map((i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -4, 0], rotate: [0, i % 2 ? -1 : 1, 0] }}
          transition={{
            duration: 8 + i * 2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.4,
          }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <rect
            x={50 - i * 8}
            y={40 + i * 8}
            width="100"
            height="130"
            rx="6"
            fill="#faf3e0"
            stroke="#100609"
            strokeWidth="1.5"
            strokeOpacity={0.5 - i * 0.1}
          />
          {i === 0 && (
            <>
              <line x1="62" y1="64" x2="138" y2="64" stroke="#ff7a00" strokeWidth="3" strokeLinecap="round" />
              <line x1="62" y1="80" x2="130" y2="80" stroke="#100609" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="62" y1="92" x2="138" y2="92" stroke="#100609" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="62" y1="104" x2="120" y2="104" stroke="#100609" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="62" y1="120" x2="138" y2="120" stroke="#100609" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="62" y1="132" x2="100" y2="132" stroke="#100609" strokeWidth="1" strokeOpacity="0.3" />
            </>
          )}
        </motion.g>
      ))}
    </svg>
  );
}

function PortraitsDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {[
        { cx: 60, cy: 90, delay: 0 },
        { cx: 130, cy: 70, delay: 0.4 },
        { cx: 100, cy: 130, delay: 0.8 },
      ].map((p, i) => (
        <motion.g
          key={i}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.6, 0.95, 0.6],
          }}
          transition={{
            duration: 4 + i,
            ease: "easeInOut",
            repeat: Infinity,
            delay: p.delay,
          }}
          style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
        >
          {/* Avatar circle */}
          <circle cx={p.cx} cy={p.cy} r="32" fill="#ede0c4" stroke="#100609" strokeWidth="1.5" strokeOpacity="0.4" />
          {/* Initials */}
          <text
            x={p.cx}
            y={p.cy + 6}
            fontSize="20"
            textAnchor="middle"
            fill="#100609"
            fillOpacity="0.5"
            fontFamily="Inter Tight, sans-serif"
            fontWeight="600"
          >
            {["NK", "SB", "MS"][i]}
          </text>
        </motion.g>
      ))}
      {/* Connecting lines */}
      <motion.g
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <line x1="60" y1="90" x2="130" y2="70" stroke="#ff7a00" strokeWidth="1" />
        <line x1="130" y1="70" x2="100" y2="130" stroke="#ff7a00" strokeWidth="1" />
        <line x1="100" y1="130" x2="60" y2="90" stroke="#ff7a00" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

function ShopDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Tag shape */}
        <path
          d="M50 60 L120 60 L160 100 L120 140 L50 140 Z"
          fill="#ff7a00"
          fillOpacity="0.85"
          stroke="#100609"
          strokeWidth="1.5"
        />
        <circle cx="135" cy="100" r="6" fill="#100609" />
        {/* Price text */}
        <text
          x="80"
          y="108"
          fontSize="22"
          fontFamily="Inter Tight, sans-serif"
          fontWeight="600"
          fill="#100609"
        >
          €
        </text>
      </motion.g>
      {/* Smaller secondary tag */}
      <motion.g
        animate={{ y: [0, 6, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        style={{ transformOrigin: "60px 170px" }}
      >
        <path
          d="M30 150 L70 150 L90 170 L70 190 L30 190 Z"
          fill="none"
          stroke="#100609"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
      </motion.g>
    </svg>
  );
}

function CameraDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      >
        {/* Camera body */}
        <rect
          x="40"
          y="70"
          width="120"
          height="80"
          rx="8"
          fill="#faf3e0"
          stroke="#100609"
          strokeWidth="1.5"
        />
        {/* Top viewfinder bump */}
        <rect x="80" y="58" width="30" height="14" rx="4" fill="#100609" fillOpacity="0.85" />
        {/* Lens outer */}
        <circle cx="100" cy="110" r="28" fill="#ede0c4" stroke="#100609" strokeWidth="1.5" />
        {/* Lens inner */}
        <motion.circle
          cx="100"
          cy="110"
          r="20"
          fill="none"
          stroke="#ff7a00"
          strokeWidth="2"
          animate={{ r: [20, 16, 20] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        />
        <circle cx="100" cy="110" r="10" fill="#100609" />
        <circle cx="106" cy="104" r="3" fill="#faf3e0" fillOpacity="0.6" />
        {/* Indicator dot */}
        <motion.circle
          cx="142"
          cy="84"
          r="3"
          fill="#ff7a00"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.g>
    </svg>
  );
}

function FeedDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={40}
          y={50 + i * 35}
          width="120"
          height="22"
          rx="11"
          fill={i === 0 ? "#ff7a00" : "#faf3e0"}
          fillOpacity={i === 0 ? 0.85 : 1}
          stroke="#100609"
          strokeWidth="1.5"
          strokeOpacity={0.5}
          animate={{
            x: [40, 44, 40],
            opacity: [1, 0.85, 1],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      {/* Lines inside cards */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={52}
          y1={61 + i * 35}
          x2={52 + 50 + (i % 2) * 30}
          y2={61 + i * 35}
          stroke={i === 0 ? "#100609" : "#100609"}
          strokeOpacity={i === 0 ? 0.7 : 0.3}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      {/* Connecting "wave" */}
      <motion.path
        d="M30 175 Q70 165 100 175 T170 175"
        fill="none"
        stroke="#ff7a00"
        strokeWidth="2"
        strokeOpacity="0.5"
        strokeLinecap="round"
        animate={{
          d: [
            "M30 175 Q70 165 100 175 T170 175",
            "M30 175 Q70 185 100 175 T170 175",
            "M30 175 Q70 165 100 175 T170 175",
          ],
        }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      />
    </svg>
  );
}

function ManifestoDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 100 + Math.cos(angle) * 50;
          const y1 = 100 + Math.sin(angle) * 50;
          const x2 = 100 + Math.cos(angle) * 80;
          const y2 = 100 + Math.sin(angle) * 80;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#100609"
              strokeWidth="2"
              strokeOpacity={0.4}
              strokeLinecap="round"
            />
          );
        })}
      </motion.g>
      <motion.circle
        cx="100"
        cy="100"
        r="32"
        fill="#ff7a00"
        fillOpacity="0.85"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      />
      <text
        x="100"
        y="108"
        fontSize="28"
        textAnchor="middle"
        fill="#100609"
        fontFamily="Inter Tight, sans-serif"
        fontWeight="700"
      >
        ◉
      </text>
    </svg>
  );
}

function EnvelopeDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.g
        animate={{ y: [0, -4, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      >
        {/* Envelope body */}
        <rect
          x="40"
          y="70"
          width="120"
          height="80"
          rx="6"
          fill="#faf3e0"
          stroke="#100609"
          strokeWidth="1.5"
        />
        {/* Flap (closed) */}
        <path
          d="M40 76 L100 120 L160 76"
          fill="none"
          stroke="#100609"
          strokeWidth="1.5"
        />
      </motion.g>
      {/* Envelope opening — letter peeking */}
      <motion.rect
        x="60"
        y="55"
        width="80"
        height="30"
        rx="2"
        fill="#ff7a00"
        fillOpacity="0.85"
        stroke="#100609"
        strokeWidth="1.5"
        animate={{ y: [55, 50, 55] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: 1 }}
      />
      <line x1="68" y1="65" x2="132" y2="65" stroke="#100609" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="68" y1="73" x2="120" y2="73" stroke="#100609" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

function FormDecor() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Card */}
        <rect
          x="40"
          y="40"
          width="120"
          height="130"
          rx="8"
          fill="#faf3e0"
          stroke="#100609"
          strokeWidth="1.5"
        />
        {/* Form fields */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line
              x1="55"
              y1={60 + i * 26}
              x2="100"
              y2={60 + i * 26}
              stroke="#100609"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <rect
              x="55"
              y={66 + i * 26}
              width="90"
              height="14"
              rx="3"
              fill="none"
              stroke="#100609"
              strokeWidth="1"
              strokeOpacity={i === 1 ? 0.7 : 0.3}
            />
          </g>
        ))}
        {/* Submit button */}
        <motion.rect
          x="55"
          y="140"
          width="50"
          height="20"
          rx="10"
          fill="#ff7a00"
          stroke="#100609"
          strokeWidth="1.5"
          animate={{ x: [55, 53, 55] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        />
        <text
          x="80"
          y="153"
          fontSize="9"
          textAnchor="middle"
          fill="#100609"
          fontFamily="Inter Tight, sans-serif"
          fontWeight="600"
        >
          →
        </text>
      </motion.g>
    </svg>
  );
}
