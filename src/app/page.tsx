import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import MountainBackdrop from "@/components/MountainBackdrop";
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
    <div className="relative min-h-screen">
      <MountainBackdrop />
      <Nav />

      {/* Hero / landing */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
        <Image
          src="/logo.png"
          alt="Tour de Freixo"
          width={480}
          height={720}
          priority
          className="h-72 w-auto drop-shadow-[0_0_40px_rgba(249,0,61,0.15)] sm:h-[26rem]"
        />
        <h2 className="mt-2 text-center font-display text-sm font-black uppercase tracking-widest text-neutral-500">
          By EDCycling
        </h2>
        <p className="mt-6 max-w-xl text-balance text-base text-neutral-400 sm:text-lg">
          Uma brincadeira a sério entre amigos, sobre duas rodas, em Gondomar.
        </p>
        <p className="mt-2 max-w-xl text-balance text-base text-neutral-400 sm:text-lg">
          Acompanha a classificação geral, os pontos de sprint e de montanha, etapa a etapa.
        </p>

        <div className="mt-6 flex gap-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          <span className="rounded-full border border-white/10 px-3 py-1">
            {data.stages.length} etapa{data.stages.length === 1 ? "" : "s"}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {data.riders.length} atletas
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/classificacao-geral"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-light"
          >
            Classificação Geral
          </Link>
          <Link
            href="/etapas"
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-neutral-200 transition hover:border-brand/50 hover:text-white"
          >
            Ver Etapas
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Neste momento
          </p>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-display text-sm font-black uppercase tracking-widest text-white">
              Classificação Geral
            </h2>
            <Link href="/classificacao-geral" className="text-sm font-semibold text-brand-light hover:text-brand">
              ver tudo →
            </Link>
          </div>
          {gc.length === 0 ? (
            <p className="px-5 py-6 text-sm text-neutral-500">Ainda sem resultados.</p>
          ) : (
            <ol>
              {gc.map((row) => (
                <li
                  key={row.rider.id}
                  className={`flex items-center justify-between border-b border-white/5 px-5 py-3 text-sm last:border-0 ${
                    row.rank === 1 ? "border-l-4 border-l-brand bg-brand/10" : ""
                  }`}
                >
                  <span className="text-neutral-200">
                    <span className="mr-3 inline-block w-5 font-mono text-neutral-500">
                      {row.rank}.
                    </span>
                    {row.rider.name}
                  </span>
                  <span className="font-mono text-neutral-400">
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
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-sm font-black uppercase tracking-widest text-white">
                🚩 Sprint
              </h2>
              <Link href="/pontos" className="text-sm font-semibold text-brand-light hover:text-brand">
                ver tudo →
              </Link>
            </div>
            {sprint.length === 0 ? (
              <p className="px-5 py-6 text-sm text-neutral-500">Sem pontos ainda.</p>
            ) : (
              <ul>
                {sprint.map((row) => (
                  <li
                    key={row.rider.id}
                    className="flex justify-between border-b border-white/5 px-5 py-3 text-sm text-neutral-200 last:border-0"
                  >
                    <span>{row.rank}. {row.rider.name}</span>
                    <span className="font-mono text-neutral-400">{row.points} pts</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-sm font-black uppercase tracking-widest text-white">
                ⛰️ Montanha
              </h2>
              <Link href="/pontos" className="text-sm font-semibold text-brand-light hover:text-brand">
                ver tudo →
              </Link>
            </div>
            {mountain.length === 0 ? (
              <p className="px-5 py-6 text-sm text-neutral-500">Sem pontos ainda.</p>
            ) : (
              <ul>
                {mountain.map((row) => (
                  <li
                    key={row.rider.id}
                    className="flex justify-between border-b border-white/5 px-5 py-3 text-sm text-neutral-200 last:border-0"
                  >
                    <span>{row.rank}. {row.rider.name}</span>
                    <span className="font-mono text-neutral-400">{row.points} pts</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="mt-16 text-center text-xs text-neutral-600">
          Tour de Freixo
        </footer>
      </main>
    </div>
  );
}
