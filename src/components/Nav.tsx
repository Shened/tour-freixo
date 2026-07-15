import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
          🚴 Tour de Freixo
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-neutral-600">
          <Link href="/classificacao-geral" className="hover:text-blue-600">
            Geral
          </Link>
          <Link href="/pontos" className="hover:text-blue-600">
            Pontos
          </Link>
          <Link href="/etapas" className="hover:text-blue-600">
            Etapas
          </Link>
          <Link href="/admin" className="text-neutral-400 hover:text-blue-600">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
