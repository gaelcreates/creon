export const metadata = {
  title: "À propos — CREON",
  description: "Le manifeste de CREON et l'équipe derrière le média.",
};

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 lg:px-14 pt-12 pb-14 max-w-[1320px] mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">À propos · 06.05.26</p>
        <h1 className="font-display text-[clamp(56px,8.6vw,140px)] leading-[0.86] m-0 tracking-tight">
          On fait un<br />
          <span className="hl-block">magazine</span>.<br />
          Pas une plateforme.
        </h1>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      {/* 01 — Manifeste */}
      <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
          <p className="eyebrow text-noir-doux">01 — Manifeste</p>
          <div className="space-y-6 max-w-[720px] text-[18px] leading-relaxed">
            <p>
              CREON est né d&apos;un constat : la Suisse romande grouille de
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
              CREON, c&apos;est l&apos;inverse. Un média indépendant qui
              parcourt la scène locale, recommande les events qui valent le
              déplacement, donne une vraie page web à des créateurs
              qu&apos;on choisit un par un, et publie des articles qui
              parlent vraiment de comment ça se passe ici.
            </p>
            <p>
              Pas d&apos;algorithme. Pas de pub. Une newsletter dominicale,
              un site qu&apos;on alimente lentement, et une promesse :{" "}
              <span className="hl">on ne sélectionne que ce qu&apos;on défend.</span>
            </p>
          </div>
        </div>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      {/* 02 — Équipe */}
      <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
          <p className="eyebrow text-noir-doux">02 — Équipe</p>
          <div>
            <h2 className="font-display text-[44px] sm:text-6xl mt-0 mb-10 leading-[0.92]">
              Petite équipe.<br />Beaucoup d&apos;avis.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl">
              <article className="border-2 border-noir bg-creme p-5">
                <div className="aspect-square bg-creme-fonce border-2 border-noir mb-4 flex items-center justify-center">
                  <span className="font-display text-7xl text-noir/30 leading-none">
                    G
                  </span>
                </div>
                <p className="eyebrow text-noir-doux mb-1">
                  Fondateur · Édition
                </p>
                <h3 className="font-display text-3xl leading-none mt-1">
                  Gaël
                </h3>
                <p className="mt-3 text-sm text-noir-doux leading-relaxed">
                  Curation, écriture, photos, et tout le reste tant
                  qu&apos;on est petit.
                </p>
              </article>
            </div>
            <p className="mt-10 max-w-md text-sm text-noir-doux leading-relaxed">
              On cherche : un·e photographe contributeur, un·e éditeur·rice
              de newsletter. Si t&apos;es du genre,{" "}
              <a
                href="mailto:hello@creon.ch"
                className="text-accent border-b-2 border-accent hover:text-accent-deep"
              >
                écris-nous
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      {/* 03 — Édition */}
      <section className="px-6 lg:px-14 py-16 lg:py-20 max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
          <p className="eyebrow text-noir-doux">03 — Édition</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
            <div>
              <p className="font-display text-5xl leading-none">2026</p>
              <p className="mono-meta uppercase mt-2 mb-2">Année 1</p>
              <p className="text-sm text-noir-doux leading-relaxed">
                Lancement printemps · 1 newsletter par semaine.
              </p>
            </div>
            <div>
              <p className="font-display text-5xl leading-none">CH-Romande</p>
              <p className="mono-meta uppercase mt-2 mb-2">Périmètre</p>
              <p className="text-sm text-noir-doux leading-relaxed">
                Lausanne · Genève · Vevey · Fribourg · Neuchâtel · Bâle.
              </p>
            </div>
            <div>
              <p className="font-display text-5xl leading-none">∞</p>
              <p className="mono-meta uppercase mt-2 mb-2">Pubs · Algos</p>
              <p className="text-sm text-noir-doux leading-relaxed">
                Zéro. Indépendance financière par la newsletter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
