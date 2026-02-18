# Refactor Notes

- Extracted `shortDescription` to `backend/src/utils/shortDescription.js`; reused in GooglePlayLookupService and AppleAppStoreLookupService (DRY).
- LookupController: safe read of `err.message` and treat "not found" as 400.
- No SOLID violations identified per @07-design-patterns.mdc.

## Feature: Lookup History

- `LookupController` refactored from standalone export to `createLookupHandler(repo, getServiceFn)` factory — enables dependency injection for history repo and testability. Backwards-compatible `lookup` export preserved.
- `detectStore(url)` extracted as a pure function for URL-to-store mapping.
- `HistoryRepository.save()` uses `ON CONFLICT(url) DO UPDATE` (UPSERT) to deduplicate history by URL, avoiding unbounded table growth from repeated lookups.
- History save wrapped in try/catch inside lookup handler — history persistence failure cannot break the primary lookup flow.
- Ordering by `id DESC` instead of `looked_up_at DESC` for reliable sub-millisecond ordering in SQLite.
