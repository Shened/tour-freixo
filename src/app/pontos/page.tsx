import Nav from "@/components/Nav";
import { fetchAllData, computePointsClassification } from "@/lib/standings";

export const dynamic = "force-dynamic";

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
    <section className="rounded-xl border bg-white shadow-sm">
      <h2 className="border-b px-4 py-3 font-semibold">
        {icon} {title}
      </h2>
      {rows.length === 0 ? (
        <p className="px-4 py-4 text-sm text-neutral-400">Sem pontos ainda.</p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.rider.id} className="border-b last:border-0">
                <td className="w-10 px-4 py-2 font-mono text-neutral-400">{row.rank}</td>
                <td className="px-4 py-2 font-medium">{row.rider.name}</td>
                <td className="px-4 py-2 text-right font-mono text-neutral-600">
                  {row.points} pts
                </td>
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
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Classificações por Pontos</h1>
        <div className="grid gap-6 sm:grid-cols-2">
          <PointsTable title="Sprint" icon="🚩" rows={sprint} />
          <PointsTable title="Montanha" icon="⛰️" rows={mountain} />
        </div>
      </main>
    </div>
  );
}
