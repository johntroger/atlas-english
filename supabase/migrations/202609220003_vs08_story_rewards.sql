-- VS-08: account-backed first completion and a single fixed story reward.
create table if not exists public.story_progress (
  user_id uuid not null references auth.users(id) on delete restrict,
  mission_id text not null check (mission_id in ('m1', 'm2', 'm3')),
  mission_version text not null default 'vs-05.1',
  state text not null check (state in ('first_completed', 'replayable')),
  first_completion_id uuid not null,
  idempotency_key uuid not null,
  request_hash char(64) not null check (request_hash ~ '^[0-9a-f]{64}$'),
  first_completed_at timestamptz not null default now(),
  choice_flags jsonb not null default '{}'::jsonb check (jsonb_typeof(choice_flags) = 'object'),
  primary key (user_id, mission_id),
  unique (first_completion_id)
);

create table if not exists public.reward_grants (
  user_id uuid not null references auth.users(id) on delete restrict,
  reward_id text not null check (reward_id = 'context_restored'),
  source_mission_id text not null check (source_mission_id = 'm3'),
  source_completion_id uuid not null references public.story_progress(first_completion_id) on delete restrict,
  granted_at timestamptz not null default now(),
  primary key (user_id, reward_id),
  unique (source_completion_id)
);

alter table public.story_progress enable row level security;
alter table public.reward_grants enable row level security;
revoke all on table public.story_progress, public.reward_grants from anon, authenticated;

create or replace function public.complete_vs08_mission(
  p_user_id uuid, p_mission_id text, p_completion_id uuid, p_idempotency_key uuid, p_request_hash char(64)
)
returns table (state text, completion_id uuid, reward_granted boolean)
language plpgsql security definer set search_path = public as $$
declare prior public.story_progress%rowtype; required_count integer; has_reward boolean := false; inserted_count integer;
begin
  select * into prior from public.story_progress where user_id = p_user_id and mission_id = p_mission_id;
  if found then
    if prior.idempotency_key = p_idempotency_key and prior.request_hash <> p_request_hash then
      raise exception 'idempotency_conflict' using errcode = 'P0001';
    end if;
    select exists(select 1 from public.reward_grants where source_completion_id = prior.first_completion_id) into has_reward;
    return query select 'replayable'::text, prior.first_completion_id, has_reward; return;
  end if;
  select count(distinct item_id)::integer into required_count from public.attempts
    where actor_user_id = p_user_id and item_id like ('slice.' || p_mission_id || '.%') and technical_status = 'ok';
  if required_count < 4 then raise exception 'mission_not_ready' using errcode = 'P0001'; end if;
  if p_mission_id = 'm3' and (select count(*) from public.story_progress where user_id = p_user_id and mission_id in ('m1','m2')) < 2 then
    raise exception 'mission_not_ready' using errcode = 'P0001';
  end if;
  insert into public.story_progress(user_id, mission_id, state, first_completion_id, idempotency_key, request_hash)
    values(p_user_id, p_mission_id, 'first_completed', p_completion_id, p_idempotency_key, p_request_hash);
  if p_mission_id = 'm3' then
    insert into public.reward_grants(user_id,reward_id,source_mission_id,source_completion_id)
      values(p_user_id,'context_restored','m3',p_completion_id) on conflict do nothing;
    get diagnostics inserted_count = row_count;
    has_reward := inserted_count = 1;
  end if;
  return query select 'first_completed'::text, p_completion_id, has_reward;
end; $$;

revoke all on function public.complete_vs08_mission(uuid,text,uuid,uuid,char(64)) from public;
grant execute on function public.complete_vs08_mission(uuid,text,uuid,uuid,char(64)) to service_role;
