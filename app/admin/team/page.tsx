import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { addAdmin, removeAdmin } from "./actions";

type AdminRow = {
  id: string;
  email: string;
  display_name: string;
  role: "super_admin" | "admin" | "editor";
  created_at: string;
  last_login_at: string | null;
};

export const metadata = {
  title: "Équipe — CREON Admin",
};

const roleLabels: Record<AdminRow["role"], string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.role !== "super_admin") redirect("/admin");

  const { data: admins } = await supabase
    .from("admins")
    .select("id, email, display_name, role, created_at, last_login_at")
    .order("created_at", { ascending: true });

  const list = (admins ?? []) as AdminRow[];

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-noir-doux">
          Back-office · super admin
        </p>
        <h1 className="font-display text-5xl mt-2 leading-none">Équipe</h1>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl leading-tight">Admins actuels</h2>
        <div className="border-2 border-noir overflow-hidden">
          <table className="w-full font-body text-sm">
            <thead className="bg-creme-fonce border-b-2 border-noir">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Nom
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Rôle
                </th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Créé le
                </th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((a, i) => {
                const isMe = a.id === user.id;
                return (
                  <tr
                    key={a.id}
                    className={cn(
                      "border-b border-noir/20 last:border-0",
                      i % 2 === 1 && "bg-creme-fonce/40",
                    )}
                  >
                    <td className="px-4 py-3 font-display text-lg">
                      {a.display_name}
                      {isMe && (
                        <span className="ml-2 mono-meta text-accent-deep">
                          (toi)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 mono-meta">{a.email}</td>
                    <td className="px-4 py-3 mono-meta uppercase">
                      {roleLabels[a.role]}
                    </td>
                    <td className="px-4 py-3 mono-meta text-noir-doux">
                      {new Date(a.created_at).toLocaleDateString("fr-CH")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isMe && (
                        <form action={removeAdmin} className="inline">
                          <input type="hidden" name="id" value={a.id} />
                          <button
                            type="submit"
                            className="font-body text-xs uppercase tracking-wider px-3 py-1 border-2 border-noir bg-creme hover:bg-noir hover:text-creme transition-colors"
                          >
                            Retirer
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl leading-tight">
          Inviter un nouvel admin
        </h2>
        <p className="text-sm text-noir-doux max-w-xl leading-relaxed">
          L&apos;invité reçoit un email avec un lien magique pour se connecter
          la première fois. Pas de mot de passe.
        </p>
        <form
          action={addAdmin}
          className="border-2 border-noir bg-creme p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
        >
          <div className="space-y-1.5 sm:col-span-1">
            <label className="block font-body text-xs uppercase tracking-widest text-noir-doux">
              Nom
            </label>
            <Input name="display_name" placeholder="Léa M." required />
          </div>
          <div className="space-y-1.5 sm:col-span-1">
            <label className="block font-body text-xs uppercase tracking-widest text-noir-doux">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="lea@creon.ch"
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-1">
            <label className="block font-body text-xs uppercase tracking-widest text-noir-doux">
              Rôle
            </label>
            <select
              name="role"
              defaultValue="admin"
              className="w-full px-4 py-3 border-2 border-noir bg-creme font-body text-base text-noir focus:outline-none focus:border-accent transition-colors"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" size="md">
              Inviter →
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
