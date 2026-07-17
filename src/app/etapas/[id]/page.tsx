import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import MountainBackdrop from "@/components/MountainBackdrop";
import { fetchAllData } from "@/lib/standings";
import { pointsForPosition } from "@/lib/points";
import { formatSecondsToTime, formatGap } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function EtapaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchAllData();
  const stage = data.stages.find((s) => s.id === id);
  if (!stage) notFound();

  const riderById = new Map(data.riders.map((r) => [r.id, r]));

  const results = data.stageResults.filter((r) => r.stage_id === stage.id);
  const finished = results
    .filter((r) => r.status === "FINISHED")
    .sort((a, b) => (a.time_seconds ?? 0) - (b.time_seconds ?? 0));
  const dnf = results.filter((r) => r.status === "DNF");
  const dns = results.filter((r) => r.status === "DNS");
  const leaderTime = finished[0]?.time_seconds ?? 0;

  const goals = data.goals
    .filter((g) => g.stage_id === stage.id)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="relative min-h-screen">
      <MountainBackdrop />
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-1 font-mono text-sm text-neutral-500">Etapa {stage.number}</p>
        <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight text-white">
          {stage.name}
        </h1>

        <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <h2 className="border-b border-white/10 px-5 py-4 font-display text-sm font-black uppercase tracking-widest text-white">
            Classificação da etapa
          </h2>
          {finished.length === 0 && dnf.length === 0 && dns.length === 0 ? (
            <p className="px-5 py-6 text-sm text-neutral-500">Ainda sem resultados.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {finished.map((r, i) => {
                  const rider = riderById.get(r.rider_id);
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-white/5 last:border-0 ${
                        i === 0 ? "border-l-4 border-l-brand bg-brand/10" : ""
                      }`}
                    >
                      <td className="w-10 px-4 py-3 font-mono text-neutral-500">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-neutral-100">{rider?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-mono text-neutral-400">
                        {i === 0
                          ? formatSecondsToTime(r.time_seconds ?? 0)
                          : formatGap((r.time_seconds ?? 0) - leaderTime)}
                      </td>
                    </tr>
                  );
                })}
                {dnf.map((r) => {
                  const rider = riderById.get(r.rider_id);
                  return (
                    <tr key={r.id} className="border-b border-white/5 last:border-0">
                      <td className="w-10 px-4 py-3 font-mono text-neutral-700">—</td>
                      <td className="px-4 py-3 text-neutral-500">{rider?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-red-400">
                        DNF
                      </td>
                    </tr>
                  );
                })}
                {dns.map((r) => {
                  const rider = riderById.get(r.rider_id);
                  return (
                    <tr key={r.id} className="border-b border-white/5 last:border-0">
                      <td className="w-10 px-4 py-3 font-mono text-neutral-700">—</td>
                      <td className="px-4 py-3 text-neutral-500">{rider?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-neutral-600">
                        DNS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {goals.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Sem metas volantes (sprint/montanha) nesta etapa.
          </p>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const goalResults = data.goalResults
                .filter((gr) => gr.goal_id === goal.id)
                .sort((a, b) => a.position - b.position);
              return (
                <section
                  key={goal.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <h3 className="border-b border-white/10 px-5 py-3 font-display text-sm font-black uppercase tracking-widest text-white">
                    {goal.type === "SPRINT" ? "🚩" : "⛰️"} {goal.name}
                  </h3>
                  {goalResults.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-neutral-500">Sem resultados.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <tbody>
                        {goalResults.map((gr) => {
                          const rider = riderById.get(gr.rider_id);
                          return (
                            <tr key={gr.id} className="border-b border-white/5 last:border-0">
                              <td className="w-10 px-4 py-3 font-mono text-neutral-500">
                                {gr.position}
                              </td>
                              <td className="px-4 py-3 text-neutral-200">{rider?.name ?? "—"}</td>
                              <td className="px-4 py-3 text-right font-mono text-neutral-400">
                                {pointsForPosition(gr.position)} pts
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
