// Aceita "mm:ss", "h:mm:ss" ou "hh:mm:ss" e devolve segundos totais.
export function parseTimeToSeconds(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":").map((p) => p.trim());
  if (parts.some((p) => p === "" || Number.isNaN(Number(p)))) return null;

  let h = 0,
    m = 0,
    s = 0;
  if (parts.length === 3) {
    [h, m, s] = parts.map(Number);
  } else if (parts.length === 2) {
    [m, s] = parts.map(Number);
  } else if (parts.length === 1) {
    s = Number(parts[0]);
  } else {
    return null;
  }

  if (m >= 60 || s >= 60 || m < 0 || s < 0 || h < 0) return null;

  return h * 3600 + m * 60 + s;
}

export function formatSecondsToTime(totalSeconds: number | null): string {
  if (totalSeconds === null || totalSeconds === undefined) return "—";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = m.toString().padStart(h > 0 ? 2 : 1, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Formata uma diferença de tempo relativa ao líder, ex: "+1:23"
export function formatGap(totalSeconds: number): string {
  if (totalSeconds < 0) return "—";
  return `+${formatSecondsToTime(totalSeconds)}`;
}
