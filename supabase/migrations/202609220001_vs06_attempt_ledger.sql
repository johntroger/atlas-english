create table if not exists public.attempts (
  id uuid primary key,
  actor_user_id uuid null references auth.users(id) on delete restrict,
  guest_provenance_id uuid null,
  idempotency_key text not null check (length(trim(idempotency_key)) > 0),
  request_hash char(64) not null check (request_hash ~ '^[0-9a-f]{64}$'),
  item_id text not null check (length(trim(item_id)) > 0),
  item_version text not null check (length(trim(item_version)) > 0),
  node_id text not null check (length(trim(node_id)) > 0),
  content_pack_id text not null check (length(trim(content_pack_id)) > 0),
  content_pack_version text not null check (length(trim(content_pack_version)) > 0),
  evaluation_algorithm_version text not null check (length(trim(evaluation_algorithm_version)) > 0),
  scoring_contract_version text not null check (length(trim(scoring_contract_version)) > 0),
  answer_payload jsonb not null,
  server_outcome jsonb not null,
  hint_count integer not null check (hint_count >= 0),
  progress_channel text not null check (progress_channel in ('mastery', 'practice', 'technical')),
  evidence_eligible boolean not null,
  ineligibility_reason text null,
  technical_status text not null check (technical_status in ('ok', 'client_interrupted', 'server_error', 'content_invalid', 'session_invalid')),
  client_started_at timestamptz null,
  received_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  guest_expires_at timestamptz null,
  check ((actor_user_id is null) <> (guest_provenance_id is null)),
  check (jsonb_typeof(answer_payload) in ('string', 'array')),
  check (
    (evidence_eligible = false)
    or (
      progress_channel = 'mastery'
      and technical_status = 'ok'
      and hint_count = 0
      and ineligibility_reason is null
    )
  ),
  check (
    (guest_provenance_id is null and guest_expires_at is null)
    or (guest_provenance_id is not null and guest_expires_at is not null)
  )
);

alter table public.attempts enable row level security;
revoke all on table public.attempts from anon, authenticated;
create unique index if not exists attempts_account_idempotency_idx
  on public.attempts (actor_user_id, idempotency_key) where actor_user_id is not null;
create unique index if not exists attempts_guest_idempotency_idx
  on public.attempts (guest_provenance_id, idempotency_key) where guest_provenance_id is not null;
create index if not exists attempts_account_submitted_at_idx
  on public.attempts (actor_user_id, submitted_at desc) where actor_user_id is not null;
create index if not exists attempts_guest_submitted_at_idx
  on public.attempts (guest_provenance_id, submitted_at desc) where guest_provenance_id is not null;
create index if not exists attempts_item_version_idx on public.attempts (item_id, item_version);
create index if not exists attempts_guest_expiry_idx
  on public.attempts (guest_expires_at) where guest_provenance_id is not null;

create or replace function public.prevent_attempt_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'attempts are append-only';
end;
$$;

revoke all on function public.prevent_attempt_mutation() from public;

drop trigger if exists attempts_append_only on public.attempts;
create trigger attempts_append_only before update or delete on public.attempts
for each row execute function public.prevent_attempt_mutation();
