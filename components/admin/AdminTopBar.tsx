import { logout } from "@/lib/auth";

const roleLabels: Record<string, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

export function AdminTopBar({
  displayName,
  role,
}: {
  displayName: string;
  role: string;
}) {
  return (
    <div className="border-b border-noir bg-creme h-14 px-6 flex items-center justify-between shrink-0">
      <p className="small">
        <span className="text-noir-doux">Connecté&nbsp;:</span>{" "}
        <span className="font-medium">{displayName}</span>
        <span className="mono-meta text-noir-doux ml-3">
          {roleLabels[role] ?? role}
        </span>
      </p>
      <form action={logout}>
        <button
          type="submit"
          className="px-3 py-1.5 border border-noir bg-creme-clair text-noir font-body text-[13px] font-medium rounded-md hover:bg-noir hover:text-creme transition-colors"
        >
          Déconnexion
        </button>
      </form>
    </div>
  );
}
