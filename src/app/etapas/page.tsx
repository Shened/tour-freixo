import Link from "next/link";
import Nav from "@/components/Nav";
import { fetchAllData } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function EtapasPage() {
  const { stages } = await fetchAllData();

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Etapas</h1>
        {stages.length === 0 ? (
          <p className="text-neutral-400">Ainda sem etapas criadas.</p>
        ) : (
          <ul className="space-y-2">
            {stages.map((stage) => (
              <li key={stage.id}>
                <Link
                  href={`/etapas/${stage.id}`}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm hover:border-blue-300"
                >
                  <span>
                    <span className="mr-2 font-mono text-neutral-400">
                      Etapa {stage.number}
                    </span>
                    <span className="font-medium">{stage.name}</span>
                  </span>
                  {stage.date && (
                    <span className="text-sm text-neutral-400">
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
