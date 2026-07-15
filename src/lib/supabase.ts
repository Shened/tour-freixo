import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

/**
 * Cliente público — usa a chave anon, respeita RLS.
 * Usar para todas as leituras (páginas públicas de classificações).
 */
export function supabasePublic() {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Cliente admin — usa a service role key, ignora RLS.
 * Usar APENAS em server actions / route handlers depois de confirmar sessão de admin.
 * Nunca importar este ficheiro em componentes de cliente.
 */
export function supabaseAdmin() {
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não está definida no ambiente do servidor."
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
