import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../EventForm";
import { updateEvent, deleteEvent } from "../actions";

export const metadata = {
  title: "Modifier event — CREON Admin",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [eventRes, creatorsRes] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, short_description, cover_image, date_start, date_end, city, venue, venue_address, categories, external_url, external_label, price_info, linked_creator, status, featured",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("creators")
      .select("id, display_name")
      .eq("status", "active")
      .order("display_name", { ascending: true }),
  ]);

  if (!eventRes.data) {
    notFound();
  }

  return (
    <EventForm
      event={eventRes.data}
      creators={creatorsRes.data ?? []}
      saveAction={updateEvent}
      deleteAction={deleteEvent}
    />
  );
}
