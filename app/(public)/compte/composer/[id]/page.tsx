import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ComposerForm } from "../ComposerForm";
import { updatePost, deletePost, archivePost } from "../actions";

export const metadata = {
  title: "Modifier mon contenu — CREON",
};

export default async function ComposerEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const saved = sp.saved === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator || creator.status !== "active") {
    redirect("/compte");
  }

  const { data: post } = await supabase
    .from("creator_posts")
    .select(
      "id, slug, type, title, content, content_html, cover_image, gallery_images, service_url, service_price, service_cta, tags, status",
    )
    .eq("id", id)
    .eq("creator_id", creator.id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-6 max-w-3xl mx-auto w-full">
        <p className="mono-meta text-noir-doux mb-3">
          <Link
            href="/compte/contenus"
            className="hover:text-accent-deep transition-colors"
          >
            ← Mes contenus
          </Link>
        </p>
        <p className="eyebrow text-noir-doux mb-2">Édition</p>
        <h1 className="display-2">Modifier</h1>
        {saved && (
          <div className="mt-6 border border-accent bg-accent-soft px-4 py-3 rounded-md font-body text-[14px]">
            ✓ Contenu enregistré.
          </div>
        )}
      </section>

      <section className="px-6 lg:px-14 pb-20 max-w-3xl mx-auto w-full">
        <ComposerForm
          post={post}
          saveAction={updatePost}
          deleteAction={deletePost}
          archiveAction={archivePost}
        />
      </section>
    </>
  );
}
