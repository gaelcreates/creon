import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../ArticleForm";
import { createArticle } from "../actions";

export const metadata = {
  title: "Nouvel article — CREON Admin",
};

export default async function NewArticlePage() {
  const supabase = await createClient();
  const [creatorsRes, eventsRes] = await Promise.all([
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

  return (
    <ArticleForm
      creators={creatorsRes.data ?? []}
      events={eventsRes.data ?? []}
      saveAction={createArticle}
    />
  );
}
