import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CREON — article";

const TYPE_LABELS: Record<string, string> = {
  coulisses: "Coulisses",
  profil: "Profil",
  educatif: "Éducatif",
  annonce: "Annonce",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("editorial_articles")
    .select("title, type, author, reading_time, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creon-lilac.vercel.app";

  const [displayFont, bodyFont] = await Promise.all([
    fetch(`${baseUrl}/fonts/Lineal-Regular.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${baseUrl}/fonts/Lineal-Regular.ttf`).then((r) => r.arrayBuffer()),
  ]);

  const title = article?.title ?? "CREON";
  const typeLabel = article ? TYPE_LABELS[article.type] ?? article.type : "Magazine";
  const author = article?.author ?? "La rédaction";
  const date = article?.published_at
    ? new Date(article.published_at).toLocaleDateString("fr-CH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const titleSize = title.length > 60 ? 72 : title.length > 40 ? 88 : 104;

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
              alignItems: "center",
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#3d2a1f",
            }}
          >
            CREON · Le mag
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              border: "3px solid #100609",
              background: "#ff7a00",
              fontFamily: "Lineal",
              fontSize: 36,
              color: "#100609",
            }}
          >
            {typeLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Lineal",
              fontSize: titleSize,
              lineHeight: 0.9,
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
            fontSize: 24,
            color: "#3d2a1f",
            letterSpacing: "0.04em",
          }}
        >
          <div style={{ display: "flex" }}>
            par <span style={{ color: "#100609", marginLeft: 8 }}>{author}</span>
            {date && (
              <span style={{ marginLeft: 16, opacity: 0.7 }}>· {date}</span>
            )}
            {article?.reading_time && (
              <span style={{ marginLeft: 16, opacity: 0.7 }}>
                · {article.reading_time} min
              </span>
            )}
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
