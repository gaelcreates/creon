-- ============================================================================
-- CREON V1 — Storage bucket pour les uploads (covers events/articles + photos créateur)
-- À exécuter dans Supabase → SQL Editor → New query → Run
-- ============================================================================

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'creon-uploads',
  'creon-uploads',
  true,                 -- public read
  5242880,              -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Note : pas de policies storage.objects nécessaires car les uploads
-- passent par le client service-role (bypass RLS) après vérification
-- d'auth côté serveur dans la server action uploadImage.
-- ============================================================================
