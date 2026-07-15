-- Tour de Freixo — esquema da base de dados (Supabase / Postgres)
-- Corre este script no SQL Editor do teu projeto Supabase.

create extension if not exists "pgcrypto";

-- Atletas
create table if not exists riders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team text,
  created_at timestamptz default now()
);

-- Etapas
create table if not exists stages (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  name text not null,
  date date,
  created_at timestamptz default now()
);

-- Resultado de cada atleta em cada etapa (tempo de etapa, ou DNS/DNF)
create table if not exists stage_results (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references stages(id) on delete cascade,
  rider_id uuid not null references riders(id) on delete cascade,
  status text not null default 'FINISHED' check (status in ('FINISHED', 'DNS', 'DNF')),
  time_seconds int, -- null quando status != FINISHED
  created_at timestamptz default now(),
  unique (stage_id, rider_id)
);

-- Metas volantes (sprint ou montanha) dentro de cada etapa. Uma etapa pode ter 0, 1 ou várias.
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references stages(id) on delete cascade,
  type text not null check (type in ('SPRINT', 'MOUNTAIN')),
  name text not null,
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- Classificação de cada meta volante (posição de cada atleta, 1º a 10º pontuam)
create table if not exists goal_results (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  rider_id uuid not null references riders(id) on delete cascade,
  position int not null check (position between 1 and 10),
  created_at timestamptz default now(),
  unique (goal_id, rider_id),
  unique (goal_id, position)
);

-- Row Level Security: leitura pública, escrita apenas via service role (usada pelo admin no servidor)
alter table riders enable row level security;
alter table stages enable row level security;
alter table stage_results enable row level security;
alter table goals enable row level security;
alter table goal_results enable row level security;

drop policy if exists "public read riders" on riders;
create policy "public read riders" on riders for select using (true);

drop policy if exists "public read stages" on stages;
create policy "public read stages" on stages for select using (true);

drop policy if exists "public read stage_results" on stage_results;
create policy "public read stage_results" on stage_results for select using (true);

drop policy if exists "public read goals" on goals;
create policy "public read goals" on goals for select using (true);

drop policy if exists "public read goal_results" on goal_results;
create policy "public read goal_results" on goal_results for select using (true);
