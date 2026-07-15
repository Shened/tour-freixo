import Link from "next/link";
import { fetchAllData } from "@/lib/standings";
import { addStageAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminStagesPage() {
  const { stages } = await fetchAllData();
  const sorted = stages.slice().sort((a, b) => a.number - b.number);
  const nextNumber = (sorted.at(-1)?.number ?? 0) + 1;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Etapas</h1>

      <form
        action={addStageAction}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Nº</label>
          <input
            name="number"
            type="number"
            defaultValue={nextNumber}
            required
            className="w-20 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Nome</label>
          <input
            name="name"
            required
            placeholder="Ex: Freixo — Aveleda"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Data (opcional)</label>
          <input
            name="date"
            type="date"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Criar etapa
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400">Ainda sem etapas.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((stage) => (
            <li key={stage.id}>
              <Link
                href={`/admin/stages/${stage.id}`}
                className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm hover:border-blue-300"
              >
                <span>
                  <span className="mr-2 font-mono text-neutral-400">Etapa {stage.number}</span>
                  {stage.name}
                </span>
                <span className="text-sm text-blue-600">gerir →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
