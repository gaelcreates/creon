import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creon-lilac.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/compte", "/auth/", "/login", "/login/sent", "/design"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
