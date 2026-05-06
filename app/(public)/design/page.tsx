import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { Chip } from "@/components/ui/Chip";

export const metadata = {
  title: "Design system — CREON (interne)",
  robots: { index: false, follow: false },
};

const sampleCreator = { handle: "gael", display_name: "Gaël" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <h2 className="font-display text-3xl border-b-2 border-noir pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-body text-xs uppercase tracking-wider text-noir-doux">
      {children}
    </span>
  );
}

export default function DesignSystem() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      <header className="space-y-3">
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
          Design system
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-none">
          Briques visuelles
        </h1>
        <p className="font-body text-base text-noir-doux max-w-xl">
          Tous les composants partagés et les 4 états du Header. Référence
          interne — n&apos;est pas indexée.
        </p>
      </header>

      <Section title="Couleurs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { name: "creme", hex: "#f5ead5", className: "bg-creme" },
            {
              name: "creme-fonce",
              hex: "#ede0c4",
              className: "bg-creme-fonce",
            },
            { name: "accent", hex: "#ff7a00", className: "bg-accent" },
            { name: "noir", hex: "#100609", className: "bg-noir" },
            { name: "noir-doux", hex: "#3d2a1f", className: "bg-noir-doux" },
          ].map((c) => (
            <div key={c.name} className="space-y-2">
              <div
                className={`${c.className} h-24 border-2 border-noir`}
                aria-hidden
              />
              <div className="font-body text-sm">
                <div className="font-medium">{c.name}</div>
                <div className="text-noir-doux text-xs">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typographie">
        <div className="space-y-6">
          <div>
            <Label>Affigere — display</Label>
            <p className="font-display text-7xl leading-none mt-2">
              Magazine indé
            </p>
          </div>
          <div>
            <Label>Lineal — body regular</Label>
            <p className="font-body text-base mt-2 max-w-xl leading-relaxed">
              La culture suisse vit dans les ateliers, les caves, les
              vernissages improvisés et les festivals qui n&apos;ont pas encore
              de wikipedia.
            </p>
          </div>
          <div>
            <Label>Lineal — body small</Label>
            <p className="font-body text-sm mt-2 text-noir-doux max-w-xl">
              Texte secondaire, métadonnées, légendes.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Boutons">
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">S&apos;abonner</Button>
          <Button variant="secondary">Voir plus</Button>
          <Button variant="tertiary">En savoir plus</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">
            Petit
          </Button>
          <Button variant="primary" size="md">
            Moyen
          </Button>
          <Button variant="primary" size="lg">
            Grand
          </Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="ton@email.ch" />
          </div>
          <div className="space-y-2">
            <Label>Recherche</Label>
            <Input type="search" placeholder="chercher un créateur…" />
          </div>
        </div>
      </Section>

      <Section title="Tags & Chips">
        <div className="space-y-4">
          <div>
            <Label>Tags catégories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Tag>Mode</Tag>
              <Tag>Musique</Tag>
              <Tag>Art visuel</Tag>
              <Tag variant="accent">Featured</Tag>
            </div>
          </div>
          <div>
            <Label>Filtres chips (cliquables)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Chip active>Lausanne</Chip>
              <Chip>Genève</Chip>
              <Chip>Zurich</Chip>
              <Chip>Berne</Chip>
              <Chip>Bâle</Chip>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6">
            <Tag>Event</Tag>
            <h3 className="font-display text-2xl mt-3 leading-tight">
              Vernissage — Atelier 13
            </h3>
            <p className="font-body text-sm text-noir-doux mt-2">
              Samedi 14 mars · Lausanne · 19h
            </p>
          </Card>
          <Card className="p-6">
            <Tag>Créateur</Tag>
            <h3 className="font-display text-2xl mt-3 leading-tight">
              Léa Dornier
            </h3>
            <p className="font-body text-sm text-noir-doux mt-2">
              Photographe · Genève
            </p>
          </Card>
          <Card className="p-6">
            <Tag variant="accent">Article featured</Tag>
            <h3 className="font-display text-2xl mt-3 leading-tight">
              La nouvelle scène fanzine romande
            </h3>
            <p className="font-body text-sm text-noir-doux mt-2">
              5 min · Coulisses
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Header — 4 états">
        <p className="font-body text-sm text-noir-doux max-w-2xl">
          Le composant Header s&apos;adapte selon l&apos;état d&apos;auth. En
          Sprint 1 il est rendu statique (props hardcodées) ; Sprint 2 le
          connectera au hook <code>useAuth()</code> et à Supabase.
        </p>
        <div className="space-y-8">
          <div className="space-y-2">
            <Label>État 1 — visiteur anonyme</Label>
            <div className="border-2 border-dashed border-noir/30">
              <Header />
            </div>
          </div>
          <div className="space-y-2">
            <Label>État 2 — créateur connecté</Label>
            <div className="border-2 border-dashed border-noir/30">
              <Header creator={sampleCreator} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>État 3 — admin connecté (pas créateur)</Label>
            <div className="border-2 border-dashed border-noir/30">
              <Header isAdmin />
            </div>
          </div>
          <div className="space-y-2">
            <Label>État 4 — admin + créateur (cas Gaël)</Label>
            <div className="border-2 border-dashed border-noir/30">
              <Header creator={sampleCreator} isAdmin />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
