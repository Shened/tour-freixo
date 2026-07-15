# Tour de Freixo — Classificações

Site para mostrar e atualizar as classificações do Tour de Freixo:
- **Classificação Geral (GC)** — soma dos tempos de etapa. Um atleta com DNS/DNF numa etapa deixa de contar para a GC.
- **Classificação de Sprint** e **Classificação de Montanha** — pontos somados de todas as metas volantes desse tipo, em todas as etapas (1º–50, 2º–45, 3º–40, 4º–35, 5º–30, 6º–25, 7º–20, 8º–15, 9º–10, 10º–5).
- Página pública por etapa com a classificação dessa etapa e as metas volantes disputadas.
- Área **/admin** protegida por password para inserir resultados de etapa e de metas volantes.

Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS, Supabase (Postgres).

## 1. Criar o projeto Supabase

1. Cria um projeto em [supabase.com](https://supabase.com).
2. Vai a **SQL Editor** e corre o conteúdo de `supabase/schema.sql`. Isto cria as tabelas (`riders`, `stages`, `stage_results`, `goals`, `goal_results`) e as políticas de leitura pública.
3. Vai a **Project Settings → API** e copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no cliente — só é usada nas server actions do admin)

## 2. Configurar variáveis de ambiente

Copia `.env.local.example` para `.env.local` e preenche:

```
NEXT_PUBLIC_SUPABASE_URL=https://tmqkaxtdmnpzwydgxcwm.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_vU7x8ExE6YQvWcoTVTW43g_vmeolpu6
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcWtheHRkbW5wend5ZGd4Y3dtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE0NTg5MywiZXhwIjoyMDk5NzIxODkzfQ.27MQiHlrqtHH1xs1sV_n0uOm77FEYceha6aElLDVQ0Y
ADMIN_PASSWORD=Jpinguim15
ADMIN_SESSION_SECRET=d72265d0a5b6b739910c3ec8c9ae99728934483abb34737090b1fa9520e97433
```

`ADMIN_SESSION_SECRET` é usada para assinar o cookie de sessão do admin — gera uma string aleatória (por ex. `openssl rand -hex 32`).

## 3. Correr localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` para o site público e `http://localhost:3000/admin` para entrar com a `ADMIN_PASSWORD`.

## 4. Deploy (Vercel)

1. Sobe o projeto para um repositório Git (GitHub, etc.).
2. Importa o repositório em [vercel.com](https://vercel.com).
3. Define as mesmas variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) nas *Project Settings → Environment Variables* da Vercel.
4. Deploy.

## Como usar

1. Em **/admin/riders**, adiciona os atletas do Tour de Freixo.
2. Em **/admin/stages**, cria cada etapa (número, nome, data).
3. Abre a etapa em **/admin/stages/[id]** para:
   - Definir o **estado** de cada atleta nessa etapa (Terminou / DNS / DNF) e o **tempo** (formato `mm:ss` ou `h:mm:ss`) para quem terminou.
   - Adicionar **metas volantes** (sprint ou montanha) — podes adicionar 0, 1 ou várias por etapa — e registar a posição (1º a 10º) de cada atleta em cada meta. Os pontos são calculados automaticamente.
4. As páginas públicas (`/`, `/classificacao-geral`, `/pontos`, `/etapas`) atualizam-se automaticamente.

## Notas sobre as regras

- Um atleta que tenha DNS ou DNF **em qualquer etapa** deixa de contar para a Classificação Geral (fica de fora, mesmo retroativamente) — mas continua a poder pontuar nas classificações de sprint/montanha.
- As classificações de sprint e montanha nunca são afetadas por DNS/DNF — contam só os pontos das metas volantes.
