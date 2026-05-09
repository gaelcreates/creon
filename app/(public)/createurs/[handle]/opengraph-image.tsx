import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CREON — créateur";

export default async function Image({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: creator } = await supabase
    .from("creators")
    .select("display_name, short_bio, city, canton, categories")
    .eq("handle", handle)
    .eq("status", "active")
    .maybeSingle();

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creon-lilac.vercel.app";

  const [displayFont, bodyFont] = await Promise.all([
    fetch(`${baseUrl}/fonts/Lineal-Regular.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${baseUrl}/fonts/Lineal-Regular.ttf`).then((r) => r.arrayBuffer()),
  ]);

  const name = creator?.display_name ?? "CREON Créateurs";
  const bio = creator?.short_bio ?? "L'annuaire des créateurs suisses.";
  const city = creator?.city ?? "Suisse";
  const canton = creator?.canton ?? "";
  const category = creator?.categories?.[0] ?? "Créateur";

  const initials = name
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const nameSize = name.length > 24 ? 92 : 120;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5ead5",
          display: "flex",
          padding: 0,
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
            width: 360,
            background: "#ede0c4",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "3px solid #100609",
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Lineal",
              fontSize: 200,
              color: "#100609",
              opacity: 0.4,
              lineHeight: 1,
            }}
          >
            {initials}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: 56,
            paddingTop: 80,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#3d2a1f",
                marginBottom: 10,
              }}
            >
              CREON · Annuaire
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Lineal",
                fontSize: nameSize,
                lineHeight: 0.88,
                color: "#100609",
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 18px",
                border: "3px solid #100609",
                background: "#ff7a00",
                fontFamily: "Lineal",
                fontSize: 28,
                color: "#100609",
                alignSelf: "flex-start",
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 22,
                color: "#3d2a1f",
                lineHeight: 1.4,
                maxWidth: 700,
              }}
            >
              {bio.length > 140 ? bio.slice(0, 137) + "…" : bio}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 24,
              borderTop: "3px solid #100609",
              fontSize: 24,
              color: "#3d2a1f",
              letterSpacing: "0.04em",
            }}
          >
            <div style={{ display: "flex", color: "#100609" }}>
              {city}
              {canton && ` · ${canton}`}
            </div>
            <div style={{ display: "flex", color: "#3d2a1f" }}>creon.ch</div>
          </div>
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
