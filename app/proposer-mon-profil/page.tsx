import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

export const metadata = {
  title: "Proposer mon profil — CREON",
  description:
    "Tu es créateur en Suisse ? Décris-nous ton univers et on étudie ta candidature manuellement.",
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

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-body text-xs uppercase tracking-widest text-noir font-medium">
        {label}
      </label>
      {children}
      {hint && (
        <p className="font-body text-xs text-noir-doux">{hint}</p>
      )}
    </div>
  );
}

export default function ProposerMonProfilPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-3xl mx-auto w-full">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux mb-6">
          Candidature créateur
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[0.9]">
          Propose ton profil.
        </h1>
        <p className="font-body text-lg text-noir-doux mt-8 max-w-xl leading-relaxed">
          Tu es créateur en Suisse — mode, musique, art visuel, photo, vidéo,
          design, artisanat ? Décris-nous ton univers en 5 min. On étudie
          chaque candidature manuellement et on revient vers toi sous 7
          jours.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-2xl mx-auto w-full">
        <form className="space-y-7">
          <FormField label="Nom complet">
            <Input name="name" placeholder="Léa Dornier" required />
          </FormField>

          <FormField label="Email">
            <Input
              type="email"
              name="email"
              placeholder="ton@email.ch"
              required
            />
          </FormField>

          <FormField label="Instagram (sans @)">
            <Input name="instagram" placeholder="lea.dornier" required />
          </FormField>

          <FormField label="Ville">
            <Input name="city" placeholder="Genève, Lausanne…" required />
          </FormField>

          <FormField
            label="Catégories"
            hint="Choisis 1 à 3 catégories qui te décrivent le mieux."
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip key={cat}>{cat}</Chip>
              ))}
            </div>
          </FormField>

          <FormField
            label="Pitch"
            hint="300 caractères max. Décris ton univers, ce que tu fabriques, où tu en es."
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
            Envoyer ma candidature
          </Button>
        </form>
      </section>
    </>
  );
}
