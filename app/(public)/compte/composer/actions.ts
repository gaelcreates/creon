"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, randomSuffix } from "@/lib/slug";

async function requireCreator() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Not authenticated");

  const { data: creator } = await supabase
    .from("creators")
    .select("id, handle, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator || creator.status !== "active") {
    throw new Error("No active creator profile");
  }
  return { user, creator };
}

function extractFields(formData: FormData) {
  const type = formData.get("type") as "short" | "article" | "service";
  const title = (formData.get("title") as string)?.trim() || null;
  const contentRaw = formData.get("content") as string;
  const contentHtml = (formData.get("content_html") as string) || null;
  let content: object | null = null;
  if (contentRaw) {
    try {
      content = JSON.parse(contentRaw);
    } catch {
      content = null;
    }
  }

  // Build gallery from named slots
  const galleryImages: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const url = (formData.get(`gallery_${i}`) as string)?.trim();
    if (url) galleryImages.push(url);
  }

  // Tags : comma-separated
  const tagsRaw = (formData.get("tags") as string)?.trim() ?? "";
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);

  return {
    type,
    title,
    content,
    content_html: contentHtml,
    cover_image: (formData.get("cover_image") as string)?.trim() || null,
    gallery_images: galleryImages,
    service_url: (formData.get("service_url") as string)?.trim() || null,
    service_price: (formData.get("service_price") as string)?.trim() || null,
    service_cta:
      (formData.get("service_cta") as string)?.trim() || "Découvrir",
    tags,
    status: formData.get("status") as "draft" | "published" | "archived",
  };
}

export async function createPost(formData: FormData) {
  const { creator } = await requireCreator();
  const fields = extractFields(formData);

  // Generate slug
  const baseSlug = fields.title
    ? slugify(fields.title)
    : `${fields.type}-${randomSuffix(6)}`;
  const slug = `${baseSlug}-${randomSuffix(4)}`;

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("creator_posts")
    .insert({
      ...fields,
      slug,
      creator_id: creator.id,
      published_at:
        fields.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Erreur création post : ${error.message}`);

  revalidatePath("/compte");
  revalidatePath("/compte/contenus");
  revalidatePath("/feed");
  revalidatePath(`/createurs/${creator.handle}`);
  redirect(`/compte/composer/${data.id}?saved=1`);
}

export async function updatePost(formData: FormData) {
  const { creator } = await requireCreator();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const fields = extractFields(formData);
  const adminClient = createAdminClient();

  // Verify ownership before update
  const { data: existing } = await adminClient
    .from("creator_posts")
    .select("creator_id, status, published_at, slug")
    .eq("id", id)
    .maybeSingle();
  if (!existing || existing.creator_id !== creator.id) {
    throw new Error("Not your post");
  }

  const published_at =
    fields.status === "published" && !existing.published_at
      ? new Date().toISOString()
      : existing.published_at ?? null;

  const { error } = await adminClient
    .from("creator_posts")
    .update({ ...fields, published_at })
    .eq("id", id);

  if (error) throw new Error(`Erreur mise à jour : ${error.message}`);

  revalidatePath("/compte");
  revalidatePath("/compte/contenus");
  revalidatePath("/feed");
  revalidatePath(`/createurs/${creator.handle}`);
  revalidatePath(`/createurs/${creator.handle}/${existing.slug}`);
  redirect(`/compte/composer/${id}?saved=1`);
}

export async function deletePost(formData: FormData) {
  const { creator } = await requireCreator();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const adminClient = createAdminClient();
  const { data: existing } = await adminClient
    .from("creator_posts")
    .select("creator_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing || existing.creator_id !== creator.id) {
    throw new Error("Not your post");
  }

  const { error } = await adminClient
    .from("creator_posts")
    .delete()
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/compte");
  revalidatePath("/compte/contenus");
  revalidatePath("/feed");
  revalidatePath(`/createurs/${creator.handle}`);
  redirect("/compte/contenus");
}

export async function archivePost(formData: FormData) {
  const { creator } = await requireCreator();
  const id = formData.get("id") as string;
  if (!id) throw new Error("id required");

  const adminClient = createAdminClient();
  const { data: existing } = await adminClient
    .from("creator_posts")
    .select("creator_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing || existing.creator_id !== creator.id) {
    throw new Error("Not your post");
  }

  const { error } = await adminClient
    .from("creator_posts")
    .update({ status: "archived" })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/compte/contenus");
  revalidatePath("/feed");
  revalidatePath(`/createurs/${creator.handle}`);
}
