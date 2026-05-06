"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Option = { id: string; label: string; sublabel?: string };

type Props = {
  name: string;
  options: Option[];
  initial?: string[];
  max?: number;
  emptyLabel?: string;
};

export function MultiPicker({
  name,
  options,
  initial = [],
  max = 6,
  emptyLabel = "Aucun choix disponible",
}: Props) {
  const [selected, setSelected] = useState<string[]>(initial);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= max) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }

  if (options.length === 0) {
    return (
      <p className="font-body text-sm text-noir-doux italic px-3 py-2 border-2 border-dashed border-noir/30">
        {emptyLabel}
      </p>
    );
  }

  return (
    <>
      <div className="border-2 border-noir bg-creme max-h-72 overflow-y-auto">
        {options.map((opt, i) => {
          const active = selected.includes(opt.id);
          const order = active ? selected.indexOf(opt.id) + 1 : null;
          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left border-b border-noir/20 last:border-0 transition-colors",
                active
                  ? "bg-accent text-noir"
                  : i % 2 === 1
                    ? "bg-creme-fonce/30 hover:bg-creme-fonce"
                    : "hover:bg-creme-fonce/60",
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 border-2 border-noir flex items-center justify-center font-display text-sm shrink-0",
                  active ? "bg-noir text-creme" : "bg-creme",
                )}
              >
                {order ?? "·"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm leading-tight truncate">
                  {opt.label}
                </div>
                {opt.sublabel && (
                  <div className="mono-meta text-noir-doux truncate">
                    {opt.sublabel}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mono-meta text-noir-doux mt-2">
        {selected.length} / {max} sélectionné{selected.length > 1 ? "s" : ""}
        {" · L'ordre du clic = l'ordre d'affichage."}
      </p>
      <input type="hidden" name={name} value={selected.join(",")} />
    </>
  );
}
