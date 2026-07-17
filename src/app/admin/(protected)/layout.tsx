import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { logoutAction } from "../login/actions";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Tour de Freixo" width={32} height={48} className="h-8 w-auto" />
            <nav className="flex gap-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              <Link href="/admin" className="hover:text-brand-light">
                Painel
              </Link>
              <Link href="/admin/riders" className="hover:text-brand-light">
                Atletas
              </Link>
              <Link href="/admin/stages" className="hover:text-brand-light">
                Etapas
              </Link>
              <Link href="/" className="text-neutral-600 hover:text-brand-light">
                ← Ver site público
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button className="text-sm text-neutral-500 hover:text-red-400">Sair</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
