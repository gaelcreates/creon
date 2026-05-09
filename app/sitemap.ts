import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creon-lilac.vercel.app";

  const supabase = await createClient();

  const [eventsRes, articlesRes, creatorsRes, postsRes, productionsRes] =
    await Promise.all([
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
      supabase
        .from("creator_posts")
        .select(
          "slug, published_at, updated_at, creator:creators!inner(handle, status)",
        )
        .eq("status", "published"),
      supabase
        .from("productions_references")
        .select("slug, created_at")
        .eq("status", "published"),
    ]);

  const staticPaths: Array<{
    path: string;
    priority: number;
    changeFreq: "weekly" | "monthly" | "daily";
  }> = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/feed", priority: 0.95, changeFreq: "daily" },
    { path: "/events", priority: 0.9, changeFreq: "daily" },
    { path: "/articles", priority: 0.9, changeFreq: "weekly" },
    { path: "/createurs", priority: 0.9, changeFreq: "weekly" },
    { path: "/services", priority: 0.85, changeFreq: "weekly" },
    { path: "/productions", priority: 0.7, changeFreq: "monthly" },
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
    ...((postsRes.data ?? []) as unknown as Array<{
      slug: string;
      published_at: string | null;
      updated_at: string | null;
      creator: { handle: string };
    }>).map((p) => ({
      url: `${baseUrl}/createurs/${p.creator.handle}/${p.slug}`,
      lastModified: p.updated_at
        ? new Date(p.updated_at)
        : p.published_at
          ? new Date(p.published_at)
          : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...(productionsRes.data ?? []).map((pr) => ({
      url: `${baseUrl}/productions#${pr.slug}`,
      lastModified: pr.created_at ? new Date(pr.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
