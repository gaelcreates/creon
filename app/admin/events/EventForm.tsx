"use client";

import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DateTimePickerInput } from "@/components/admin/DateTimePickerInput";

type Creator = { id: string; display_name: string };

export type EventData = {
  id?: string;
  title?: string;
  slug?: string;
  short_description?: string | null;
  cover_image?: string | null;
  date_start?: string;
  date_end?: string | null;
  city?: string;
  venue?: string;
  venue_address?: string | null;
  categories?: string[];
  external_url?: string | null;
  external_label?: string | null;
  price_info?: string | null;
  linked_creator?: string | null;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
};

const CITIES = [
  "Lausanne",
  "Genève",
  "Zurich",
  "Berne",
  "Bâle",
  "Vevey",
  "Fribourg",
  "Neuchâtel",
  "Bulle",
  "Sion",
  "Lugano",
  "Autre",
];

const CATEGORIES = [
  "Mode",
  "Musique",
  "Art visuel",
  "Photo",
  "Vidéo",
  "Design",
  "Artisanat",
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
    <section className="space-y-4">
      <div>
        <p className="eyebrow text-noir-doux">{number}</p>
        <h2 className="font-display text-2xl leading-none mt-1">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function EventForm({
  event = {},
  creators,
  saveAction,
  deleteAction,
}: {
  event?: EventData;
  creators: Creator[];
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const isEdit = !!event.id;

  return (
    <div className="space-y-10 max-w-3xl">
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-noir">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
            <Link
              href="/admin/events"
              className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              ← Tous les events
            </Link>
          </p>
          <h1 className="font-display text-4xl mt-2 leading-none">
            {isEdit ? "Modifier l'event" : "Nouvel event"}
          </h1>
        </div>
      </div>

      <form action={saveAction} className="space-y-10">
        {isEdit && <input type="hidden" name="id" value={event.id} />}

        <Section number="01" title="Identité">
          <Field label="Titre *">
            <Input
              name="title"
              defaultValue={event.title ?? ""}
              required
              maxLength={120}
              placeholder="Vernissage — Atelier 13"
            />
          </Field>
          <Field
            label="Slug URL"
            hint="Auto-généré depuis le titre si vide. Ne change pas après publication."
          >
            <Input
              name="slug"
              defaultValue={event.slug ?? ""}
              placeholder="vernissage-atelier-13"
              pattern="^[a-z0-9-]*$"
            />
          </Field>
          <Field label="Description courte (160 chars max)">
            <textarea
              name="short_description"
              defaultValue={event.short_description ?? ""}
              maxLength={160}
              rows={3}
              className={textareaClass}
              placeholder="Une phrase qui donne envie de venir."
            />
          </Field>
        </Section>

        <Section number="02" title="Date & lieu">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date & heure de début *">
              <DateTimePickerInput
                name="date_start"
                defaultValue={event.date_start ?? undefined}
                required
                placeholder="Date de début…"
              />
            </Field>
            <Field label="Date & heure de fin (optionnel)">
              <DateTimePickerInput
                name="date_end"
                defaultValue={event.date_end ?? undefined}
                placeholder="Date de fin…"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Ville *">
              <select
                name="city"
                defaultValue={event.city ?? ""}
                required
                className={selectClass}
              >
                <option value="">Choisir…</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Lieu *">
              <Input
                name="venue"
                defaultValue={event.venue ?? ""}
                required
                placeholder="Atelier 13, Le Bourg, Halle 6…"
              />
            </Field>
          </div>
          <Field label="Adresse (optionnel)">
            <Input
              name="venue_address"
              defaultValue={event.venue_address ?? ""}
              placeholder="Rue, n°, code postal, ville"
            />
          </Field>
        </Section>

        <Section number="03" title="Catégories">
          <CategoryPicker
            name="categories"
            options={CATEGORIES}
            max={3}
          />
        </Section>

        <Section number="04" title="Visuel">
          <Field
            label="URL image cover"
            hint="Pour V1 : /assets/riso-event-1.svg | /assets/riso-event-2.svg | /assets/riso-event-3.svg ou URL externe. Upload réel en Sprint 4."
          >
            <Input
              name="cover_image"
              defaultValue={event.cover_image ?? ""}
              placeholder="/assets/riso-event-1.svg"
            />
          </Field>
        </Section>

        <Section number="05" title="Inscription externe">
          <Field
            label="URL externe (billetterie, RSVP, Eventbrite…)"
            hint="Optionnel. Si présent, un bouton apparaît sur la page event."
          >
            <Input
              type="url"
              name="external_url"
              defaultValue={event.external_url ?? ""}
              placeholder="https://billetterie.example.ch/event-xyz"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Label du bouton">
              <Input
                name="external_label"
                defaultValue={event.external_label ?? "S'inscrire"}
              />
            </Field>
            <Field label="Info prix (texte libre)">
              <Input
                name="price_info"
                defaultValue={event.price_info ?? ""}
                placeholder="Gratuit · CHF 5 · dès CHF 15…"
              />
            </Field>
          </div>
        </Section>

        <Section number="06" title="Créateur lié (optionnel)">
          <Field label="Créateur">
            <select
              name="linked_creator"
              defaultValue={event.linked_creator ?? ""}
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
        </Section>

        <Section number="07" title="Statut & mise en avant">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Statut">
              <select
                name="status"
                defaultValue={event.status ?? "draft"}
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
                  defaultChecked={event.featured ?? false}
                  className="w-5 h-5 accent-accent"
                />
                <span className="font-body text-sm">
                  Affiché en home (Cette semaine)
                </span>
              </label>
            </Field>
          </div>
        </Section>

        <div className="flex items-center gap-3 pt-6 border-t-2 border-noir sticky bottom-0 bg-creme py-4 -mx-2 px-2">
          <Button type="submit" size="lg">
            {isEdit ? "Enregistrer" : "Créer l'event"} →
          </Button>
          <Link
            href="/admin/events"
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
                  "Supprimer cet event définitivement ? Cette action est irréversible.",
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={event.id} />
            <button
              type="submit"
              className="font-body text-xs uppercase tracking-wider px-4 py-2 border-2 border-noir bg-creme text-noir hover:bg-noir hover:text-creme transition-colors"
            >
              Supprimer cet event
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
