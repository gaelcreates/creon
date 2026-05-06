"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryPicker } from "@/components/CategoryPicker";
import { ImageUploader } from "@/components/ui/ImageUploader";

const CATEGORIES = [
  "Mode",
  "Musique",
  "Art visuel",
  "Photo",
  "Vidéo",
  "Design",
  "Artisanat",
];

type LinkItem = { label: string; url: string; type?: string };

type CompteFormProps = {
  creator: {
    id: string;
    email: string;
    handle: string;
    display_name: string;
    short_bio: string | null;
    long_bio: string | null;
    profile_image: string | null;
    cover_image: string | null;
    city: string | null;
    canton: string | null;
    categories: string[];
    links: LinkItem[];
  };
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
};

const textareaClass =
  "w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-noir placeholder:text-noir-doux/50 focus:outline-none focus:border-accent focus:bg-creme-fonce transition-colors duration-150 resize-none";
const selectClass =
  "w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-noir focus:outline-none focus:border-accent transition-colors";

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
];
const CANTONS = ["VD", "GE", "ZH", "BE", "BS", "FR", "NE", "VS", "TI"];

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
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t-2 border-noir pt-8 first:border-0 first:pt-0">
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

function LinksEditor({
  name,
  initial,
}: {
  name: string;
  initial: LinkItem[];
}) {
  const [links, setLinks] = useState<LinkItem[]>(
    initial.length > 0 ? initial : [{ label: "", url: "" }],
  );

  function add() {
    setLinks([...links, { label: "", url: "" }]);
  }
  function remove(idx: number) {
    setLinks(links.filter((_, i) => i !== idx));
  }
  function update(idx: number, field: "label" | "url", value: string) {
    setLinks(
      links.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    );
  }

  return (
    <>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div
            key={i}
            className="grid grid-cols-[140px_1fr_44px] gap-2 items-stretch"
          >
            <input
              value={link.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Instagram"
              className="px-3 py-2.5 border-2 border-noir bg-creme font-body text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <input
              value={link.url}
              onChange={(e) => update(i, "url", e.target.value)}
              placeholder="https://instagram.com/…"
              type="url"
              className="px-3 py-2.5 border-2 border-noir bg-creme font-body text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="border-2 border-noir bg-creme font-body text-sm hover:bg-noir hover:text-creme transition-colors"
              title="Supprimer ce lien"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="font-body text-xs uppercase tracking-widest underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep mt-3"
      >
        + Ajouter un lien
      </button>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          links.filter((l) => l.label.trim() && l.url.trim()),
        )}
      />
    </>
  );
}

export function CompteForm({
  creator,
  saveAction,
  deleteAction,
}: CompteFormProps) {
  const initials = creator.display_name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-10 max-w-3xl">
      <form action={saveAction} className="space-y-10">
        <Section
          number="01"
          title="Identité"
          description="Ce qui apparaît en haut de ta page publique."
        >
          <Field label="Photo de profil" hint="Carrée, ratio 1:1.">
            <ImageUploader
              name="profile_image"
              defaultValue={creator.profile_image}
              folder="creators"
              shape="square"
            />
          </Field>

          <Field label="Nom d'auteur·rice *">
            <Input
              name="display_name"
              defaultValue={creator.display_name}
              required
              maxLength={80}
            />
          </Field>

          <Field
            label="Handle (URL de ton profil)"
            hint={`creon.ch/createurs/<handle>. Lettres minuscules, chiffres et tirets uniquement. Changer casse les anciens liens partagés.`}
          >
            <Input
              name="handle"
              defaultValue={creator.handle}
              required
              pattern="^[a-z0-9-]+$"
              minLength={2}
              maxLength={60}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
            <Field label="Ville">
              <select
                name="city"
                defaultValue={creator.city ?? ""}
                className={selectClass}
              >
                <option value="">—</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Canton">
              <select
                name="canton"
                defaultValue={creator.canton ?? ""}
                className={selectClass}
              >
                <option value="">—</option>
                {CANTONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section number="02" title="Bio">
          <Field label="Bio courte (160 chars max)" hint="Affichée sur les cards de l'annuaire.">
            <textarea
              name="short_bio"
              defaultValue={creator.short_bio ?? ""}
              maxLength={160}
              rows={2}
              className={textareaClass}
              placeholder="Une phrase qui te résume."
            />
          </Field>
          <Field
            label="Bio longue"
            hint="Affichée sur ta page publique. Saute des lignes pour créer des paragraphes."
          >
            <textarea
              name="long_bio"
              defaultValue={creator.long_bio ?? ""}
              rows={6}
              className={textareaClass}
              placeholder="Raconte ton parcours, ce que tu fabriques, où tu travailles."
            />
          </Field>
        </Section>

        <Section
          number="03"
          title="Catégories"
          description="1 à 3 catégories. Cliquer pour sélectionner."
        >
          <CategoryPicker
            name="categories"
            options={CATEGORIES}
            max={3}
            initial={creator.categories}
          />
        </Section>

        <Section
          number="04"
          title="Image cover (bannière)"
          description="Affichée tout en haut de ta page publique. Ratio 21:9 idéal. Optionnel."
        >
          <Field label="Image cover" hint="Optionnel. Si absent, fond beige texturé.">
            <ImageUploader
              name="cover_image"
              defaultValue={creator.cover_image}
              folder="creators"
              shape="wide"
            />
          </Field>
        </Section>

        <Section
          number="05"
          title="Liens"
          description="Instagram, site, shop, Spotify, Are.na, etc. Affichés sur ta page publique."
        >
          <LinksEditor name="links" initial={creator.links} />
        </Section>

        <Section
          number="06"
          title="Compte"
          description="Pour V1, change d'email = contact équipe (hello@creon.ch)."
        >
          <Field label="Email de connexion">
            <input
              value={creator.email}
              disabled
              className="w-full px-4 py-3 border-2 border-noir bg-creme-fonce font-body text-base text-noir-doux cursor-not-allowed"
            />
          </Field>
        </Section>

        <div className="flex items-center gap-3 pt-6 border-t-2 border-noir sticky bottom-0 bg-creme py-4 -mx-2 px-2 z-10">
          <Button type="submit" size="lg">
            Enregistrer →
          </Button>
          <Link
            href={`/createurs/${creator.handle}`}
            target="_blank"
            className="font-body text-sm uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep px-2 py-1"
          >
            Voir ma page publique ↗
          </Link>
        </div>
      </form>

      <div className="border-t-2 border-noir pt-8 mt-12">
        <p className="eyebrow text-noir-doux mb-3">Zone de danger</p>
        <p className="font-body text-sm text-noir-doux mb-4 max-w-md">
          Supprimer ton compte rend ton profil invisible. Tes events liés
          restent attribués historiquement mais ne pointent plus vers ta page.
        </p>
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (
              !confirm(
                "Supprimer ton compte CREON ? Action réversible uniquement par contact direct avec l'équipe.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="font-body text-xs uppercase tracking-wider px-4 py-2 border-2 border-noir bg-creme text-noir hover:bg-noir hover:text-creme transition-colors"
          >
            Supprimer mon compte
          </button>
        </form>
      </div>
    </div>
  );
}
