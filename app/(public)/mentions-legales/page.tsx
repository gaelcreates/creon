export const metadata = {
  title: "Mentions légales — CREON",
  description:
    "Éditeur, hébergeur et informations légales de CREON, plateforme suisse pour les créateurs.",
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="eyebrow text-noir-doux">{title}</p>
      <div className="body leading-relaxed">{children}</div>
    </div>
  );
}

export default function MentionsLegalesPage() {
  return (
    <article>
      <section className="px-6 lg:px-14 pt-28 pb-12 lg:pt-32 max-w-3xl mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-5">Légal</p>
        <h1 className="display-1">
          Mentions <span className="hl">légales</span>.
        </h1>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-12 max-w-3xl mx-auto w-full space-y-10">
        <Block title="Éditeur du site">
          <p>
            CREON — Plateforme digitale indépendante.
            <br />
            Suisse romande.
            <br />
            Contact :{" "}
            <a
              href="mailto:hello@creon.ch"
              className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
            >
              hello@creon.ch
            </a>
          </p>
        </Block>

        <Block title="Direction de la publication">
          <p>Gaël — fondateur et rédacteur en chef.</p>
        </Block>

        <Block title="Hébergement">
          <p>
            Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
            États-Unis.
            <br />
            Base de données : Supabase, hébergée en Europe (Frankfurt).
          </p>
        </Block>

        <Block title="Propriété intellectuelle">
          <p>
            L&apos;ensemble des contenus (textes, images, identité
            visuelle) publiés par CREON crew sur ce site est la propriété
            de CREON sauf mention contraire. Les contenus contribués par
            les créateurs (posts, articles, services) restent leur
            propriété ; ils accordent à CREON un droit de représentation
            dans le cadre de la plateforme.
          </p>
        </Block>

        <Block title="Responsabilité">
          <p>
            Les contenus publiés par les créateurs n&apos;engagent que leur
            responsabilité. CREON modère les signalements selon ses
            conditions d&apos;utilisation. Les liens externes pointant vers
            des sites tiers sont fournis à titre indicatif et nous ne
            garantissons pas leur contenu.
          </p>
        </Block>

        <Block title="Droit applicable">
          <p>Suisse · for juridique : Lausanne (VD).</p>
        </Block>
      </section>
    </article>
  );
}
