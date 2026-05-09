import { Card } from "@/components/ui/Card";
import { SectionDecor } from "@/components/SectionDecor";

export const metadata = {
  title: "À propos — CREON",
  description:
    "La plateforme suisse pour les créateurs : manifeste, équipe, périmètre.",
};

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
    <section className="border-t border-noir px-6 lg:px-14 py-12 lg:py-16 max-w-[1320px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
        <div>
          <span className="mono-meta text-noir-doux">{number}</span>
          <h2 className="heading-1 mt-1">{title}</h2>
        </div>
        <div className="max-w-[720px]">{children}</div>
      </div>
    </section>
  );
}

export default function AProposPage() {
  return (
    <>
      <section className="relative px-6 lg:px-14 pt-28 pb-12 lg:pt-32 max-w-[1320px] mx-auto w-full overflow-hidden">
        <SectionDecor variant="manifesto" />
        <p className="eyebrow text-noir-doux mb-5">À propos · 2026</p>
        <h1 className="display-1 max-w-4xl">
          On fait une <span className="hl">plateforme</span>.<br />
          Pas un magazine.
        </h1>
      </section>

      <Section number="01" title="Manifeste">
        <div className="space-y-6 lead leading-relaxed">
          <p>
            CREON est née d&apos;un constat : la Suisse romande grouille de
            créateurs qu&apos;on ne voit jamais sortir d&apos;Instagram. Des
            photographes, des stylistes, des graphistes, des musiciens qui
            font de l&apos;excellent travail dans des ateliers sans vitrine.
          </p>
          <p>
            En face : des médias culturels qui couvrent surtout Paris et
            Berlin, et un Internet qui pousse toujours les mêmes têtes vers
            le haut.
          </p>
          <p>
            CREON, c&apos;est l&apos;inverse. Une plateforme où les
            créateurs publient eux-mêmes leurs posts, articles et services.
            Une équipe qui sélectionne les events qui valent le déplacement.
            Des dossiers signés par CREON crew. Pas
            d&apos;algorithme. Pas de pub.{" "}
            <span className="hl-marker text-noir">
              On ne sélectionne que ce qu&apos;on défend.
            </span>
          </p>
        </div>
      </Section>

      <Section number="02" title="Équipe">
        <div className="space-y-6">
          <p className="lead">
            Petite équipe. Beaucoup d&apos;avis.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
            <Card className="p-5">
              <div className="aspect-square bg-creme-fonce border border-noir rounded mb-4 flex items-center justify-center">
                <span className="display-1 text-noir/30 leading-none">G</span>
              </div>
              <p className="mono-meta text-noir-doux">Fondateur · Édition</p>
              <h3 className="heading-3 mt-1">Gaël</h3>
              <p className="small text-noir-doux mt-3 leading-relaxed">
                Curation, écriture, photos, et tout le reste tant qu&apos;on
                est petit.
              </p>
            </Card>
          </div>
          <p className="small text-noir-doux max-w-md">
            On cherche : un·e photographe contributeur, un·e éditeur·rice
            de newsletter. Si t&apos;es du genre,{" "}
            <a
              href="mailto:hello@creon.ch"
              className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
            >
              écris-nous
            </a>
            .
          </p>
        </div>
      </Section>

      <Section number="03" title="Périmètre">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="display-2 leading-none">2026</p>
            <p className="eyebrow text-noir-doux mt-2 mb-1">Année 1</p>
            <p className="small text-noir-doux leading-relaxed">
              Lancement printemps · 1 newsletter par semaine.
            </p>
          </div>
          <div>
            <p className="display-2 leading-none">CH-Romande</p>
            <p className="eyebrow text-noir-doux mt-2 mb-1">Géographie</p>
            <p className="small text-noir-doux leading-relaxed">
              Lausanne · Genève · Vevey · Fribourg · Neuchâtel · Bâle.
            </p>
          </div>
          <div>
            <p className="display-2 leading-none">∞</p>
            <p className="eyebrow text-noir-doux mt-2 mb-1">Pubs · Algos</p>
            <p className="small text-noir-doux leading-relaxed">
              Zéro. Indépendance financière par la newsletter.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
