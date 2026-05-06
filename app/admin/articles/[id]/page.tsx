import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../ArticleForm";
import { updateArticle, deleteArticle } from "../actions";

export const metadata = {
  title: "Modifier article — CREON Admin",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [articleRes, creatorsRes, eventsRes] = await Promise.all([
    supabase
      .from("articles")
      .select(
        "id, slug, title, subtitle, excerpt, content, content_html, cover_image, type, linked_creator, linked_event, author, reading_time, status, featured",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("creators")
      .select("id, display_name")
      .eq("status", "active")
      .order("display_name", { ascending: true }),
    supabase
      .from("events")
      .select("id, title")
      .order("date_start", { ascending: false })
      .limit(100),
  ]);

  if (!articleRes.data) {
    notFound();
  }

  return (
    <ArticleForm
      article={articleRes.data}
      creators={creatorsRes.data ?? []}
      events={eventsRes.data ?? []}
      saveAction={updateArticle}
      deleteAction={deleteArticle}
    />
  );
}
