-- VS-08 hardening: concurrent completion requests must converge on one receipt.
create or replace function public.complete_vs08_mission(
  p_user_id uuid, p_mission_id text, p_completion_id uuid, p_idempotency_key uuid, p_request_hash char(64)
)
returns table (state text, completion_id uuid, reward_granted boolean)
language plpgsql security definer set search_path = public as $$
declare
  prior public.story_progress%rowtype;
  required_count integer;
  has_reward boolean := false;
  inserted_count integer;
begin
  select * into prior
    from public.story_progress
    where user_id = p_user_id and mission_id = p_mission_id;

  if found then
    if prior.idempotency_key = p_idempotency_key and prior.request_hash <> p_request_hash then
      raise exception 'idempotency_conflict' using errcode = 'P0001';
    end if;
    select exists(
      select 1 from public.reward_grants where source_completion_id = prior.first_completion_id
    ) into has_reward;
    return query select 'replayable'::text, prior.first_completion_id, has_reward;
    return;
  end if;

  select count(distinct item_id)::integer into required_count
    from public.attempts
    where actor_user_id = p_user_id
      and item_id like ('slice.' || p_mission_id || '.%')
      and technical_status = 'ok';
  if required_count < 4 then
    raise exception 'mission_not_ready' using errcode = 'P0001';
  end if;
  if p_mission_id = 'm3' and (
    select count(*) from public.story_progress
    where user_id = p_user_id and mission_id in ('m1', 'm2')
  ) < 2 then
    raise exception 'mission_not_ready' using errcode = 'P0001';
  end if;

  insert into public.story_progress(
    user_id, mission_id, state, first_completion_id, idempotency_key, request_hash
  ) values (
    p_user_id, p_mission_id, 'first_completed', p_completion_id, p_idempotency_key, p_request_hash
  ) on conflict (user_id, mission_id) do nothing
  returning * into prior;

  if not found then
    select * into prior
      from public.story_progress
      where user_id = p_user_id and mission_id = p_mission_id;
    if prior.idempotency_key = p_idempotency_key and prior.request_hash <> p_request_hash then
      raise exception 'idempotency_conflict' using errcode = 'P0001';
    end if;
    select exists(
      select 1 from public.reward_grants where source_completion_id = prior.first_completion_id
    ) into has_reward;
    return query select 'replayable'::text, prior.first_completion_id, has_reward;
    return;
  end if;

  if p_mission_id = 'm3' then
    insert into public.reward_grants(user_id, reward_id, source_mission_id, source_completion_id)
      values(p_user_id, 'context_restored', 'm3', p_completion_id)
      on conflict do nothing;
    get diagnostics inserted_count = row_count;
    has_reward := inserted_count = 1;
  end if;

  return query select 'first_completed'::text, p_completion_id, has_reward;
end;
$$;

revoke all on function public.complete_vs08_mission(uuid, text, uuid, uuid, char(64)) from public;
grant execute on function public.complete_vs08_mission(uuid, text, uuid, uuid, char(64)) to service_role;
