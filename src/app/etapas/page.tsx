import Link from "next/link";
import Nav from "@/components/Nav";
import MountainBackdrop from "@/components/MountainBackdrop";
import { fetchAllData } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function EtapasPage() {
  const { stages } = await fetchAllData();

  return (
    <div className="relative min-h-screen">
      <MountainBackdrop />
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand">Percurso</p>
        <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight text-white">
          Etapas
        </h1>
        {stages.length === 0 ? (
          <p className="text-neutral-500">Ainda sem etapas criadas.</p>
        ) : (
          <ul className="space-y-3">
            {stages.map((stage) => (
              <li key={stage.id}>
                <Link
                  href={`/etapas/${stage.id}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-brand/50 hover:bg-white/[0.05]"
                >
                  <span className="text-neutral-100">
                    <span className="mr-3 font-mono text-neutral-500">
                      Etapa {stage.number}
                    </span>
                    <span className="font-medium">{stage.name}</span>
                  </span>
                  {stage.date && (
                    <span className="text-sm text-neutral-500">
                      {new Date(stage.date).toLocaleDateString("pt-PT")}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
