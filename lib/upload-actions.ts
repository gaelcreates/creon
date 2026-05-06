"use server";

import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import { randomSuffix } from "./slug";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadImage(formData: FormData): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Tu dois être connecté pour uploader.");

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Aucun fichier reçu.");
  if (file.size > MAX_BYTES) {
    throw new Error("Fichier trop gros (5 MB max).");
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error("Format non supporté (JPG, PNG, WebP uniquement).");
  }

  const ext = EXT_MAP[file.type] ?? "jpg";
  const folder = formData.get("folder") as string | null;
  const safeFolder = folder && /^[a-z0-9-]+$/.test(folder) ? folder : "misc";
  const path = `${safeFolder}/${Date.now()}-${randomSuffix(8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const adminClient = createAdminClient();

  const { error: uploadErr } = await adminClient.storage
    .from("creon-uploads")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });
  if (uploadErr) throw new Error(`Upload échoué : ${uploadErr.message}`);

  const {
    data: { publicUrl },
  } = adminClient.storage.from("creon-uploads").getPublicUrl(path);

  return publicUrl;
}
