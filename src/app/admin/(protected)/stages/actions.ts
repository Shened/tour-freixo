"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export async function addStageAction(formData: FormData) {
  const number = Number(formData.get("number"));
  const name = String(formData.get("name") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  if (!number || !name) return;

  const sb = supabaseAdmin();
  const { error } = await sb.from("stages").insert({
    number,
    name,
    date: date || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/stages");
  revalidatePath("/etapas");
  revalidatePath("/");
}

export async function deleteStageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const sb = supabaseAdmin();
  const { error } = await sb.from("stages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/stages");
  revalidatePath("/etapas");
  revalidatePath("/");
  redirect("/admin/stages");
}
