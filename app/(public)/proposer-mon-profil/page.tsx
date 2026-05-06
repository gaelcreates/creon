import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

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
      {hint && (
        <p className="mono-meta text-noir-doux">{hint}</p>
      )}
    </div>
  );
}

export default function ProposerMonProfilPage() {
  return (
    <>
      {/* Hero */}
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
        <p className="eyebrow text-noir-doux mb-8">Le formulaire</p>
        <form className="space-y-8">
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
            hint="Choisis 1 à 3 catégories qui te décrivent le mieux."
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip key={cat}>{cat}</Chip>
              ))}
            </div>
          </FormField>

          <FormField
            number="06"
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
            Envoyer ma candidature →
          </Button>
        </form>
      </section>
    </>
  );
}
