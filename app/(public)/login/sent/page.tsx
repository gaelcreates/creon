import Link from "next/link";

export const metadata = {
  title: "Lien envoyé — CREON",
};

export default async function LoginSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "ton email";

  return (
    <section className="flex-1 flex items-center justify-center px-6 py-16 lg:py-20">
      <div className="w-full max-w-md space-y-7">
        <div className="space-y-3">
          <p className="eyebrow text-noir-doux">Lien envoyé</p>
          <h1 className="font-display text-[64px] leading-[0.86] m-0 tracking-tight">
            Vérifie ta{" "}
            <span className="hl-block">boîte mail</span>.
          </h1>
        </div>
        <div className="space-y-4 font-body text-base text-noir-doux leading-relaxed">
          <p>
            On vient d&apos;envoyer un lien magique à{" "}
            <span className="text-noir font-medium">{email}</span>.
          </p>
          <p>
            Clique dessus dans les 60 minutes pour ouvrir ta session. Pense à
            vérifier tes spams.
          </p>
        </div>
        <div className="pt-4 border-t-2 border-noir/20">
          <Link
            href="/login"
            className="mono-meta uppercase underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            Renvoyer le lien →
          </Link>
        </div>
      </div>
    </section>
  );
}
