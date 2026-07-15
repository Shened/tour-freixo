"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export async function addRiderAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  if (!name) return;

  const sb = supabaseAdmin();
  const { error } = await sb.from("riders").insert({
    name,
    team: team || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/riders");
  revalidatePath("/");
}

export async function deleteRiderAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const sb = supabaseAdmin();
  const { error } = await sb.from("riders").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/riders");
  revalidatePath("/");
}
