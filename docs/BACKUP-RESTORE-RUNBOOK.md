# Backup and isolated-restore runbook

> Trạng thái: **P-033 SPECIFICATION COMPLETE — chưa chạy trên môi trường thật**  
> Cập nhật: 2026-09-21  
> Phạm vi: Owner Alpha và Public/Production PostgreSQL/Supabase logical backup  
> Mục tiêu: backup mã hóa hằng ngày, rolling 30 ngày; chứng minh có thể restore vào đích cô lập mà không chạm nguồn

## 1. Safety contract

Runbook này là mẫu vận hành, không phải quyền tạo project, credential, workflow, backup object hoặc chạy restore. Chỉ được đưa vào thực thi sau khi đúng phase được phê duyệt.

Các guard bắt buộc:

- không đặt connection string, password, R2 secret hoặc `age` private identity trong repo, command argument ghi vào log, artifact hay evidence;
- backup automation chỉ có public `age` recipient, database read/dump credential và quyền R2 `PutObject`/`HeadObject` trong đúng prefix;
- restore dùng credential R2 read riêng và private `age` identity từ password manager/offline recovery copy; automation backup không có hai quyền này;
- source và restore target phải là hai Supabase project ref khác nhau; target phải được đánh dấu `isolated-restore`, không có traffic và không dùng Vercel Production config;
- lệnh restore dừng trước khi ghi nếu confirmation phrase, target fingerprint, environment/prefix hoặc checksum không khớp;
- restore luôn vào project mới/rỗng; không “thử lại” trên target đã restore dở, không cutover và không xóa/chỉnh source;
- log/evidence chỉ chứa ID, version, hash, count và thời gian; không chứa email, answer, token, URL có password hoặc dữ liệu học thô;
- plaintext dump chỉ tồn tại trong thư mục tạm quyền `0700` trên runner tạm; cleanup là bắt buộc nhưng không được tuyên bố là secure erase trên SSD/cloud runner.

Logical database dump không chứa byte của Supabase Storage. Vertical Slice không lưu user file; nếu Storage được thêm sau này, release bị chặn cho tới khi có object-backup/restore procedure và cross-check metadata↔object riêng. Tùy biến schema `auth`/`storage` cũng bị cấm nếu chưa có migration và restore test riêng.

## 2. Tool/version manifest

Các version dưới đây là planning baseline đã kiểm tra ngày 2026-09-21. Workflow thật phải pin binary checksum/container digest và ghi lại kết quả `--version`; không dùng `latest`, beta channel hoặc floating GitHub Action tag.

| Tool | Planning pin | Rule trước lần chạy đầu |
|---|---:|---|
| Supabase CLI | `2.116.0` | xác minh release/checksum; chạy `supabase db dump --dry-run`; nâng version chỉ qua change review |
| `age` | `1.3.1` | xác minh release checksum/Sigsum; backup chỉ nhận public recipient |
| AWS CLI | `2.35.4` | pin official v2 installer/image checksum; chỉ dùng S3 API với endpoint R2 |
| PostgreSQL client | `<SOURCE_MAJOR>.<PINNED_PATCH>` | major phải bằng source server; exact patch + image digest được điền sau khi project tồn tại |
| GitHub Actions | full 40-character commit SHA | mỗi `uses:` phải là SHA đã review; `permissions: contents: read` hoặc thấp hơn |

Placeholder `<SOURCE_MAJOR>.<PINNED_PATCH>` là fail-closed, không phải floating version. Nó phải được thay bằng giá trị thật trong implementation manifest sau truy vấn `server_version`, trước khi backup đầu tiên được xem là hợp lệ.

Nguồn chuẩn:

