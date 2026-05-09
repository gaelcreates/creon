-- ============================================================================
-- CREON V2 — Refonte schema (plateforme sociale)
-- À exécuter dans Supabase → SQL Editor → New query → Run
-- ⚠️ DROP toutes les tables v1 et reconstruit from scratch
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DROP v1 (CASCADE pour gérer les dépendances)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins peuvent lire les admins" ON admins;
DROP POLICY IF EXISTS "Super_admin peut insérer admins" ON admins;
DROP POLICY IF EXISTS "Super_admin peut modifier admins" ON admins;
DROP POLICY IF EXISTS "Super_admin peut supprimer admins" ON admins;

DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS homepage_config CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

DROP TYPE IF EXISTS creator_status CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS article_status CASCADE;
DROP TYPE IF EXISTS article_type CASCADE;
DROP TYPE IF EXISTS admin_role CASCADE;

DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_super_admin() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_set_updated_at() CASCADE;

-- ----------------------------------------------------------------------------
-- 2. ENUMS v2
-- ----------------------------------------------------------------------------
CREATE TYPE creator_status            AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE event_status              AS ENUM ('draft', 'published', 'archived');
CREATE TYPE editorial_article_type    AS ENUM ('coulisses', 'profil', 'educatif', 'signature');
CREATE TYPE editorial_article_status  AS ENUM ('draft', 'published', 'archived');
CREATE TYPE creator_post_type         AS ENUM ('short', 'article', 'service');
CREATE TYPE creator_post_status       AS ENUM ('draft', 'published', 'archived', 'flagged');
CREATE TYPE production_status         AS ENUM ('draft', 'published');
CREATE TYPE inquiry_status            AS ENUM ('new', 'contacted', 'won', 'lost');
CREATE TYPE flag_status               AS ENUM ('pending', 'reviewed', 'dismissed', 'action_taken');
CREATE TYPE admin_role                AS ENUM ('super_admin', 'admin', 'editor');

-- ----------------------------------------------------------------------------
-- 3. TABLES
-- ----------------------------------------------------------------------------

-- admins (équipe CREON)
CREATE TABLE admins (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text UNIQUE NOT NULL,
  display_name    text NOT NULL,
  role            admin_role NOT NULL DEFAULT 'admin',
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_login_at   timestamptz
);

-- creators (profils + comptes social)
CREATE TABLE creators (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text UNIQUE NOT NULL,
  handle            text UNIQUE NOT NULL,
  display_name      text NOT NULL,
  short_bio         text,
  long_bio          text,
  profile_image     text,
  cover_image       text,
  city              text,
  canton            text,
  categories        text[] NOT NULL DEFAULT '{}',
  links             jsonb NOT NULL DEFAULT '[]'::jsonb,
  status            creator_status NOT NULL DEFAULT 'pending',
  featured          boolean NOT NULL DEFAULT false,
  post_count        int NOT NULL DEFAULT 0,
  follower_count    int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX creators_status_idx ON creators(status);
CREATE INDEX creators_featured_idx ON creators(featured) WHERE featured = true;
CREATE INDEX creators_email_idx ON creators(email);

-- events (curés par CREON)
CREATE TABLE events (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text UNIQUE NOT NULL,
  title              text NOT NULL,
  description        jsonb,
  short_description  text,
  cover_image        text,
  gallery_images     text[] NOT NULL DEFAULT '{}',
  date_start         timestamptz NOT NULL,
  date_end           timestamptz,
  city               text NOT NULL,
  venue              text NOT NULL,
  venue_address      text,
  categories         text[] NOT NULL DEFAULT '{}',
  external_url       text,
  external_label     text DEFAULT 'S''inscrire',
  linked_creator     uuid REFERENCES creators(id) ON DELETE SET NULL,
  price_info         text,
  status             event_status NOT NULL DEFAULT 'draft',
  featured           boolean NOT NULL DEFAULT false,
  created_by         uuid REFERENCES admins(id) ON DELETE SET NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  published_at       timestamptz
);

CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_date_start_idx ON events(date_start);
CREATE INDEX events_featured_idx ON events(featured) WHERE featured = true;

-- editorial_articles (signés CREON crew, distincts des creator_posts)
CREATE TABLE editorial_articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  subtitle        text,
  excerpt         text,
  content         jsonb,
  content_html    text,
  cover_image     text,
  type            editorial_article_type NOT NULL,
  linked_creator  uuid REFERENCES creators(id) ON DELETE SET NULL,
  linked_event    uuid REFERENCES events(id) ON DELETE SET NULL,
  author          text NOT NULL,
  reading_time    int,
  status          editorial_article_status NOT NULL DEFAULT 'draft',
  featured        boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_by      uuid REFERENCES admins(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX editorial_articles_status_idx ON editorial_articles(status);
CREATE INDEX editorial_articles_published_at_idx ON editorial_articles(published_at);
CREATE INDEX editorial_articles_type_idx ON editorial_articles(type);

-- creator_posts (LE CŒUR DE LA PLATEFORME SOCIALE)
CREATE TABLE creator_posts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  slug              text NOT NULL,
  type              creator_post_type NOT NULL,
  title             text,
  content           jsonb,
  content_html      text,
  cover_image       text,
  gallery_images    text[] NOT NULL DEFAULT '{}',
  service_url       text,
  service_price     text,
  service_cta       text DEFAULT 'Découvrir',
  tags              text[] NOT NULL DEFAULT '{}',
  status            creator_post_status NOT NULL DEFAULT 'draft',
  view_count        int NOT NULL DEFAULT 0,
  flag_count        int NOT NULL DEFAULT 0,
  published_at      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, slug)
);

