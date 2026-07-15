import Nav from "@/components/Nav";
import { fetchAllData, computeGC, isRiderOutOfGC } from "@/lib/standings";
import { formatSecondsToTime, formatGap } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function ClassificacaoGeralPage() {
  const data = await fetchAllData();
  const gc = computeGC(data);
  const leaderTime = gc[0]?.totalSeconds ?? 0;
  const outRiders = data.riders.filter((r) => isRiderOutOfGC(data, r.id));

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Classificação Geral</h1>

        {gc.length === 0 ? (
          <p className="text-neutral-400">Ainda sem resultados.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b bg-neutral-50 text-left text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Atleta</th>
                  <th className="px-4 py-3 text-right font-medium">Etapas</th>
                  <th className="px-4 py-3 text-right font-medium">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {gc.map((row) => (
                  <tr key={row.rider.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-neutral-400">{row.rank}</td>
                    <td className="px-4 py-3 font-medium">
                      {row.rider.name}
                      {row.rider.team && (
                        <span className="ml-2 text-xs text-neutral-400">{row.rider.team}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-500">{row.stagesCompleted}</td>
                    <td className="px-4 py-3 text-right font-mono">
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
          <div className="mt-6 rounded-xl border border-dashed bg-white p-4 text-sm">
            <p className="mb-2 font-medium text-neutral-600">
              Fora da Geral (DNS/DNF numa etapa)
            </p>
            <p className="text-neutral-400">
              {outRiders.map((r) => r.name).join(", ")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
