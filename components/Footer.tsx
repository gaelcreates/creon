import Link from "next/link";

const cols = [
  {
    title: "Le mag",
    links: [
      { href: "/events", label: "Events" },
      { href: "/createurs", label: "Créateurs" },
      { href: "/articles", label: "Articles" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
  {
    title: "Suivre",
    links: [
      {
        href: "https://instagram.com/creoncrew",
        label: "Instagram",
        external: true,
      },
      { href: "#", label: "TikTok", external: true },
      { href: "#", label: "Spotify", external: true },
      { href: "#", label: "Are.na", external: true },
    ],
  },
  {
    title: "Maison",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/proposer-mon-profil", label: "Proposer ton profil" },
      { href: "/mentions-legales", label: "Mentions" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-noir text-creme grain-bg grain-on-dark mt-auto">
      <div className="relative z-[2] max-w-[1320px] mx-auto px-6 lg:px-14 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="bg-accent inline-block px-3.5 py-1.5">
              <span className="font-display text-3xl text-noir leading-none">
                CREON
              </span>
            </div>
            <p className="mt-5 max-w-xs text-[15px] leading-snug text-creme">
              Le média de la scène créative suisse romande. Indépendant,
              imparfait, à l&apos;encre orange.
            </p>
            <p className="eyebrow mt-5 text-paper-edge">
              Made in Switzerland · 2026
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-accent mb-3.5">{col.title}</p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-0 border-t-[1.5px] border-paper-edge mt-9" />
        <div className="mono-meta mt-3.5 flex flex-col sm:flex-row justify-between gap-2 text-paper-edge">
          <span>© CREON 2026 — Tous droits réservés.</span>
          <span>Lausanne / Genève</span>
        </div>
      </div>
    </footer>
  );
}
