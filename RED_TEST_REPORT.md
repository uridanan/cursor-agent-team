# Red Test Report

## Test Cases

| Test Suite | Test Case | Result | Evidence |
|------------|-----------|--------|----------|
| LookupController | lookup with body { url } sends 200 and app info shape | FAIL | `Error: Not Implemented` at LookupController.js:6 |
| AppStoreLookupServiceFactory | getService(googlePlayUrl) returns instance of GooglePlayLookupService | FAIL | `Error: Not Implemented` at AppStoreLookupServiceFactory.js:9 |
| AppStoreLookupServiceFactory | getService(appleUrl) returns instance of AppleAppStoreLookupService | FAIL | `Error: Not Implemented` at AppStoreLookupServiceFactory.js:9 |
| GooglePlayLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | FAIL | `Error: Not Implemented` at GooglePlayLookupService.js:10 |
| AppleAppStoreLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | FAIL | `Error: Not Implemented` at AppleAppStoreLookupService.js:10 |
| AppLookupPage | renders url input and submit button | FAIL | `Error: Not Implemented` at AppLookupPage.jsx:2 |
| useAppLookup | returns fetchApp, result, and error | FAIL | `Error: Not Implemented` at useAppLookup.js:5 |

## Summary

- Backend: 5 tests failed (stubs throw "Not Implemented").
- Frontend: 2 tests failed (stubs throw "Not Implemented").

## Feature: Lookup History

| Test Suite | Test Case | Result | Evidence |
|------------|-----------|--------|----------|
| HistoryRepository | save() persists an entry and returns it with id and timestamp | FAIL | `Cannot find module '../src/repositories/HistoryRepository.js'` |
| HistoryRepository | findAll() returns entries newest-first | FAIL | Module not found |
| HistoryRepository | findAll() returns empty array when no entries | FAIL | Module not found |
| HistoryRepository | deleteById() removes a specific entry | FAIL | Module not found |
| HistoryRepository | deleteById() returns false for non-existent id | FAIL | Module not found |
| HistoryRepository | deleteAll() clears all entries | FAIL | Module not found |
| HistoryRepository | save() deduplicates by url, keeping only the latest | FAIL | Module not found |
| HistoryController | GET /api/history returns empty list initially | FAIL | `Cannot find module '../src/repositories/HistoryRepository.js'` |
| HistoryController | GET /api/history returns saved entries | FAIL | Module not found |
| HistoryController | DELETE /api/history/:id removes entry | FAIL | Module not found |
| HistoryController | DELETE /api/history/:id returns 404 for missing | FAIL | Module not found |
| HistoryController | DELETE /api/history clears all entries | FAIL | Module not found |
| LookupControllerHistory | successful lookup is saved to history | FAIL | `Cannot find module '../src/repositories/HistoryRepository.js'` |
| LookupControllerHistory | failed lookup is not saved to history | FAIL | Module not found |
| useHistory | returns history, refresh, removeEntry, clearAll | FAIL | `Cannot find module './useHistory'` |
| useHistory | fetches history on mount | FAIL | Module not found |
| useHistory | removeEntry calls DELETE and refreshes | FAIL | Module not found |
| useHistory | clearAll calls DELETE and refreshes | FAIL | Module not found |
| HistoryPanel | renders nothing when history is empty | FAIL | `Cannot find module './HistoryPanel'` |
| HistoryPanel | renders entries with names and bundle ids | FAIL | Module not found |
| HistoryPanel | calls onSelect when an entry is clicked | FAIL | Module not found |
| HistoryPanel | calls onClear when clear all is clicked | FAIL | Module not found |
| HistoryPanel | calls onRemove when remove button is clicked | FAIL | Module not found |

### Summary

- Backend: 14 tests failed (modules not yet created).
- Frontend: 9 tests failed (modules not yet created).
