import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { Chip } from "@/components/ui/Chip";

export const metadata = {
  title: "Grammaire visuelle — CREON",
  robots: { index: false, follow: false },
};

const sampleCreator = { handle: "gael", display_name: "Gaël" };

function SectionHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-7">
      <span className="mono-meta text-noir-doux">{number}</span>
      <h2 className="heading-1">{title}</h2>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow text-noir-doux">{children}</span>;
}

const TYPO_SCALE = [
  ["Display 1", "88/088", "display-1", "CREON"],
  ["Display 2", "64/088", "display-2", "Cette semaine"],
  ["H1", "40/088", "heading-1", "Les créateurs"],
  ["H2", "32/088", "heading-2", "À l'affiche"],
  ["H3", "22/088", "heading-3", "Lara Müller"],
  ["Lead", "19/048", "lead", "Le média de la scène créative suisse romande."],
  ["Body", "15/048", "body", "Texte courant — Lineal Regular, 15 pixels, line-height 1.55."],
  ["Small", "13/048", "small", "Métadonnée secondaire, légende."],
  ["Mono meta", "12/048", "mono-meta", "VEN 16.05 · GENÈVE · 21H"],
];

const PALETTE = [
  { name: "Beige", hex: "#f5ead5", bg: "bg-creme", note: "Fond dominant ~80%" },
  { name: "Beige clair", hex: "#faf3e0", bg: "bg-creme-clair", note: "Cards, surfaces" },
  { name: "Beige foncé", hex: "#ede0c4", bg: "bg-creme-fonce", note: "Sections alt, hover" },
  { name: "Noir", hex: "#100609", bg: "bg-noir", note: "Texte, bordures" },
  { name: "Noir adouci", hex: "#3d2d1f", bg: "bg-noir-doux", note: "Texte secondaire" },
  { name: "Orange", hex: "#ff7a00", bg: "bg-accent", note: "Accent · max 5%" },
];

const SIDEBAR_LINKS = [
  { label: "Dashboard", icon: "○" },
  { label: "Events", icon: "≡" },
  { label: "Articles", icon: "≡" },
  { label: "Créateurs", icon: "○", count: 1 },
  { label: "Modération", icon: "▷", count: 7, urgent: true },
  { label: "Productions", icon: "≡" },
  { label: "Home", icon: "★" },
  { label: "Newsletter", icon: "✉" },
  { label: "Équipe", icon: "○" },
];