- [Supabase Backup and Restore using the CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore);
- [Supabase CLI `db dump`](https://supabase.com/docs/reference/cli/supabase-db-dump);
- [Cloudflare R2 CLI/S3 endpoint](https://developers.cloudflare.com/r2/get-started/cli/);
- [`age` release and CLI](https://github.com/FiloSottile/age/releases);
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).

## 3. Secret and placeholder inventory

| Name | Secret? | Backup job | Manual restore | Meaning |
|---|---:|---:|---:|---|
| `ATLAS_ENVIRONMENT` | no | yes | yes | exactly `owner-alpha` or `public-production` |
| `ATLAS_SOURCE_PROJECT_REF` | sensitive metadata | yes | evidence only | source project identifier |
| `ATLAS_SOURCE_DB_URL` | **yes** | yes | no | percent-encoded session-pooler/direct URL |
| `ATLAS_RESTORE_PROJECT_REF` | sensitive metadata | no | yes | new isolated target identifier |
| `ATLAS_RESTORE_DB_URL` | **yes** | no | yes | target URL; never same as source |
| `ATLAS_R2_ACCOUNT_ID` | sensitive metadata | yes | yes | R2 account endpoint component |
| `ATLAS_R2_BUCKET` | sensitive metadata | yes | yes | private backup bucket |
| `ATLAS_R2_PREFIX` | no | yes | yes | `owner-alpha/` or `public-production/` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | **yes** | upload scope | read scope | separate least-privilege credentials |
| `ATLAS_AGE_RECIPIENT` | no | yes | no | public `age1...` recipient |
| `ATLAS_AGE_IDENTITY_FILE` | **yes** | never | local only | private identity path, not its content |
| `ATLAS_BACKUP_OBJECT_KEY` | no | output | input | immutable `.tar.gz.age` key |
| `ATLAS_RESTORE_CONFIRMATION` | no | no | yes | exact target/backup confirmation phrase |

`ATLAS_SOURCE_DB_URL` and `ATLAS_RESTORE_DB_URL` are masked secrets and must never be printed. GitHub debug logging is disabled for secret-bearing jobs. No pull-request workflow receives environment secrets.

## 4. Daily backup command template

Target shell is Bash on an ephemeral Linux runner. The final workflow may translate orchestration, but must preserve this order and every fail-closed check.

### 4.1 Preflight

```bash
set -Eeuo pipefail
umask 077

: "${ATLAS_ENVIRONMENT:?missing}"
: "${ATLAS_SOURCE_PROJECT_REF:?missing}"
: "${ATLAS_SOURCE_DB_URL:?missing}"
: "${ATLAS_R2_ACCOUNT_ID:?missing}"
: "${ATLAS_R2_BUCKET:?missing}"
: "${ATLAS_R2_PREFIX:?missing}"
: "${ATLAS_AGE_RECIPIENT:?missing}"
: "${AWS_ACCESS_KEY_ID:?missing}"
: "${AWS_SECRET_ACCESS_KEY:?missing}"

case "$ATLAS_ENVIRONMENT" in
  owner-alpha|public-production) ;;
  *) echo "invalid environment" >&2; exit 64 ;;
esac

case "$ATLAS_ENVIRONMENT:$ATLAS_R2_PREFIX" in
  owner-alpha:owner-alpha/*|public-production:public-production/*) ;;
  *) echo "environment/prefix mismatch" >&2; exit 65 ;;
esac

test "$(supabase --version)" = "2.116.0"
age --version | grep -Eq '(^| )v?1\.3\.1($| )'
aws --version 2>&1 | grep -q 'aws-cli/2.35.4 '
psql --version | grep -Eq 'psql \(PostgreSQL\) <SOURCE_MAJOR>\.<PINNED_PATCH>'

ATLAS_BACKUP_STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
ATLAS_BACKUP_ID="${ATLAS_ENVIRONMENT}-$(date -u +%Y%m%dT%H%M%SZ)-${GITHUB_RUN_ID:?missing}"
ATLAS_WORK_DIR="$(mktemp -d -t atlas-backup.XXXXXXXX)"
chmod 700 "$ATLAS_WORK_DIR"
trap 'rm -rf -- "$ATLAS_WORK_DIR"' EXIT

ATLAS_R2_ENDPOINT="https://${ATLAS_R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
ATLAS_BACKUP_OBJECT_KEY="${ATLAS_R2_PREFIX}${ATLAS_BACKUP_ID}.tar.gz.age"
export AWS_DEFAULT_REGION=auto AWS_EC2_METADATA_DISABLED=true AWS_PAGER=""
```

Implementation phải thay hai placeholder PostgreSQL bằng exact pin; command còn placeholder phải fail review và không được chạy.

### 4.2 Dump, manifest, encrypt and upload

```bash
cd "$ATLAS_WORK_DIR"

psql "$ATLAS_SOURCE_DB_URL" --no-psqlrc --tuples-only --no-align \
  --set ON_ERROR_STOP=1 \
  --command "select current_setting('server_version'), current_database();" \
  > source-fingerprint.txt

supabase db dump --db-url "$ATLAS_SOURCE_DB_URL" -f roles.sql --role-only
supabase db dump --db-url "$ATLAS_SOURCE_DB_URL" -f schema.sql
supabase db dump --db-url "$ATLAS_SOURCE_DB_URL" -f data.sql \
  --use-copy --data-only \
  -x "storage.buckets_vectors" -x "storage.vector_indexes"
supabase db dump --db-url "$ATLAS_SOURCE_DB_URL" \
  -f history_schema.sql --schema supabase_migrations
supabase db dump --db-url "$ATLAS_SOURCE_DB_URL" \
  -f history_data.sql --use-copy --data-only --schema supabase_migrations

test -s roles.sql
test -s schema.sql
test -s data.sql
test -s source-fingerprint.txt

sha256sum roles.sql schema.sql data.sql history_schema.sql history_data.sql \
  source-fingerprint.txt > SHA256SUMS

cat > manifest.txt <<EOF
backup_id=$ATLAS_BACKUP_ID
environment=$ATLAS_ENVIRONMENT
source_project_ref=$ATLAS_SOURCE_PROJECT_REF
started_at=$ATLAS_BACKUP_STARTED_AT
supabase_cli=2.116.0
age=1.3.1
aws_cli=2.35.4
postgres_client=<SOURCE_MAJOR>.<PINNED_PATCH>
format=atlas-logical-backup-v1
storage_object_bytes_included=false
EOF

tar --create --gzip --file "$ATLAS_BACKUP_ID.tar.gz" \
  manifest.txt SHA256SUMS source-fingerprint.txt \
  roles.sql schema.sql data.sql history_schema.sql history_data.sql

age --encrypt --recipient "$ATLAS_AGE_RECIPIENT" \
  --output "$ATLAS_BACKUP_ID.tar.gz.age" "$ATLAS_BACKUP_ID.tar.gz"

ATLAS_ENCRYPTED_SHA256="$(sha256sum "$ATLAS_BACKUP_ID.tar.gz.age" | cut -d ' ' -f 1)"
ATLAS_ENCRYPTED_BYTES="$(wc -c < "$ATLAS_BACKUP_ID.tar.gz.age" | tr -d ' ')"

aws s3api put-object \
  --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" \
  --key "$ATLAS_BACKUP_OBJECT_KEY" \
  --body "$ATLAS_BACKUP_ID.tar.gz.age" \
  --content-type application/octet-stream \
  --metadata "sha256=$ATLAS_ENCRYPTED_SHA256,environment=$ATLAS_ENVIRONMENT,backup_id=$ATLAS_BACKUP_ID" \
  --no-cli-pager > upload-receipt.json

aws s3api head-object \
  --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" \
  --key "$ATLAS_BACKUP_OBJECT_KEY" \
  --query '{bytes:ContentLength,sha256:Metadata.sha256,environment:Metadata.environment,backup_id:Metadata.backup_id}' \
  --output json --no-cli-pager > head-receipt.json

test "$(aws s3api head-object --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" --key "$ATLAS_BACKUP_OBJECT_KEY" \
  --query 'Metadata.sha256' --output text --no-cli-pager)" = "$ATLAS_ENCRYPTED_SHA256"
test "$(aws s3api head-object --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" --key "$ATLAS_BACKUP_OBJECT_KEY" \
  --query 'ContentLength' --output text --no-cli-pager)" = "$ATLAS_ENCRYPTED_BYTES"
```

Chỉ sau hai phép `head-object` cuối cùng mới ghi trạng thái `backup_verified`. Upload lỗi hoặc metadata/hash/size mismatch là incident; không ghi success và không tự chuyển sang credential rộng hơn. R2 lifecycle 30 ngày được cấu hình ngoài job và được kiểm tra riêng.

## 5. Isolated restore command template

Restore là manual protected-environment job hoặc thao tác của operator trên máy tin cậy. Nó dùng project mới/rỗng, credential read-only cho đúng object và private identity ngoài repo.

### 5.1 Target guard and download

```bash
set -Eeuo pipefail
umask 077

: "${ATLAS_ENVIRONMENT:?missing}"
: "${ATLAS_SOURCE_PROJECT_REF:?missing}"
: "${ATLAS_RESTORE_PROJECT_REF:?missing}"
: "${ATLAS_RESTORE_DB_URL:?missing}"
: "${ATLAS_BACKUP_OBJECT_KEY:?missing}"
: "${ATLAS_RESTORE_CONFIRMATION:?missing}"
: "${ATLAS_AGE_IDENTITY_FILE:?missing}"
: "${ATLAS_R2_ACCOUNT_ID:?missing}"
: "${ATLAS_R2_BUCKET:?missing}"
: "${AWS_ACCESS_KEY_ID:?missing}"
: "${AWS_SECRET_ACCESS_KEY:?missing}"

test "$ATLAS_SOURCE_PROJECT_REF" != "$ATLAS_RESTORE_PROJECT_REF"
test "$ATLAS_RESTORE_CONFIRMATION" = \
  "RESTORE-ISOLATED:${ATLAS_RESTORE_PROJECT_REF}:${ATLAS_BACKUP_OBJECT_KEY}"
test -f "$ATLAS_AGE_IDENTITY_FILE"

case "$ATLAS_BACKUP_OBJECT_KEY" in
  owner-alpha/*|public-production/*) ;;
  *) echo "unexpected object prefix" >&2; exit 66 ;;
esac

test "$(supabase --version)" = "2.116.0"
age --version | grep -Eq '(^| )v?1\.3\.1($| )'
aws --version 2>&1 | grep -q 'aws-cli/2.35.4 '
psql --version | grep -Eq 'psql \(PostgreSQL\) <SOURCE_MAJOR>\.<PINNED_PATCH>'

ATLAS_RESTORE_STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
ATLAS_RESTORE_DIR="$(mktemp -d -t atlas-restore.XXXXXXXX)"
chmod 700 "$ATLAS_RESTORE_DIR"
trap 'rm -rf -- "$ATLAS_RESTORE_DIR"' EXIT
cd "$ATLAS_RESTORE_DIR"

ATLAS_R2_ENDPOINT="https://${ATLAS_R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export AWS_DEFAULT_REGION=auto AWS_EC2_METADATA_DISABLED=true AWS_PAGER=""

test "$(psql "$ATLAS_RESTORE_DB_URL" --no-psqlrc --tuples-only --no-align \
  --set ON_ERROR_STOP=1 \
  --command "select to_regclass('public.attempts') is null;")" = "t"

aws s3api head-object --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" --key "$ATLAS_BACKUP_OBJECT_KEY" \
  --output json --no-cli-pager > head-receipt.json

ATLAS_EXPECTED_SHA256="$(aws s3api head-object --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" --key "$ATLAS_BACKUP_OBJECT_KEY" \
  --query 'Metadata.sha256' --output text --no-cli-pager)"

aws s3api get-object --endpoint-url "$ATLAS_R2_ENDPOINT" \
  --bucket "$ATLAS_R2_BUCKET" --key "$ATLAS_BACKUP_OBJECT_KEY" \
  encrypted-backup.age --no-cli-pager > download-receipt.json

test "$(sha256sum encrypted-backup.age | cut -d ' ' -f 1)" = "$ATLAS_EXPECTED_SHA256"
age --decrypt --identity "$ATLAS_AGE_IDENTITY_FILE" \
  --output backup.tar.gz encrypted-backup.age
tar --extract --gzip --file backup.tar.gz
sha256sum --check SHA256SUMS
grep -Fx "environment=$ATLAS_ENVIRONMENT" manifest.txt
grep -Fx "source_project_ref=$ATLAS_SOURCE_PROJECT_REF" manifest.txt
```

Target emptiness check is intentionally tied to `public.attempts`, one of the required slice tables. Sau implementation, target project phải có một immutable environment marker và guard này được mở rộng để xác nhận marker `isolated-restore`; project ref comparison alone is not sufficient evidence.

### 5.2 Restore transaction

```bash
psql "$ATLAS_RESTORE_DB_URL" --no-psqlrc \
  --single-transaction \
  --set ON_ERROR_STOP=1 \
  --command 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;' \
  --file roles.sql \
  --file schema.sql \
  --command 'SET session_replication_role = replica;' \
  --file data.sql

psql "$ATLAS_RESTORE_DB_URL" --no-psqlrc \
  --single-transaction \
  --set ON_ERROR_STOP=1 \
  --file history_schema.sql \
  --file history_data.sql
```

Theo hướng dẫn Supabase, restore dùng `ON_ERROR_STOP`, single transaction và tắt trigger trong phiên nạp data. Nếu roles/history đã tồn tại hoặc Supabase managed role gây lỗi, operator không sửa dump tùy hứng: ghi lỗi, hủy target và mở change review dựa trên troubleshooting chính thức. Không bỏ qua câu lệnh lỗi để đạt trạng thái PASS.

## 6. Verification queries

Chạy trên source ngay trước dump và trên isolated target sau restore; lưu chỉ kết quả tổng hợp. `source` và `target` phải khớp ở các count/invariant áp dụng, ngoại trừ managed operational tables được liệt kê rõ trong evidence.

```sql
select current_setting('server_version') as server_version,
       current_database() as database_name;

select n.nspname as schema_name, c.relname as table_name,
       pg_total_relation_size(c.oid) as bytes
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind = 'r'
  and n.nspname in ('public', 'auth')
order by 1, 2;

select 'profiles' table_name, count(*) row_count from public.profiles
union all select 'attempts', count(*) from public.attempts
union all select 'evidence_events', count(*) from public.evidence_events
union all select 'mastery_projections', count(*) from public.mastery_projections
union all select 'review_queue', count(*) from public.review_queue
union all select 'guest_imports', count(*) from public.guest_imports
union all select 'consent_events', count(*) from public.consent_events
union all select 'content_releases', count(*) from public.content_releases
union all select 'narrative_releases', count(*) from public.narrative_releases
union all select 'story_progress', count(*) from public.story_progress
union all select 'reward_grants', count(*) from public.reward_grants
order by 1;

select count(*) as invalid_indexes
from pg_index
where not indisvalid;

select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

select count(*) as invalid_attempt_actor_rows
from public.attempts
where (user_id is null) = (guest_session_id_hash is null);

select count(*) as duplicate_account_idempotency_groups
from (
  select user_id, idempotency_key
  from public.attempts
  where user_id is not null
  group by user_id, idempotency_key having count(*) > 1
) d;

select count(*) as duplicate_guest_import_groups
from (
  select guest_session_id_hash
  from public.guest_imports
  group by guest_session_id_hash having count(*) > 1
) d;

select count(*) as duplicate_reward_groups
from (
  select user_id, reward_id
  from public.reward_grants
  group by user_id, reward_id having count(*) > 1
) d;

select count(*) as orphan_evidence_rows
from public.evidence_events e
left join public.attempts a on a.id = e.attempt_id
where a.id is null;
```

Pass requires:

- encrypted object hash and byte count match R2 metadata;
- all internal plaintext hashes pass;
- required 11 tables, constraints, indexes, RLS flags and policy inventory exist;
- source/target aggregate row counts match or every allowed difference is named and justified;
- all five integrity-error counts above equal zero;
- exact content/narrative/evaluator/mastery versions referenced by attempts exist;
- authenticated owner read, other-user deny, attempt replay/idempotency and one reward smoke tests pass against the isolated target;
- elapsed restore time is at most 24 hours; the measured value is recorded without claiming an uptime SLA.

## 7. Failure handling

| Failure | Required response | Forbidden response |
|---|---|---|
| dump/version/preflight fails | mark backup failed, alert owner, retain last verified object | upload partial archive or relax version check |
| encrypt/hash fails | do not upload; terminate runner and rotate key only if exposure suspected | upload plaintext or unverified ciphertext |
| upload/head mismatch | mark incident and retry whole immutable object with a new backup ID | overwrite an object already marked verified |
| decrypt/checksum fails | quarantine object identifier, fail drill, test earlier verified object | edit hash/manifest to continue |
| target guard fails | stop before write; verify project refs/configuration | bypass confirmation or point at source |
| restore SQL fails | record first error, abandon/recreate isolated target, open change review | continue statements, manually patch Production |
| post-restore invariant differs | fail drill and keep environment isolated for diagnosis | call restore successful based on row count alone |
| backup missed/older than 26h | operational incident during active Alpha/Public use | silently wait for next schedule |

No failed drill authorizes destructive cleanup of source data. Target disposal occurs only after evidence is retained and the exact isolated target is re-verified; deletion is an implementation-time operator action, not part of this planning template.

## 8. Evidence record template

```text
evidence_id:
run_type: daily-backup | pre-release-restore | monthly-restore | quarterly-restore
environment: owner-alpha | public-production
source_project_ref_masked:
restore_project_ref_masked: N/A for backup-only
backup_id:
r2_object_key_without_credentials:
started_at_utc:
completed_at_utc:
elapsed_seconds:
tool_versions_and_binary_checksums:
workflow_commit_sha:
source_schema_version:
source_content_narrative_algorithm_versions:
encrypted_sha256:
encrypted_bytes:
head_object_verified: true | false
decrypt_verified: true | false | N/A
internal_checksums_verified: true | false | N/A
source_target_count_comparison_artifact:
constraints_indexes_rls_result:
domain_invariants_result:
critical_smoke_result:
rto_24h_result: pass | fail | N/A
storage_bytes_scope: none-in-vertical-slice
reviewer:
result: pass | fail
first_failure_and_safe_state:
remediation_owner_and_due_date:
retest_evidence_id:
secret_or_learner_content_present: must_be_false
```

Evidence lives in protected operational storage, not in the public repository when it could reveal project identifiers or user counts. The repository may retain a redacted summary containing only evidence ID, date, environment class, result and tool manifest.

## 9. Cadence and acceptance

- Owner Alpha: daily backup starts before the first real progress is stored; backup health checked daily while Alpha is active.
- Before Public Preview: at least one successful isolated restore of the intended environment class.
- First three public months: one successful isolated restore each month.
- Afterwards: quarterly, unless an incident/tool/schema/provider change requires an earlier drill.
- Tool upgrade, PostgreSQL major change, auth/storage customization or backup-format change invalidates prior compatibility evidence and requires a new isolated drill.
- Bucket lifecycle retains encrypted objects for 30 days; lifecycle configuration and oldest/newest-object sampling are part of operational evidence.

A scheduled job marked green is not restore evidence. P-033 closes only the pre-code specification gap; live backup and restore remain Owner Alpha/Public release gates.
