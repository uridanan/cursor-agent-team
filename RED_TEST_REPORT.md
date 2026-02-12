# Red Test Report

## Test Cases

| Test Suite | Test Case | Result | Evidence |
|------------|-----------|--------|----------|
| LookupController | lookup with body { url } sends 200 and app info shape | PASS | (existing) |
| AppStoreLookupServiceFactory | getService(googlePlayUrl) returns instance of GooglePlayLookupService | PASS | (existing) |
| ... | (existing backend/frontend) | ... | ... |
| **IconDownloadService** | fetches iconUrl and triggers download with sanitized app name and extension | FAIL | `Error: Not Implemented` at IconDownloadService.js:11 |
| **IconDownloadService** | uses .jpg when icon URL suggests jpeg | FAIL | `Error: Not Implemented` at IconDownloadService.js:11 |
| **AppLookupPage** | shows icon with download affordance when result is present | FAIL | `expected false to be true` (no cursor-pointer/title/aria-label on wrapper) |
| **AppLookupPage** | clicking icon calls download with result iconUrl and name | FAIL | (depends on affordance; would fail before impl) |

## Feature: Download App Icon (Red Phase)

| Test | Result | Evidence |
|------|--------|----------|
| IconDownloadService: fetches iconUrl and triggers download with sanitized app name and extension | FAIL | `Error: Not Implemented` |
| IconDownloadService: uses .jpg when icon URL suggests jpeg | FAIL | `Error: Not Implemented` |
| AppLookupPage: shows icon with download affordance when result is present | FAIL | AssertionError: hasPointer \|\| hasTitle \|\| hasAria |
| AppLookupPage: clicking icon calls download with result iconUrl and name | FAIL | mockDownload not called (no clickable wrapper yet) |

## Summary

- Icon download feature: 4 new tests written; all fail (stub throws or UI not implemented).
