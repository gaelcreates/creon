"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";

type Props = {
  name: string;
  options: string[];
  max?: number;
};

export function CategoryPicker({ name, options, max = 3 }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(opt: string) {
    setSelected((prev) => {
      if (prev.includes(opt)) {
        return prev.filter((o) => o !== opt);
      }
      if (prev.length >= max) {
        return [...prev.slice(1), opt];
      }
      return [...prev, opt];
    });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip
            key={opt}
            active={selected.includes(opt)}
            onClick={() => toggle(opt)}
          >
            {opt}
          </Chip>
        ))}
      </div>
      <input type="hidden" name={name} value={selected.join(",")} />
    </>
  );
}
