// Pontuação para metas volantes (sprint e montanha)
const POINTS_BY_POSITION: Record<number, number> = {
  1: 50,
  2: 45,
  3: 40,
  4: 35,
  5: 30,
  6: 25,
  7: 20,
  8: 15,
  9: 10,
  10: 5,
};

export function pointsForPosition(position: number): number {
  return POINTS_BY_POSITION[position] ?? 0;
}

export const VALID_POSITIONS = Object.keys(POINTS_BY_POSITION).map(Number);
