-- ============================================================================
-- CREON V1 — schéma initial
-- À exécuter dans Supabase → SQL Editor → New query → Run
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Enums
-- ----------------------------------------------------------------------------
CREATE TYPE creator_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE event_status   AS ENUM ('draft', 'published', 'archived');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE article_type   AS ENUM ('coulisses', 'profil', 'educatif', 'annonce');
CREATE TYPE admin_role     AS ENUM ('super_admin', 'admin', 'editor');

-- ----------------------------------------------------------------------------
-- 2. Tables
-- ----------------------------------------------------------------------------

-- admins : équipe CREON, lié 1-1 à auth.users
CREATE TABLE admins (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text UNIQUE NOT NULL,
  display_name    text NOT NULL,
  role            admin_role NOT NULL DEFAULT 'admin',
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_login_at   timestamptz
);

-- creators : profils publics, lien à auth.users via l'email (pas FK)
CREATE TABLE creators (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text UNIQUE NOT NULL,
  handle          text UNIQUE NOT NULL,
  display_name    text NOT NULL,
  short_bio       text,
  long_bio        text,
  profile_image   text,
  cover_image     text,
  city            text,
  canton          text,
  categories      text[] NOT NULL DEFAULT '{}',
  links           jsonb NOT NULL DEFAULT '[]'::jsonb,
  status          creator_status NOT NULL DEFAULT 'pending',
  featured        boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX creators_status_idx ON creators(status);
CREATE INDEX creators_featured_idx ON creators(featured) WHERE featured = true;

-- events
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

-- articles
CREATE TABLE articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  subtitle        text,
  excerpt         text,
  content         jsonb,
  content_html    text,
  cover_image     text,
  type            article_type NOT NULL,
  linked_creator  uuid REFERENCES creators(id) ON DELETE SET NULL,
  linked_event    uuid REFERENCES events(id) ON DELETE SET NULL,
  author          text NOT NULL,
  reading_time    int,
  status          article_status NOT NULL DEFAULT 'draft',
  featured        boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_by      uuid REFERENCES admins(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX articles_status_idx ON articles(status);
CREATE INDEX articles_published_at_idx ON articles(published_at);
CREATE INDEX articles_type_idx ON articles(type);

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

-- homepage_config (singleton, une seule ligne)
CREATE TABLE homepage_config (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title             text,
  hero_subtitle          text,
  hero_cta_label         text,
  hero_cta_url           text,
  featured_event_ids     uuid[] NOT NULL DEFAULT '{}',
  featured_creator_ids   uuid[] NOT NULL DEFAULT '{}',
  featured_article_ids   uuid[] NOT NULL DEFAULT '{}',
  banner_text            text,
  banner_active          boolean NOT NULL DEFAULT false,
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. Trigger updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_homepage_updated_at
  BEFORE UPDATE ON homepage_config
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Helper functions pour RLS (SECURITY DEFINER pour éviter récursion)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND role = 'super_admin');
$$;

-- ----------------------------------------------------------------------------
-- 5. RLS — activation et policies
-- ----------------------------------------------------------------------------
ALTER TABLE admins                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators                ENABLE ROW LEVEL SECURITY;
ALTER TABLE events                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config         ENABLE ROW LEVEL SECURITY;

-- admins
CREATE POLICY "Admins peuvent lire les admins"
  ON admins FOR SELECT USING (is_admin());

CREATE POLICY "Super_admin peut insérer admins"
  ON admins FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "Super_admin peut modifier admins"
  ON admins FOR UPDATE USING (is_super_admin());

CREATE POLICY "Super_admin peut supprimer admins"
  ON admins FOR DELETE USING (is_super_admin());

-- creators
CREATE POLICY "Public peut lire créateurs actifs"
  ON creators FOR SELECT USING (status = 'active');

CREATE POLICY "Admin peut tout lire les créateurs"
  ON creators FOR SELECT USING (is_admin());

CREATE POLICY "Créateur peut lire son propre profil même non actif"
  ON creators FOR SELECT USING (email = auth.email());

CREATE POLICY "Admin peut tout faire sur créateurs"
  ON creators FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Créateur peut modifier son propre profil"
  ON creators FOR UPDATE
  USING (email = auth.email())
  WITH CHECK (email = auth.email());

-- events
CREATE POLICY "Public lit events publiés"
  ON events FOR SELECT USING (status = 'published');

CREATE POLICY "Admin tout faire sur events"
  ON events FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- articles
CREATE POLICY "Public lit articles publiés"
  ON articles FOR SELECT USING (status = 'published');

CREATE POLICY "Admin tout faire sur articles"
  ON articles FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- newsletter_subscribers (pas de SELECT public, INSERT via service_role)
CREATE POLICY "Admin lit newsletter"
  ON newsletter_subscribers FOR SELECT USING (is_admin());

CREATE POLICY "Admin tout faire sur newsletter"
  ON newsletter_subscribers FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- homepage_config (lecture publique, modif admin)
CREATE POLICY "Public lit homepage config"
  ON homepage_config FOR SELECT USING (true);

CREATE POLICY "Admin modifie homepage"
  ON homepage_config FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ----------------------------------------------------------------------------
-- 6. Seed homepage_config (singleton)
-- ----------------------------------------------------------------------------
INSERT INTO homepage_config (
  hero_title,
  hero_subtitle,
  hero_cta_label,
  hero_cta_url,
  banner_active
)
VALUES (
  'La culture créative suisse, curée à la main.',
  'Events, créateurs, articles. On parcourt la Suisse romande pour toi.',
  'S''abonner',
  '/newsletter',
  false
);

-- ============================================================================
-- Migration terminée. Vérifie dans Table Editor que les 6 tables sont là.
-- ============================================================================
