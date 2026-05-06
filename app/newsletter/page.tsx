import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export const metadata = {
  title: "Newsletter — CREON",
  description:
    "Reçois chaque dimanche les events, créateurs et articles à pas manquer en Suisse romande.",
};

const issues = [
  {
    number: "n°12",
    date: "10 mars 2026",
    title: "Vernissages, fanzines et un sound design qui dérange",
    excerpt:
      "Trois events à Lausanne ce week-end, un portrait de Marius Pittet, et la nouvelle vague d’éditrices indé.",
  },
  {
    number: "n°11",
    date: "3 mars 2026",
    title: "Tout ce qu’on a vu pendant le festival photo",
    excerpt:
      "Compte-rendu de Vevey, sélection de 8 séries qui valent le détour, et le carnet d’adresses des photographes locaux.",
  },
  {
    number: "n°10",
    date: "25 février 2026",
    title: "Ouvrir un atelier : le guide pas-à-pas",
    excerpt:
      "Loyer, statut, sélection des membres : on a interviewé 4 ateliers qui marchent en Suisse romande.",
  },
];

export default function NewsletterPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-16 max-w-3xl mx-auto w-full text-center">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux mb-6">
          Newsletter dominicale
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.9]">
          Reçois{" "}
          <span className="bg-accent px-3 inline-block">l&apos;essentiel</span>{" "}
          chaque dimanche.
        </h1>
        <p className="font-body text-lg text-noir-doux mt-10 max-w-xl mx-auto leading-relaxed">
          ~600 mots. Trois events de la semaine, deux créateurs à suivre, un
          article long. Pas de spam, pas de publicité, désabonnement en un
          clic.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 mt-12 max-w-md mx-auto">
          <Input type="email" placeholder="ton@email.ch" required />
          <Button type="submit" size="md">
            S&apos;abonner
          </Button>
        </form>
        <p className="font-body text-xs text-noir-doux mt-6">
          Premier email envoyé dimanche prochain.
        </p>
      </section>

      <section className="border-t-2 border-noir px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
            Archives
          </p>
          <h2 className="font-display text-4xl sm:text-5xl leading-none mt-3">
            Derniers numéros
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <Card key={issue.number} className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Tag>{issue.number}</Tag>
                <span className="font-body text-xs uppercase tracking-widest text-noir-doux">
                  {issue.date}
                </span>
              </div>
              <h3 className="font-display text-xl leading-tight">
                {issue.title}
              </h3>
              <p className="font-body text-sm text-noir-doux leading-relaxed">
                {issue.excerpt}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
