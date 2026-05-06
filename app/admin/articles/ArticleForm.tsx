"use client";

import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TiptapEditor } from "@/components/admin/TiptapEditor";

type Creator = { id: string; display_name: string };
type EventLite = { id: string; title: string };

export type ArticleData = {
  id?: string;
  title?: string;
  slug?: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content?: object | null;
  content_html?: string | null;
  cover_image?: string | null;
  type?: "coulisses" | "profil" | "educatif" | "annonce";
  linked_creator?: string | null;
  linked_event?: string | null;
  author?: string;
  reading_time?: number | null;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
};

const TYPES: Array<{ value: ArticleData["type"]; label: string }> = [
  { value: "coulisses", label: "Coulisses" },
  { value: "profil", label: "Profil" },
  { value: "educatif", label: "Éducatif" },
  { value: "annonce", label: "Annonce" },
];

const selectClass =
  "w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-noir focus:outline-none focus:border-accent transition-colors";
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
      <label className="block font-body text-xs uppercase tracking-widest text-noir-doux">
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
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t-2 border-noir pt-8 first:border-0 first:pt-0">
      <div>
        <p className="eyebrow text-noir-doux">{number}</p>
        <h2 className="font-display text-2xl leading-none mt-1">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ArticleForm({
  article = {},
  creators,
  events,
  saveAction,
  deleteAction,
}: {
  article?: ArticleData;
  creators: Creator[];
  events: EventLite[];
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const isEdit = !!article.id;

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-noir">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
            <Link
              href="/admin/articles"
              className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              ← Tous les articles
            </Link>
          </p>
          <h1 className="font-display text-4xl mt-2 leading-none">
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>
      </div>

      <form action={saveAction} className="space-y-10">
        {isEdit && <input type="hidden" name="id" value={article.id} />}

        <Section number="01" title="Identité">
          <Field label="Titre *">
            <Input
              name="title"
              defaultValue={article.title ?? ""}
              required
              maxLength={140}
              placeholder="Pourquoi la riso a colonisé les caves de Lausanne."
            />
          </Field>
          <Field label="Sous-titre (optionnel)">
            <Input
              name="subtitle"
              defaultValue={article.subtitle ?? ""}
              maxLength={140}
            />
          </Field>
          <Field
            label="Slug URL"
            hint="Auto-généré depuis le titre si vide. Ne change pas après publication."
          >
            <Input
              name="slug"
              defaultValue={article.slug ?? ""}
              placeholder="riso-caves-lausanne"
              pattern="^[a-z0-9-]*$"
            />
          </Field>
        </Section>

        <Section number="02" title="Type & métadonnées">
          <Field label="Type d'article *">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <label
                  key={t.value}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    defaultChecked={
                      article.type ? article.type === t.value : t.value === "coulisses"
                    }
                    required
                    className="peer sr-only"
                  />
                  <span className="inline-block px-4 py-2 border-2 border-noir font-body text-sm uppercase tracking-wider bg-creme peer-checked:bg-accent peer-checked:text-noir transition-colors">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Auteur affiché *">
              <Input
                name="author"
                defaultValue={article.author ?? "Gaël"}
                required
              />
            </Field>
            <Field label="Temps de lecture (min)">
              <Input
                type="number"
                name="reading_time"
                defaultValue={article.reading_time ?? 5}
                min={1}
                max={60}
              />
            </Field>
          </div>
          <Field label="Excerpt (250 chars max)">
            <textarea
              name="excerpt"
              defaultValue={article.excerpt ?? ""}
              maxLength={250}
              rows={3}
              className={textareaClass}
              placeholder="Résumé court de l'article. Affiché sur les cards et en méta SEO."
            />
          </Field>
        </Section>

        <Section number="03" title="Visuel">
          <Field
            label="URL image cover"
            hint="Pour V1 : /assets/riso-article-1.svg | /assets/riso-article-2.svg ou URL externe."
          >
            <Input
              name="cover_image"
              defaultValue={article.cover_image ?? ""}
              placeholder="/assets/riso-article-1.svg"
            />
          </Field>
        </Section>

        <Section number="04" title="Contenu">
          <p className="font-body text-sm text-noir-doux max-w-2xl leading-relaxed">
            Éditeur riche : titres H2/H3, gras/italique/souligné, listes,
            citation, lien, image (URL), embed YouTube, séparateur. Vimeo /
            Instagram / TikTok arriveront en Sprint 5.
          </p>
          <TiptapEditor
            name="content"
            htmlName="content_html"
            initialJSON={article.content as object | null}
            initialHTML={article.content_html ?? null}
            placeholder="Commence à écrire ton article…"
          />
        </Section>

        <Section number="05" title="Liens (optionnels)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Créateur lié">
              <select
                name="linked_creator"
                defaultValue={article.linked_creator ?? ""}
                className={selectClass}
              >
                <option value="">Aucun</option>
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.display_name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Event lié">
              <select
                name="linked_event"
                defaultValue={article.linked_event ?? ""}
                className={selectClass}
              >
                <option value="">Aucun</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section number="06" title="Statut & mise en avant">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Statut">
              <select
                name="status"
                defaultValue={article.status ?? "draft"}
                className={selectClass}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </Field>
            <Field label="Featured">
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-noir bg-creme cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={article.featured ?? false}
                  className="w-5 h-5 accent-accent"
                />
                <span className="font-body text-sm">
                  Affiché en home (Lecture longue)
                </span>
              </label>
            </Field>
          </div>
        </Section>

        <div className="flex items-center gap-3 pt-6 border-t-2 border-noir sticky bottom-0 bg-creme py-4 -mx-2 px-2 z-10">
          <Button type="submit" size="lg">
            {isEdit ? "Enregistrer" : "Créer l'article"} →
          </Button>
          <Link
            href="/admin/articles"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep px-2 py-1"
          >
            Annuler
          </Link>
        </div>
      </form>

      {isEdit && deleteAction && (
        <div className="border-t-2 border-noir pt-8 mt-12">
          <p className="eyebrow text-noir-doux mb-3">Zone de danger</p>
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (
                !confirm(
                  "Supprimer cet article définitivement ? Cette action est irréversible.",
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={article.id} />
            <button
              type="submit"
              className="font-body text-xs uppercase tracking-wider px-4 py-2 border-2 border-noir bg-creme text-noir hover:bg-noir hover:text-creme transition-colors"
            >
              Supprimer cet article
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
