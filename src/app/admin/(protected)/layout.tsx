import { redirect } from "next/navigation";
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
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/admin" className="hover:text-blue-600">
              Painel
            </Link>
            <Link href="/admin/riders" className="hover:text-blue-600">
              Atletas
            </Link>
            <Link href="/admin/stages" className="hover:text-blue-600">
              Etapas
            </Link>
            <Link href="/" className="text-neutral-400 hover:text-blue-600">
              ← Ver site público
            </Link>
          </nav>
          <form action={logoutAction}>
            <button className="text-sm text-neutral-500 hover:text-red-600">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
