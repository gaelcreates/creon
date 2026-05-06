import { redirect } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
        <span className="mono-meta uppercase text-noir-doux">{number}</span>
        <span className="block font-display text-2xl leading-none mt-1">
          {label}
        </span>
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
      <section className="px-6 lg:px-14 pt-12 pb-12 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">
          Candidature · sur invitation uniquement
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-12 items-end">
          <h1 className="font-display text-[clamp(56px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
            Propose<br />
            ton <span className="hl-block">profil</span>.
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[460px]">
            Tu es créateur·rice en Suisse — mode, musique, art visuel,
            photo, vidéo, design, artisanat ? Décris-nous ton univers en 5
            minutes. On étudie chaque candidature manuellement et on revient
            sous 7 jours.
          </p>
        </div>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      <section className="px-6 lg:px-14 py-16 max-w-[760px] mx-auto w-full">
        {sent ? (
          <div className="border-[2.5px] border-noir bg-creme-fonce p-8 shadow-[6px_6px_0_var(--color-noir)] space-y-4">
            <p className="eyebrow text-noir-doux">Candidature envoyée</p>
            <h2 className="font-display text-5xl leading-tight">
              Merci. On revient vers toi sous{" "}
              <span className="hl">7 jours</span>.
            </h2>
            <p className="text-base text-noir-doux leading-relaxed">
              On lit chaque candidature manuellement. Si on dit oui, tu
              recevras un email avec un lien magique pour ouvrir ton espace
              créateur et finaliser ton profil.
            </p>
          </div>
        ) : (
          <>
            <p className="eyebrow text-noir-doux mb-8">Le formulaire</p>
            {error && (
              <div className="border-2 border-noir bg-accent px-4 py-3 font-body text-sm mb-6">
                {error}
              </div>
            )}
            <form action={submitCandidacy} className="space-y-8">
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
                  rows={6}
                  required
                  placeholder="Je fais de la photo documentaire au moyen format. Je travaille en ce moment sur une série autour des bistrots de quartier en Suisse romande…"
                  className="w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-noir placeholder:text-noir-doux/50 focus:outline-none focus:border-accent focus:bg-creme-fonce transition-colors duration-150 resize-none"
                />
              </FormField>

              <Button type="submit" size="lg">
                Envoyer ma candidature →
              </Button>
            </form>
          </>
        )}
      </section>
    </>
  );
}
