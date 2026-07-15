"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { parseTimeToSeconds } from "@/lib/time";
import type { StageStatus } from "@/lib/types";

function revalidateStage(stageId: string) {
  revalidatePath(`/admin/stages/${stageId}`);
  revalidatePath(`/etapas/${stageId}`);
  revalidatePath("/classificacao-geral");
  revalidatePath("/pontos");
  revalidatePath("/");
}

export async function saveStageResultsAction(formData: FormData) {
  const stageId = String(formData.get("stage_id") ?? "");
  const riderIds = formData.getAll("rider_id").map(String);
  if (!stageId) return;

  const sb = supabaseAdmin();

  const rows = riderIds.map((riderId) => {
    const status = String(formData.get(`status_${riderId}`) ?? "FINISHED") as StageStatus;
    const timeRaw = String(formData.get(`time_${riderId}`) ?? "");
    const timeSeconds = status === "FINISHED" ? parseTimeToSeconds(timeRaw) : null;
    return {
      stage_id: stageId,
      rider_id: riderId,
      status,
      time_seconds: timeSeconds,
    };
  });

  const { error } = await sb
    .from("stage_results")
    .upsert(rows, { onConflict: "stage_id,rider_id" });
  if (error) throw new Error(error.message);

  revalidateStage(stageId);
}

export async function addGoalAction(formData: FormData) {
  const stageId = String(formData.get("stage_id") ?? "");
  const type = String(formData.get("type") ?? "SPRINT");
  const name = String(formData.get("name") ?? "").trim();
  if (!stageId || !name) return;

  const sb = supabaseAdmin();
  const { count } = await sb
    .from("goals")
    .select("id", { count: "exact", head: true })
    .eq("stage_id", stageId);

  const { error } = await sb.from("goals").insert({
    stage_id: stageId,
    type,
    name,
    order_index: count ?? 0,
  });
  if (error) throw new Error(error.message);

  revalidateStage(stageId);
}

export async function deleteGoalAction(formData: FormData) {
  const stageId = String(formData.get("stage_id") ?? "");
  const goalId = String(formData.get("goal_id") ?? "");
  if (!goalId) return;

  const sb = supabaseAdmin();
  const { error } = await sb.from("goals").delete().eq("id", goalId);
  if (error) throw new Error(error.message);

  revalidateStage(stageId);
}

export async function addGoalResultAction(formData: FormData) {
  const stageId = String(formData.get("stage_id") ?? "");
  const goalId = String(formData.get("goal_id") ?? "");
  const riderId = String(formData.get("rider_id") ?? "");
  const position = Number(formData.get("position"));
  if (!goalId || !riderId || !position) return;

  const sb = supabaseAdmin();
  const { error } = await sb
    .from("goal_results")
    .upsert(
      { goal_id: goalId, rider_id: riderId, position },
      { onConflict: "goal_id,rider_id" }
    );
  if (error) throw new Error(error.message);

  revalidateStage(stageId);
}

export async function deleteGoalResultAction(formData: FormData) {
  const stageId = String(formData.get("stage_id") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const sb = supabaseAdmin();
  const { error } = await sb.from("goal_results").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateStage(stageId);
}
