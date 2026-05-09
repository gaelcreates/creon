import { redirect } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryPicker } from "@/components/CategoryPicker";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, randomSuffix } from "@/lib/slug";

export const metadata = {
  title: "Proposer mon profil — CREON",
  description:
    "Tu es créateur·rice en Suisse ? Décris-nous ton univers et on étudie ta candidature manuellement.",
};

const categories = [
  "Mode",
  "Musique",
  "Art visuel",
  "Photo",
  "Vidéo",
  "Design",
  "Artisanat",
  "Autre",
];

async function submitCandidacy(formData: FormData) {
  "use server";
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const instagram = (formData.get("instagram") as string)?.trim().replace(/^@/, "");
  const city = (formData.get("city") as string)?.trim();
  const pitch = (formData.get("pitch") as string)?.trim();
  const cats = (formData.get("categories") as string)
    ?.split(",")
    .map((c) => c.trim())
    .filter(Boolean) ?? [];

  if (!name || !email || !instagram || !city || !pitch) {
    redirect(
      `/proposer-mon-profil?error=${encodeURIComponent("Tous les champs sont requis")}`,
    );
  }
  if (!email.includes("@")) {
    redirect(
      `/proposer-mon-profil?error=${encodeURIComponent("Email invalide")}`,
    );
  }

  const admin = createAdminClient();
  const handle = `${slugify(name)}-${randomSuffix(4)}`;

  const { error } = await admin.from("creators").insert({
    email,
    handle,
    display_name: name,
    short_bio: pitch.slice(0, 160),
    long_bio: pitch,
    city,
    categories: cats,
    links: [
      {
        label: "Instagram",
        url: `https://instagram.com/${instagram}`,
        type: "instagram",
      },
    ],
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      redirect(
        `/proposer-mon-profil?error=${encodeURIComponent("Cet email a déjà candidaté")}`,
      );
    }
    redirect(
      `/proposer-mon-profil?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/proposer-mon-profil?sent=1`);
}

const textareaClass =
  "w-full px-3.5 py-2.5 border border-noir bg-creme-clair rounded-md font-body text-[14px] text-noir placeholder:text-noir-doux/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-150 resize-none";

function FormField({
  label,
  number,
  hint,
  children,
}: {
  label: string;
  number: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="mono-meta text-noir-doux">{number}</span>
        <span className="block heading-3 mt-0.5">{label}</span>
      </label>
      {children}
      {hint && <p className="mono-meta text-noir-doux">{hint}</p>}
    </div>
  );
}

export default async function ProposerMonProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error;

  return (
    <>
      <section className="px-6 lg:px-14 pt-16 pb-10 lg:pt-20 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-5">
          Candidature · sur invitation uniquement
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-end">
          <h1 className="display-1">
            Propose<br />
            ton <span className="hl">profil</span>.
          </h1>
          <p className="lead text-noir-doux max-w-[460px]">
            Tu es créateur·rice en Suisse ? Décris-nous ton univers en 5
            minutes. On étudie chaque candidature manuellement et on revient
            sous 7 jours.
          </p>
        </div>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-12 max-w-[760px] mx-auto w-full">
        {sent ? (
          <Card className="p-8 space-y-4 border-accent">
            <p className="eyebrow text-noir-doux">Candidature envoyée</p>
            <h2 className="heading-1">
              Merci. On revient vers toi sous{" "}
              <span className="hl">7 jours</span>.
            </h2>
            <p className="body text-noir-doux leading-relaxed">
              On lit chaque candidature manuellement. Si on dit oui, tu
              recevras un email avec un lien magique pour ouvrir ton espace
              créateur et finaliser ton profil.
            </p>
          </Card>
        ) : (
          <>
            <p className="eyebrow text-noir-doux mb-8">Le formulaire</p>
            {error && (
              <div className="border border-rouge-brique bg-rouge-brique/10 px-4 py-3 rounded-md font-body text-[14px] text-rouge-brique mb-6">
                {error}
              </div>
            )}
            <form action={submitCandidacy} className="space-y-7">
              <FormField number="01" label="Nom complet">
                <Input name="name" placeholder="Léa Dornier" required />
              </FormField>

              <FormField number="02" label="Email">
                <Input
                  type="email"
                  name="email"
                  placeholder="ton@email.ch"
                  required
                />
              </FormField>

              <FormField number="03" label="Instagram (sans @)">
                <Input name="instagram" placeholder="lea.dornier" required />
              </FormField>

              <FormField number="04" label="Ville">
                <Input name="city" placeholder="Genève, Lausanne…" required />
              </FormField>

              <FormField
                number="05"
                label="Catégories"
                hint="1 à 3 catégories. Cliquer pour sélectionner."
              >
                <CategoryPicker name="categories" options={categories} max={3} />
              </FormField>

              <FormField
                number="06"
                label="Pitch"
                hint="300 caractères max. Ce que tu fabriques, où tu en es."
              >
                <textarea
                  name="pitch"
                  maxLength={300}
                  rows={5}
                  required
                  placeholder="Je fais de la photo documentaire au moyen format. Je travaille en ce moment sur une série autour des bistrots de quartier en Suisse romande…"
                  className={textareaClass}
                />
              </FormField>

              <Button type="submit" variant="accent" size="lg">
                Envoyer ma candidature →
              </Button>
            </form>
          </>
        )}
      </section>
    </>
  );
}
