import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/auth";

const roleLabels: Record<string, string> = {
  super_admin: "super admin",
  admin: "admin",
  editor: "editor",
};

export function AdminTopBar({
  displayName,
  role,
}: {
  displayName: string;
  role: string;
}) {
  return (
    <div className="border-b-2 border-noir bg-creme h-16 px-6 flex items-center justify-between shrink-0">
      <p className="font-body text-sm">
        <span className="text-noir-doux">Connecté&nbsp;:</span>{" "}
        <span className="font-medium">{displayName}</span>
        <span className="text-noir-doux text-xs uppercase tracking-widest ml-3">
          ({roleLabels[role] ?? role})
        </span>
      </p>
      <form action={logout}>
        <Button type="submit" variant="secondary" size="sm">
          Déconnexion
        </Button>
      </form>
    </div>
  );
}
