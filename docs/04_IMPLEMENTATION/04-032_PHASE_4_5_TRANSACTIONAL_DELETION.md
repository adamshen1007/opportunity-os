# 04-032_PHASE_4_5_TRANSACTIONAL_DELETION.md

## Status

`TASK-P45-A05` defines the deletion boundary for one authenticated user's scan and all private records derived from it.

## Ownership Boundary

`ScanRunRecord.ownerPrincipalId` is the deletion authority. The API derives that principal exclusively from the authenticated server-side session. A scan identifier supplied by a caller is never treated as proof of ownership.

The transaction first reads the scan using both its identifier and the authenticated principal. A missing scan and another user's scan both produce the same not-found behavior. Administrative read override does not grant deletion authority.

## Transactional Graph

Deletion discovers records from persisted relationships rather than trusting client input or serialized provenance. One Prisma transaction removes records in dependency order:

1. validation feedback linked to generated opportunities
2. ranking items and ranking results
3. generated opportunities and candidates
4. evidence-cluster memberships and clusters
5. analyses, normalized content, and raw source content
6. scan-job rows linked through `resultScanId`
7. the owner-scoped scan root

The in-memory dashboard cache changes only after the database transaction commits. If any delete fails, Prisma rolls the transaction back and the scan remains available for a safe retry. Repeating deletion after a successful commit is harmless and returns the same non-disclosing not-found result as an unknown identifier.

## Shared Public Evidence

Opportunity OS currently stores a private, scan-specific evidence snapshot in `RawSourceContent`. It does not maintain a shared public-evidence registry. These private snapshots are deleted with their owning scan; the original public provider content remains at its external source.

If a shared evidence registry is introduced later, shared records must not be deleted while referenced by another owned scan. The scan-specific membership and provenance edge must be detached transactionally, and the shared record may be removed only when a separate reference audit proves that no owner still references it.

## User-Visible Result

After a successful deletion:

- the scan is absent from scan lists and direct API lookup
- its opportunities, rankings, evidence, and feedback are unavailable by old identifiers
- linked scan-job state is removed
- the dashboard removes the scan from recent history
- if the deleted scan was active, its local active-scan identifier and rendered result are cleared

## Backup-Retention Limitation

Application deletion removes live database rows. It does not retroactively rewrite database backups, point-in-time recovery logs, provider snapshots, exported support archives, or observability data that already exists.

Operators must:

- use the shortest practical hosted-database backup retention window
- restrict backup access to authorized operators
- prevent application secrets and raw provider payloads from entering backups
- allow deleted rows to age out through the documented provider retention schedule
- avoid restoring an old backup directly into production without replaying deletion requests created after that backup
- record and reapply outstanding deletion requests during disaster recovery before reopening user access

This limitation must be disclosed in pilot privacy guidance until backup deletion replay is automated and independently verified.

## Verification

Deterministic tests cover complete graph deletion, owner denial, repeated deletion, linked-job removal, feedback removal, injected transaction failure, rollback, orphan counts, foreign-key compatibility, stale identifiers, and dashboard active-state clearing.
