"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { GcEvolutionPoint, GcEvolutionSeries } from "@/lib/standings";

const COLORS = [
  "#f9003d", // brand
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#eab308",
  "#ec4899",
  "#84cc16",
  "#6366f1",
];

export default function GcEvolutionChart({
  series,
  points,
}: {
  series: GcEvolutionSeries[];
  points: GcEvolutionPoint[];
}) {
  if (points.length < 2) {
    return (
      <p className="px-5 py-6 text-sm text-neutral-500">
        A evolução aparece aqui assim que houver pelo menos 2 etapas com resultados.
      </p>
    );
  }

  const chartData = points.map((p) => ({
    stageLabel: p.stageLabel,
    ...p.ranks,
  }));

  const riderCount = series.length;

  return (
    <div className="px-2 py-4 sm:px-5">
      <ResponsiveContainer width="100%" height={Math.max(280, riderCount * 34)}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="stageLabel"
            stroke="rgba(255,255,255,0.4)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
          />
          <YAxis
            reversed
            allowDecimals={false}
            domain={[1, riderCount]}
            stroke="rgba(255,255,255,0.4)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            width={28}
          />
          <Tooltip
            contentStyle={{
              background: "#111114",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#fff" }}
            formatter={(value, name) => [`${value}º`, name] as [string, string]}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
          {series.map((s, i) => (
            <Line
              key={s.riderId}
              type="monotone"
              dataKey={s.riderId}
              name={s.riderName}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
