import { fetchAllData } from "@/lib/standings";
import { addRiderAction, deleteRiderAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminRidersPage() {
  const { riders } = await fetchAllData();
  const sorted = riders.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Atletas</h1>

      <form
        action={addRiderAction}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Nome</label>
          <input
            name="name"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Equipa (opcional)</label>
          <input
            name="team"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Adicionar
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400">Ainda sem atletas.</p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-white shadow-sm">
          {sorted.map((rider) => (
            <li key={rider.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>
                {rider.name}
                {rider.team && <span className="ml-2 text-xs text-neutral-400">{rider.team}</span>}
              </span>
              <form action={deleteRiderAction}>
                <input type="hidden" name="id" value={rider.id} />
                <button className="text-xs text-neutral-400 hover:text-red-600">remover</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
