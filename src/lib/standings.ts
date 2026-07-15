import { supabasePublic } from "./supabase";
import { pointsForPosition } from "./points";
import type {
  Rider,
  Stage,
  StageResult,
  Goal,
  GoalResult,
  GoalType,
} from "./types";

export interface FullData {
  riders: Rider[];
  stages: Stage[];
  stageResults: StageResult[];
  goals: Goal[];
  goalResults: GoalResult[];
}

export async function fetchAllData(): Promise<FullData> {
  const sb = supabasePublic();

  const [
    { data: riders },
    { data: stages },
    { data: stageResults },
    { data: goals },
    { data: goalResults },
  ] = await Promise.all([
    sb.from("riders").select("*").order("name"),
    sb.from("stages").select("*").order("number"),
    sb.from("stage_results").select("*"),
    sb.from("goals").select("*").order("order_index"),
    sb.from("goal_results").select("*"),
  ]);

  return {
    riders: (riders as Rider[]) ?? [],
    stages: (stages as Stage[]) ?? [],
    stageResults: (stageResults as StageResult[]) ?? [],
    goals: (goals as Goal[]) ?? [],
    goalResults: (goalResults as GoalResult[]) ?? [],
  };
}

export interface GcRow {
  rider: Rider;
  totalSeconds: number;
  stagesCompleted: number;
  rank: number;
}

/**
 * Classificação geral (GC): soma dos tempos de etapa.
 * Um atleta que teve DNS/DNF em qualquer etapa deixa de participar na GC
 * (é excluído por completo, não só a partir dessa etapa).
 */
export function computeGC(data: FullData): GcRow[] {
  const { riders, stageResults } = data;

  const excluded = new Set<string>();
  for (const r of stageResults) {
    if (r.status !== "FINISHED") excluded.add(r.rider_id);
  }

  const rows: GcRow[] = [];
  for (const rider of riders) {
    if (excluded.has(rider.id)) continue;
    const results = stageResults.filter(
      (r) => r.rider_id === rider.id && r.status === "FINISHED"
    );
    if (results.length === 0) continue;
    const totalSeconds = results.reduce(
      (sum, r) => sum + (r.time_seconds ?? 0),
      0
    );
    rows.push({
      rider,
      totalSeconds,
      stagesCompleted: results.length,
      rank: 0,
    });
  }

  rows.sort((a, b) => a.totalSeconds - b.totalSeconds);
  rows.forEach((row, i) => (row.rank = i + 1));
  return rows;
}

export interface PointsRow {
  rider: Rider;
  points: number;
  rank: number;
}

/**
 * Classificação por pontos (sprint ou montanha), somando os pontos
 * de todas as metas volantes desse tipo, em todas as etapas.
 * Não é afetada por DNS/DNF — mantém-se independente da GC.
 */
export function computePointsClassification(
  data: FullData,
  type: GoalType
): PointsRow[] {
  const { riders, goals, goalResults } = data;
  const goalIdsOfType = new Set(
    goals.filter((g) => g.type === type).map((g) => g.id)
  );

  const totals = new Map<string, number>();
  for (const gr of goalResults) {
    if (!goalIdsOfType.has(gr.goal_id)) continue;
    const pts = pointsForPosition(gr.position);
    totals.set(gr.rider_id, (totals.get(gr.rider_id) ?? 0) + pts);
  }

  const rows: PointsRow[] = riders
    .filter((r) => totals.has(r.id))
    .map((rider) => ({
      rider,
      points: totals.get(rider.id) ?? 0,
      rank: 0,
    }));

  rows.sort((a, b) => b.points - a.points);
  rows.forEach((row, i) => (row.rank = i + 1));
  return rows;
}

export function isRiderOutOfGC(data: FullData, riderId: string): boolean {
  return data.stageResults.some(
    (r) => r.rider_id === riderId && r.status !== "FINISHED"
  );
}