CREATE INDEX creator_posts_status_idx ON creator_posts(status);
CREATE INDEX creator_posts_type_idx ON creator_posts(type);
CREATE INDEX creator_posts_published_at_idx ON creator_posts(published_at);
CREATE INDEX creator_posts_creator_id_idx ON creator_posts(creator_id);
CREATE INDEX creator_posts_view_count_idx ON creator_posts(view_count DESC);

-- productions_references (page Productions vidéo CREON)
CREATE TABLE productions_references (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  client_name     text NOT NULL,
  project_title   text NOT NULL,
  description     text,
  cover_image     text,
  gallery_images  text[] NOT NULL DEFAULT '{}',
  video_url       text,
  tags            text[] NOT NULL DEFAULT '{}',
  order_index     int NOT NULL DEFAULT 0,
  status          production_status NOT NULL DEFAULT 'draft',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX productions_status_idx ON productions_references(status);
CREATE INDEX productions_order_idx ON productions_references(order_index);

-- production_inquiries (devis reçus via formulaire /productions)
CREATE TABLE production_inquiries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text,
  company         text,
  project_type    text NOT NULL,
  budget_range    text,
  message         text NOT NULL,
  status          inquiry_status NOT NULL DEFAULT 'new',
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX production_inquiries_status_idx ON production_inquiries(status);
CREATE INDEX production_inquiries_created_idx ON production_inquiries(created_at DESC);

-- post_flags (modération)
CREATE TABLE post_flags (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         uuid NOT NULL REFERENCES creator_posts(id) ON DELETE CASCADE,
  reporter_email  text,
  reason          text NOT NULL,
  status          flag_status NOT NULL DEFAULT 'pending',
  reviewed_by     uuid REFERENCES admins(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX post_flags_post_id_idx ON post_flags(post_id);
CREATE INDEX post_flags_status_idx ON post_flags(status);

-- newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text UNIQUE NOT NULL,
  confirmed           boolean NOT NULL DEFAULT true,
  confirmation_token  text,
  subscribed_at       timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at     timestamptz,
  source              text DEFAULT 'website'
);

-- homepage_config (singleton)
CREATE TABLE homepage_config (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title               text,
  hero_subtitle            text,
  featured_post_ids        uuid[] NOT NULL DEFAULT '{}',
  featured_event_ids       uuid[] NOT NULL DEFAULT '{}',
  featured_creator_ids     uuid[] NOT NULL DEFAULT '{}',
  featured_article_ids     uuid[] NOT NULL DEFAULT '{}',
  featured_production_ids  uuid[] NOT NULL DEFAULT '{}',
  banner_text              text,
  banner_active            boolean NOT NULL DEFAULT false,
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. TRIGGERS updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_creators_updated_at
  BEFORE UPDATE ON creators FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_editorial_articles_updated_at
  BEFORE UPDATE ON editorial_articles FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_creator_posts_updated_at
  BEFORE UPDATE ON creator_posts FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_homepage_updated_at
  BEFORE UPDATE ON homepage_config FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Helper functions RLS (SECURITY DEFINER pour éviter récursion)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND role = 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_post_owner(target_creator_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.creators
    WHERE id = target_creator_id AND email = auth.email()
  );
$$;

-- ----------------------------------------------------------------------------
-- 6. RLS — activation et policies
-- ----------------------------------------------------------------------------
ALTER TABLE admins                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators                ENABLE ROW LEVEL SECURITY;
ALTER TABLE events                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_articles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE productions_references  ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_inquiries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_flags              ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config         ENABLE ROW LEVEL SECURITY;

-- admins
CREATE POLICY "Admins lisent admins"      ON admins FOR SELECT USING (is_admin());
CREATE POLICY "Super_admin insère admins" ON admins FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "Super_admin modifie admins" ON admins FOR UPDATE USING (is_super_admin());
CREATE POLICY "Super_admin supprime admins" ON admins FOR DELETE USING (is_super_admin());

-- creators
CREATE POLICY "Public lit créateurs actifs" ON creators FOR SELECT USING (status = 'active');
CREATE POLICY "Admin lit tous créateurs"    ON creators FOR SELECT USING (is_admin());
CREATE POLICY "Créateur lit son profil"     ON creators FOR SELECT USING (email = auth.email());
CREATE POLICY "Admin gère créateurs"        ON creators FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Créateur modifie son profil" ON creators FOR UPDATE
  USING (email = auth.email()) WITH CHECK (email = auth.email());

-- events (curés CREON)
CREATE POLICY "Public lit events publiés" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Admin gère events"         ON events FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- editorial_articles (CREON crew)
CREATE POLICY "Public lit articles publiés" ON editorial_articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admin gère editorial"        ON editorial_articles FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- creator_posts
CREATE POLICY "Public lit posts publiés"    ON creator_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Créateur lit ses posts"      ON creator_posts FOR SELECT USING (is_post_owner(creator_id));
CREATE POLICY "Admin lit tous posts"        ON creator_posts FOR SELECT USING (is_admin());
CREATE POLICY "Créateur insère ses posts"   ON creator_posts FOR INSERT
  WITH CHECK (is_post_owner(creator_id));
CREATE POLICY "Créateur modifie ses posts"  ON creator_posts FOR UPDATE
  USING (is_post_owner(creator_id)) WITH CHECK (is_post_owner(creator_id));
CREATE POLICY "Créateur supprime ses posts" ON creator_posts FOR DELETE USING (is_post_owner(creator_id));
CREATE POLICY "Admin gère tous posts"       ON creator_posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- productions_references
CREATE POLICY "Public lit productions publiées" ON productions_references FOR SELECT USING (status = 'published');
CREATE POLICY "Admin gère productions"          ON productions_references FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- production_inquiries (anon peut INSERT, admin lit)
CREATE POLICY "Admin lit inquiries"   ON production_inquiries FOR SELECT USING (is_admin());
CREATE POLICY "Admin gère inquiries"  ON production_inquiries FOR ALL USING (is_admin()) WITH CHECK (is_admin());
-- INSERT public via service_role server action (bypass RLS)

-- post_flags (anon peut signaler, admin lit/gère)
CREATE POLICY "Admin lit flags"   ON post_flags FOR SELECT USING (is_admin());
CREATE POLICY "Admin gère flags"  ON post_flags FOR ALL USING (is_admin()) WITH CHECK (is_admin());
-- INSERT public via service_role server action

-- newsletter_subscribers
CREATE POLICY "Admin lit newsletter"  ON newsletter_subscribers FOR SELECT USING (is_admin());
CREATE POLICY "Admin gère newsletter" ON newsletter_subscribers FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- homepage_config
CREATE POLICY "Public lit homepage"   ON homepage_config FOR SELECT USING (true);
CREATE POLICY "Admin modifie homepage" ON homepage_config FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ----------------------------------------------------------------------------
-- 7. Seeds
-- ----------------------------------------------------------------------------

-- Re-insert Gael as super_admin (auth.users.id connu de la session précédente)
INSERT INTO admins (id, email, display_name, role)
VALUES (
  '846d238f-66f8-4065-83a7-294ab0966b62',
  'gaelcreates@gmail.com',
  'Gaël',
  'super_admin'
);

-- Singleton homepage_config
INSERT INTO homepage_config (
  hero_title,
  hero_subtitle,
  banner_active
)
VALUES (
  'La plateforme suisse pour les créateurs.',
  'Annuaire, feed, events. Curé à la main par CREON crew.',
  false
);

-- ============================================================================
-- Migration v2 terminée. 9 tables, RLS strictes, Gael ré-inséré super_admin.
-- ============================================================================
