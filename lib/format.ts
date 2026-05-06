export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const dayName = d
    .toLocaleDateString("fr-CH", { weekday: "short" })
    .toUpperCase()
    .slice(0, 3);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${dayName} ${day}.${month}`;
}

export function formatEventDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatArticleDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(2);
  return `${day}.${month}.${year}`;
}

export function buildQuery(
  params: Record<string, string | null | undefined>,
): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}
