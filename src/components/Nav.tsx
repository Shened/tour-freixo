import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center py-1">
          <Image
            src="/logo.png"
            alt="Tour de Freixo"
            width={100}
            height={150}
            className="h-20 w-auto"
            priority
          />
        </Link>
        <nav className="flex flex-wrap gap-5 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          <Link href="/classificacao-geral" className="transition hover:text-brand-light">
            Geral
          </Link>
          <Link href="/pontos" className="transition hover:text-brand-light">
            Pontos
          </Link>
          <Link href="/etapas" className="transition hover:text-brand-light">
            Etapas
          </Link>
          <Link href="/admin" className="text-neutral-600 transition hover:text-brand-light">
            Admin
          </Link>
        </nav>
      </div>
      <div className="h-[3px] w-full brand-swoosh" />
    </header>
  );
}
