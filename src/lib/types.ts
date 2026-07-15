export type StageStatus = "FINISHED" | "DNS" | "DNF";
export type GoalType = "SPRINT" | "MOUNTAIN";

export interface Rider {
  id: string;
  name: string;
  team: string | null;
}

export interface Stage {
  id: string;
  number: number;
  name: string;
  date: string | null;
}

export interface StageResult {
  id: string;
  stage_id: string;
  rider_id: string;
  status: StageStatus;
  time_seconds: number | null;
}

export interface Goal {
  id: string;
  stage_id: string;
  type: GoalType;
  name: string;
  order_index: number;
}

export interface GoalResult {
  id: string;
  goal_id: string;
  rider_id: string;
  position: number;
}
