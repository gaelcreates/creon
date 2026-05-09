export const metadata = {
  title: "Confidentialité — CREON",
  description:
    "Politique de confidentialité de CREON : ce qu'on collecte, ce qu'on en fait, tes droits.",
};

function Block({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="eyebrow text-noir-doux">
        {number} — {title}
      </p>
      <div className="body leading-relaxed">{children}</div>
    </div>
  );
}

export default function ConfidentialitePage() {
  return (
    <article>
      <section className="px-6 lg:px-14 pt-16 pb-12 lg:pt-20 max-w-3xl mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-5">Légal</p>
        <h1 className="display-1">
          <span className="hl">Confidentialité</span>.
        </h1>
        <p className="lead text-noir-doux mt-6 max-w-2xl">
          On respecte ta vie privée. Pas de tracker tiers, pas de revente,
          pas de cookies de pub. Seulement ce qui est strictement
          nécessaire pour faire tourner la plateforme.
        </p>
      </section>

      <hr className="border-0 border-t border-noir m-0" />

      <section className="px-6 lg:px-14 py-12 max-w-3xl mx-auto w-full space-y-10">
        <Block number="01" title="Ce qu'on collecte">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-medium">Newsletter</strong> : ton
              email uniquement, pour t&apos;envoyer la newsletter
              dominicale.
            </li>
            <li>
              <strong className="font-medium">Candidature créateur</strong>{" "}
              : nom, email, Instagram, ville, catégories, pitch.
            </li>
            <li>
              <strong className="font-medium">Compte créateur</strong> :
              informations de profil + posts/articles/services que tu
              publies.
            </li>
            <li>
              <strong className="font-medium">Logs serveur</strong> :
              adresses IP et user-agents conservés temporairement par notre
              hébergeur (Vercel) à des fins de sécurité.
            </li>
          </ul>
        </Block>

        <Block number="02" title="Ce qu'on n'a pas">
          <ul className="list-disc pl-5 space-y-2">
            <li>Aucun cookie de tracking publicitaire.</li>
            <li>Aucun pixel Facebook, Google Analytics, ou similaire.</li>
            <li>
              Aucune revente, aucun partage à des tiers à des fins
              commerciales.
            </li>
          </ul>
        </Block>

        <Block number="03" title="Cookies & stockage local">
          <p>
            Cookies <strong className="font-medium">essentiels</strong>{" "}
            uniquement, pour la connexion (session Supabase) sur les pages
            privées (/compte, /admin). Aucun cookie sur les pages publiques
            pour les visiteurs anonymes.
          </p>
        </Block>

        <Block number="04" title="Tes droits">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-medium">Te désabonner</strong> de la
              newsletter via le lien dans chaque email.
            </li>
            <li>
              <strong className="font-medium">Supprimer ton compte créateur</strong>{" "}
              depuis <span className="font-medium">/compte</span>.
            </li>
            <li>
              <strong className="font-medium">Demander l&apos;export ou l&apos;effacement</strong>{" "}
              de tes données en écrivant à{" "}
              <a
                href="mailto:hello@creon.ch"
                className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
              >
                hello@creon.ch
              </a>
              . Réponse sous 30 jours.
            </li>
          </ul>
        </Block>

        <Block number="05" title="Hébergement & traitement">
          <p>
            Tes données transitent par et sont stockées chez :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong className="font-medium">Vercel</strong> (hébergement
              web, USA)
            </li>
            <li>
              <strong className="font-medium">Supabase</strong> (base de
              données + auth, Europe — Frankfurt)
            </li>
          </ul>
        </Block>

        <Block number="06" title="Contact">
          <p>
            Question, plainte, demande d&apos;effacement :{" "}
            <a
              href="mailto:hello@creon.ch"
              className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent transition-colors"
            >
              hello@creon.ch
            </a>
            .
          </p>
        </Block>
      </section>
    </article>
  );
}
