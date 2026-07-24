import Nav from "@/components/Nav";
import MountainBackdrop from "@/components/MountainBackdrop";
import GcEvolutionChart from "@/components/GcEvolutionChart";
import { fetchAllData, computeGC, computeGcEvolution, isRiderOutOfGC } from "@/lib/standings";
import { formatSecondsToTime, formatGap } from "@/lib/time";

export const dynamic = "force-dynamic";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default async function ClassificacaoGeralPage() {
  const data = await fetchAllData();
  const gc = computeGC(data);
  const evolution = computeGcEvolution(data);
  const leaderTime = gc[0]?.totalSeconds ?? 0;
  const outRiders = data.riders.filter((r) => isRiderOutOfGC(data, r.id));

  return (
    <div className="relative min-h-screen">
      <MountainBackdrop />
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand">Geral</p>
        <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight text-white">
          Classificação Geral
        </h1>

        {gc.length === 0 ? (
          <p className="text-neutral-500">Ainda sem resultados.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-left text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Atleta</th>
                  <th className="px-4 py-3 text-right font-medium">Etapas</th>
                  <th className="px-4 py-3 text-right font-medium">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {gc.map((row) => (
                  <tr
                    key={row.rider.id}
                    className={`border-b border-white/5 last:border-0 ${
                      row.rank === 1 ? "border-l-4 border-l-brand bg-brand/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-neutral-500">
                      {MEDALS[row.rank] ?? row.rank}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-100">
                      {row.rider.name}
                      {row.rider.team && (
                        <span className="ml-2 text-xs text-neutral-500">{row.rider.team}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-500">{row.stagesCompleted}</td>
                    <td className="px-4 py-3 text-right font-mono text-neutral-300">
                      {row.rank === 1
                        ? formatSecondsToTime(row.totalSeconds)
                        : formatGap(row.totalSeconds - leaderTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {outRiders.length > 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm">
            <p className="mb-2 font-semibold text-neutral-400">
              Fora da Geral (DNS/DNF numa etapa)
            </p>
            <p className="text-neutral-600">{outRiders.map((r) => r.name).join(", ")}</p>
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <h2 className="border-b border-white/10 px-5 py-4 font-display text-sm font-black uppercase tracking-widest text-white">
            Evolução da Classificação
          </h2>
          <GcEvolutionChart series={evolution.series} points={evolution.points} />
        </section>
      </main>
    </div>
  );
}
