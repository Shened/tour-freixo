import Image from "next/image";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";
  const from = params.from ?? "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <Image src="/logo.png" alt="Tour de Freixo" width={56} height={84} className="mb-4 h-14 w-auto" />
        <h1 className="mb-1 font-display text-xl font-black uppercase tracking-tight text-white">
          Tour de Freixo
        </h1>
        <p className="mb-6 text-sm text-neutral-500">Acesso de administrador</p>

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {hasError && (
            <p className="text-sm text-red-400">Password incorreta.</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-light"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
