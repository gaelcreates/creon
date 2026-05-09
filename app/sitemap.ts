import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creon-lilac.vercel.app";

  const supabase = await createClient();

  const [eventsRes, articlesRes, creatorsRes] = await Promise.all([
    supabase
      .from("events")
      .select("slug, published_at, date_start")
      .eq("status", "published"),
    supabase
      .from("editorial_articles")
      .select("slug, published_at, updated_at")
      .eq("status", "published"),
    supabase
      .from("creators")
      .select("handle, updated_at")
      .eq("status", "active"),
  ]);

  const staticPaths: Array<{
    path: string;
    priority: number;
    changeFreq: "weekly" | "monthly" | "daily";
  }> = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/events", priority: 0.9, changeFreq: "daily" },
    { path: "/articles", priority: 0.9, changeFreq: "weekly" },
    { path: "/createurs", priority: 0.9, changeFreq: "weekly" },
    { path: "/newsletter", priority: 0.7, changeFreq: "monthly" },
    { path: "/a-propos", priority: 0.5, changeFreq: "monthly" },
    { path: "/proposer-mon-profil", priority: 0.5, changeFreq: "monthly" },
  ];

  const now = new Date();

  return [
    ...staticPaths.map((s) => ({
      url: `${baseUrl}${s.path}`,
      lastModified: now,
      changeFrequency: s.changeFreq,
      priority: s.priority,
    })),
    ...(eventsRes.data ?? []).map((e) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: e.published_at ? new Date(e.published_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...(articlesRes.data ?? []).map((a) => ({
      url: `${baseUrl}/articles/${a.slug}`,
      lastModified: a.updated_at
        ? new Date(a.updated_at)
        : a.published_at
          ? new Date(a.published_at)
          : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...(creatorsRes.data ?? []).map((c) => ({
      url: `${baseUrl}/createurs/${c.handle}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
