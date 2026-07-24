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

const VALID_STATUSES: StageStatus[] = ["FINISHED", "DNS", "DNF"];

export async function saveStageResultsAction(formData: FormData) {
  const stageId = String(formData.get("stage_id") ?? "");
  const riderIds = formData.getAll("rider_id").map(String);
  if (!stageId || riderIds.length === 0) return;

  const sb = supabaseAdmin();

  const rows = riderIds.map((riderId) => {
    const rawStatus = String(formData.get(`status_${riderId}`) ?? "FINISHED");
    const status: StageStatus = VALID_STATUSES.includes(rawStatus as StageStatus)
      ? (rawStatus as StageStatus)
      : "FINISHED";
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

  if (error) {
    console.error("[saveStageResultsAction] erro ao gravar resultados:", error.message);
    throw new Error(error.message);
  }

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

  const { data: stageResult } = await sb
    .from("stage_results")
    .select("status")
    .eq("stage_id", stageId)
    .eq("rider_id", riderId)
    .maybeSingle();

  if (stageResult?.status === "DNS") {
    console.error("[addGoalResultAction] atleta em DNS nesta etapa, não pode pontuar em metas volantes");
    return;
  }

  // Se outro atleta já ocupa esta posição nesta meta, liberta a posição primeiro
  // (senão a unique constraint (goal_id, position) rejeita o upsert abaixo).
  const { error: freeError } = await sb
    .from("goal_results")
    .delete()
    .eq("goal_id", goalId)
    .eq("position", position)
    .neq("rider_id", riderId);
  if (freeError) {
    console.error("[addGoalResultAction] erro ao libertar posição:", freeError.message);
    throw new Error(freeError.message);
  }

  const { error } = await sb
    .from("goal_results")
    .upsert(
      { goal_id: goalId, rider_id: riderId, position },
      { onConflict: "goal_id,rider_id" }
    );
  if (error) {
    console.error("[addGoalResultAction] erro ao gravar resultado:", error.message);
    throw new Error(error.message);
  }

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