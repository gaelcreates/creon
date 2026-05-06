export const metadata = {
  title: "Mentions légales — CREON",
  description:
    "Éditeur, hébergeur et informations légales de CREON, le média digital suisse romand.",
};

export default function MentionsLegalesPage() {
  return (
    <article>
      <section className="px-6 lg:px-14 pt-12 pb-12 max-w-3xl mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">Légal</p>
        <h1 className="font-display text-[clamp(48px,7vw,96px)] leading-[0.86] m-0 tracking-tight">
          Mentions <span className="hl-block">légales</span>.
        </h1>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      <section className="px-6 lg:px-14 py-12 max-w-3xl mx-auto w-full space-y-10 font-body text-base leading-relaxed">
        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Éditeur du site</p>
          <p>
            CREON — Média digital indépendant.
            <br />
            Suisse romande.
            <br />
            Contact :{" "}
            <a
              href="mailto:hello@creon.ch"
              className="text-accent border-b-2 border-accent hover:text-accent-deep"
            >
              hello@creon.ch
            </a>
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Direction de la publication</p>
          <p>Gaël — fondateur et rédacteur en chef.</p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Hébergement</p>
          <p>
            Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            <br />
            Base de données : Supabase, hébergée en Europe (Frankfurt).
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Propriété intellectuelle</p>
          <p>
            L&apos;ensemble des contenus (textes, images, identité visuelle)
            publiés sur ce site est la propriété de CREON sauf mention
            contraire. Les contenus contribués par les créateurs référencés
            restent leur propriété ; ils nous accordent un droit de
            représentation dans le cadre du média.
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Responsabilité</p>
          <p>
            Les informations publiées sont vérifiées au mieux mais ne
            sauraient engager la responsabilité de CREON en cas
            d&apos;inexactitude. Les liens externes pointant vers des sites
            tiers sont fournis à titre indicatif et nous ne garantissons pas
            leur contenu.
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Droit applicable</p>
          <p>Suisse · for juridique : Lausanne (VD).</p>
        </div>
      </section>
    </article>
  );
}
