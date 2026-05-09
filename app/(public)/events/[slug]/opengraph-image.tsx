import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CREON — event";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("title, date_start, city, venue, categories")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creon-lilac.vercel.app";

  const [displayFont, bodyFont] = await Promise.all([
    fetch(`${baseUrl}/fonts/Lineal-Regular.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${baseUrl}/fonts/Lineal-Regular.ttf`).then((r) => r.arrayBuffer()),
  ]);

  const title = event?.title ?? "CREON Events";
  const dateStr = event?.date_start
    ? new Date(event.date_start)
        .toLocaleDateString("fr-CH", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })
        .toUpperCase()
    : "";
  const timeStr = event?.date_start
    ? new Date(event.date_start).toLocaleTimeString("fr-CH", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const city = event?.city ?? "Suisse romande";
  const venue = event?.venue ?? "";
  const category = event?.categories?.[0] ?? "Event";

  const titleSize = title.length > 50 ? 80 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5ead5",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          position: "relative",
          fontFamily: "Lineal",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 16,
            background: "#100609",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#3d2a1f",
            }}
          >
            CREON · Agenda
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 24px",
              border: "3px solid #100609",
              background: "#ff7a00",
              fontFamily: "Lineal",
              fontSize: 32,
              color: "#100609",
            }}
          >
            {category}
          </div>
        </div>

        {dateStr && (
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 28,
              fontWeight: 400,
              color: "#100609",
              letterSpacing: "0.06em",
            }}
          >
            {dateStr} · {timeStr}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "flex-start",
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Lineal",
              fontSize: titleSize,
              lineHeight: 0.92,
              color: "#100609",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: "3px solid #100609",
            fontSize: 26,
            color: "#3d2a1f",
            letterSpacing: "0.04em",
          }}
        >
          <div style={{ display: "flex", color: "#100609" }}>
            {venue} · {city}
          </div>
          <div style={{ display: "flex", color: "#3d2a1f" }}>creon.ch</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Lineal", data: displayFont, style: "normal", weight: 400 },
        { name: "Lineal", data: bodyFont, style: "normal", weight: 400 },
      ],
    },
  );
}
