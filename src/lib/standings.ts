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

  const [ridersRes, stagesRes, stageResultsRes, goalsRes, goalResultsRes] =
    await Promise.all([
      sb.from("riders").select("*").order("name"),
      sb.from("stages").select("*").order("number"),
      sb.from("stage_results").select("*"),
      sb.from("goals").select("*").order("order_index"),
      sb.from("goal_results").select("*"),
    ]);

  for (const [label, res] of [
    ["riders", ridersRes],
    ["stages", stagesRes],
    ["stage_results", stageResultsRes],
    ["goals", goalsRes],
    ["goal_results", goalResultsRes],
  ] as const) {
    if (res.error) {
      console.error(`[fetchAllData] erro ao ler "${label}":`, res.error.message);
    }
  }

  return {
    riders: (ridersRes.data as Rider[]) ?? [],
    stages: (stagesRes.data as Stage[]) ?? [],
    stageResults: (stageResultsRes.data as StageResult[]) ?? [],
    goals: (goalsRes.data as Goal[]) ?? [],
    goalResults: (goalResultsRes.data as GoalResult[]) ?? [],
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

export interface GcEvolutionSeries {
  riderId: string;
  riderName: string;
}

export interface GcEvolutionPoint {
  stage: number;
  stageLabel: string;
  ranks: Record<string, number>; // riderId -> rank at this point in the race
}

/**
 * Evolução da classificação geral etapa a etapa: para cada etapa (por ordem),
 * calcula a posição de cada atleta na GC acumulada até essa etapa.
 * Só inclui atletas que nunca tiveram DNS/DNF (os mesmos que contam para a GC final).
 */
export function computeGcEvolution(data: FullData): {
  series: GcEvolutionSeries[];
  points: GcEvolutionPoint[];
} {
  const { riders, stages, stageResults } = data;

  const excluded = new Set<string>();
  for (const r of stageResults) {
    if (r.status !== "FINISHED") excluded.add(r.rider_id);
  }
  const includedRiders = riders.filter((r) => !excluded.has(r.id));
  const series: GcEvolutionSeries[] = includedRiders.map((r) => ({
    riderId: r.id,
    riderName: r.name,
  }));

  const sortedStages = stages.slice().sort((a, b) => a.number - b.number);
  const cumulative = new Map<string, number>();
  const hasRaced = new Set<string>();

  const points: GcEvolutionPoint[] = [];

  for (const stage of sortedStages) {
    const resultsThisStage = stageResults.filter(
      (r) => r.stage_id === stage.id && r.status === "FINISHED"
    );
    if (resultsThisStage.length === 0) continue;

    for (const res of resultsThisStage) {
      if (excluded.has(res.rider_id)) continue;
      cumulative.set(
        res.rider_id,
        (cumulative.get(res.rider_id) ?? 0) + (res.time_seconds ?? 0)
      );
      hasRaced.add(res.rider_id);
    }

    const ranked = includedRiders
      .filter((r) => hasRaced.has(r.id))
      .map((r) => ({ id: r.id, total: cumulative.get(r.id) ?? 0 }))
      .sort((a, b) => a.total - b.total);

    const ranks: Record<string, number> = {};
    ranked.forEach((r, i) => (ranks[r.id] = i + 1));

    points.push({ stage: stage.number, stageLabel: `E${stage.number}`, ranks });
  }

  return { series, points };
}
