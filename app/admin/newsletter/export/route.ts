import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Forbidden", { status: 403 });

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  const adminClient = createAdminClient();
  const { data: subscribers, error } = await adminClient
    .from("newsletter_subscribers")
    .select("email, confirmed, subscribed_at, unsubscribed_at, source")
    .order("subscribed_at", { ascending: false });
  if (error) return new NextResponse(error.message, { status: 500 });

  const headers = [
    "email",
    "confirmed",
    "subscribed_at",
    "unsubscribed_at",
    "source",
  ];
  const lines = [headers.join(",")];
  for (const s of subscribers ?? []) {
    lines.push(
      [
        csvEscape(s.email),
        csvEscape(s.confirmed),
        csvEscape(s.subscribed_at),
        csvEscape(s.unsubscribed_at),
        csvEscape(s.source),
      ].join(","),
    );
  }
  const csv = lines.join("\n");
  const filename = `creon-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
