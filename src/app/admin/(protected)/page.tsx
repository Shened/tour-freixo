import Link from "next/link";
import { fetchAllData } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const data = await fetchAllData();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Painel de administração</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/riders"
          className="rounded-xl border bg-white p-5 text-neutral-900 shadow-sm hover:border-brand/40"
        >
          <p className="text-sm text-neutral-500">Atletas</p>
          <p className="text-2xl font-black text-brand">{data.riders.length}</p>
        </Link>
        <Link
          href="/admin/stages"
          className="rounded-xl border bg-white p-5 text-neutral-900 shadow-sm hover:border-brand/40"
        >
          <p className="text-sm text-neutral-500">Etapas</p>
          <p className="text-2xl font-black text-brand">{data.stages.length}</p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-semibold text-neutral-700">Etapas recentes</h2>
        {data.stages.length === 0 ? (
          <p className="text-sm text-neutral-400">Nenhuma etapa criada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {data.stages
              .slice()
              .sort((a, b) => b.number - a.number)
              .slice(0, 5)
              .map((stage) => (
                <li key={stage.id}>
                  <Link
                    href={`/admin/stages/${stage.id}`}
                    className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-neutral-900 shadow-sm hover:border-brand/40"
                  >
                    <span>
                      <span className="mr-2 font-mono text-neutral-400">
                        Etapa {stage.number}
                      </span>
                      {stage.name}
                    </span>
                    <span className="text-sm text-brand-light">editar →</span>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
