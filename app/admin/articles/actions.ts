"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, randomSuffix } from "@/lib/slug";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("Not admin");
  return user;
}

function extractArticleFields(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  if (!slug) slug = `${slugify(title)}-${randomSuffix(4)}`;

  const contentRaw = formData.get("content") as string;
  let content: object | null = null;
  if (contentRaw) {
    try {
      content = JSON.parse(contentRaw);
    } catch {
      content = null;
    }
  }

  const linkedCreator = formData.get("linked_creator") as string;
  const linkedEvent = formData.get("linked_event") as string;
  const readingTimeRaw = formData.get("reading_time") as string;
  const readingTime = readingTimeRaw ? parseInt(readingTimeRaw, 10) : null;

  return {
    title,
    slug,
    subtitle: (formData.get("subtitle") as string)?.trim() || null,
    excerpt: (formData.get("excerpt") as string)?.trim() || null,
    content,
    content_html: (formData.get("content_html") as string) || null,
    cover_image: (formData.get("cover_image") as string)?.trim() || null,
    type: formData.get("type") as
      | "coulisses"
      | "profil"
      | "educatif"
      | "annonce",
    author: (formData.get("author") as string)?.trim() || "Gaël",
    reading_time: readingTime,
    linked_creator: linkedCreator || null,
    linked_event: linkedEvent || null,
    status: formData.get("status") as
      | "draft"
      | "published"
      | "archived",
    featured: formData.get("featured") === "on",
  };
}

export async function createArticle(formData: FormData) {
  const user = await requireAdmin();
  const fields = extractArticleFields(formData);

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("articles")
    .insert({
      ...fields,
      created_by: user.id,
      published_at:
        fields.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ce slug est déjà utilisé. Change-le et ré-essaie.");
    }
    throw error;
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  redirect(`/admin/articles/${data.id}`);
}

export async function updateArticle(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const fields = extractArticleFields(formData);
  const adminClient = createAdminClient();

  const { data: existing } = await adminClient
    .from("articles")
    .select("status, published_at")
    .eq("id", id)
    .maybeSingle();

  const published_at =
    fields.status === "published" && !existing?.published_at
      ? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await adminClient
    .from("articles")
    .update({ ...fields, published_at })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/articles/${id}`);
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("articles").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  redirect("/admin/articles");
}
