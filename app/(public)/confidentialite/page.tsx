export const metadata = {
  title: "Confidentialité — CREON",
  description:
    "Politique de confidentialité de CREON : ce qu'on collecte, ce qu'on en fait, tes droits.",
};

export default function ConfidentialitePage() {
  return (
    <article>
      <section className="px-6 lg:px-14 pt-12 pb-12 max-w-3xl mx-auto w-full">
        <p className="eyebrow text-noir-doux mb-4">Légal</p>
        <h1 className="font-display text-[clamp(48px,7vw,96px)] leading-[0.86] m-0 tracking-tight">
          <span className="hl-block">Confidentialité</span>.
        </h1>
        <p className="font-body text-[17px] leading-relaxed mt-8 max-w-[640px]">
          On respecte ta vie privée. Pas de tracker tiers, pas de revente,
          pas de cookies de pub. Seulement ce qui est strictement nécessaire
          pour faire tourner le site.
        </p>
      </section>

      <hr className="border-0 border-t-[2.5px] border-noir m-0" />

      <section className="px-6 lg:px-14 py-12 max-w-3xl mx-auto w-full space-y-10 font-body text-base leading-relaxed">
        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">01 — Ce qu&apos;on collecte</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Newsletter</strong> : ton email uniquement, pour
              t&apos;envoyer la newsletter dominicale. Désabonnement en un
              clic.
            </li>
            <li>
              <strong>Candidature créateur</strong> : nom, email, Instagram,
              ville, catégories, pitch. Utilisés pour évaluer ta
              candidature.
            </li>
            <li>
              <strong>Compte créateur</strong> : informations de profil que
              tu choisis de partager (photo, bio, liens, etc.).
            </li>
            <li>
              <strong>Logs serveur</strong> : adresses IP et user-agents
              conservés temporairement par notre hébergeur (Vercel) à des
              fins de sécurité.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">02 — Ce qu&apos;on n&apos;a pas</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Aucun cookie de tracking publicitaire.</li>
            <li>Aucun pixel Facebook, Google Analytics, ou similaire.</li>
            <li>
              Aucune revente, aucun partage à des tiers à des fins
              commerciales.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">
            03 — Cookies & stockage local
          </p>
          <p>
            On utilise uniquement des cookies <strong>essentiels</strong>{" "}
            pour la connexion (session Supabase) sur les pages privées
            (/compte, /admin). Aucun cookie sur les pages publiques pour les
            visiteurs anonymes.
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">04 — Tes droits</p>
          <p>
            Tu peux à tout moment :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Te désabonner</strong> de la newsletter via le lien
              dans chaque email.
            </li>
            <li>
              <strong>Supprimer ton compte créateur</strong> depuis{" "}
              <span className="font-medium">/compte</span>.
            </li>
            <li>
              <strong>Demander l&apos;export ou l&apos;effacement</strong> de
              tes données personnelles en écrivant à{" "}
              <a
                href="mailto:hello@creon.ch"
                className="text-accent border-b-2 border-accent hover:text-accent-deep"
              >
                hello@creon.ch
              </a>
              . Réponse sous 30 jours.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">05 — Hébergement & traitement</p>
          <p>
            Tes données transitent par et sont stockées chez :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Vercel</strong> (hébergement web, USA)
            </li>
            <li>
              <strong>Supabase</strong> (base de données + auth, Europe —
              Frankfurt)
            </li>
          </ul>
          <p>
            On ne contrôle pas leurs politiques propres, mais on choisit ces
            prestataires pour leur conformité RGPD et leur emplacement EU
            quand possible.
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">06 — Contact</p>
          <p>
            Question, plainte, demande d&apos;effacement :{" "}
            <a
              href="mailto:hello@creon.ch"
              className="text-accent border-b-2 border-accent hover:text-accent-deep"
            >
              hello@creon.ch
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