export default function DesignSystemPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-12">
      {/* Top meta */}
      <div className="flex justify-between items-baseline mb-10 pb-4 border-b border-noir mono-meta text-noir-doux">
        <span>CREON · Design system desktop · v04</span>
        <span>05 / 26</span>
      </div>

      {/* Hero */}
      <header className="mb-16">
        <h1 className="display-1 mb-5">
          La <span className="hl">grammaire</span> visuelle.
        </h1>
        <p className="lead text-noir-doux max-w-xl">
          Sobriété, espace, précision. Le beige porte 80 % de la surface.
          L&apos;orange ponctue. Le noir contraste. Pas de décoration
          gratuite.
        </p>
      </header>

      {/* 01 — Typographie */}
      <section className="mb-20">
        <SectionHeader number="01" title="Typographie — 3 candidats titres." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <TypoCandidate
            name="Inter Tight"
            recommended
            note="Recommandé : neutre, dense, signature contemporaine"
            sample="Créateurs."
            fontFamily="var(--font-display)"
          />
          <TypoCandidate
            name="Geist"
            note="Verseil : plus générique, géométrique, futuriste sobre"
            sample="Créateurs."
            fontFamily="ui-sans-serif, system-ui"
          />
          <TypoCandidate
            name="Space Grotesk"
            note="Caractère plus prononcé, signature plus marquée"
            sample="Créateurs."
            fontFamily="ui-sans-serif, system-ui"
          />
        </div>

        <div className="border border-noir rounded-lg overflow-hidden">
          {TYPO_SCALE.map(([name, ratio, cls, sample], i) => (
            <div
              key={String(name)}
              className={`grid grid-cols-[120px_120px_1fr] gap-4 px-5 py-3.5 items-baseline border-b border-noir/15 last:border-b-0 ${i % 2 === 1 ? "bg-creme-clair/40" : ""}`}
            >
              <span className="mono-meta text-noir-doux">{name}</span>
              <span className="mono-meta text-noir-doux">{ratio}</span>
              <span className={cls as string}>{sample}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 02 — Palette */}
      <section className="mb-20">
        <SectionHeader number="02" title="Palette." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PALETTE.map((c) => (
            <div key={c.name} className="space-y-2">
              <div
                className={`${c.bg} h-24 border border-noir rounded-md`}
                aria-hidden
              />
              <div>
                <div className="font-body text-[14px] font-medium">
                  {c.name}
                </div>
                <div className="mono-meta text-noir-doux">{c.hex}</div>
                <div className="small text-noir-doux mt-0.5">{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — Boutons */}
      <section className="mb-20">
        <SectionHeader number="03" title="Boutons." />

        <div className="border border-noir rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-noir/15">
            {[
              { variant: "primary" as const, label: "Primaire", note: "Noir au hover", text: "S'abonner" },
              { variant: "accent" as const, label: "Accent", note: "Variante orange direct", text: "Découvrir" },
              { variant: "secondary" as const, label: "Secondaire", note: "Beige bordure noire", text: "Voir tout" },
              { variant: "tertiary" as const, label: "Tertiaire", note: "Souligné orange", text: "Lire l'article" },
              { variant: "destructive" as const, label: "Destructif", note: "Rouge subtil", text: "Supprimer" },
            ].map((b) => (
              <div key={b.variant} className="px-5 py-6 border-r border-noir/15 last:border-r-0 flex flex-col gap-3">
                <div>
                  <Label>{b.label}</Label>
                  <div className="small text-noir-doux">{b.note}</div>
                </div>
                <Button variant={b.variant}>{b.text}</Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 bg-creme-clair/40">
            {[
              { variant: "primary" as const, text: "S'abonner" },
              { variant: "accent" as const, text: "Découvrir" },
              { variant: "secondary" as const, text: "Voir tout" },
              { variant: "tertiary" as const, text: "Lire l'article" },
              { variant: "destructive" as const, text: "Supprimer" },
            ].map((b, i) => (
              <div key={i} className="px-5 py-6 border-r border-noir/15 last:border-r-0 flex flex-col gap-3">
                <Label>Hover</Label>
                {/* On force visuellement l'état hover via classes simulées sur la version idle */}
                <div className="pointer-events-none">
                  <Button variant={b.variant}>{b.text}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Tags · Chips · Inputs */}
      <section className="mb-20">
        <SectionHeader number="04" title="Tags · Chips · Inputs." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <Label>Tags catégories</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Tag>Mode</Tag>
                <Tag>Art</Tag>
                <Tag>Musique</Tag>
                <Tag>Design</Tag>
                <Tag>Photo</Tag>
                <Tag>Édition</Tag>
                <Tag>Architecture</Tag>
                <Tag variant="accent">Sélection 26</Tag>
              </div>
            </div>
            <div>
              <Label>Chips de filtre — inactif / actif</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Chip active>Tout</Chip>
                <Chip>Posts</Chip>
                <Chip>Articles</Chip>
                <Chip>Services</Chip>
                <Chip>Lausanne</Chip>
                <Chip>Genève</Chip>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Inputs</Label>
            <div className="space-y-3">
              <div>
                <label className="small text-noir-doux block mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="lara@tirage-sec.ch"
                  defaultValue="lara@tirage-sec.ch"
                />
              </div>
              <div>
                <label className="small text-noir-doux block mb-1">
                  Recherche — état focus
                </label>
                <Input
                  placeholder="Recherche…"
                  className="border-accent ring-2 ring-accent/30"
                />
              </div>
              <div>
                <label className="small text-noir-doux block mb-1">
                  Désactivé
                </label>
                <Input disabled defaultValue="creon.ch/createurs/" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Header 4 états */}
      <section className="mb-20">
        <SectionHeader number="05" title="Header public · 4 états." />
        <div className="space-y-3">
          {[
            { state: "01 — Visiteur anonyme", props: {} },
            { state: "02 — Créateur connecté", props: { creator: sampleCreator } },
            { state: "03 — Admin connecté (équipe)", props: { isAdmin: true } },
            { state: "04 — Admin + créateur (Gaël)", props: { creator: sampleCreator, isAdmin: true } },
          ].map((row) => (
            <div
              key={row.state}
              className="border border-noir rounded-lg overflow-hidden"
            >
              <div className="mono-meta text-noir-doux px-4 py-2 bg-creme-clair border-b border-noir/15">
                {row.state}
              </div>
              <div>
                <Header {...row.props} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — Sidebar back-office */}
      <section className="mb-20">
        <SectionHeader number="06" title="Sidebar back-office." />
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <SidebarDemo />
          <div className="space-y-3 small text-noir-doux leading-relaxed">
            <p>
              Sidebar fixe à gauche du back-office. État actif : fond orange à
              10% d&apos;opacité, bordure gauche orange 2px, texte en gras
              noir. Pas de fond plein orange. Indicateur numérique en mono pour
              les items qui demandent une action (candidatures,
              signalements).
            </p>
            <p>
              <Label>Hover</Label>
              <br />
              Fond beige foncé, sans bordure orange. Transition 150ms.
            </p>
          </div>
        </div>
      </section>

      {/* 07 — Cards posts créateur */}
      <section className="mb-20">
        <SectionHeader
          number="07"
          title="Cards posts créateur — 3 variantes."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ShortPostDemo />
          <ArticlePostDemo />
          <ServicePostDemo />
        </div>

        <p className="small text-noir-doux mt-6 max-w-2xl">
          Hover : <code className="bg-creme-fonce px-1 rounded">translateY(-4px)</code> ·
          bordure passe en orange (1px) · ombre douce (rgba 8%) · bio cachée
          slide-down 8px sur cards créateurs.
        </p>
      </section>
    </div>
  );
}

function TypoCandidate({
  name,
  recommended,
  note,
  sample,
  fontFamily,
}: {
  name: string;
  recommended?: boolean;
  note: string;
  sample: string;
  fontFamily: string;
}) {
  return (
    <Card className={`p-5 relative ${recommended ? "ring-2 ring-accent" : ""}`}>
      {recommended && (
        <span className="absolute top-3 right-3 mono-meta text-noir bg-accent px-2 py-0.5 rounded">
          BETTER!
        </span>
      )}
      <div className="mono-meta text-noir-doux mb-2">{name}</div>
      <div
        className="text-[44px] font-semibold leading-[0.95] tracking-tight mb-3"
        style={{ fontFamily }}
      >
        {sample}
      </div>
      <p className="small text-noir mb-2">
        La plateforme suisse pour les créateurs.
      </p>
      <p className="mono-meta text-noir-doux">{note}</p>
    </Card>
  );
}

function SidebarDemo() {
  return (
    <aside className="border border-noir rounded-lg bg-creme-clair overflow-hidden">
      <div className="px-4 py-3 border-b border-noir/15">
        <span className="mono-meta text-noir-doux">Back-office</span>
      </div>
      <nav className="py-2">
        {SIDEBAR_LINKS.map((link, i) => {
          const active = i === 4;
          return (
            <div
              key={link.label}
              className={`flex items-center gap-3 px-4 py-2 border-l-2 transition-colors ${
                active
                  ? "border-accent bg-accent-soft text-noir font-medium"
                  : "border-transparent text-noir-doux hover:bg-creme-fonce"
              }`}
            >
              <span className="mono-meta text-noir-doux w-3">{link.icon}</span>
              <span className="font-body text-[14px] flex-1">{link.label}</span>
              {link.count !== undefined && (
                <span
                  className={`mono-meta ${
                    link.urgent ? "text-accent-deep" : "text-noir-doux"
                  }`}
                >
                  {link.count}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function ShortPostDemo() {
  return (
    <Card hoverable className="overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="mono-meta text-noir-doux">A · SHORT — FEED</div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-creme-fonce border border-noir" />
          <div className="flex-1 min-w-0">
            <div className="font-body text-[14px] font-medium leading-tight">
              Nora Kessler
            </div>
            <div className="mono-meta text-noir-doux">
              @nora.k · Lausanne · il y a 4h
            </div>
          </div>
        </div>
        <p className="body leading-snug">
          Dernière pièce de la collection « PTT/67 » : veste hivernale,
          doublure laine, boutons en buis tournés à la main par Yann à Vevey.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="aspect-square bg-creme-fonce border border-noir rounded" />
          <div className="aspect-square bg-creme-fonce border border-noir rounded" />
        </div>
        <div className="flex items-center justify-between mono-meta text-noir-doux pt-2 border-t border-noir/15">
          <span>Mode · Atelier</span>
          <span>↗ 142</span>
        </div>
      </div>
    </Card>
  );
}

function ArticlePostDemo() {
  return (
    <Card hoverable className="overflow-hidden">
      <div className="aspect-[16/10] bg-creme-fonce border-b border-noir" />
      <div className="p-4 space-y-3">
        <div className="mono-meta text-noir-doux">B · ARTICLE — FEED</div>
        <Tag>Article</Tag>
        <h3 className="heading-3">
          Pourquoi la riso a colonisé les caves de Lausanne.
        </h3>
        <p className="small text-noir-doux leading-snug">
          Six imprimeurs, quatre cantons, une seule machine japonaise des
          années 80.
        </p>
        <div className="flex items-center justify-between mono-meta text-noir-doux pt-2 border-t border-noir/15">
          <span>Théo Vauthier · 02.05.26</span>
          <span>8 min</span>
        </div>
      </div>
    </Card>
  );
}

function ServicePostDemo() {
  return (
    <Card hoverable className="overflow-hidden">
      <div className="aspect-[16/10] bg-creme-fonce border-b border-noir" />
      <div className="p-4 space-y-3">
        <div className="mono-meta text-noir-doux">C · SERVICE — FEED</div>
        <div className="flex items-center justify-between">
          <Tag variant="accent">Service</Tag>
          <span className="mono-meta text-noir-doux">dès 450 CHF</span>
        </div>
        <h3 className="heading-3">Tirage riso A3, 2 couleurs, 50 ex.</h3>
        <p className="small text-noir-doux leading-snug">
          Ton illustration, mes encres. Délai 10 jours.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-noir/15">
          <span className="mono-meta text-noir-doux">
            ▢ Lara M. · Renens
          </span>
          <Button variant="accent" size="sm">
            Découvrir →
          </Button>
        </div>
      </div>
    </Card>
  );
}
