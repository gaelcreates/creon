import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { submitInquiry } from "./actions";

export const metadata = {
  title: "Productions vidéo — CREON",
  description:
    "Le service de production vidéo CREON. Films institutionnels, captations, mariages, événementiel.",
};

type ReferenceRow = {
  id: string;
  slug: string;
  client_name: string;
  project_title: string;
  description: string | null;
  cover_image: string | null;
  video_url: string | null;
  tags: string[];
};

const PROJECT_TYPES = [
  "Film institutionnel",
  "Captation événement",
  "Mariage",
  "Restaurant / Hôtellerie",
  "Mode / Look book",
  "Documentaire court",
  "Autre",
];

const BUDGET_RANGES = [
  "< 2'000 CHF",
  "2'000 – 5'000 CHF",
  "5'000 – 10'000 CHF",
  "10'000 – 25'000 CHF",
  "> 25'000 CHF",
  "Pas encore défini",
];

const textareaClass =
  "w-full px-3.5 py-2.5 border border-noir bg-creme-clair rounded-md font-body text-[14px] text-noir placeholder:text-noir-doux/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-150 resize-none";
const selectClass =
  "w-full px-3.5 py-2.5 border border-noir bg-creme-clair rounded-md font-body text-[14px] text-noir focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-150";

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

export default async function ProductionsPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error;

  const supabase = await createClient();
  const { data: refs } = await supabase
    .from("productions_references")
    .select(
      "id, slug, client_name, project_title, description, cover_image, video_url, tags",
    )
    .eq("status", "published")
    .order("order_index", { ascending: true });

  const references = (refs ?? []) as ReferenceRow[];

  return (
    <>
      <section className="px-6 lg:px-14 pt-16 pb-12 lg:pt-20 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-5">
          Service interne · CREON crew
        </p>
        <h1 className="display-1 max-w-4xl">
          On filme. <span className="hl">Bien.</span>
        </h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          Films institutionnels, captations, événements, mode, mariages
          choisis. L&apos;équipe CREON produit des vidéos signature pour
          des marques et personnes qui ont quelque chose à dire.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <a
            href="#contact"
            className="px-5 py-2.5 border border-accent bg-accent text-noir font-body text-[14px] font-medium rounded-md hover:bg-accent-deep transition-colors"
          >
            Demander un devis →
          </a>
          <a
            href="#references"
            className="px-5 py-2.5 border border-noir bg-creme-clair text-noir font-body text-[14px] font-medium rounded-md hover:bg-noir hover:text-creme transition-colors"
          >
            Voir les références
          </a>
        </div>
      </section>

      <section
        id="references"
        className="border-t border-noir px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full"
      >
        <div className="flex items-baseline gap-3 mb-8">
          <span className="mono-meta text-noir-doux">01</span>
          <h2 className="heading-1">Références sélectionnées</h2>
        </div>

        {references.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-noir/30">
            <p className="heading-2 mb-3">Références en cours de publication.</p>
            <p className="small text-noir-doux">
              Les premiers projets arrivent sous peu. En attendant,{" "}
              <a
                href="#contact"
                className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4"
              >
                écris-nous directement
              </a>
              .
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {references.map((ref) => (
              <Card
                key={ref.id}
                hoverable
                className="overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-creme-fonce border-b border-noir overflow-hidden">
                  {ref.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ref.cover_image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <p className="mono-meta text-noir-doux">
                    {ref.client_name}
                  </p>
                  <h3 className="heading-3 leading-tight">
                    {ref.project_title}
                  </h3>
                  {ref.description && (
                    <p className="small text-noir-doux leading-snug line-clamp-2">
                      {ref.description}
                    </p>
                  )}
                  {ref.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-noir/15">
                      {ref.tags.slice(0, 3).map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-noir bg-creme-clair px-6 lg:px-14 py-14 lg:py-20">
        <div className="max-w-[1320px] mx-auto w-full">
          <div className="flex items-baseline gap-3 mb-8">
            <span className="mono-meta text-noir-doux">02</span>
            <h2 className="heading-1">Comment on bosse</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {[
              {
                t: "Brief court",
                d: "30 min de call ou un email détaillé. On comprend le contexte, le ton, la durée souhaitée et le budget.",
              },
              {
                t: "Devis ferme",
                d: "Sous 5 jours ouvrés. Pas de surprise : tout ce qui sera facturé est dans le devis.",
              },
              {
                t: "Production rapide",
                d: "Tournage compact, montage en parallèle. Premier rendu sous 2-3 semaines selon ampleur.",
              },
            ].map((step, i) => (
              <div key={i}>
                <p className="display-2 leading-none">0{i + 1}</p>
                <p className="eyebrow text-noir-doux mt-2 mb-2">{step.t}</p>
                <p className="small text-noir-doux leading-relaxed">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-noir px-6 lg:px-14 py-14 lg:py-20 max-w-[1320px] mx-auto w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <p className="eyebrow text-noir-doux mb-3">03 — Devis</p>
            <h2 className="display-2 mb-5">
              Décris ton projet.
              <br />
              On revient sous 5 jours.
            </h2>
            <p className="lead text-noir-doux">
              Pas de blabla, pas de réunion inutile. Un email avec le
              brief, on lit, on devise, on planifie.
            </p>
            <p className="mono-meta text-noir-doux mt-6">
              Préfère un email direct ?{" "}
              <a
                href="mailto:productions@creon.ch"
                className="text-accent-deep hover:text-accent transition-colors"
              >
                productions@creon.ch
              </a>
            </p>
          </div>

          <div>
            {sent ? (
              <Card className="p-8 border-accent">
                <p className="eyebrow text-noir-doux mb-2">Reçu ✓</p>
                <h3 className="heading-1 mb-3">
                  Merci. On revient vers toi sous{" "}
                  <span className="hl">5 jours</span>.
                </h3>
                <p className="body text-noir-doux">
                  On lit chaque message manuellement. Si urgent, écris à{" "}
                  <a
                    href="mailto:productions@creon.ch"
                    className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4"
                  >
                    productions@creon.ch
                  </a>
                  .
                </p>
              </Card>
            ) : (
              <>
                {error && (
                  <div className="border border-rouge-brique bg-rouge-brique/10 px-4 py-3 rounded-md font-body text-[14px] text-rouge-brique mb-6">
                    {error}
                  </div>
                )}
                <form action={submitInquiry} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nom *">
                      <Input name="name" required placeholder="Léa Dornier" />
                    </Field>
                    <Field label="Email *">
                      <Input
                        type="email"
                        name="email"
                        required
                        placeholder="lea@example.ch"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Téléphone">
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="+41 78 …"
                      />
                    </Field>
                    <Field label="Entreprise">
                      <Input
                        name="company"
                        placeholder="Atelier 13 SA"
                      />
                    </Field>
                  </div>
                  <Field label="Type de projet *">
                    <select
                      name="project_type"
                      required
                      className={selectClass}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choisir…
                      </option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Budget approximatif">
                    <select
                      name="budget_range"
                      className={selectClass}
                      defaultValue=""
                    >
                      <option value="">Pas encore défini</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Brief *"
                    hint="Contexte, ton, durée souhaitée, deadline. Plus c'est précis, plus le devis est fiable."
                  >
                    <textarea
                      name="message"
                      rows={6}
                      required
                      placeholder="On lance une nouvelle marque de mode upcyclée et on cherche une vidéo de présentation de 2 min pour Instagram + site. Tournage idéal en mai à Lausanne…"
                      className={textareaClass}
                    />
                  </Field>
                  <Button type="submit" variant="accent" size="lg">
                    Envoyer →
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
