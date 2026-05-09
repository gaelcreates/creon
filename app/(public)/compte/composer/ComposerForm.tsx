"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { cn } from "@/lib/cn";

type PostType = "short" | "article" | "service";

export type PostData = {
  id?: string;
  type?: PostType;
  title?: string | null;
  content?: object | null;
  content_html?: string | null;
  cover_image?: string | null;
  gallery_images?: string[];
  service_url?: string | null;
  service_price?: string | null;
  service_cta?: string | null;
  tags?: string[];
  status?: "draft" | "published" | "archived";
};

type Props = {
  post?: PostData;
  initialType?: PostType;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  archiveAction?: (formData: FormData) => Promise<void>;
};

const TYPE_INFO: Record<PostType, { label: string; description: string }> = {
  short: {
    label: "Post court",
    description: "Tweet-like · texte court · jusqu'à 4 images",
  },
  article: {
    label: "Article",
    description: "Long format · cover · éditeur riche complet",
  },
  service: {
    label: "Service",
    description: "Vitrine produit · cover · prix · CTA externe",
  },
};

const textareaClass =
  "w-full px-3.5 py-2.5 border border-noir bg-creme-clair rounded-md font-body text-[14px] text-noir placeholder:text-noir-doux/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-150 resize-none";

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
      <label className="block eyebrow text-noir-doux">{label}</label>
      {children}
      {hint && <p className="mono-meta text-noir-doux">{hint}</p>}
    </div>
  );
}

export function ComposerForm({
  post = {},
  initialType = "short",
  saveAction,
  deleteAction,
  archiveAction,
}: Props) {
  const [type, setType] = useState<PostType>(post.type ?? initialType);
  const [shortText, setShortText] = useState(
    post.type === "short" && post.content_html
      ? post.content_html.replace(/<[^>]+>/g, "")
      : "",
  );

  const isEdit = !!post.id;
  const tagsString = (post.tags ?? []).join(", ");

  return (
    <form action={saveAction} className="space-y-8">
      {isEdit && <input type="hidden" name="id" value={post.id} />}

      {/* Type selector */}
      <div className="border border-noir bg-creme-clair rounded-lg overflow-hidden">
        <div className="grid grid-cols-3">
          {(["short", "article", "service"] as PostType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              disabled={isEdit}
              className={cn(
                "px-4 py-4 text-left border-r border-noir last:border-r-0 transition-colors",
                type === t
                  ? "bg-accent text-noir"
                  : "hover:bg-creme-fonce text-noir-doux",
                isEdit && "cursor-not-allowed opacity-70",
              )}
            >
              <p className="font-body text-[14px] font-medium">
                {TYPE_INFO[t].label}
              </p>
              <p
                className={cn(
                  "mono-meta mt-1",
                  type === t ? "text-noir/70" : "text-noir-doux",
                )}
              >
                {TYPE_INFO[t].description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden type field */}
      <input type="hidden" name="type" value={type} />

      {/* Title — optional for short, required for article/service */}
      {(type === "article" || type === "service") && (
        <Field label="Titre *">
          <Input
            name="title"
            defaultValue={post.title ?? ""}
            required
            maxLength={140}
            placeholder={
              type === "article"
                ? "Pourquoi la riso a colonisé les caves de Lausanne."
                : "Tirage riso A3, 2 couleurs, 50 ex."
            }
          />
        </Field>
      )}
      {type === "short" && (
        <Field label="Titre (optionnel)">
          <Input
            name="title"
            defaultValue={post.title ?? ""}
            maxLength={140}
            placeholder="Une accroche courte si tu veux."
          />
        </Field>
      )}

      {/* Cover image — required for article and service, optional for short */}
      {type !== "short" && (
        <Field
          label={`Image cover ${type === "article" ? "*" : ""}`}
          hint="JPG, PNG ou WebP. Ratio 16:10 idéal."
        >
          <ImageUploader
            name="cover_image"
            defaultValue={post.cover_image}
            folder="creators"
            aspect="16/10"
          />
        </Field>
      )}

      {/* Content */}
      {type === "short" ? (
        <>
          <Field label="Texte (max 500 chars)">
            <textarea
              name="content_html"
              defaultValue={shortText}
              onChange={(e) => setShortText(e.target.value)}
              maxLength={500}
              rows={5}
              className={textareaClass}
              placeholder="Ce que tu veux partager. Court, direct, voix perso."
            />
            <p className="mono-meta text-noir-doux mt-1">
              {shortText.length} / 500
            </p>
          </Field>
          <Field label="Galerie (jusqu'à 4 images)">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <ImageUploader
                  key={i}
                  name={`gallery_${i}`}
                  defaultValue={post.gallery_images?.[i - 1] ?? null}
                  folder="creators"
                  shape="square"
                />
              ))}
            </div>
          </Field>
        </>
      ) : (
        <Field label="Contenu">
          <TiptapEditor
            name="content"
            htmlName="content_html"
            initialJSON={post.content ?? null}
            initialHTML={post.content_html ?? null}
            placeholder="Démarre ton article…"
          />
        </Field>
      )}

      {/* Service-only fields */}
      {type === "service" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prix indicatif" hint="Ex: 'Dès 50 CHF', 'Sur devis'.">
              <Input
                name="service_price"
                defaultValue={post.service_price ?? ""}
                placeholder="Dès 50 CHF"
              />
            </Field>
            <Field label="Label du bouton">
              <Input
                name="service_cta"
                defaultValue={post.service_cta ?? "Découvrir"}
              />
            </Field>
          </div>
          <Field label="URL externe (où on commande / contacte)">
            <Input
              type="url"
              name="service_url"
              defaultValue={post.service_url ?? ""}
              placeholder="https://…"
            />
          </Field>
        </>
      )}

      {/* Tags */}
      <Field label="Tags" hint="Jusqu'à 5 mots-clés, séparés par des virgules.">
        <Input
          name="tags"
          defaultValue={tagsString}
          placeholder="Mode, Atelier, Lausanne"
        />
      </Field>

      {/* Status */}
      <Field label="Statut">
        <div className="flex gap-2">
          {(["draft", "published"] as const).map((s) => (
            <label key={s} className="cursor-pointer">
              <input
                type="radio"
                name="status"
                value={s}
                defaultChecked={(post.status ?? "draft") === s}
                className="peer sr-only"
              />
              <span className="inline-block px-4 py-2 border border-noir font-body text-[13px] font-medium rounded-md bg-creme-clair text-noir peer-checked:bg-accent peer-checked:border-accent transition-colors">
                {s === "draft" ? "Brouillon" : "Publié"}
              </span>
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-3 pt-6 border-t border-noir sticky bottom-0 bg-creme py-4 -mx-2 px-2 z-10">
        <Button type="submit" variant="accent" size="lg">
          {isEdit ? "Enregistrer" : "Créer"} →
        </Button>
        <Link
          href="/compte/contenus"
          className="mono-meta text-noir-doux hover:text-accent-deep transition-colors"
        >
          Annuler
        </Link>
        {isEdit && archiveAction && (
          <form action={archiveAction} className="ml-auto">
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="mono-meta text-noir-doux hover:text-noir transition-colors"
            >
              Archiver
            </button>
          </form>
        )}
        {isEdit && deleteAction && (
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (
                !confirm(
                  "Supprimer ce contenu définitivement ? Action irréversible.",
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="mono-meta text-rouge-brique hover:underline transition-colors"
            >
              Supprimer
            </button>
          </form>
        )}
      </div>
    </form>
  );
}
