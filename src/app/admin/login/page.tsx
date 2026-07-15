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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-neutral-900">
          Tour de Freixo
        </h1>
        <p className="mb-6 text-sm text-neutral-500">Acesso de administrador</p>

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {hasError && (
            <p className="text-sm text-red-600">Password incorreta.</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
