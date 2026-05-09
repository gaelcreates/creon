"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Per brief: démarre VIDE avec curseur, puis typewriter en boucle sur des
// exemples concrets (noms de créateurs > catégories abstraites).
const EXAMPLES = [
  "Léa Dupont",
  "Marc Henchoz",
  "Studio Brut",
  "Camille Studio",
  "Nora Kessler",
  "Sami Béhar",
  "Mira Sallinen",
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 50;
const PAUSE_AFTER_TYPE = 2500;
const PAUSE_AFTER_DELETE = 400;

type Props = {
  defaultValue?: string;
};

export function CreatorsHeroSearch({ defaultValue = "" }: Props) {
  // Start empty with blinking cursor — no text until the first character is typed.
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">(
    "typing",
  );
  const [exampleIdx, setExampleIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (focused) return; // Stop animation when user is interacting

    const target = EXAMPLES[exampleIdx];

    if (phase === "pausing") {
      timeoutRef.current = setTimeout(
        () => {
          if (text === target) {
            setPhase("deleting");
          } else {
            setPhase("typing");
          }
        },
        text === target ? PAUSE_AFTER_TYPE : PAUSE_AFTER_DELETE,
      );
    } else if (phase === "typing") {
      if (text.length < target.length) {
        timeoutRef.current = setTimeout(() => {
          setText(target.slice(0, text.length + 1));
        }, TYPING_SPEED);
      } else {
        setPhase("pausing");
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setText(text.slice(0, -1));
        }, DELETING_SPEED);
      } else {
        setExampleIdx((i) => (i + 1) % EXAMPLES.length);
        setPhase("pausing");
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, phase, exampleIdx, focused]);

  function handleFocus() {
    setFocused(true);
    if (inputRef.current && !defaultValue) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="relative">
      {!focused && (
        <button
          type="button"
          onClick={() => {
            inputRef.current?.focus();
          }}
          aria-label="Cliquer pour chercher"
          className="absolute inset-0 z-10 cursor-text bg-transparent flex items-center px-6 lg:px-10 text-left"
        >
          <span className="display-1 leading-[0.92] tracking-[-0.025em] text-noir">
            {text}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              className="inline-block w-[0.06em] h-[0.85em] ml-1 align-baseline bg-accent translate-y-[0.05em]"
              aria-hidden
            />
          </span>
        </button>
      )}

      <form
        action="/createurs"
        method="get"
        className="relative"
      >
        <input
          ref={inputRef}
          type="search"
          name="q"
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={(e) => {
            if (!e.currentTarget.value) {
              setFocused(false);
            }
          }}
          placeholder="Chercher un créateur, une discipline, une ville…"
          className="w-full px-6 lg:px-10 py-6 lg:py-8 border-2 border-noir bg-creme-clair rounded-2xl font-display font-semibold text-[clamp(48px,7vw,88px)] tracking-[-0.025em] leading-[0.92] text-noir placeholder:text-noir-doux/40 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all duration-200 [&::-webkit-search-cancel-button]:hidden"
          autoComplete="off"
        />
        {focused && (
          <button
            type="submit"
            aria-label="Chercher"
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-noir text-creme flex items-center justify-center hover:bg-noir-doux transition-colors text-xl"
          >
            →
          </button>
        )}
      </form>
      <p className="mono-meta text-noir-doux mt-3 px-1">
        ↑ Tape pour chercher · ou pioche dans les filtres en dessous
      </p>
    </div>
  );
}
