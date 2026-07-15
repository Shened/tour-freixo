import Link from "next/link";
import Nav from "@/components/Nav";
import { fetchAllData, computeGC, computePointsClassification } from "@/lib/standings";
import { formatSecondsToTime, formatGap } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await fetchAllData();
  const gc = computeGC(data).slice(0, 5);
  const sprint = computePointsClassification(data, "SPRINT").slice(0, 3);
  const mountain = computePointsClassification(data, "MOUNTAIN").slice(0, 3);
  const leaderTime = gc[0]?.totalSeconds ?? 0;

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">Tour de Freixo</h1>
        <p className="mb-8 text-neutral-500">
          {data.stages.length} etapa{data.stages.length === 1 ? "" : "s"} ·{" "}
          {data.riders.length} atletas
        </p>

        <section className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Classificação Geral</h2>
            <Link href="/classificacao-geral" className="text-sm text-blue-600 hover:underline">
              ver tudo →
            </Link>
          </div>
          {gc.length === 0 ? (
            <p className="text-sm text-neutral-400">Ainda sem resultados.</p>
          ) : (
            <ol className="space-y-2">
              {gc.map((row) => (
                <li key={row.rider.id} className="flex items-center justify-between text-sm">
                  <span>
                    <span className="mr-2 inline-block w-5 font-mono text-neutral-400">
                      {row.rank}.
                    </span>
                    {row.rider.name}
                  </span>
                  <span className="font-mono text-neutral-600">
                    {row.rank === 1
                      ? formatSecondsToTime(row.totalSeconds)
                      : formatGap(row.totalSeconds - leaderTime)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">🚩 Pontos — Sprint</h2>
              <Link href="/pontos" className="text-sm text-blue-600 hover:underline">
                ver tudo →
              </Link>
            </div>
            {sprint.length === 0 ? (
              <p className="text-sm text-neutral-400">Sem pontos ainda.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {sprint.map((row) => (
                  <li key={row.rider.id} className="flex justify-between">
                    <span>{row.rank}. {row.rider.name}</span>
                    <span className="font-mono text-neutral-600">{row.points} pts</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">⛰️ Pontos — Montanha</h2>
              <Link href="/pontos" className="text-sm text-blue-600 hover:underline">
                ver tudo →
              </Link>
            </div>
            {mountain.length === 0 ? (
              <p className="text-sm text-neutral-400">Sem pontos ainda.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {mountain.map((row) => (
                  <li key={row.rider.id} className="flex justify-between">
                    <span>{row.rank}. {row.rider.name}</span>
                    <span className="font-mono text-neutral-600">{row.points} pts</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
