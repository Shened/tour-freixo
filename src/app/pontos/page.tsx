import Nav from "@/components/Nav";
import MountainBackdrop from "@/components/MountainBackdrop";
import { fetchAllData, computePointsClassification } from "@/lib/standings";

export const dynamic = "force-dynamic";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function PointsTable({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: string;
  rows: { rider: { id: string; name: string; team: string | null }; points: number; rank: number }[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <h2 className="border-b border-white/10 px-5 py-4 font-display text-sm font-black uppercase tracking-widest text-white">
        {icon} {title}
      </h2>
      {rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-neutral-500">Sem pontos ainda.</p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.rider.id}
                className={`border-b border-white/5 last:border-0 ${
                  row.rank === 1 ? "border-l-4 border-l-brand bg-brand/10" : ""
                }`}
              >
                <td className="w-10 px-4 py-3 font-mono text-neutral-500">
                  {MEDALS[row.rank] ?? row.rank}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-100">{row.rider.name}</td>
                <td className="px-4 py-3 text-right font-mono text-neutral-400">{row.points} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default async function PontosPage() {
  const data = await fetchAllData();
  const sprint = computePointsClassification(data, "SPRINT");
  const mountain = computePointsClassification(data, "MOUNTAIN");

  return (
    <div className="relative min-h-screen">
      <MountainBackdrop />
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand">Pontos</p>
        <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight text-white">
          Classificações por Pontos
        </h1>
        <div className="grid gap-6 sm:grid-cols-2">
          <PointsTable title="Sprint" icon="🚩" rows={sprint} />
          <PointsTable title="Montanha" icon="⛰️" rows={mountain} />
        </div>
      </main>
    </div>
  );
}
