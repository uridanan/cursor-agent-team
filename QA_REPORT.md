# QA Report

## Test Results

| Test Suite | Test Name | Result |
|------------|-----------|--------|
| LookupController | lookup with body { url } sends 200 and app info shape | PASS |
| AppStoreLookupServiceFactory | getService(googlePlayUrl) returns instance of GooglePlayLookupService | PASS |
| AppStoreLookupServiceFactory | getService(appleUrl) returns instance of AppleAppStoreLookupService | PASS |
| GooglePlayLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | PASS |
| AppleAppStoreLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | PASS |
| AppLookupPage | renders url input and submit button | PASS |
| useAppLookup | returns fetchApp, result, and error | PASS |

## Summary

- Backend: 5/5 passed
- Frontend: 2/2 passed
- Total: 7/7 passed

**PASS**

## Feature: Lookup History

| Test Suite | Test Name | Result |
|------------|-----------|--------|
| HistoryRepository | save() persists an entry and returns it with id and timestamp | PASS |
| HistoryRepository | findAll() returns entries newest-first | PASS |
| HistoryRepository | findAll() returns empty array when no entries | PASS |
| HistoryRepository | deleteById() removes a specific entry | PASS |
| HistoryRepository | deleteById() returns false for non-existent id | PASS |
| HistoryRepository | deleteAll() clears all entries | PASS |
| HistoryRepository | save() deduplicates by url, keeping only the latest | PASS |
| HistoryController | GET /api/history returns empty list initially | PASS |
| HistoryController | GET /api/history returns saved entries | PASS |
| HistoryController | DELETE /api/history/:id removes entry | PASS |
| HistoryController | DELETE /api/history/:id returns 404 for missing | PASS |
| HistoryController | DELETE /api/history clears all entries | PASS |
| LookupControllerHistory | successful lookup is saved to history | PASS |
| LookupControllerHistory | failed lookup is not saved to history | PASS |
| useHistory | returns history, refresh, removeEntry, clearAll | PASS |
| useHistory | fetches history on mount | PASS |
| useHistory | removeEntry calls DELETE and refreshes | PASS |
| useHistory | clearAll calls DELETE and refreshes | PASS |
| HistoryPanel | renders nothing when history is empty | PASS |
| HistoryPanel | renders entries with names and bundle ids | PASS |
| HistoryPanel | calls onSelect when an entry is clicked | PASS |
| HistoryPanel | calls onClear when clear all is clicked | PASS |
| HistoryPanel | calls onRemove when remove button is clicked | PASS |

### Summary

- Backend: 21/21 passed (14 new)
- Frontend: 14/14 passed (9 new)
- Total: 35/35 passed

**PASS**
