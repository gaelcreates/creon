import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MultiPicker } from "@/components/admin/MultiPicker";
import { updateHomepage } from "./actions";

export const metadata = {
  title: "Home — CREON Admin",
};

const textareaClass =
  "w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-noir placeholder:text-noir-doux/50 focus:outline-none focus:border-accent focus:bg-creme-fonce transition-colors duration-150 resize-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block eyebrow text-noir-doux">
        {label}
      </label>
      {children}
      {hint && <p className="mono-meta text-noir-doux">{hint}</p>}
    </div>
  );
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-noir pt-8 first:border-0 first:pt-0">
      <div>
        <p className="eyebrow text-noir-doux">{number}</p>
        <h2 className="font-display text-3xl leading-none mt-1">{title}</h2>
        {description && (
          <p className="font-body text-sm text-noir-doux mt-2 max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export default async function AdminHomepagePage() {
  const supabase = await createClient();

  const [configRes, eventsRes, creatorsRes, articlesRes] = await Promise.all([
    supabase
      .from("homepage_config")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("events")
      .select("id, title, city, date_start")
      .eq("status", "published")
      .order("date_start", { ascending: false })
      .limit(50),
    supabase
      .from("creators")
      .select("id, display_name, city")
      .eq("status", "active")
      .order("display_name", { ascending: true }),
    supabase
      .from("editorial_articles")
      .select("id, title, type, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50),
  ]);

  const config = configRes.data;
  if (!config) {
    return (
      <div className="space-y-6 max-w-2xl">
        <p className="font-body text-noir-doux">
          Configuration homepage manquante. Le seed initial n&apos;a pas été
          appliqué — re-run la migration SQL.
        </p>
      </div>
    );
  }

  const eventOptions = (eventsRes.data ?? []).map((e) => ({
    id: e.id,
    label: e.title,
    sublabel: `${e.city} · ${new Date(e.date_start).toLocaleDateString("fr-CH")}`,
  }));
  const creatorOptions = (creatorsRes.data ?? []).map((c) => ({
    id: c.id,
    label: c.display_name,
    sublabel: c.city ?? "—",
  }));
  const articleOptions = (articlesRes.data ?? []).map((a) => ({
    id: a.id,
    label: a.title,
    sublabel: `${a.type} · ${a.published_at ? new Date(a.published_at).toLocaleDateString("fr-CH") : ""}`,
  }));

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <p className="eyebrow text-noir-doux">
          Back-office
        </p>
        <h1 className="display-2 mt-2">
          Édition de la home
        </h1>
        <p className="font-body text-sm text-noir-doux mt-3 max-w-xl">
          Hero, bannière, et sélection des contenus mis en avant. Sauvegarder
          déclenche un revalidate automatique de la home publique.
        </p>
      </div>

      <form action={updateHomepage} className="space-y-10">
        <input type="hidden" name="id" value={config.id} />

        <Section
          number="01"
          title="Hero"
          description="Le bloc d'accroche en haut de la home publique. Pour V1 le titre est hardcodé dans page.tsx ; ces champs serviront en Sprint 5 quand on bascule la home en DB-driven."
        >
          <Field label="Titre">
            <Input
              name="hero_title"
              defaultValue={config.hero_title ?? ""}
              placeholder="La culture créative suisse, curée à la main."
            />
          </Field>
          <Field label="Sous-titre">
            <textarea
              name="hero_subtitle"
              defaultValue={config.hero_subtitle ?? ""}
              rows={3}
              className={textareaClass}
              placeholder="Events, créateurs, articles. On parcourt la Suisse romande pour toi."
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Label CTA">
              <Input
                name="hero_cta_label"
                defaultValue={config.hero_cta_label ?? ""}
                placeholder="S'abonner"
              />
            </Field>
            <Field label="URL CTA">
              <Input
                name="hero_cta_url"
                defaultValue={config.hero_cta_url ?? ""}
                placeholder="/newsletter"
              />
            </Field>
          </div>
        </Section>

        <Section
          number="02"
          title="Bannière éditoriale"
          description="Bandeau noir au-dessus du Header. Si activé, remplace le texte 'N° 1 · Édition de lancement' actuel."
        >
          <Field label="Texte de la bannière">
            <Input
              name="banner_text"
              defaultValue={config.banner_text ?? ""}
              placeholder="N° 14 · Semaine du 04.05.26 · Lausanne 14°…"
            />
          </Field>
          <label className="flex items-center gap-3 px-4 py-3 border-2 border-noir bg-creme cursor-pointer w-fit">
            <input
              type="checkbox"
              name="banner_active"
              defaultChecked={config.banner_active}
              className="w-5 h-5 accent-accent"
            />
            <span className="font-body text-sm">Activer la bannière</span>
          </label>
        </Section>

        <Section
          number="03"
          title="Events featured"
          description="Affichés dans la section 'Cette semaine' de la home. 3 max, l'ordre du clic = l'ordre affiché."
        >
          <MultiPicker
            name="featured_event_ids"
            options={eventOptions}
            initial={config.featured_event_ids ?? []}
            max={3}
            emptyLabel="Aucun event publié — créés des events publiés d'abord."
          />
        </Section>

        <Section
          number="04"
          title="Créateurs featured"
          description="Affichés dans la section 'Sous le radar' de la home. 5 max."
        >
          <MultiPicker
            name="featured_creator_ids"
            options={creatorOptions}
            initial={config.featured_creator_ids ?? []}
            max={5}
            emptyLabel="Aucun créateur actif — approuves des candidatures d'abord."
          />
        </Section>

        <Section
          number="05"
          title="Articles featured"
          description="1 grand + 2 petits dans la section 'Lecture longue'. 3 max, l'ordre du clic = l'ordre affiché (premier = celui en grand)."
        >
          <MultiPicker
            name="featured_article_ids"
            options={articleOptions}
            initial={config.featured_article_ids ?? []}
            max={3}
            emptyLabel="Aucun article publié — créés des articles d'abord."
          />
        </Section>

        <div className="flex items-center gap-3 pt-6 border-t border-noir sticky bottom-0 bg-creme py-4 -mx-2 px-2">
          <Button type="submit" size="lg">
            Enregistrer la home →
          </Button>
        </div>
      </form>
    </div>
  );
}
