-- VS-07: verified account identity, auditable consent and atomic guest-history import.
-- Apply after 202609220001_vs06_attempt_ledger.sql in the Supabase SQL editor.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  locale text not null default 'vi' check (locale in ('vi')),
  timezone text not null default 'Asia/Ho_Chi_Minh' check (timezone in ('Asia/Ho_Chi_Minh')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consent_events (
  id uuid primary key,
  user_id uuid null references auth.users(id) on delete restrict,
  guest_session_id_hash char(64) null check (guest_session_id_hash ~ '^[0-9a-f]{64}$'),
  consent_type text not null check (
    consent_type in ('age_residency_attestation', 'terms_acceptance', 'privacy_acknowledgement', 'guest_import')
  ),
  policy_version text not null check (length(trim(policy_version)) > 0),
  decision boolean not null,
  source text not null check (source in ('web')), 
  created_at timestamptz not null default now(),
  check ((user_id is null) <> (guest_session_id_hash is null))
);

alter table public.attempts
  add column if not exists import_source_attempt_id uuid null references public.attempts(id) on delete restrict;

create unique index if not exists attempts_import_source_attempt_idx
  on public.attempts (import_source_attempt_id) where import_source_attempt_id is not null;

create table if not exists public.guest_imports (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete restrict,
  guest_session_id_hash char(64) not null check (guest_session_id_hash ~ '^[0-9a-f]{64}$'),
  idempotency_key text not null check (length(trim(idempotency_key)) > 0),
  request_hash char(64) not null check (request_hash ~ '^[0-9a-f]{64}$'),
  consent_event_id uuid not null references public.consent_events(id) on delete restrict,
  imported_attempt_count integer not null check (imported_attempt_count >= 0),
  imported_evidence_count integer not null default 0 check (imported_evidence_count = 0),
  result_hash char(64) not null check (result_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  unique (guest_session_id_hash),
  unique (user_id, idempotency_key)
);

alter table public.profiles enable row level security;
alter table public.consent_events enable row level security;
alter table public.guest_imports enable row level security;
revoke all on table public.profiles, public.consent_events, public.guest_imports from anon, authenticated;

create or replace function public.prevent_vs07_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'VS-07 audit records are append-only';
end;
$$;

revoke all on function public.prevent_vs07_mutation() from public;

drop trigger if exists consent_events_append_only on public.consent_events;
create trigger consent_events_append_only before update or delete on public.consent_events
for each row execute function public.prevent_vs07_mutation();

drop trigger if exists guest_imports_append_only on public.guest_imports;
create trigger guest_imports_append_only before update or delete on public.guest_imports
for each row execute function public.prevent_vs07_mutation();

create or replace function public.import_guest_attempts(
  p_user_id uuid,
  p_guest_provenance_id uuid,
  p_guest_session_id_hash char(64),
  p_idempotency_key text,
  p_request_hash char(64),
  p_consent_event_id uuid
)
returns table (
  receipt_id uuid,
  imported_attempt_count integer,
  result_hash char(64),
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  prior public.guest_imports%rowtype;
  attempt_count integer;
  import_id uuid := gen_random_uuid();
  calculated_result_hash char(64);
begin
  select * into prior
  from public.guest_imports
  where user_id = p_user_id and idempotency_key = p_idempotency_key;

  if found then
    if prior.request_hash <> p_request_hash then
      raise exception 'idempotency_conflict' using errcode = 'P0001';
    end if;
    return query select prior.id, prior.imported_attempt_count, prior.result_hash, prior.created_at;
    return;
  end if;

  if exists (select 1 from public.guest_imports where guest_session_id_hash = p_guest_session_id_hash) then
    raise exception 'guest_history_already_imported' using errcode = 'P0001';
  end if;

  select count(*)::integer into attempt_count
  from public.attempts
  where guest_provenance_id = p_guest_provenance_id
    and guest_expires_at > now()
    and technical_status = 'ok';

  if attempt_count = 0 then
    raise exception 'no_eligible_guest_history' using errcode = 'P0001';
  end if;

  calculated_result_hash := encode(
    extensions.digest(
      concat_ws(':', p_user_id::text, p_guest_session_id_hash, attempt_count::text, p_request_hash),
      'sha256'
    ),
    'hex'
  )::char(64);

  insert into public.guest_imports (
    id, user_id, guest_session_id_hash, idempotency_key, request_hash, consent_event_id,
    imported_attempt_count, imported_evidence_count, result_hash
  ) values (
    import_id, p_user_id, p_guest_session_id_hash, p_idempotency_key, p_request_hash, p_consent_event_id,
    attempt_count, 0, calculated_result_hash
  );

  insert into public.attempts (
    id, actor_user_id, guest_provenance_id, idempotency_key, request_hash,
    item_id, item_version, node_id, content_pack_id, content_pack_version,
    evaluation_algorithm_version, scoring_contract_version, answer_payload, server_outcome,
    hint_count, progress_channel, evidence_eligible, ineligibility_reason, technical_status,
    client_started_at, received_at, submitted_at, guest_expires_at, import_source_attempt_id
  )
  select
    gen_random_uuid(), p_user_id, null,
    concat('guest-import:', source.id::text), source.request_hash,
    source.item_id, source.item_version, source.node_id, source.content_pack_id, source.content_pack_version,
    source.evaluation_algorithm_version, source.scoring_contract_version, source.answer_payload, source.server_outcome,
    source.hint_count, source.progress_channel, false, 'guest_import_not_mastery_evidence', source.technical_status,
    source.client_started_at, now(), source.submitted_at, null, source.id
  from public.attempts source
  where source.guest_provenance_id = p_guest_provenance_id
    and source.guest_expires_at > now()
    and source.technical_status = 'ok';

  return query select import_id, attempt_count, calculated_result_hash, now();
end;
$$;

revoke all on function public.import_guest_attempts(uuid, uuid, char(64), text, char(64), uuid) from public;
grant execute on function public.import_guest_attempts(uuid, uuid, char(64), text, char(64), uuid) to service_role;
