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
| AppLookupPage | shows icon with download affordance when result is present | PASS |
| AppLookupPage | clicking icon calls download with result iconUrl and name | PASS |
| useAppLookup | returns fetchApp, result, and error | PASS |
| IconDownloadService | fetches iconUrl and triggers download with sanitized app name and extension | PASS |
| IconDownloadService | uses .jpg when icon URL suggests jpeg | PASS |

## Summary

- Backend: 7 passed (6 suites)
- Frontend: 6 passed (3 suites)
- Total: 13 passed

**PASS**
