import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "À propos — CREON",
  description: "Le manifeste de CREON et l'équipe derrière le média.",
};

export default function AProposPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-3xl mx-auto w-full">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux mb-6">
          À propos
        </p>
        <h1 className="font-display text-6xl sm:text-8xl leading-[0.9]">
          Le <span className="bg-accent px-3 inline-block">manifeste</span>
        </h1>
      </section>

      <section className="px-6 py-12 max-w-3xl mx-auto w-full space-y-7 font-body text-lg leading-relaxed">
        <p>
          CREON est né d&apos;un constat : la Suisse romande grouille de
          créateurs qu&apos;on ne voit jamais sortir d&apos;Instagram. Des
          photographes, des stylistes, des graphistes, des musiciens qui font
          de l&apos;excellent travail dans des ateliers sans vitrine.
        </p>
        <p>
          En face : des médias culturels qui couvrent surtout Paris et Berlin,
          et un Internet qui pousse toujours les mêmes têtes vers le haut.
        </p>
        <p>
          CREON, c&apos;est l&apos;inverse. Un média indépendant qui parcourt
          la scène locale, recommande les events qui valent le déplacement,
          donne une vraie page web à des créateurs qu&apos;on choisit un par
          un, et publie des articles qui parlent vraiment de comment ça se
          passe ici.
        </p>
        <p>
          Pas d&apos;algorithme. Pas de pub. Une newsletter dominicale, un
          site qu&apos;on alimente lentement, et une promesse :{" "}
          <span className="bg-accent px-1">on ne sélectionne que ce qu&apos;on défend.</span>
        </p>
      </section>

      <section className="border-t-2 border-noir px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="font-display text-4xl sm:text-5xl leading-none mb-12">
          L&apos;équipe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-creme-fonce border-2 border-noir flex items-center justify-center font-display text-2xl">
                G
              </div>
              <div>
                <h3 className="font-display text-2xl leading-tight">Gaël</h3>
                <p className="font-body text-xs uppercase tracking-widest text-noir-doux mt-1">
                  Fondateur · Édition
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-noir-doux leading-relaxed">
              Curation, écriture, photos, et tout le reste tant qu&apos;on est
              petit.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
