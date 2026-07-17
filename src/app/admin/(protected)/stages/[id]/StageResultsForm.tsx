"use client";

import { useState, useTransition } from "react";
import { saveStageResultsAction } from "./actions";
import type { StageStatus } from "@/lib/types";

interface RiderRow {
  id: string;
  name: string;
  status: StageStatus;
  time: string; // já formatado como mm:ss, string vazia se não houver
}

export default function StageResultsForm({
  stageId,
  initialRows,
}: {
  stageId: string;
  initialRows: RiderRow[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function updateStatus(riderId: string, status: StageStatus) {
    setSaved(false);
    setRows((prev) =>
      prev.map((r) =>
        r.id === riderId
          ? { ...r, status, time: status === "FINISHED" ? r.time : "" }
          : r
      )
    );
  }

  function updateTime(riderId: string, time: string) {
    setSaved(false);
    setRows((prev) => prev.map((r) => (r.id === riderId ? { ...r, time } : r)));
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveStageResultsAction(formData);
      setSaved(true);
    });
  }

  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white text-neutral-900 shadow-sm">
        <p className="px-4 py-4 text-sm text-neutral-400">
          Sem atletas ainda — adiciona atletas primeiro.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="overflow-hidden rounded-xl border bg-white text-neutral-900 shadow-sm">
      <input type="hidden" name="stage_id" value={stageId} />
      <table className="w-full text-sm">
        <thead className="border-b bg-neutral-50 text-left text-neutral-500">
          <tr>
            <th className="px-4 py-2 font-medium">Atleta</th>
            <th className="px-4 py-2 font-medium">Estado</th>
            <th className="px-4 py-2 font-medium">Tempo (mm:ss)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const disabled = row.status !== "FINISHED";
            return (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">
                  {row.name}
                  <input type="hidden" name="rider_id" value={row.id} />
                </td>
                <td className="px-4 py-2">
                  <select
                    name={`status_${row.id}`}
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value as StageStatus)}
                    className="rounded-lg border border-neutral-300 bg-white text-neutral-900 px-2 py-1 text-sm"
                  >
                    <option value="FINISHED">Terminou</option>
                    <option value="DNS">DNS</option>
                    <option value="DNF">DNF</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    name={`time_${row.id}`}
                    placeholder={disabled ? "—" : "mm:ss"}
                    value={row.time}
                    disabled={disabled}
                    onChange={(e) => updateTime(row.id, e.target.value)}
                    className="w-28 rounded-lg border border-neutral-300 bg-white text-neutral-900 px-2 py-1 text-sm font-mono disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-3 border-t px-4 py-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-light disabled:opacity-60"
        >
          {isPending ? "A guardar…" : "Guardar resultados"}
        </button>
        {saved && !isPending && (
          <span className="text-sm text-green-600">Guardado ✓</span>
        )}
      </div>
    </form>
  );
}
