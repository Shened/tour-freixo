import { notFound } from "next/navigation";
import { fetchAllData } from "@/lib/standings";
import { formatSecondsToTime } from "@/lib/time";
import { pointsForPosition, VALID_POSITIONS } from "@/lib/points";
import {
  saveStageResultsAction,
  addGoalAction,
  deleteGoalAction,
  addGoalResultAction,
  deleteGoalResultAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminStageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchAllData();
  const stage = data.stages.find((s) => s.id === id);
  if (!stage) notFound();

  const riders = data.riders.slice().sort((a, b) => a.name.localeCompare(b.name));
  const resultsByRider = new Map(
    data.stageResults.filter((r) => r.stage_id === stage.id).map((r) => [r.rider_id, r])
  );
  const goals = data.goals
    .filter((g) => g.stage_id === stage.id)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      <p className="mb-1 font-mono text-sm text-neutral-400">Etapa {stage.number}</p>
      <h1 className="mb-6 text-2xl font-bold">{stage.name}</h1>

      <section className="mb-10">
        <h2 className="mb-3 font-semibold">Resultados da etapa</h2>
        <form action={saveStageResultsAction} className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <input type="hidden" name="stage_id" value={stage.id} />
          <table className="w-full text-sm">
            <thead className="border-b bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-2 font-medium">Atleta</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium">Tempo (mm:ss)</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => {
                const existing = resultsByRider.get(rider.id);
                return (
                  <tr key={rider.id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-medium">
                      {rider.name}
                      <input type="hidden" name="rider_id" value={rider.id} />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        name={`status_${rider.id}`}
                        defaultValue={existing?.status ?? "FINISHED"}
                        className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                      >
                        <option value="FINISHED">Terminou</option>
                        <option value="DNS">DNS</option>
                        <option value="DNF">DNF</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name={`time_${rider.id}`}
                        placeholder="mm:ss"
                        defaultValue={
                          existing?.time_seconds != null
                            ? formatSecondsToTime(existing.time_seconds)
                            : ""
                        }
                        className="w-28 rounded-lg border border-neutral-300 px-2 py-1 text-sm font-mono"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {riders.length === 0 ? (
            <p className="px-4 py-4 text-sm text-neutral-400">
              Sem atletas ainda — adiciona atletas primeiro.
            </p>
          ) : (
            <div className="border-t px-4 py-3">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Guardar resultados
              </button>
            </div>
          )}
        </form>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Metas volantes (sprint / montanha)</h2>

        <form
          action={addGoalAction}
          className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 shadow-sm"
        >
          <input type="hidden" name="stage_id" value={stage.id} />
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tipo</label>
            <select name="type" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
              <option value="SPRINT">🚩 Sprint</option>
              <option value="MOUNTAIN">⛰️ Montanha</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Nome</label>
            <input
              name="name"
              required
              placeholder="Ex: Alto do Freixo"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Adicionar meta
          </button>
        </form>

        {goals.length === 0 ? (
          <p className="text-sm text-neutral-400">Sem metas volantes nesta etapa.</p>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const goalResults = data.goalResults
                .filter((gr) => gr.goal_id === goal.id)
                .sort((a, b) => a.position - b.position);
              const takenPositions = new Set(goalResults.map((gr) => gr.position));
              const riderById = new Map(riders.map((r) => [r.id, r]));

              return (
                <div key={goal.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-semibold">
                      {goal.type === "SPRINT" ? "🚩" : "⛰️"} {goal.name}
                    </h3>
                    <form action={deleteGoalAction}>
                      <input type="hidden" name="stage_id" value={stage.id} />
                      <input type="hidden" name="goal_id" value={goal.id} />
                      <button className="text-xs text-neutral-400 hover:text-red-600">
                        remover meta
                      </button>
                    </form>
                  </div>

                  {goalResults.length > 0 && (
                    <table className="w-full text-sm">
                      <tbody>
                        {goalResults.map((gr) => (
                          <tr key={gr.id} className="border-b last:border-0">
                            <td className="w-10 px-4 py-2 font-mono text-neutral-400">
                              {gr.position}
                            </td>
                            <td className="px-4 py-2">{riderById.get(gr.rider_id)?.name ?? "—"}</td>
                            <td className="px-4 py-2 text-neutral-500">
                              {pointsForPosition(gr.position)} pts
                            </td>
                            <td className="px-4 py-2 text-right">
                              <form action={deleteGoalResultAction}>
                                <input type="hidden" name="stage_id" value={stage.id} />
                                <input type="hidden" name="id" value={gr.id} />
                                <button className="text-xs text-neutral-400 hover:text-red-600">
                                  remover
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <form
                    action={addGoalResultAction}
                    className="flex flex-wrap items-end gap-3 border-t bg-neutral-50 px-4 py-3"
                  >
                    <input type="hidden" name="stage_id" value={stage.id} />
                    <input type="hidden" name="goal_id" value={goal.id} />
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">
                        Atleta
                      </label>
                      <select
                        name="rider_id"
                        required
                        className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                      >
                        {riders.map((rider) => (
                          <option key={rider.id} value={rider.id}>
                            {rider.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">
                        Posição
                      </label>
                      <select
                        name="position"
                        required
                        className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                      >
                        {VALID_POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}º {takenPositions.has(pos) ? "(substituir)" : ""} — {pointsForPosition(pos)} pts
                          </option>
                        ))}
                      </select>
                    </div>
                    <button className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-neutral-900">
                      Adicionar
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
