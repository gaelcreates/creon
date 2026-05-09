import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { deleteMyAccount } from "../actions";

export const metadata = {
  title: "Paramètres — CREON",
};

async function logoutAction() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function ParametresPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const { data: creator } = await supabase
    .from("creators")
    .select("email, handle, display_name, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!creator || creator.status !== "active") {
    redirect("/compte");
  }

  return (
    <>
      <section className="px-6 lg:px-14 pt-12 pb-6 max-w-2xl mx-auto w-full">
        <p className="mono-meta text-noir-doux mb-3">
          <Link
            href="/compte"
            className="hover:text-accent-deep transition-colors"
          >
            ← Mon compte
          </Link>
        </p>
        <p className="eyebrow text-noir-doux mb-2">Compte</p>
        <h1 className="display-2">Paramètres</h1>
      </section>

      <section className="px-6 lg:px-14 pb-12 max-w-2xl mx-auto w-full space-y-8">
        <Card className="p-6">
          <p className="eyebrow text-noir-doux mb-3">Email de connexion</p>
          <p className="body font-medium">{creator.email}</p>
          <p className="small text-noir-doux mt-2">
            Pour V1, le changement d&apos;email passe par contact équipe (
            <a
              href="mailto:hello@creon.ch"
              className="text-accent-deep underline decoration-accent decoration-[1.5px] underline-offset-4"
            >
              hello@creon.ch
            </a>
            ).
          </p>
        </Card>

        <Card className="p-6">
          <p className="eyebrow text-noir-doux mb-3">Session</p>
          <p className="body mb-4">
            Te déconnecter ferme ta session sur cet appareil.
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 border border-noir bg-creme-clair text-noir font-body text-[14px] font-medium rounded-md hover:bg-noir hover:text-creme transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </Card>

        <Card className="p-6 border-rouge-brique/40">
          <p className="eyebrow text-rouge-brique mb-3">Zone de danger</p>
          <p className="body mb-2">Supprimer mon compte</p>
          <p className="small text-noir-doux mb-4 leading-relaxed">
            Soft delete : ton profil est suspendu et n&apos;apparaît plus
            publiquement. Tes posts liés restent attribués historiquement
            mais ne pointent plus vers ta page. Action réversible
            uniquement par contact direct avec l&apos;équipe.
          </p>
          <form
            action={deleteMyAccount}
            onSubmit={(e) => {
              if (
                !confirm(
                  "Supprimer ton compte CREON ? Réversible uniquement par contact équipe.",
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 border border-rouge-brique text-rouge-brique font-body text-[14px] font-medium rounded-md hover:bg-rouge-brique hover:text-creme transition-colors"
            >
              Supprimer mon compte
            </button>
          </form>
        </Card>
      </section>
    </>
  );
}
