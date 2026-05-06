"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const DAYS_FR_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

type Props = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
};

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function combineDateTime(
  d: Date | null,
  h: number,
  m: number,
): Date | null {
  if (!d) return null;
  const result = new Date(d);
  result.setHours(h, m, 0, 0);
  return result;
}

function toLocalISOString(d: Date): string {
  // Returns ISO without timezone shift (treats local as canonical)
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 19);
}

export function DateTimePickerInput({
  name,
  defaultValue,
  required,
  placeholder = "Choisir une date…",
}: Props) {
  const initialDate = defaultValue ? new Date(defaultValue) : null;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(initialDate);
  const [viewMonth, setViewMonth] = useState<Date>(initialDate ?? new Date());
  const [hour, setHour] = useState<number>(
    initialDate ? initialDate.getHours() : 19,
  );
  const [minute, setMinute] = useState<number>(
    initialDate ? initialDate.getMinutes() : 0,
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const fullDate = combineDateTime(date, hour, minute);
  const hiddenValue = fullDate ? fullDate.toISOString() : "";

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastOfMonth.getDate();

  const cells: Array<{ date: Date; current: boolean }> = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month, -i), current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), current: true });
  }
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, nextDay++), current: false });
  }

  const today = new Date();

  function displayLabel(): string {
    if (!fullDate) return placeholder;
    const dateStr = fullDate.toLocaleDateString("fr-CH", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    return `${dateStr} · ${timeStr}`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-left flex items-center justify-between gap-3 focus:outline-none focus:border-accent transition-colors",
          open && "border-accent bg-creme-fonce",
        )}
      >
        <span className={fullDate ? "text-noir" : "text-noir-doux/60"}>
          {displayLabel()}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0"
        >
          <rect x="3" y="4" width="18" height="18" rx="0" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 top-full left-0 mt-2 bg-creme border-2 border-noir shadow-[6px_6px_0_var(--color-noir)] p-4 w-[340px]">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month - 1, 1))}
              className="w-9 h-9 border-2 border-noir bg-creme font-body text-base hover:bg-creme-fonce transition-colors"
              aria-label="Mois précédent"
            >
              ←
            </button>
            <div className="text-center">
              <div className="font-display text-xl leading-none">
                {MONTHS_FR[month]}
              </div>
              <div className="mono-meta text-noir-doux mt-0.5">{year}</div>
            </div>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month + 1, 1))}
              className="w-9 h-9 border-2 border-noir bg-creme font-body text-base hover:bg-creme-fonce transition-colors"
              aria-label="Mois suivant"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS_FR_SHORT.map((d) => (
              <div
                key={d}
                className="mono-meta text-center text-noir-doux py-1.5 text-[10px]"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-2 border-noir">
            {cells.map((cell, i) => {
              const isSelected = date && sameDay(cell.date, date);
              const isToday = sameDay(cell.date, today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDate(cell.date);
                    if (
                      cell.date.getMonth() !== month ||
                      cell.date.getFullYear() !== year
                    ) {
                      setViewMonth(
                        new Date(cell.date.getFullYear(), cell.date.getMonth(), 1),
                      );
                    }
                  }}
                  className={cn(
                    "aspect-square text-sm font-body transition-colors border-r border-b border-noir/15 last:border-r-0 [&:nth-child(7n)]:border-r-0",
                    !cell.current && "text-noir-doux/30",
                    cell.current && !isSelected && "hover:bg-creme-fonce",
                    isSelected && "bg-accent text-noir font-medium",
                    isToday && !isSelected && "ring-2 ring-noir ring-inset",
                  )}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t-2 border-noir flex items-center gap-2">
            <span className="mono-meta uppercase shrink-0">Heure</span>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="px-2 py-1.5 border-2 border-noir bg-creme font-body text-sm focus:outline-none focus:border-accent"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
            <span className="font-display text-lg">:</span>
            <select
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
              className="px-2 py-1.5 border-2 border-noir bg-creme font-body text-sm focus:outline-none focus:border-accent"
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDate(null);
              }}
              className="flex-1 mono-meta uppercase text-noir-doux py-2 underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-3 py-2 border-2 border-noir bg-accent font-body text-sm uppercase tracking-wider hover:shadow-[3px_3px_0_var(--color-noir)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <input type="hidden" name={name} value={hiddenValue} required={required} />
    </div>
  );
}
