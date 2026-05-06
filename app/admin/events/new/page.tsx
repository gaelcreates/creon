import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../EventForm";
import { createEvent } from "../actions";

export const metadata = {
  title: "Nouvel event — CREON Admin",
};

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: creators } = await supabase
    .from("creators")
    .select("id, display_name")
    .eq("status", "active")
    .order("display_name", { ascending: true });

  return (
    <EventForm
      creators={creators ?? []}
      saveAction={createEvent}
    />
  );
}
